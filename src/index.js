let fs = require('fs');
let path = require('path');

let MagicString = require('magic-string');

// using: regex, capture groups, and capture group variables.
const componentRegex = /@Component\(\s?{([\s\S]*)}\s?\)$/gm;
const templateUrlRegex = /templateUrl\s*:(.*)/g;
const styleUrlsRegex = /styleUrls\s*:(\s*\[[\s\S]*?\])/g;
const stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string, map) {
  return string.replace(stringRegex, function (match, quote, url) {
    if (url.charAt(0) !== '.') {
      url = './' + url;
    }
    return "require('" + url + "')";
  });
}

module.exports = function (source) {
  this.cacheable();

  const magicString = new MagicString(source);

  let hasReplacements = false;
  let match;
  let start, end, replacement;

  while ((match = componentRegex.exec(source)) !== null) {
    start = match.index;
    end = start + match[0].length;

    replacement = match[0]
      .replace(templateUrlRegex, function (match, url) {
        return 'template:' + replaceStringsWithRequires(url);
      })
      .replace(styleUrlsRegex, function (match, urls) {
        return 'styles:' + replaceStringsWithRequires(urls);
      });

    magicString.overwrite(start, end, replacement);
  }

  let sourceMap = magicString.generateMap({ hires: true });

  this.callback(null, magicString.toString(), magicString.generateMap({ hires: true }).mappings);
};
