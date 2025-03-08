import buildDefDeal from "./buildDefDeal";

/**
 * 全局变量定义替换加载器
 * @param src 源对象
 * @param defDefault 定义键和默认值 将用来遍历替换 代码中的默认值
 * @param prefix 文件中的定义前缀 默认 DEF
 * @param map 自定义映射关系
 */
export default function buildDefLoader(
    src: { [key: string]: any },
    defDefault: { [key: string]: any },
    {prefix, map}: {
        prefix: string,
        map: { [_: string]: string } | undefined
    } = {
        prefix: "DEF",
        map: undefined
    }
) {
    return function (source: string): string {
        return buildDefDeal(source, src, defDefault, prefix, map)
    }
}
