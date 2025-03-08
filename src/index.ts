import fs from 'node:fs'
import JSON from 'json5'
import {env} from "node:process";
import './util'
import {StringEmptyOrBlank} from "./util";
import {JsonEnvConfig, DEFAULT} from "./config";
import buildDefLoader from "./buildDefLoader"
import buildDefPlugin from "./buildDefPlugin";
import autoDef from "./autoDef";
import envFiles from "./envFiles";

function fromJson(file: string, target: { [key: string]: any }) {
    const content = fs.readFileSync(file, 'utf-8')
    let json: any = {}
    try {
        json = JSON.parse(content)
    } catch (e) {
        throw new Error(`${file} is not a valid json file`)
    }
    if (typeof json !== 'object' || Array.isArray(json)) {
        throw new Error(`${file} is not a valid json file`)
    }
    for (const key in json) {
        target[key] = json[key]
    }
}

function load(option: JsonEnvConfig) {
    // 获取项目根目录
    let target: { [key: string]: any } = env
    if (!StringEmptyOrBlank(option.envKey)) {
        let current: { [key: string]: any } | undefined = target[option.envKey]
        if (!current) {
            current = {}
            target[option.envKey] = current
        }
        target = current
    }
    const [baseFilePath, envFilePath, localFilePath] = envFiles(option)
    // 先加载 base
    fs.existsSync(baseFilePath) && fromJson(baseFilePath, target)
    // 根据环境加载对应文件
    fs.existsSync(envFilePath) && fromJson(envFilePath, target)
    // 最后加载本地文件
    fs.existsSync(localFilePath) && fromJson(localFilePath, target)
    return {
        Env: target,
        getEnv(key: string, defaultValue: any = undefined) {
            return target[key] || defaultValue
        },
        setEnv(key: string, value: any) {
            target[key] = value
        }
    }
}

export {
    JsonEnvConfig,
    DEFAULT,
    load,
    buildDefLoader,
    buildDefPlugin,
    autoDef
}
