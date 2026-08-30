import type { Rule } from "eslint";

interface FunctionDeclaration {
  implementation: boolean;
  name?: string;
}

interface Position {
  line: number;
}

interface SourceLocation {
  end: Position;
  start: Position;
}

interface Statement {
  body?: unknown;
  declaration?: Statement | null;
  id?: { name?: string } | null;
  loc?: SourceLocation | null;
  type: string;
}

function functionDeclaration(statement: Statement): FunctionDeclaration | null {
  const declaration =
    statement.type === "ExportDefaultDeclaration" ||
    statement.type === "ExportNamedDeclaration"
      ? statement.declaration
      : statement;

  if (
    !declaration ||
    (declaration.type !== "FunctionDeclaration" &&
      declaration.type !== "TSDeclareFunction")
  ) {
    return null;
  }

  return {
    implementation:
      declaration.type === "FunctionDeclaration" && declaration.body != null,
    name: declaration.id?.name,
  };
}

function sameOverloadGroup(
  current: FunctionDeclaration,
  previous: FunctionDeclaration,
): boolean {
  return (
    !previous.implementation &&
    current.name != null &&
    current.name === previous.name
  );
}

export const functionPadding: Rule.RuleModule = {
  create(context) {
    const sourceCode = context.sourceCode;

    function firstAttachedLine(
      current: Statement,
      previous: Statement,
    ): number {
      let startLine = current.loc?.start.line ?? 0;
      const comments = sourceCode.getCommentsBefore(current as Rule.Node);

      for (let index = comments.length - 1; index >= 0; index -= 1) {
        const comment = comments[index];

        if (
          !comment?.loc ||
          comment.loc.start.line <= (previous.loc?.end.line ?? 0) ||
          startLine > comment.loc.end.line + 1
        ) {
          break;
        }

        startLine = comment.loc.start.line;
      }

      return startLine;
    }

    function checkStatements(statements: Statement[]): void {
      for (let index = 1; index < statements.length; index += 1) {
        const current = statements[index];
        const previous = statements[index - 1];

        if (!current || !previous || !current.loc || !previous.loc) {
          continue;
        }

        const currentFunction = functionDeclaration(current);
        const previousFunction = functionDeclaration(previous);
        const startLine = firstAttachedLine(current, previous);

        if (
          !currentFunction ||
          !previousFunction ||
          sameOverloadGroup(currentFunction, previousFunction) ||
          startLine > previous.loc.end.line + 1
        ) {
          continue;
        }

        const lineStart = sourceCode.text.lastIndexOf(
          "\n",
          sourceCode.getIndexFromLoc({ column: 0, line: startLine }) - 1,
        );

        context.report({
          fix: (fixer) =>
            fixer.insertTextBeforeRange([lineStart + 1, lineStart + 1], "\n"),
          messageId: "expected",
          node: current as Rule.Node,
        });
      }
    }

    return {
      BlockStatement: (node) => checkStatements(node.body),
      Program: (node) => checkStatements(node.body),
      StaticBlock: (node) => checkStatements(node.body),
      SwitchCase: (node) => checkStatements(node.consequent),
      TSModuleBlock: (node: { body: Statement[] }) =>
        checkStatements(node.body),
    };
  },
  meta: {
    docs: {
      description: "Require blank lines around function declaration groups",
    },
    fixable: "whitespace",
    messages: {
      expected: "Expected a blank line around the function declaration.",
    },
    schema: [],
    type: "layout",
  },
};
