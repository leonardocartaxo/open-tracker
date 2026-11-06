function isDecoratedField(node) {
  return node?.type === 'PropertyDefinition' && Array.isArray(node.decorators) && node.decorators.length > 0;
}

const newline = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: {
      description: 'Require a blank line after a decorated class property',
    },
    schema: [],
    messages: {
      expected: 'Expected blank line after decorated class property.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      ClassBody(node) {
        const members = node.body;

        for (let index = 0; index < members.length - 1; index += 1) {
          const current = members[index];
          const next = members[index + 1];
          if (!isDecoratedField(current) && !isDecoratedField(next)) continue;

          const currentLast = sourceCode.getLastToken(current);
          const nextFirst = sourceCode.getFirstToken(next);
          const hasBlankLine = nextFirst.loc.start.line - currentLast.loc.end.line > 1;
          if (hasBlankLine) continue;

          context.report({
            node: next,
            messageId: 'expected',
            fix(fixer) {
              return fixer.insertTextAfter(currentLast, '\n');
            },
          });
        }
      },
    };
  },
};

export default {
  meta: { name: 'decorated-class-fields' },
  rules: { newline },
};
