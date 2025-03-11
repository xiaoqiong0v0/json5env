import fs from "node:fs";
import JSON from "json5";

export function envLoad(file: string) {
    let json: any = {}
    if (file.endsWith(".js")) {
        try {
            json = require(file)
        } catch (e) {
            throw new Error(`${file} is not a valid env js export(module.exports) file`)
        }
    } else {
        const content = fs.readFileSync(file, 'utf-8')
        try {
            json = JSON.parse(content)
        } catch (e) {
            throw new Error(`${file} is not a valid json file`)
        }
        if (typeof json !== 'object' || Array.isArray(json)) {
            throw new Error(`${file} is not a valid json file`)
        }
    }
    return json
}
