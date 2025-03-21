import React, { useState } from "react";
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
} from "./constant";

import "./index.css";

enum TAB_VALUES {
  THRIFT_TO_TS = 0,
  JS_BUNDLE = 1,
  HTML = 2,
}

export default function EsCheck() {
  const [tabValues, setTabValues] = useState(TAB_VALUES.JS_BUNDLE);
  const [thrift, setThrift] = useState(START_THRIFT);
  const [jsBundleCode, setJsBundleCode] = useState(START_JS_BUNDLE);
  const [htmlCode, setHtmlCode] = useState(START_HTML);
  const [sourcemapCode, setSourcemapCode] = useState(START_SOURCEMAP);

  const [tsCode, setTsCode] = useState("");
  const [jsBundleLogCode, setJsBundleLogCode] = useState("");
  const [htmlLogCode, setHtmlLogCode] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (editor: any, data: any, value: any) => {
    setThrift(value);
  };

  const handleClick = async () => {
    const ast = parser("", thrift);
    const tsCode = await print(ast);
    // const result = await prettier(tsCode);
    setTsCode(tsCode);
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
        <Tab
          label="Thrift 转换 Typescript"
          value={TAB_VALUES.THRIFT_TO_TS}
          onClick={() => setTabValues(TAB_VALUES.THRIFT_TO_TS)}
        />
        <Tab
          label="js bundle esCheck"
          value={TAB_VALUES.JS_BUNDLE}
          onClick={() => setTabValues(TAB_VALUES.JS_BUNDLE)}
        />
        <Tab
          label="html esCheck"
          value={TAB_VALUES.HTML}
          onClick={() => setTabValues(TAB_VALUES.HTML)}
        />
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
              onBeforeChange={handleChange} // 每次编辑内容变化时更新 state
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
              onBeforeChange={handleChange} // 每次编辑内容变化时更新 state
            />
          </div>
          <div className="mx-[10px] flex">
            <Button
              style={{ margin: "auto" }}
              className="h-[30px]"
              variant="contained"
            >
              转换
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
            onBeforeChange={handleChange} // 每次编辑内容变化时更新 state
          />
          <div className="mx-[10px] flex">
            <Button
              style={{ margin: "auto" }}
              className="h-[30px]"
              variant="contained"
            >
              转换
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
              转换
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
