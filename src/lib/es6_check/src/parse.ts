import { parse } from 'acorn'

function parseJS(jsStr: string) {
    return parse(jsStr, { ecmaVersion: 5 })
}

export default parseJS
