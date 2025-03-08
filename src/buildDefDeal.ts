function toString(data: any) {
    switch (typeof data) {
        case "object":
            return JSON.stringify(data)
        default:
            return String(data)
    }
}

function toDefValue(type: string, value: any, defaultValue: any) {
    const realValue = toString(value !== undefined ? value : defaultValue)
    let regex;
    let math;
    switch (type) {
        case 'string':
            return `'${realValue}'`
        case 'symbol':
            regex = /Symbol\((.*)\)/
            math = regex.exec(realValue)
            if (math) {
                return `Symbol(${math[1]})`
            } else {
                return `Symbol(${realValue})`
            }
        case 'bigint':
            if (realValue.endsWith('n')) {
                return `${realValue}`
            }
            return `${realValue}n`
        default:
            return realValue
    }
}

function replaceAll(src: string, search: string, replace: string) {
    return src.replace(new RegExp(search, 'g'), replace)
}

/**
 * 全局变量定义替换加载器
 * @param source 源代码
 * @param src 源对象
 * @param defDefault 定义键和默认值 将用来遍历替换 代码中的默认值
 * @param prefix 文件中的定义前缀
 * @param map 自定义映射关系 defDefault:src
 */
export default function buildDefDeal(
    source: string,
    src: { [key: string]: any },
    defDefault: { [key: string]: any },
    prefix: string = "DEF",
    map: { [key: string]: string } | undefined = undefined,
): string {
    let outSource = source
    Object.keys(defDefault).forEach((key) => {
        const defaultValue = defDefault[key]
        const srcKey = map ? map[key] : key
        outSource = replaceAll(outSource, `${prefix}.${key}`, toDefValue(typeof defaultValue, src[srcKey], defaultValue))
    })
    return outSource
}
