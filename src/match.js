var removeDiacritics = require('diacritic').clean;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
var specialCharsRegex = /[.*+?^${}()|[\]\\]/g;

// http://www.ecma-international.org/ecma-262/5.1/#sec-15.10.2.6
var wordCharacterRegex = /[a-z0-9_]/i;

var whitespacesRegex = /\s+/;

function escapeRegexCharacters(str) {
  return str.replace(specialCharsRegex, '\\$&');
}

export const match = (text, query)  => {

    return (
        query
            .trim()
            .split(whitespacesRegex)
            .reduce((result, word) => {
                if (!word.length) return result;
                const wordLen = word.length;
                const regex = new RegExp(escapeRegexCharacters(word), 'i');
                const { index = -1 } = text.match(regex);
                if (index > -1) {
                    result.push([index, index + wordLen]);

                    // Replace what we just found with spaces so we don't find it again.
                    text =
                        text.slice(0, index) +
                        new Array(wordLen + 1).join(' ') +
                        text.slice(index + wordLen);
                }

                return result;
            }, [])
            .sort((match1, match2) => {
                return match1[0] - match2[0];
            })
    );
};
