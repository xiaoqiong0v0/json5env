export function StringEmptyOrBlank(str: string | undefined | null) {
    return str === null || str === undefined || str.trim().length === 0
}

export function StringIsNullOrUndefined(str: string | undefined | null) {
    return str === null || str === undefined
}
