import JSON from "json5";

const keyInEnv: string = "__JSON_5_ENV_STRING__"

function loadFromEnv() {
    const env = process.env[keyInEnv]
    if (!env) return {}
    try {
        return JSON.parse(env)
    } catch (e) {
        return {}
    }
}

function saveToEnv(env: { [key: string]: any }) {
    process.env[keyInEnv] = JSON.stringify(env)
}

const current = loadFromEnv()


const EnvConst: { [key: string]: any } = new Proxy(current, {
    get: (target: any, prop: string) => {
        if (prop in target) {
            return target[prop]
        }
        return undefined
    },
    set: (target: any, prop: string, value: any) => {
        target[prop] = value
        saveToEnv(target)
        return true
    }
})


export default EnvConst
