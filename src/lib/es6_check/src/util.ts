import urlParser from 'url'
import log from './log'

function replaceURLHost(url: string, host: string) {
    const urlObj = urlParser.parse(url, false, true)
    urlObj.host = host
    // 改成http的协议, ip:port不支持SSL
    urlObj.protocol = 'http'
    return urlParser.format(urlObj)
}

function ensureURLHasProtocol(url: string, isHttps: boolean = false) {
    const urlObj = urlParser.parse(url, false, true)

    const protocol = isHttps ? 'https' : 'http'
    if (!urlObj.protocol) {
        log('add protocol', protocol, 'to ', url)
        urlObj.protocol = protocol
    }

    return urlParser.format(urlObj)
}

export { replaceURLHost, ensureURLHasProtocol }
