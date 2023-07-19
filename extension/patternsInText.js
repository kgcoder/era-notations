/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const bcPattern = `(${spacePattern}|-)?((b\\.(${spacePattern})?c\\.?|bc)e?)`
const leadingAdPattern = `(a\\.(${spacePattern})?d\\.?|ad|c\\.(${spacePattern})?e\\.?|ce)`
const trailingAdPattern = `(${spacePattern}|-)?(a\\.(${spacePattern})?d\\.?|ad|c\\.(${spacePattern})?e\\.?|ce)`

const supPattern = '\\[\\d*?\\]'

const nakedYearPattern = '([1-9][0-9]{0,2},[0-9]{3}|[0-9]{1,4}|10000|10,000|[0-9]{1,3},?000)(?!\\])'

const nakedDecadePattern = "[0-9]{0,3}0'?s"
const decadePattern = `(${nakedDecadePattern})${bcPattern}`



const yearBCPattern = `(${nakedYearPattern}(${supPattern})?)${bcPattern}`

const nakedCenturyPattern = `((\\d+(st|nd|rd|th))|${ordinalNumberWords.join('|')})`


const centuriesOrMillenniaPattern = `((${nakedCenturyPattern})(${spacePattern}|-)(millennium|millennia|century|centuries|cent\\.|c\\.))(${bcPattern})`

const yearWithLeadingADPattern = `\\b${leadingAdPattern}\\b(${spacePattern})${nakedYearPattern}`

// sdfdf AD 14 dffsdfd


//sfdf 35 CE dfdfdf