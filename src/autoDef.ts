import {JsonEnvConfig} from "./config";
import envFiles from "./envFiles";
import fs from "node:fs";
import {cwd} from "node:process";
import JSON from "json5";
import path from "node:path";
import {envLoad} from "./envLoad";

const root = cwd()

function absoluteFilePath(file: string) {
    if (path.isAbsolute(file)) {
        return file
    } else {
        return path.resolve(root, file)
    }
}

function absoluteFilePaths(file: string[]) {
    return file.map(absoluteFilePath)
}

function typeDefault(value: any): string {
    switch (typeof value) {
        case "bigint":
            return `${value}n`
        case "string":
            return `"${value}"`
        case "object":
            return JSON.stringify(value)
        default:
            return `${value}`
    }
}

function buildDefConst(
    map: { [key: string]: any },
    defFileName: string = 'def.d.ts',
    defValName: string = 'DEF',
    isCommonJs: boolean = false
) {
    const file = absoluteFilePath(defFileName)
    const lines: string[] = ["// 该文件仅用于声明"]
    const isDeclare = defFileName.endsWith('.d.ts')
    const suffix = isDeclare ? ';' : ','
    if (isDeclare) {
        lines.push(`declare const ${defValName}: {`)
    } else {
        if (isCommonJs) {
            lines.push(`const ${defValName} = {`)
        } else {
            lines.push(`export const ${defValName} = {`)
        }
    }
    Object.keys(map).forEach(key => {
        lines.push(`    ${key}: ${typeDefault(map[key])}${suffix}`)
    })
    lines.push('};')
    if (!isDeclare && isCommonJs) {
        lines.push(`module.exports = {${defValName}}`)
    }
    fs.writeFileSync(file, lines.join('\n'))
}

/**
 * 自动生成定义文件
 * @param files 配置或配置文件列表 从前到后 值类型覆盖
 * @param defFileName 生成文件名 默认 def.d.ts 支持js
 * @param defValName 生成变量名 默认 DEF
 * @param custom 自定义变量 覆盖
 * @param customSetter 自定义变量设置到环境变量
 * @param isCommonJs 是否生成commonjs模块
 */
export default function autoDef(
    files: JsonEnvConfig | Array<string>,
    {
        defFileName = 'def.d.ts',
        defValName = 'DEF',
        custom = {},
        customSetter = undefined,
        isCommonJs = false
    }: {
        defFileName?: string,
        defValName?: string,
        custom?: { [_: string]: any },
        customSetter?: ((key: string, value: any) => void) | undefined,
        isCommonJs?: boolean
    } = {}
) {
    const filesInner = Array.isArray(files) ? absoluteFilePaths(files) : envFiles(files)

    function loop() {
        const map: { [key: string]: any } = {}
        for (const file of filesInner) {
            try {
                const content = envLoad(file)
                Object.keys(content).forEach(key => {
                    if (content[key] !== undefined) {
                        map[key] = content[key]
                    } else if (map[key] === undefined) {
                        map[key] = null
                    }
                })
            } catch (e) {
                // ignore
            }
        }
        Object.keys(custom).forEach(key => {
            if (customSetter) {
                customSetter(key, custom[key])
            }
            if (custom[key] !== undefined) {
                map[key] = custom[key]
            } else if (map[key] === undefined) {
                map[key] = null
            }
        })
        buildDefConst(map, defFileName, defValName, isCommonJs)
        return map
    }

    let time: NodeJS.Timeout | undefined = undefined
    return {
        exec() {
            return loop()
        },
        watch(interval: number = 3000) {
            if (time) {
                clearInterval(time)
            }
            time = setInterval(loop, Math.max(interval, 500))
        },
        unWatch() {
            if (!time) return
            clearInterval(time)
        }
    }
}
