import fs from 'node:fs'
import JSON from 'json5'
import './util'
import {StringEmptyOrBlank} from "./util";
import {JsonEnvConfig, DEFAULT} from "./config";
import buildDefLoader from "./buildDefLoader"
import buildDefPlugin from "./buildDefPlugin";
import autoDef from "./autoDef";
import envFiles from "./envFiles";
import EnvConst from "./envConst";
import {envLoad} from "./envLoad";

function obtainEnv(file: string, target: { [key: string]: any }) {
    let json: any = envLoad(file)
    for (const key in json) {
        target[key] = json[key]
    }
}

function load(option: JsonEnvConfig) {
    // 获取项目根目录
    let target: { [key: string]: any } = EnvConst
    if (!StringEmptyOrBlank(option.envKey)) {
        let current: { [key: string]: any } | undefined = target[option.envKey!]
        if (!current) {
            current = {}
            target[option.envKey!] = current
        }
        target = current
    }
    const [baseFilePath, envFilePath, localFilePath] = envFiles(option)
    // 先加载 base
    fs.existsSync(baseFilePath) && obtainEnv(baseFilePath, target)
    // 根据环境加载对应文件
    fs.existsSync(envFilePath) && obtainEnv(envFilePath, target)
    // 最后加载本地文件
    fs.existsSync(localFilePath) && obtainEnv(localFilePath, target)
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
