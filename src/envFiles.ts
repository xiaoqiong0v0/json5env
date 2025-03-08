import {DEFAULT, JsonEnvConfig} from "./config";
import {cwd, env} from "node:process";
import path from "node:path";
import {StringIsNullOrUndefined} from "./util";

const root = cwd()

export const filePath = (fNamePre: string, format: string) => {
    return path.resolve(root, fNamePre + (StringIsNullOrUndefined(format) ? DEFAULT.format : format))
}
export default function envFiles(option: JsonEnvConfig): string[] {
    // 先加载 base
    const baseFile = option.baseFile || DEFAULT.baseFile
    const baseFilePath = filePath(option.baseFile, option.format)
    // 根据环境加载对应文件
    const nodeEnv = env.NODE_ENV || 'production'
    const envFile = option.envFiles[nodeEnv] || `${baseFile}.${nodeEnv}`
    const envFilePath = filePath(envFile, option.format)
    // 最后加载本地文件
    const localFile = option.localFile || `${baseFile}.local`
    const localFilePath = filePath(localFile, option.format)
    return [
        baseFilePath,
        envFilePath,
        localFilePath
    ]
}
