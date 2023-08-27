/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const bcPattern = `(${spacePattern}|-)?((b\\.(${spacePattern})?c\\.?|bc)e?)`
const leadingAdPattern = `(a\\.(${spacePattern})?d\\.?|ad)`
const leadingCEPattern = `(c\\.(${spacePattern})?e\\.?|ce)`

const trailingADPattern = `(${spacePattern}|-)?(a\\.(${spacePattern})?d\\.?|ad)`
const trailingCEPattern = `(${spacePattern}|-)?(c\\.(${spacePattern})?e\\.?|ce)`
const rangePattern = `(${spacePattern})?(—|−|–|-|— ?early|− ?early|– ?early|- ?early|— ?late|− ?late|– ?late|- ?late|\\&#8211;|\\&ndash;|\\&#8212;|\\&mdash;|\\&#8211; ?early|\\&ndash; ?early|\\&#8212; ?early|\\&mdash; ?early|\\&#8211; ?late|\\&ndash; ?late|\\&#8212; ?late|\\&mdash; ?late|or|to|to late|to early|to the|and|and late|and early|or late|or early|-to-|until|till|through)(${spacePattern})?`

const supPattern = '\\[\\d*?\\]'

const nakedYearPattern = '([1-9][0-9]{0,2},[0-9]{3}|[0-9]{1,4}|10000|10,000|[0-9]{1,3},?000)(?!\\])'

const nakedDecadePattern = "[0-9]{0,3}0'?s"
const decadePattern = `(${nakedDecadePattern})${bcPattern}`
const decadeWithTrailingADPattern = `(${nakedDecadePattern})${trailingADPattern}`
const decadeWithTrailingCEPattern = `(${nakedDecadePattern})${trailingCEPattern}`




const yearBCPattern = `(${nakedYearPattern}(${supPattern})?)${bcPattern}`

const nakedCenturyPattern = `((\\d+(st|nd|rd|th))|${ordinalNumberWords.join('|')})`


const centuriesOrMillenniaBCPattern = `((${nakedCenturyPattern})(${spacePattern}|-)(millennium|millennia|century|centuries|cent\\.|c\\.))(${bcPattern})`

const yearWithLeadingADPattern = `\\b${leadingAdPattern}\\b(${spacePattern})${nakedYearPattern}`
const yearRangeWithLeadingADPattern = `(\\b${leadingAdPattern}\\b(${spacePattern})${nakedYearPattern}${rangePattern})${nakedYearPattern}`
const yearRangeWithTrailingADPattern = `(${nakedYearPattern}${rangePattern}${nakedYearPattern})${trailingADPattern}`

const yearRangeWithLeadingCEPattern = `(\\b${leadingCEPattern}\\b(${spacePattern})${nakedYearPattern}${rangePattern})${nakedYearPattern}`



