module.exports = {
  files: ['./lang/*.json'],
  localesPath: './lang',
  srcPath: '.',
  srcExtensions: ['js', 'hbs'],
  translationKeyMatcher: /(localize "|localize\("|format\(")(.*?)("|"\))/ig,
};
