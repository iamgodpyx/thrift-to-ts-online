import * as parser from "@babel/parser";
// @ts-ignore
import traverse from "@babel/traverse";
import myPlugin from "./safari10_bug_check_plugin";
import parseJS from "./parse";
import fetchText from "./request";
import fs from "fs";
import { NullableMappedPosition } from "source-map";

import { getContentOriginPosition } from "./source-map";

enum ScriptType {
  URL = "URL",
  INLINE = "INLINE",
}

export interface ParseResult {
  info: string;
  type: ScriptType;
  // success为成功, 其他都是失败
  message: string | ParseError;
  errorPos?: ParseError;
}

export interface ParseResultWithOriginPos extends ParseResult {
  originPos?: NullableMappedPosition;
}

export interface CheckResult {
  has_error: boolean;
  type: ScriptType;
  // success为成功, 其他都是失败
  message: string;
}

interface ParseError extends Error {
  pos: number;
  loc: {
    line: number;
    column: number;
  };
  raisedAt: number;
}

function isECMAScriptES5(script: string): ParseResult {
  let message = "success";
  let errorPos: ParseError | undefined;
  try {
    parseJS(script);
  } catch (err) {
    const errorWithType = err as ParseError;
    errorPos = errorWithType;
    const { pos } = errorWithType;
    const SPLIT_LENGTH = 35;
    let startPos = pos - SPLIT_LENGTH;
    if (startPos < 0) {
      startPos = 0;
    }
    const CONTENT = script.slice(startPos, pos + SPLIT_LENGTH);
    message = CONTENT;
  }
  return {
    info: script,
    type: ScriptType.INLINE,
    errorPos,
    message,
  };
}

async function isECMAScriptURLES5(url: string): Promise<ParseResult> {
  let text = "";
  try {
    text = await fetchText(url);
  } catch (err) {
    return {
      info: url,
      type: ScriptType.URL,
      message: "获取文件失败",
    };
  }

  // eslint-disable-next-line @typescript-eslint/await-thenable
  const resp = await isECMAScriptES5(text);
  return {
    info: url,
    type: ScriptType.URL,
    message: resp.message,
  };
}

async function hasSafari10ErrorByURL(url: string): Promise<CheckResult> {
  let text = "";
  try {
    text = await fetchText(url);
  } catch (err) {
    return {
      has_error: false,
      type: ScriptType.URL,
      message: "获取文件失败",
    };
  }

  const resp = await hasSafari10Error(text);
  return {
    has_error: resp.has_error,
    type: ScriptType.URL,
    message: resp.message,
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
async function hasSafari10Error(script: string): Promise<CheckResult> {
  try {
    // eslint-disable-next-line
    const ast = parser.parse(script);
    const polyfills = new myPlugin();
    traverse(ast, polyfills.visitor());
    if (!polyfills.hasError) {
      return {
        has_error: polyfills.hasError,
        type: ScriptType.INLINE,
        message: "success",
      };
    } else {
      return {
        has_error: polyfills.hasError,
        type: ScriptType.INLINE,
        message: "检测文件在 Safari10 浏览器存在 Bug",
      };
    }
  } catch (err) {
    return {
      has_error: false,
      type: ScriptType.INLINE,
      message: "文件在 Safari10 浏览器是否存在 Bug 检测过程中检测失败",
    };
  }
}

/**
 * @param filepath 可以是本地路径或者是线上 URL 地址
 */
async function validateScriptByURL(
  filepath: string
): Promise<ParseResultWithOriginPos> {
  const content = fs.readFileSync(filepath, "utf8");

  const result = isECMAScriptES5(content);

  if (result.message === "success") {
    return result;
  }

  const originPos = await getContentOriginPosition(content, filepath, {
    // eslint-disable-next-line
    line: result?.errorPos?.loc?.line!,
    // eslint-disable-next-line
    column: result?.errorPos?.loc?.column!,
  });

  return {
    ...result,
    originPos: originPos || undefined,
  };
}

export {
  isECMAScriptES5,
  isECMAScriptURLES5,
  hasSafari10ErrorByURL,
  hasSafari10Error,
  validateScriptByURL,
};
