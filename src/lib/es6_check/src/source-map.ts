import path from "path";
import fs from "fs";
// source-map 这个库通过是否有 fetch 对象来判断是否是 node 环境， 所以不能使用 fetch
import axios from "axios";
import { RawSourceMap, SourceMapConsumer } from "source-map";

// https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#
function hasSourceMap(content: string) {
  const lines = content.split("\n");

  const lastLine = lines[lines.length - 1];

  if (lastLine && lastLine.startsWith("//# sourceMappingURL=")) {
    return true;
  }

  return false;
}

function getSourceMapURI(content: string) {
  if (!hasSourceMap(content)) {
    return "";
  }

  const lines = content.split("\n");
  const lastLine = lines[lines.length - 1];
  return lastLine.replace("//# sourceMappingURL=", "").trim();
}

async function resolveSourceMapContent(
  content: string,
  filepath: string
): Promise<RawSourceMap | null> {
  const sourceMapURI = getSourceMapURI(content);

  if (!sourceMapURI) {
    return null;
  }

  if (sourceMapURI.startsWith("http") || sourceMapURI.startsWith("//")) {
    console.log("sourceMap 似乎是 URL", sourceMapURI, "尝试通过请求获取");
    try {
      const resp = await axios.get(sourceMapURI);
      console.log("sourceMap 请求结果返回", resp.data);
      return JSON.parse(resp.data) as RawSourceMap;
    } catch (err) {
      console.error("error", err);
    }
  } else {
    const fileDir = path.dirname(filepath);

    const sourceMapPath = path.join(fileDir, sourceMapURI);
    console.log("尝试读取本地 SourceMap 文件", sourceMapURI, sourceMapPath);

    if (fs.existsSync(sourceMapPath)) {
      console.log(`${sourceMapPath} 文件存在， 读取内容`);
      const content = fs.readFileSync(sourceMapPath, "utf8");
      try {
        return JSON.parse(content) as RawSourceMap;
      } catch (e) {
        console.log(`将 ${sourceMapPath} 内容解析成 JSON 失败, 返回 null`);
        console.error("error", e);
      }
    } else {
      console.log(`未能找到 SourceMap 文件`);
    }
  }

  return null;
}

async function getContentOriginPosition(
  rawContent: string,
  sourceMap: string,
  position: { line: number; column: number }
) {
  // const sourceMap = await resolveSourceMapContent(rawContent, filapath);

  if (!sourceMap) {
    return null;
  }

  // console.log(`解析到 sourceMap 文件, 产物名称为 ${sourceMap.file}`);
  console.log({ position });


  const origionalPosition = await SourceMapConsumer.with(
    sourceMap,
    null,
    (consumer: any) => {
      const originalPosition = consumer.originalPositionFor(position);
      return originalPosition;
    }
  );

  return origionalPosition;
}

export {
  hasSourceMap,
  getSourceMapURI,
  resolveSourceMapContent,
  getContentOriginPosition,
};
