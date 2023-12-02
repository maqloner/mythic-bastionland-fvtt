module.exports = {
  localesPath: './lang',
  srcPath: '.',
  srcExtensions: ['js', 'hbs'],
  translationKeyMatcher: /(localize "|localize\("|format\(")(.*?)("|"\))/ig,
};
