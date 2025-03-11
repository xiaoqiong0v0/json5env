import buildDefDeal from "./buildDefDeal";
import EnvConst from "./envConst";

/**
 * 全局变量定义替换加载器
 * @param defDefault 定义键和默认值 将用来遍历替换 代码中的默认值
 * @param src 源对象默认 EnvConst
 * @param prefix 文件中的定义前缀 默认 DEF
 * @param map 自定义映射关系
 * @param filter 默认过滤 *node_modules* 和 不是 js ts vue 文件
 */
export default function buildDefPlugin(
    defDefault: { [key: string]: any },
    {
        src = EnvConst,
        prefix = "DEF",
        map = undefined,
        filter = (id) =>
            id.includes('node_modules') ||
            !(id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.vue'))
    }: {
        src?: { [_: string]: any },
        prefix?: string,
        map?: { [_: string]: string } | undefined,
        filter?: (id: string) => boolean
    } = {}
) {
    return {
        name: 'globalDefPlugin',
        transform: function (source: string, id: string): string {
            if (filter(id)) {
                return source
            }
            return buildDefDeal(source, src, defDefault, prefix, map)
        }
    }
}
