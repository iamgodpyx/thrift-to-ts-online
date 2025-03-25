import axios from 'axios'

import { ensureURLHasProtocol } from './util'
import log from './log'

async function fetchData(url: string) {
    log('[start]', url)
    const urlWithProtocol = ensureURLHasProtocol(url)
    const encodedURL = encodeURI(urlWithProtocol)
    const resp = await axios.get<string>(encodedURL)
    log('[ended]', url)
    return resp.data
}

export default fetchData
