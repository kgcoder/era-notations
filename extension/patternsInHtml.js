/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const spacePattern = ' |\\s|\\&nbsp;|\\&#160;|\\&#8201;'
const completeSpacePatternInHtml = `(<span[^>]*?>)(${spacePattern})(</span>)|${spacePattern}`
const bcPatternInHtml = `(${completeSpacePatternInHtml}|-)((b\\.(${completeSpacePatternInHtml})?c\\.?|bc)e?|(<small>)(bce?)</small>)`
//const methods = Object.keys(shortToLongMethodConversions).join('|')

const nakedYearPatternInHtml = '\\b([1-9][0-9]{0,2},[0-9]{3}|[0-9]{1,4}|10000|10,000)(?!\\])\\b'


// const centuriesAndMillenniaMarkupPattern = `((<span class="(bc-c|bc-m)"( data-t="([^>]*?)")?( data-s="[^>]*?")?>)([^<]*?)</span>(${completeSpacePatternInHtml}|-)(century|centuries|cent\\.|c\\.|millennium|millennia))(${bcPatternInHtml})`
// const markupWithInnerSpansPattern = `(<span class="(${methods})"( data-t="([^>]*?)")?( data-s="([^>]*?)")?>)([^<]*?)(<span[^>]*?>)(.)(</span>)([^<]*?)</span>`
// const generalMarkupPattern = `(<span class="(${methods})"( data-t="([^>]*?)")?( data-s="([^>]*?)")?>)([^<]*?)</span>`


const negativeLookaheadPattern = '(?<!<[^>]*?)'

const h2Pattern = `<h2><span[^>]*?></span><span class="mw-headline"[^>]*?>(.*?)</span><IgnoredPart></h2>`

