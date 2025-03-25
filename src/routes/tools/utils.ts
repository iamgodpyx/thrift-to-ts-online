import { isECMAScriptES5 } from "@/lib/es6_check/src";
import { getContentOriginPosition } from "@/lib/es6_check/src/source-map";
import fs from "fs";

export async function validateScript(
    jsBundle: string,
    sourceMap: string
): Promise<string> {
    const result = isECMAScriptES5(jsBundle);
    let resultLog = '';
    if (result.message === "success") {
        console.log(`Js Bundle ESCheck, 通过`);
        resultLog = `Js Bundle ESCheck, 通过`
        return resultLog;
    } else {
        console.log(`Js Bundle ESCheck, 失败`);
        resultLog = `Js Bundle ESCheck, 失败\n`

        console.log(`
检测到语法错误， 常见的错误有:
1. 代码中引入 const/let/await 等未编译的 ES6 语法
2. 箭头函数 () => {}
3. class
请检查
`);
        resultLog += `检测到语法错误， 常见的错误有:
1. 代码中引入 const/let/await 等未编译的 ES6 语法
2. 箭头函数 () => {}
3. class
请检查\n\n`
        console.log(`打包产物代码上下文为: ${result.message}\n\n`);
        resultLog += `打包产物代码上下文为: ${result.message}\n\n`
        if (result.errorPos) {
            console.log(
                `打包产物代码位置：第${result?.errorPos?.loc.line}行，第${result?.errorPos?.loc.column}列`
            );
            resultLog += `打包产物代码位置：第${result?.errorPos?.loc.line}行，第${result?.errorPos?.loc.column}列\n`

            const originFilePos = await getContentOriginPosition(jsBundle, sourceMap, {
                line: result?.errorPos?.loc.line,
                column: result?.errorPos?.loc.column,
            });

            if (!originFilePos) {
                console.log(`未能获取到源代码位置`);
                resultLog += `未能获取到源代码位置\n`
            }

            if (originFilePos) {
                console.log(
                    `打包后存在 ES6 语法的原代码文件为: ${originFilePos.source} 第${originFilePos.line}行，第${originFilePos.column}列`
                );
                resultLog += `打包后存在 ES6 语法的原代码文件为: ${originFilePos.source} 第${originFilePos.line}行，第${originFilePos.column}列\n`
            }
        }
        return resultLog;
    }
}
