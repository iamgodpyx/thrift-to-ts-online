import { format } from "prettier-standalone";

export function prettier(source: string) {
  return format(source, {
    parser: "typescript",
    semi: true,
    printWidth: 80,
    bracketSpacing: true,
    tabWidth: 2,
    trailingComma: "none",
    useTabs: false,
  });
}
