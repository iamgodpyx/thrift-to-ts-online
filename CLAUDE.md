# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 Modern.js Web 应用，提供在线工具：
1. **Thrift IDL 转 TypeScript** - 将 Apache Thrift 接口定义文件转换为 TypeScript 类型定义
2. **ES6 兼容性检查** - 检测 JavaScript bundle 和 HTML 中的 ES6 语法
3. **Mock 数据生成** - 使用 intermock 从 TypeScript 接口生成 mock 数据

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产环境构建
pnpm start        # 启动生产服务器
pnpm serve        # 本地预览生产构建
pnpm lint         # 运行 Biome 代码检查
pnpm new          # 启用可选功能或添加新入口
```

## 架构

### 核心目录

- **`src/routes/`** - 页面组件（Modern.js 文件路由）
  - `page.tsx` - 主页，Thrift 转 TS 功能
  - `tools/page.tsx` - 多标签工具页（Thrift 转换器 + ES6 检查器 + Mock 生成器）

- **`src/lib/thriftNew/`** - Thrift 解析和 TypeScript 生成
  - `index.ts` - 主解析入口，将 Thrift AST 转换为内部表示
  - `print.ts` - 从解析的 Thrift 结构生成 TypeScript 代码
  - `interfaces.ts` - 解析后的 Thrift 实体类型定义
  - `handleComments.ts` - 注释处理逻辑
  - `@creditkarma/thrift-parser/` - 自定义 Thrift IDL 解析器（fork 自 creditkarma）

- **`src/lib/es6_check/`** - ES6 兼容性检查
  - `src/index.ts` - ES6 检查函数的主导出
  - `src/script.ts` - 使用 Acorn 进行 JavaScript/ES6 语法验证
  - `src/html.ts` - HTML script 标签 ES6 检查
  - `src/source-map.ts` - Source map 处理，用于错误位置映射

- **`src/lib/tools/`** - 共享工具函数
  - `format.ts` - Prettier 格式化封装
  - `utils.ts` - 通用工具函数

### 核心数据流

1. **Thrift 转换**：用户输入 Thrift IDL → `parser()` 解析为 AST → `print()` 生成 TypeScript
2. **ES6 检查**：用户输入 JS/HTML → Acorn 解析器验证语法 → 报告发现的 ES6 特性
3. **Mock 生成**：TypeScript 接口 → intermock 生成 mock 数据

### 类型映射

Thrift 类型在 `src/lib/thriftNew/index.ts` 中映射到 TypeScript：
- `i32/i16/i8/byte` → `number`
- `i64` → `Int64`（别名为 `string`，带废弃警告）
- `string` → `string`
- `bool` → `boolean`
- `list<T>` → `T[]`
- `map<K,V>` → `Record<string, V>`（默认）或 `Map<K,V>`
- `set<T>` → `Set<T>`

## 配置文件

- **modern.config.ts** - Modern.js 配置，包含 Tailwind CSS 和 Node polyfill 插件
- **biome.json** - 代码检查和格式化（替代 ESLint/Prettier）
- **tsconfig.json** - TypeScript 配置，路径别名 `@/*` → `./src/*`