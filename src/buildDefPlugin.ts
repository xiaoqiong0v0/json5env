import buildDefDeal from "./buildDefDeal";

/**
 * 全局变量定义替换加载器
 * @param src 源对象
 * @param defDefault 定义键和默认值 将用来遍历替换 代码中的默认值
 * @param prefix 文件中的定义前缀 默认 DEF
 * @param map 自定义映射关系
 * @param filter 默认过滤 *node_modules* 和 不是 js ts vue 文件
 */
export default function buildDefPlugin(
    src: { [key: string]: any },
    defDefault: { [key: string]: any },
    {prefix, map, filter}: {
        prefix: string,
        map: { [_: string]: string } | undefined,
        filter: (id: string) => boolean
    } = {
        prefix: "DEF",
        map: undefined,
        filter: (id) =>
            id.includes('node_modules') ||
            !(id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.vue'))
    }
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
