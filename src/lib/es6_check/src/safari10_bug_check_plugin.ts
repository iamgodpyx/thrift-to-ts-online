import * as t from "@babel/types";
// @ts-ignore
import { NodePath, Visitor } from "@babel/traverse";
// @ts-ignore
import { flattenDeep, intersection } from "lodash";

/**
 * BUG: Safari10 Cannot declare a let variable twice: 'e'.
 * 这个bug是Safari官方承认的bug
 * 参考链接: https://www.cnblogs.com/cczlovexw/p/8425194.html
 */

class Plugin {
  public hasError = false;
  // t
  public visitor: () => Visitor = () => {
    const getFunctionParameters = this.getFunctionParameters;
    const getForLoopParameters = this.getForLoopParameters;
    const getOutParametersFormVariable = this.getOutParametersFormVariable;

    const that = this;

    const visitor: Visitor = {
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        // 函数外部传入参数
        const outParameters = getFunctionParameters(path.node.params);
        const bodyPathArr: any = path.node.body.body;
        for (const bodyPath of bodyPathArr) {
          if (t.isVariableDeclaration(bodyPath)) {
            const params = getOutParametersFormVariable(bodyPath);
            outParameters.push(...params);
          }
          if (
            t.isForInStatement(bodyPath) ||
            t.isForOfStatement(bodyPath) ||
            t.isForStatement(bodyPath)
          ) {
            const forLoopParameters = getForLoopParameters(bodyPath);
            if (intersection(forLoopParameters, outParameters).length > 0) {
              that.hasError = true;
              break;
            }
          }
        }
        return undefined;
      },
    };
    return visitor;
  };

  private getFunctionParameters = (
    nodes: Array<
      t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty
    >
  ): string[] => {
    const parameters = nodes.map((paramNodePath) => {
      return this.getParametersNameByType(paramNodePath);
    });
    return this.formatParametersFn(parameters);
  };

  private getForLoopParameters = (
    item: t.ForInStatement | t.ForOfStatement | t.ForStatement
  ) => {
    // 判断声明变量
    const element =
      t.isForInStatement(item) || t.isForOfStatement(item)
        ? item.left
        : item.init;

    if (t.isVariableDeclaration(element)) {
      const params = element.declarations.map((paramNodePath: any) => {
        return this.getParametersNameByType(paramNodePath.id as any);
      });
      return this.formatParametersFn(params);
    }
    return [];
  };

  private getOutParametersFormVariable = (
    item: t.VariableDeclaration
  ): string[] => {
    if (item.kind === "var") {
      const params = item.declarations.map((paramNodePath: any) => {
        return this.getParametersNameByType(paramNodePath.id as any);
      });
      return this.formatParametersFn(params);
    }
    return [];
  };

  // 将多维数组扁平化并过滤
  private formatParametersFn = (params: string | any[]) => {
    const formatParameters = flattenDeep(params);
    return formatParameters.filter((v: any) => v);
  };

  /**
   * 获取参数名
   * @param item 需要获取参数的 NodePath
   * @return 返回值可能是个string, 有可能是个多维数组
   */
  private getParametersNameByType = (
    item:
      | t.Identifier
      | t.AssignmentPattern
      | t.ArrayPattern
      | t.ObjectPattern
      | t.RestElement
      | t.MemberExpression
      | t.TSParameterProperty
  ): string | any[] => {
    if (t.isIdentifier(item)) {
      return this.getIdentifierName(item);
    }
    if (t.isAssignmentPattern(item)) {
      return this.getAssignmentPatternName(item);
    }
    if (t.isArrayPattern(item)) {
      return this.getArrayPatternName(item);
    }
    if (t.isObjectPattern(item)) {
      return this.getObjectPatternName(item);
    }
    if (t.isRestElement(item)) {
      return this.getRestElementName(item);
    }
    if (t.isMemberExpression(item)) {
      return this.getMemberExpressionName();
    }
    if (t.isTSParameterProperty(item)) {
      return this.getTsParameterPropertyName(item);
    }
    return "";
  };

  private getIdentifierName = (v: t.Identifier) => {
    return v.name;
  };

  private getAssignmentPatternName = (v: t.AssignmentPattern) => {
    const item:
      | t.Identifier
      | t.ObjectPattern
      | t.ArrayPattern
      | t.MemberExpression = v.left as any;
    return this.getParametersNameByType(item);
  };

  private getArrayPatternName = (v: t.ArrayPattern) => {
    const params = (v.elements || []).map(
      // @ts-ignore
      (
        element:
          | t.Identifier
          | t.RestElement
          | t.AssignmentPattern
          | t.ArrayPattern
          | t.ObjectPattern
      ) => {
        return this.getParametersNameByType(element);
      }
    );
    return params;
  };

  private getRestElementName = (v: t.RestElement) => {
    const item:
      | t.Identifier
      | t.MemberExpression
      | t.RestElement
      | t.AssignmentPattern
      | t.ArrayPattern
      | t.ObjectPattern
      | t.TSParameterProperty = v.argument as any;
    return this.getParametersNameByType(item);
  };

  private getMemberExpressionName = () => {
    return "";
  };

  private getObjectPatternName = (v: t.ObjectPattern) => {
    const params = v.properties.map(
      (element: t.RestElement | t.ObjectProperty) => {
        if (t.isObjectProperty(element)) {
          // @ts-ignore
          return element.key.name;
        }
        if (t.isRestElement(element)) {
          return this.getRestElementName(element);
        }
      }
    );
    return params;
  };

  private getTsParameterPropertyName = (v: t.TSParameterProperty) => {
    const item: t.Identifier | t.AssignmentPattern = v.parameter;
    return this.getParametersNameByType(item);
  };
}

export default Plugin;
