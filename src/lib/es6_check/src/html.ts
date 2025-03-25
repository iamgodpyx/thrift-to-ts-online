import { isECMAScriptES5, isECMAScriptURLES5, ParseResult } from "./script";
import fetchHTML from "./request";
import { cheerio } from "./npm";
import { replaceURLHost } from "./util";
import log from "./log";
// import { validateMetrics } from './metrics'

interface HTMLParseResult {
  // 引入的脚本
  urls: string[];
  // 内嵌在html里面的脚本
  scriptStrs: string[];
}

interface HTMLValidateResult {
  data: ParseResult[];
  ok: boolean;
}

interface ValidateConfig {
  whiteList?: string[];
  // 替换url中的域名
  address?: string;
}

function getHTMLScripts(html: string): HTMLParseResult {
  const urls: string[] = [];
  const scriptStrs: string[] = [];

  const $ = cheerio.load(html);

  const scripts = $("script");
  scripts.map((_: any, val: any) => {
    // http://es6.ruanyifeng.com/#docs/module-loader 过滤掉module模块
    if (val.attribs.src && val.attribs.type !== "module") {
      urls.push(val.attribs.src);
    } else if (
      val.children.length > 0 &&
      (!val.attribs.type ||
        val.attribs.type === "application/javascript" ||
        val.attribs.type === "text/javascript")
    ) {
      const children = val.children;
      children.map((child: any) => {
        // @ts-ignore
        if (child.data) {
          // @ts-ignore
          scriptStrs.push(child.data);
        }
      });
    }
  });

  return {
    urls,
    scriptStrs,
  };
}

async function isHTMLContainES6(
  html: string,
  opts: ValidateConfig
): Promise<HTMLValidateResult> {
  const scriptObj = getHTMLScripts(html);

  const externalScripts = scriptObj.urls.filter((url) => {
    if (opts.whiteList) {
      const whiteList = opts.whiteList;
      return whiteList.every((str) => {
        if (str === url) {
          return false;
        }
        return true;
      });
    }
    return true;
  });
  const scriptsResp = await Promise.all(
    externalScripts.map(isECMAScriptURLES5)
  );

  const inlineScriptResp = await Promise.all(
    scriptObj.scriptStrs.map(isECMAScriptES5)
  );

  const allResult = [...scriptsResp, ...inlineScriptResp];

  const allScriptValid = allResult.every((val) => val.message === "success");
  return {
    ok: allScriptValid,
    data: allResult,
  };
}

async function isHTMLInlineScriptContainES6(
  html: string
): Promise<HTMLValidateResult> {
  const scriptObj = getHTMLScripts(html);

  const inlineScriptResp = await Promise.all(
    scriptObj.scriptStrs.map(isECMAScriptES5)
  );

  const allResult = [...inlineScriptResp];

  const allScriptValid = allResult.every((val) => val.message === "success");
  return {
    ok: allScriptValid,
    data: allResult,
  };
}

async function isHTMLURLContainES6(url: string, opts: ValidateConfig = {}) {
  log("opts", opts);
  log("[start/getHTML] raw url", url);

  let htmlURL = url;
  if (opts.address) {
    htmlURL = replaceURLHost(url, opts.address);
  }

  log("[start/getHTML] query url", htmlURL);
  const html = await fetchHTML(htmlURL);
  log("[end/getHTML]", htmlURL);
  const resp = await isHTMLContainES6(html, opts);
  return {
    ...resp,
    html: url,
  };
}

async function isHTMLURLArrayContainES6(
  urls: string[],
  opts: ValidateConfig = {}
) {
  // validateMetrics.input()

  let fmtedURLs = urls;
  if (opts.address) {
    fmtedURLs = urls.map((str) => replaceURLHost(str, opts.address!));
  }

  // 获取所有的html内容
  const htmlContents = await Promise.all(fmtedURLs.map(fetchHTML));

  const allScripts = new Set<string>();
  const whiteListScripts = new Set<string>(opts.whiteList || []);

  const htmlInfo = htmlContents.map(getHTMLScripts).map((value, i) => {
    return {
      ...value,
      html: fmtedURLs[i],
      content: htmlContents[i],
    };
  });

  htmlInfo.forEach((info) => {
    info.urls.forEach((scriptURL) => {
      if (!whiteListScripts.has(scriptURL)) {
        allScripts.add(scriptURL);
      }
    });
  });

  const scriptsResult = await Promise.all(
    Array.from(allScripts).map(isECMAScriptURLES5)
  );

  const scriptsMap = new Map<string, ParseResult>();
  scriptsResult.forEach((result) => {
    scriptsMap.set(result.info, result);
  });

  const totalResult: HTMLValidateResult[] = htmlInfo.map((info) => {
    const inlineResult = info.scriptStrs.map(isECMAScriptES5);
    const urlResult = info.urls.map((url) => {
      if (whiteListScripts.has(url)) {
        return {
          info: url,
          type: "URL",
          message: "success",
        } as ParseResult;
      }
      return scriptsMap.get(url) as ParseResult;
    });

    const results = [...inlineResult, ...urlResult];
    const ok = results.every((val) => val.message === "success");
    return {
      ok,
      html: info.html,
      content: info.content,
      data: results,
    };
  });

  const isAllHTMLPass = totalResult.every((val) => !!val.ok);

  // if (isAllHTMLPass) {
  //     validateMetrics.pass()
  // } else {
  //     validateMetrics.fail()
  // }

  return {
    ok: isAllHTMLPass,
    data: totalResult,
  };
}

export {
  isHTMLContainES6,
  isHTMLInlineScriptContainES6,
  isHTMLURLContainES6,
  isHTMLURLArrayContainES6,
  getHTMLScripts,
};
