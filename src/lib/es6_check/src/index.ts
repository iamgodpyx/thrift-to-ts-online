import {
  isHTMLContainES6,
  isHTMLURLContainES6,
  isHTMLURLArrayContainES6,
  isHTMLInlineScriptContainES6,
} from "./html";
import {
  isECMAScriptES5,
  isECMAScriptURLES5,
  hasSafari10ErrorByURL,
  hasSafari10Error,
  validateScriptByURL,
} from "./script";

interface ParseError extends Error {
  pos: number;
  loc: {
    line: number;
    column: number;
  };
  raisedAt: number;
}

enum ScriptType {
  URL = "URL",
  INLINE = "INLINE",
}

interface ParseResult {
  info: string;
  type: ScriptType;
  // success为成功, 其他都是失败
  message: string | ParseError;
  errorPos?: ParseError;
}

export {
  isHTMLContainES6,
  isHTMLURLContainES6,
  isECMAScriptES5,
  isECMAScriptURLES5,
  isHTMLURLArrayContainES6,
  isHTMLInlineScriptContainES6,
  hasSafari10ErrorByURL,
  hasSafari10Error,
  validateScriptByURL,
  ParseResult,
};
