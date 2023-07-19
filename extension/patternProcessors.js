/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



function processYearBCPattern(text,replacementsArray){
    let result;
    const reg = giRegForText(yearBCPattern)
    while ((result = reg.exec(text))) {

        const yearWithSup = result[1] || ''
        const space = result[4] || ''
        const bc = result[5] || ''

        const index = result.index + yearWithSup.length + space.length
        addIntermediaryReplacement(replacementsArray,'bc',bc,index, true)


    }
}


function processYearWithLeadingADPattern(text,replacementsArray){
    let result;
    const reg = giRegForText(yearWithLeadingADPattern)
    while ((result = reg.exec(text))) {
        console.log('result',result)
        const leadingAD = result[1] || ''
        const space = result[4] || ''
        const yearNumber = result[5] || ''

        let index = result.index
        addIntermediaryReplacement(replacementsArray,'leading-ad',leadingAD,index)
        index += leadingAD.length
        addIntermediaryReplacement(replacementsArray,'ad-space',space,index)
        index += space.length
        addIntermediaryReplacement(replacementsArray,'year',yearNumber,index)



    }
}



function processDecadeBCPattern(text, replacementsArray){
    let result;
    const reg = giRegForText(decadePattern)
    while ((result = reg.exec(text))) {
        const decadeString = result[1] || ''
        const space = result[2] || ''
        const bc = result[3] || ''

        let index = result.index + decadeString.length + space.length
        addIntermediaryReplacement(replacementsArray,'bc',bc,index)


    }

}



function processCenturyOrMillenniumPattern(text, replacementsArray) {
    
    let result;
    const reg = giRegForText(centuriesOrMillenniaPattern)
    while ((result = reg.exec(text))) {
        const stringTillSpace = result[1] || ''
        const space = result[9] || ''
        const bc = result[10] || ''
    
        let index = result.index + stringTillSpace.length  + space.length
       
        addIntermediaryReplacement(replacementsArray,'bc',bc,index)
        
    }
}



