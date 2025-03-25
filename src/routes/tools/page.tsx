import React, { useEffect, useState } from "react";
import {
  Controlled as CodeMirror,
  UnControlled as CodeMirror2,
} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css"; // 使用 Dracula 主题
import "codemirror/mode/javascript/javascript"; // 引入 JavaScript 语法高亮
import { parser } from "@/lib/thriftNew";
import { print } from "@/lib/thriftNew/print";
import { prettier } from "@/lib/tools/format";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import {
  START_THRIFT,
  START_HTML,
  START_JS_BUNDLE,
  START_SOURCEMAP,
  THRIFT_TIPS,
  JS_ESCHECK_TIPS,
  HTML_ESCHECK_TIPS,
} from "./constant";
import Tooltip from "@mui/material/Tooltip";
import { isHTMLInlineScriptContainES6 } from "@/lib/es6_check/src";
import sourceMap from "source-map";
import { validateScript } from "./utils";

import "./index.css";

enum TAB_VALUES {
  THRIFT_TO_TS = 0,
  JS_BUNDLE = 1,
  HTML = 2,
}

export default function EsCheck() {
  const [tabValues, setTabValues] = useState(TAB_VALUES.THRIFT_TO_TS);
  const [thrift, setThrift] = useState(START_THRIFT);
  const [jsBundleCode, setJsBundleCode] = useState(START_JS_BUNDLE);
  const [htmlCode, setHtmlCode] = useState(START_HTML);
  const [sourcemapCode, setSourcemapCode] = useState(START_SOURCEMAP);

  const [tsCode, setTsCode] = useState("");
  const [jsBundleLogCode, setJsBundleLogCode] = useState("");
  const [htmlLogCode, setHtmlLogCode] = useState("");

  useEffect(() => {
    // 创建一个 script 标签
    const script = document.createElement("script");
    // 指定 unpkg 上的包地址，例如加载 lodash 4.17.21 的完整版（根据实际情况修改）
    script.src = "https://unpkg.com/source-map@0.7.4/dist/source-map.js";
    script.async = true;
    // 将 script 标签添加到 body 中
    document.body.appendChild(script);

    // 可选：加载完成后的回调
    script.onload = () => {
      console.log("脚本加载完成！");
      (sourceMap.SourceMapConsumer as any).initialize({
        "lib/mappings.wasm":
          "https://unpkg.com/source-map@0.7.4/lib/mappings.wasm",
      });
      // 此时可以使用该包全局变量（如 lodash 通常挂载在 _ 上）
    };

    // 清理函数，在组件卸载时移除 script 标签
    return () => {
      document.body.removeChild(script);
    };
  }, []); // 空依赖数组，确保只在挂载和卸载时执行一次

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (editor: any, data: any, value: any) => {
    setThrift(value);
  };
  const handleJsBundleChange = (editor: any, data: any, value: any) => {
    setJsBundleCode(value);
  };
  const handleSourcemapChange = (editor: any, data: any, value: any) => {
    setSourcemapCode(value);
  };
  const handleHtmlChange = (editor: any, data: any, value: any) => {
    setHtmlCode(value);
  };

  const handleClick = async () => {
    const ast = parser("", thrift);
    const tsCode = await print(ast);
    // const result = await prettier(tsCode);
    setTsCode(tsCode);
  };

  const hancleJsBundleClick = async () => {
    const result = await validateScript(jsBundleCode, sourcemapCode);
    setJsBundleLogCode(result);
    console.log({ result });
  };

  const hancleHtmlClick = async () => {
    const result = await isHTMLInlineScriptContainES6(htmlCode);
    if (result.ok) {
      setHtmlLogCode("HTML ESCheck, 通过");

      return true;
    } else {
      const errorResult =
        "HTML ESCheck, 失败\n" +
        (await prettier(`错误信息: ${JSON.stringify(result.data)}`));
      setHtmlLogCode(errorResult);
      return false;
    }
  };
  return (
    <div className="ESCheck flex px-[15px] py-[15px] flex-col">
      <Tabs
        value={tabValues}
        indicatorColor="secondary"
        textColor="inherit"
        aria-label="full width tabs example"
        sx={{
          ".MuiTab-root": {
            textTransform: "none", // 禁用自动大写
          },
        }}
      >
        <Tooltip title={THRIFT_TIPS} placement="bottom">
          <Tab
            label="Thrift IDL 转 TypeScript"
            value={TAB_VALUES.THRIFT_TO_TS}
            onClick={() => setTabValues(TAB_VALUES.THRIFT_TO_TS)}
          />
        </Tooltip>
        <Tooltip title={JS_ESCHECK_TIPS} placement="bottom">
          <Tab
            label="Js Bundle ESCheck"
            value={TAB_VALUES.JS_BUNDLE}
            onClick={() => setTabValues(TAB_VALUES.JS_BUNDLE)}
          />
        </Tooltip>
        <Tooltip title={HTML_ESCHECK_TIPS} placement="bottom">
          <Tab
            label="HTML ESCheck"
            value={TAB_VALUES.HTML}
            onClick={() => setTabValues(TAB_VALUES.HTML)}
          />
        </Tooltip>
      </Tabs>
      {tabValues === TAB_VALUES.JS_BUNDLE ? (
        <div className="flex">
          <div className="flex flex-col">
            <CodeMirror
              className="CodeMirror-js mb-[16px]"
              value={jsBundleCode}
              options={{
                mode: "javascript", // 设置编辑器模式为 JavaScript
                theme: "dracula", // 使用 Dracula 主题
                lineNumbers: true, // 显示行号
                indentUnit: 2, // 设置缩进空格为 2
                tabSize: 2, // 设置 Tab 大小为 2
                autoCloseBrackets: true, // 自动闭合括号
                matchBrackets: true, // 匹配括号
                showCursorWhenSelecting: true, // 选中时显示光标
                lineWrapping: true,
              }}
              onBeforeChange={handleJsBundleChange} // 每次编辑内容变化时更新 state
            />
            <CodeMirror
              className="CodeMirror-js"
              value={sourcemapCode}
              options={{
                mode: "javascript", // 设置编辑器模式为 JavaScript
                theme: "dracula", // 使用 Dracula 主题
                lineNumbers: true, // 显示行号
                indentUnit: 2, // 设置缩进空格为 2
                tabSize: 2, // 设置 Tab 大小为 2
                autoCloseBrackets: true, // 自动闭合括号
                matchBrackets: true, // 匹配括号
                showCursorWhenSelecting: true, // 选中时显示光标
                lineWrapping: true,
              }}
              onBeforeChange={handleSourcemapChange} // 每次编辑内容变化时更新 state
            />
          </div>
          <div className="mx-[10px] flex">
            <Button
              style={{ margin: "auto" }}
              className="h-[30px]"
              variant="contained"
              onClick={hancleJsBundleClick}
            >
              检查
            </Button>
          </div>

          <CodeMirror2
            className="CodeMirror-log"
            value={jsBundleLogCode}
            options={{
              mode: "javascript", // 设置编辑器模式为 JavaScript
              theme: "dracula", // 使用 Dracula 主题
              lineNumbers: true, // 显示行号
              indentUnit: 2, // 设置缩进空格为 2
              tabSize: 2, // 设置 Tab 大小为 2
              autoCloseBrackets: true, // 自动闭合括号
              matchBrackets: true, // 匹配括号
              showCursorWhenSelecting: true, // 选中时显示光标
              readOnly: true,
              lineWrapping: true,
            }}
          />
        </div>
      ) : tabValues === TAB_VALUES.HTML ? (
        <div className="flex">
          <CodeMirror
            value={htmlCode}
            options={{
              mode: "javascript", // 设置编辑器模式为 JavaScript
              theme: "dracula", // 使用 Dracula 主题
              lineNumbers: true, // 显示行号
              indentUnit: 2, // 设置缩进空格为 2
              tabSize: 2, // 设置 Tab 大小为 2
              autoCloseBrackets: true, // 自动闭合括号
              matchBrackets: true, // 匹配括号
              showCursorWhenSelecting: true, // 选中时显示光标
              lineWrapping: true,
            }}
            onBeforeChange={handleHtmlChange} // 每次编辑内容变化时更新 state
          />
          <div className="mx-[10px] flex">
            <Button
              style={{ margin: "auto" }}
              className="h-[30px]"
              variant="contained"
              onClick={hancleHtmlClick}
            >
              检查
            </Button>
          </div>

          <CodeMirror2
            className="CodeMirror-log"
            value={htmlLogCode}
            options={{
              mode: "javascript", // 设置编辑器模式为 JavaScript
              theme: "dracula", // 使用 Dracula 主题
              lineNumbers: true, // 显示行号
              indentUnit: 2, // 设置缩进空格为 2
              tabSize: 2, // 设置 Tab 大小为 2
              autoCloseBrackets: true, // 自动闭合括号
              matchBrackets: true, // 匹配括号
              showCursorWhenSelecting: true, // 选中时显示光标
              readOnly: true,
              lineWrapping: true,
            }}
          />
        </div>
      ) : (
        <div className="flex">
          <CodeMirror
            value={thrift}
            options={{
              mode: "javascript", // 设置编辑器模式为 JavaScript
              theme: "dracula", // 使用 Dracula 主题
              lineNumbers: true, // 显示行号
              indentUnit: 2, // 设置缩进空格为 2
              tabSize: 2, // 设置 Tab 大小为 2
              autoCloseBrackets: true, // 自动闭合括号
              matchBrackets: true, // 匹配括号
              showCursorWhenSelecting: true, // 选中时显示光标
              lineWrapping: true,
            }}
            onBeforeChange={handleChange} // 每次编辑内容变化时更新 state
          />
          <div className="mx-[10px] flex">
            <Button
              style={{ margin: "auto" }}
              className="h-[30px]"
              variant="contained"
              onClick={handleClick}
            >
              生成
            </Button>
          </div>

          <CodeMirror2
            value={tsCode}
            options={{
              mode: "javascript", // 设置编辑器模式为 JavaScript
              theme: "dracula", // 使用 Dracula 主题
              lineNumbers: true, // 显示行号
              indentUnit: 2, // 设置缩进空格为 2
              tabSize: 2, // 设置 Tab 大小为 2
              autoCloseBrackets: true, // 自动闭合括号
              matchBrackets: true, // 匹配括号
              showCursorWhenSelecting: true, // 选中时显示光标
              readOnly: true,
              lineWrapping: true,
            }}
          />
        </div>
      )}
    </div>
  );
}
