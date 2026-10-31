// TextMate grammar for BitBake recipes, classes and conf files (.bb, .bbappend,
// .bbclass, .conf, .inc). Task bodies (shell or python) get light highlighting:
// comments, strings, variable expansions and common keywords.
export default {
  name: 'bitbake',
  scopeName: 'source.bitbake',
  aliases: ['bb', 'bbappend', 'bbclass'],
  patterns: [
    { include: '#comment' },
    { include: '#python-function' },
    { include: '#shell-function' },
    { include: '#directive' },
    { include: '#assignment' },
  ],
  repository: {
    body: {
      patterns: [
        { include: '#comment' },
        { include: '#string' },
        { include: '#variable-expansion' },
        { name: 'variable.other.shell.bitbake', match: '\\$[A-Za-z_][\\w]*' },
        {
          name: 'keyword.control.bitbake',
          match: '\\b(if|then|else|elif|fi|for|while|do|done|in|case|esac|return|def|import|from|not|and|or|None|True|False)\\b',
        },
        { name: 'support.function.bitbake', match: '\\b(install|oe_runmake|bbnote|bbwarn|bbfatal|bbplain|ln|cp|mkdir|rm|sed|d\\.getVar|d\\.setVar|bb\\.utils\\.[a-z_]+)\\b' },
      ],
    },
    comment: { name: 'comment.line.number-sign.bitbake', match: '#.*$' },
    directive: {
      match: '^\\s*(inherit|include|require|addtask|deltask|addhandler|EXPORT_FUNCTIONS|export|unset)\\b(.*)$',
      captures: {
        1: { name: 'keyword.control.bitbake' },
        2: { patterns: [{ include: '#variable-expansion' }, { match: '\\b(after|before)\\b', name: 'keyword.other.bitbake' }] },
      },
    },
    'python-function': {
      begin: '^\\s*(python)\\s+([\\w:${}-]*)\\s*(\\(\\))?\\s*(\\{)\\s*$',
      beginCaptures: {
        1: { name: 'storage.type.bitbake' },
        2: { name: 'entity.name.function.bitbake' },
        4: { name: 'punctuation.section.block.begin.bitbake' },
      },
      end: '^(\\})\\s*$',
      endCaptures: { 1: { name: 'punctuation.section.block.end.bitbake' } },
      contentName: 'source.python.embedded.bitbake',
      patterns: [{ include: '#body' }],
    },
    'shell-function': {
      begin: '^\\s*(fakeroot\\s+)?([\\w:${}-]+)\\s*(\\(\\))\\s*(\\{)\\s*$',
      beginCaptures: {
        1: { name: 'storage.modifier.bitbake' },
        2: { name: 'entity.name.function.bitbake' },
        4: { name: 'punctuation.section.block.begin.bitbake' },
      },
      end: '^(\\})\\s*$',
      endCaptures: { 1: { name: 'punctuation.section.block.end.bitbake' } },
      contentName: 'source.shell.embedded.bitbake',
      patterns: [{ include: '#body' }],
    },
    assignment: {
      begin: '^\\s*(export\\s+)?([A-Za-z0-9_${}./+-]+(?:\\[[\\w.-]+\\])?(?::[\\w${}.-]+)*)\\s*(\\?\\?=|\\?=|:=|\\+=|=\\+|\\.=|=\\.|=)',
      beginCaptures: {
        1: { name: 'keyword.control.bitbake' },
        2: { name: 'variable.other.bitbake' },
        3: { name: 'keyword.operator.assignment.bitbake' },
      },
      end: '(?<!\\\\)$',
      patterns: [{ include: '#string' }, { include: '#variable-expansion' }],
    },
    string: {
      patterns: [
        {
          name: 'string.quoted.double.bitbake',
          begin: '"',
          end: '"',
          patterns: [{ match: '\\\\.', name: 'constant.character.escape.bitbake' }, { include: '#variable-expansion' }],
        },
        {
          name: 'string.quoted.single.bitbake',
          begin: "'",
          end: "'",
          patterns: [{ include: '#variable-expansion' }],
        },
      ],
    },
    'variable-expansion': {
      patterns: [
        {
          name: 'meta.embedded.python.bitbake',
          begin: '\\$\\{@',
          end: '\\}',
          beginCaptures: { 0: { name: 'punctuation.definition.variable.bitbake' } },
          endCaptures: { 0: { name: 'punctuation.definition.variable.bitbake' } },
          patterns: [{ include: '#string' }],
        },
        {
          name: 'variable.other.expansion.bitbake',
          match: '\\$\\{[A-Za-z0-9_:.-]+\\}',
        },
      ],
    },
  },
};
