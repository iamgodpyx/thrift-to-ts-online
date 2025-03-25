#! /usr/bin/env node
import program from "commander";
import path from "path";
import fs from "fs";
import { isECMAScriptES5 } from "./script";
import { isHTMLInlineScriptContainES6 } from "./html";
import { getContentOriginPosition } from "./source-map";
// @ts-ignore
import glob from "glob";

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

enum FileExt {
  JS = "js",
  HTML = "html",
}

program.version("0.0.1");

program
  .command("html <dir>")
  .description("检测目录中的 html 文件内联 script 是否包含ES6语法")
  .action(async (dir: string) => {
    const files = syncReadFile(dir, FileExt.HTML);
    if (files.length <= 0) {
      process.exit(0);
    }
    const allResult: boolean[] = await asyncForEach(
      files,
      validateHTMLInlineScript
    );
    const isAllPass: boolean = allResult.every((item) => item === true);
    if (!isAllPass) {
      process.exit(1);
    } else {
      console.log("全部通过");
      process.exit(0);
    }
  });

program
  .command("js <dir>")
  .description("检测目录中的 js 文件是否包含ES6语法")
  .action(async (dir: string) => {
    const files = syncReadFile(dir, FileExt.JS);
    if (files.length <= 0) {
      process.exit(0);
    }
    const allResult: boolean[] = await asyncForEach(files, validateScript);
    const isAllPass: boolean = allResult.every((item) => item === true);
    if (!isAllPass) {
      process.exit(1);
    } else {
      console.log("全部通过");
      process.exit(0);
    }
  });

program.parse(process.argv);

function syncReadFile(inputDir: string, type: FileExt): string[] {
  const filePath = path.join(inputDir, "/**/*." + type);
  const files = glob.sync(filePath);

  if (!files) {
    return [];
  }
  console.log("检测到以下文件", files);
  return files;
}

type AsyncForEachCallback = (item: any, index: number, array: any[]) => any;
// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(
  array: any[],
  callback: AsyncForEachCallback
): Promise<Array<ReturnType<typeof callback>>> {
  const result: Array<ReturnType<typeof callback>> = [];
  for (let index = 0; index < array.length; index++) {
    result.push(await callback(array[index], index, array));
  }
  return result;
}

async function validateScript(filePath: string): Promise<boolean> {
  const fileBuf = fs.readFileSync(filePath).toString();
  const result = isECMAScriptES5(fileBuf);
  if (result.message === "success") {
    console.log(`文件: ${filePath}, 通过`);
    return true;
  } else {
    console.log(`文件: ${filePath}, 失败`);

    console.error(`
检测到语法错误， 常见的错误有:
1. 代码中引入 const/let/await 等未编译的 ES6 语法
2. 箭头函数 () => {}
3. class
请检查
`);
    console.error(`打包产物代码上下文为: ${result.message}\n\n`);
    if (result.errorPos) {
      console.error(
        `打包产物(${filePath})代码位置：第${result?.errorPos?.loc.line}行，第${result?.errorPos?.loc.column}列`
      );

      const originFilePos = await getContentOriginPosition(fileBuf, filePath, {
        line: result?.errorPos?.loc.line,
        column: result?.errorPos?.loc.column,
      });

      if (!originFilePos) {
        console.error(`未能获取到源代码位置`);
      }

      if (originFilePos) {
        console.error(
          `打包后存在 ES6 语法的原代码文件为: ${originFilePos.source} 第${originFilePos.line}行，第${originFilePos.column}列`
        );
      }
    }
    return false;
  }
}

async function validateHTMLInlineScript(filePath: string): Promise<boolean> {
  const fileBuf = fs.readFileSync(filePath).toString();
  const result = await isHTMLInlineScriptContainES6(fileBuf);
  if (result.ok) {
    console.log(`文件: ${filePath}, 通过`);
    return true;
  } else {
    console.log(`文件: ${filePath}, 失败`);
    console.log(`错误信息: ${JSON.stringify(result.data)}`);
    return false;
  }
}
