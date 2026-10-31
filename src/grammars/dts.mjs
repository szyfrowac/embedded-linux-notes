// TextMate grammar for Linux device tree sources (.dts, .dtsi, overlays).
export default {
  name: 'dts',
  scopeName: 'source.dts',
  aliases: ['dtsi', 'devicetree'],
  patterns: [
    { include: '#comment' },
    { include: '#preprocessor' },
    { include: '#directive' },
    { include: '#node' },
    { include: '#property' },
    { include: '#value' },
  ],
  repository: {
    comment: {
      patterns: [
        { name: 'comment.block.dts', begin: '/\\*', end: '\\*/' },
        { name: 'comment.line.double-slash.dts', match: '//.*$' },
      ],
    },
    preprocessor: {
      match: '^\\s*(#\\s*(?:include|define|undef|ifdef|ifndef|if|else|elif|endif))\\b(.*)$',
      captures: { 1: { name: 'keyword.control.directive.dts' }, 2: { name: 'string.unquoted.dts' } },
    },
    directive: {
      match: '/(dts-v1|plugin|include|delete-node|delete-property|memreserve|bits)/',
      name: 'keyword.control.dts',
    },
    node: {
      match: '(?:([A-Za-z_][\\w-]*)(:)\\s*)?(&[A-Za-z_][\\w-]*|/|[A-Za-z][\\w,.+-]*(?:@[0-9A-Fa-f,]+)?)\\s*(?=\\{)',
      captures: {
        1: { name: 'entity.name.label.dts' },
        2: { name: 'punctuation.separator.dts' },
        3: { name: 'entity.name.tag.dts' },
      },
    },
    property: {
      match: '([#A-Za-z][\\w,.+#?-]*)\\s*(?==|;)',
      name: 'variable.other.property.dts',
    },
    value: {
      patterns: [
        { name: 'string.quoted.double.dts', begin: '"', end: '"', patterns: [{ match: '\\\\.', name: 'constant.character.escape.dts' }] },
        { name: 'variable.other.reference.dts', match: '&[A-Za-z_][\\w-]*' },
        { name: 'constant.numeric.hex.dts', match: '\\b0[xX][0-9A-Fa-f]+\\b' },
        { name: 'constant.numeric.decimal.dts', match: '\\b\\d+\\b' },
        { name: 'constant.other.macro.dts', match: '\\b[A-Z][A-Z0-9_]{2,}\\b' },
        { name: 'keyword.operator.dts', match: '=' },
      ],
    },
  },
};
