export class JsonEnvConfig {
    /**
     * 环境变量设置到 EnvConst 的该键下 空的话直接设置到 EnvConst
     */
    public envKey: string | undefined = undefined;
    /**
     * 文件格式(后缀) 加载文件是文件名称合成时添加到后缀
     */
    public format: string = '.json5'
    /**
     * 基础文件名 最先加载
     */
    public baseFile: string = 'json5env';
    /**
     * 构建模式对应的文件名 第二个加载 会向上覆盖
     * 默认 规则 ${baseFile}.${NODE_ENV}
     */
    public envFiles: { [key: string]: string } = {
        "development": "json5env.development",
        "production": "json5env.production",
        "test": "json5env.test",
        "staging": "json5env.staging"
    }
    /**
     * 本地文件名 最后加载 会向上覆盖
     * 默认 规则 ${baseFile}.local
     */
    public localFile: string = 'json5env.local';
}

const defaultValue = new JsonEnvConfig();

export const DEFAULT = defaultValue;
