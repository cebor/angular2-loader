import fs from 'fs';
import path from 'path';

import MagicString from 'magic-string';

// using: regex, capture groups, and capture group variables.
const componentRegex = /@Component\(\s?{([\s\S]*)}\s?\)$/gm;
const templateUrlRegex = /templateUrl\s*:(.*)/g;
const styleUrlsRegex = /styleUrls\s*:(\s*\[[\s\S]*?\])/g;
const stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string) {
  return string.replace(stringRegex, function (match, quote, url) {
    if (url.charAt(0) !== '.') {
      url = './' + url;
    }
    return "require('" + url + "')";
  });
}

export default function (source) {
  this.cacheable();

  const magicString = new MagicString(source);
  const dir = path.parse(map).dir;

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

  this.callback(null, magicString.toString(), magicString.generateMap({ hires: true }))
};
