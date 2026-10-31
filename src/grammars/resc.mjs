// Small TextMate grammar for Renode scripts (.resc) and monitor commands.
export default {
  name: 'resc',
  scopeName: 'source.resc',
  aliases: ['renode'],
  patterns: [
    { name: 'comment.line.number-sign.resc', match: '#.*$' },
    { name: 'string.quoted.double.resc', begin: '"', end: '"' },
    { name: 'string.unquoted.path.resc', match: '@[^\\s]+' },
    { name: 'variable.other.resc', match: '\\$[A-Za-z_][\\w]*' },
    {
      name: 'keyword.control.resc',
      match: '\\b(using|include|mach|machine|emulation|macro|runMacro|start|pause|quit|set|showAnalyzer|logLevel|logFile|sysbus|connector)\\b',
    },
    { name: 'constant.numeric.resc', match: '\\b(0x[0-9A-Fa-f]+|\\d+)\\b' },
  ],
};
