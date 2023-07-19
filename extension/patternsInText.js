/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const bcPattern = `(${spacePattern}|-)?((b\\.(${spacePattern})?c\\.?|bc)e?)`
const supPattern = '\\[\\d*?\\]'

const nakedYearPattern = '([1-9][0-9]{0,2},[0-9]{3}|[0-9]{1,4}|10000|10,000|[0-9]{1,3},?000)(?!\\])'

const nakedDecadePattern = "[0-9]{0,3}0'?s"
const decadePattern = `(${nakedDecadePattern})${bcPattern}`

const roundnakedYearPattern = '[0-9]{1,3},?000(?!\\])'


const yearBCPattern = `(${nakedYearPattern}(${supPattern})?)${bcPattern}`

const nakedCenturyPattern = `((\\d+(st|nd|rd|th))|${ordinalNumberWords.join('|')})`


const centuriesPattern = `((${nakedCenturyPattern})(${spacePattern}|-)(century|centuries|cent\\.|c\\.))(${bcPattern})`
const millenniumPattern = `((${nakedCenturyPattern})(${spacePattern}|-)(millennium|millennia))(${bcPattern})`

