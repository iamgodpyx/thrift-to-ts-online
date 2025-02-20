/* eslint-disable */
import {
  SyntaxType,
  Comment,
  CommentLine,
  CommentBlock,
  TextLocation,
} from "./@creditkarma/thrift-parser";
// import * as path from "path";
// import * as fs from "fs-extra";
import { RpcEntity, CMDOptions } from "./interfaces";
import { prettier } from "../tools/format";

/* istanbul ignore next */
export async function print(
  // export function print(
  entity: RpcEntity | undefined
  // options: CMDOptions,
  // includeMap: { [key: string]: RpcEntity }
): Promise<string> {
  // ): string {
  if (!entity || !entity.ns) {
    // 过滤掉没有 namespace 的
    return "";
  }
  // const ns = options.autoNamespace
  //   ? printNamespace(entity, options.root)
  //   : entity.ns;
  const now = new Date();
  const timeString = `${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const content = `// generate${` at ${timeString}`}\n
/**
* @deprecated 该类型可能损失精度，请检查类型是否应该为string
*/
type Int64 = string\n
${printConsts(entity)}
${printEnums(entity)}
${printInterfaces(entity)}
${printTypeDefs(entity)}
${printServices(entity)}
`;

  return content;
  // const relativePath: path.ParsedPath = path.parse(
  //   path.relative(options.root, entity.fileName)
  // );
  // const target = path.resolve(
  //   options.tsRoot,
  //   relativePath.dir,
  //   `${relativePath.name}.ts`
  // );

  // await fs.ensureFile(target);
  // return fs.writeFile(
  //   target,
  //   fixIncludeNamespace(content, entity, includeMap),
  //   "utf8"
  // );
}

/**
 * 根据到 root 的相对路径生成 namespace
 *
 * @param {RpcEntity} entity
 * @param {string} root
 * @returns {string} namespace
 */
// function printNamespace(entity: RpcEntity, root: string): string {
//   const relativePath: path.ParsedPath = path.parse(
//     path.relative(root, entity.fileName)
//   );
//   const ns = relativePath.dir.replace(new RegExp(`\\${path.sep}`, "g"), ".");
//   /* istanbul ignore if */
//   if (ns.indexOf(".") === 0) {
//     throw new Error("ns error");
//   }

//   return ns;
// }

/**
 * 输出 enums
 *
 * @export
 * @param {RpcEntity} entity thrift entity
 * @returns {string}
 */
export function printEnums(entity: RpcEntity): string {
  /* istanbul ignore if */
  if (!entity.enums || entity.enums.length === 0) {
    return "";
  }

  let rtn: string = "";
  entity.enums.forEach((datum, _i) => {
    rtn += printComments(datum.commentsBefore);
    rtn += `export const enum ${datum.name} {
    ${Object.keys(datum.properties)
      .map((key, i, arr) => {
        const property = datum.properties[key];
        const cb = printComments(property.commentsBefore); // comments before
        const ca = printComments(property.commentsAfter, property.loc); // comments after
        const temp = `${cb}${key} = ${property.value}${
          arr.length - 1 === i ? "" : ","
        }`;
        return attachCommentAfterToAbovePosition(temp, ca);
      })
      .join("\n    ")}
}    ${printComments(datum.commentsAfter, datum.loc)}

`;
  });
  return rtn;
}

/**
 * 输出 consts
 *
 * @export
 * @param {RpcEntity} entity thrift entity
 * @returns {string}
 */
export function printConsts(entity: RpcEntity): string {
  /* istanbul ignore if */
  if (!entity.consts || entity.consts.length === 0) {
    return "";
  }

  let rtn: string = "";
  entity.consts.forEach((datum, _i) => {
    rtn += printComments(datum.commentsBefore);
    if (
      datum.type === SyntaxType.I64Keyword ||
      datum.type === SyntaxType.StringKeyword
    ) {
      rtn += `export const ${datum.name} = '${datum.value}'\n`;
    } else {
      rtn += `export const ${datum.name} = ${datum.value}\n`;
    }
  });
  return rtn;
}

/**
 * 输出 interfaces
 *
 * @export
 * @param {Pick<RpcEntity, 'interfaces'>} entity thrift entity
 * @returns {string}
 */
export function printInterfaces(
  entity: Pick<RpcEntity, "interfaces">
): Promise<string> | string {
  if (!entity.interfaces || entity.interfaces.length === 0) {
    return "";
  }

  let rtn = "";
  entity.interfaces.forEach((datum, _i) => {
    rtn += printComments(datum.commentsBefore);
    rtn += `export interface ${datum.name} {
    ${Object.keys(datum.properties)
      .map((key, i, arr) => {
        const property = datum.properties[key];
        const cb = printComments(property.commentsBefore); // comments before
        const ca = printComments(property.commentsAfter, property.loc); // comments after
        let temp = `${key}${property.optional ? "?" : ""}: ${property.type};`;
        if (ca) {
          temp = attachCommentAfterToAbovePosition(temp, ca);
        }
        if (cb) {
          temp = cb.trim() + "\n" + temp.trim();
        }
        return temp;
      })
      .join("\n    ")}
}    ${printComments(datum.commentsAfter, datum.loc)}

`;
  });

  // return prettier(rtn);
  return rtn;
}

/**
 * 输出 typedef
 *
 * @export
 * @param {RpcEntity} entity
 * @returns {string}
 */
export function printTypeDefs(entity: RpcEntity): string {
  if (entity.typeDefs.length === 0) {
    return "";
  }

  let rtn = "";
  entity.typeDefs.forEach((datum) => {
    rtn += printComments(datum.commentsBefore);
    rtn += `  export type ${datum.alias} = ${datum.type};${printComments(
      datum.commentsAfter,
      datum.loc
    )}\n`;
  });
  return rtn + "\n";
}

/**
 * 以 12 个半角字符宽度对齐行注释
 *
 * @param {string} str
 * @param {string} comment
 * @returns {string}
 */
function attachComment(str: string, comment: string): string {
  const c = comment;

  if (!c) {
    return str;
  }
  const len = str.length + 1;
  const len2 = Math.ceil(len / 12) * 12;
  return `${str.padEnd(len2, " ")} ${c}`;
}

function attachCommentAfterToAbovePosition(
  str: string,
  comment: string
): string {
  return comment.trim() + "\n    " + str;
}

/**
 * 这个函数用来修复类型是通过 import 导入的名称
 *
 * @export
 * @param {string} content
 * @param {Pick<RpcEntity, 'fileName' | 'includes'>} entity
 * @param {{ [absolutFilepath: string]: RpcEntity }} includeMap
 * @returns {string}
 */
// export function fixIncludeNamespace(
//   content: string,
//   entity: Partial<RpcEntity> & Pick<RpcEntity, "fileName" | "includes">,
//   includeMap: {
//     [absolutFilepath: string]: Partial<RpcEntity> & Pick<RpcEntity, "ns">;
//   }
// ): string {
//   let result = content;
//   const currentFile = path.parse(entity.fileName);
//   entity.includes.forEach((include) => {
//     // 获取所有 include 语句所对应的 entity
//     const includeKey = path.resolve(currentFile.dir, include);
//     const includeEntity = includeMap[includeKey];

//     if (!includeEntity) {
//       return;
//     }

//     const shouldBeNS = includeEntity.ns; // 需要替换成的 namespace
//     const shouldReplaceNS = path.parse(include).name; // 如果文件中有用到 filename 作为 namespace

//     result = result.replace(
//       new RegExp(
//         `([^\\w\\.])((?<!__SEGMENT__.*)${shouldReplaceNS}\\.|${shouldReplaceNS}(?!.*__SEGMENT__)\\.)`,
//         "g"
//       ),
//       `__SEGMENT__$1${shouldBeNS}__SEGMENT__.`
//     );
//   });

//   // return result.replace(new RegExp(`__SEGMENT__`, 'g'), '');
//   return (
//     "// prettier-ignore\n" +
//     prettier(result.replace(new RegExp("__SEGMENT__", "g"), ""))
//   );
// }

/**
 * 打印 service
 *
 * @export
 * @param {RpcEntity} entity
 * @param {boolean} [isGenerateRPC=false] 如果是用来生成 RPC 的打印，需要加上 namespace
 * @returns
 */
export function printServices(
  entity: RpcEntity,
  isGenerateRPC: boolean = false
) {
  const serviceEntity = entity.services;
  const keyInNs = [
    ...entity.enums.map((d) => d.name),
    ...entity.typeDefs.map((d) => d.alias),
    ...entity.interfaces.map((d) => d.name),
  ];
  return serviceEntity.reduce((rtn, cur) => {
    rtn += printComments(cur.commentsBefore);
    rtn += `export interface ${cur.name} {
${Object.keys(cur.interfaces)
  .map((key) => {
    const i = cur.interfaces[key];
    let sortTmp: any[] = [];
    i.inputParams.forEach((d) => (sortTmp[d.index] = d));
    sortTmp = sortTmp.filter((d) => !!d);
    const inputParamsStr = (sortTmp as (typeof i)["inputParams"])
      .map((d) => {
        const type =
          isGenerateRPC && keyInNs.indexOf(d.type) !== -1
            ? `${entity.ns}.${d.type}`
            : d.type;
        return `${d.name}: ${type}`;
      })
      .join(", ");
    const returnType =
      isGenerateRPC && keyInNs.indexOf(i.returnType) !== -1
        ? `${entity.ns}.${i.returnType}`
        : i.returnType;
    const cb = printComments(i.commentsBefore); // comments before
    const ca = printComments(i.commentsAfter, i.loc); // comments after
    let rtn = "";
    if (cb.trim()) {
      rtn += `    ${cb.trim()}\n`;
    }
    if (ca.trim()) {
      rtn += `    ${ca.trim()}\n`;
    }
    rtn += `    ${key}(${inputParamsStr}): Promise<${returnType}>;`;
    return rtn;
  })
  .join("\n")}
}

`;
    return rtn;
  }, "");
}

// export function printCollectionRpc(
//   entity: RpcEntity,
//   includeMap: {
//     [absolutFilepath: string]: Partial<RpcEntity> & Pick<RpcEntity, "ns">;
//   }
// ): string | null {
//   if (!entity.services.length) {
//     return null;
//   }
//   const servicesCodes = printServices(entity, true);
//   const rtn = fixIncludeNamespace(servicesCodes, entity, includeMap);
//   return rtn;
// }

export function printCommentLine(comment: CommentLine): string {
  if (!comment.value) {
    return "";
  }
  return `/** ${comment.value.replace(/\*\/+/g, "")} */`;
}

export function printCommentBlock(comment: CommentBlock): string {
  if (!comment.value.length) {
    return "";
  }
  return `/*\n* ${comment.value.join("\n* ")}\n*/`;
}

/**
 * @description 打印注释，如果是PrimarySyntax之前的注释，直接换行打印，如果是之后的注释
 *                传入PrimarySyntax的loc，判断是否打印在同一行
 *
 * @param comments 需要打印的comments
 * @param loc comments所属的PrimarySyntax的位置
 */
export function printComments(
  comments: Comment[] = [],
  loc?: TextLocation
): string {
  let res = "";
  comments.forEach((comment, idx) => {
    const sameLine =
      loc &&
      comment.loc.start.line === comment.loc.end.line &&
      comment.loc.start.line === loc.end.line;
    const lastOne = idx === comments.length - 1;
    if (sameLine) {
      if (comment.type === SyntaxType.CommentLine) {
        res = printCommentLine(comment) + "\n" + res;
        if (!lastOne) {
          res += "    ";
        }
      }
      if (comment.type === SyntaxType.CommentBlock) {
        res += printCommentBlock(comment);
        if (!lastOne) {
          res += "    ";
        }
      }
    } else {
      if (comment.type === SyntaxType.CommentLine) {
        res = printCommentLine(comment) + "\n" + res;
        // 注释下面不要换行
        // res += '\n'
      }
      if (comment.type === SyntaxType.CommentBlock) {
        res += printCommentBlock(comment);
        // 注释下面不要换行
        // res += '\n'
      }
    }
  });
  return res;
}

/**
 * @description 获取includeMap中的enum值
 */
export function printEnumsObject(includeMap: { [key: string]: RpcEntity }): {
  [key: string]: number | string;
} {
  const res: { [key: string]: number | string } = {};
  Object.keys(includeMap).forEach((key) => {
    const rtn = includeMap[key];
    if (rtn.ns) {
      const namespace = rtn.ns;
      const enums = rtn.enums;
      // 在非--new的模式下，const为undefined
      const consts = rtn.consts || [];
      enums.forEach((e) => {
        Object.keys(e.properties).forEach((eKey) => {
          res[`${namespace}.${e.name}.${eKey}`] = e.properties[eKey].value;
        });
      });
      consts.forEach((c) => {
        let parsedValue: number | string;
        if (
          c.type === SyntaxType.ByteKeyword ||
          c.type === SyntaxType.I8Keyword ||
          c.type === SyntaxType.I16Keyword ||
          c.type === SyntaxType.I32Keyword
        ) {
          parsedValue = parseInt(c.value);
        } else if (c.type === SyntaxType.DoubleKeyword) {
          parsedValue = parseFloat(c.value);
        } else {
          parsedValue = c.value;
        }
        res[`${namespace}.${c.name}`] = parsedValue;
      });
    }
  });
  const sortedRes = Object.keys(res)
    .sort()
    .reduce(
      (pre, cur) => {
        pre[cur] = res[cur];
        return pre;
      },
      {} as typeof res
    );
  return sortedRes;
}
