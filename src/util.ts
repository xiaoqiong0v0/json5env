export function StringEmptyOrBlank(str: string) {
    return !str || !str.trim()
}
export function StringIsNullOrUndefined(str: string) {
    return str === null || str === undefined
}
