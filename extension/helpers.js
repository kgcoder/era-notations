/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function giRegForHtml(pattern) {
    pattern = negativeLookaheadPattern + pattern
    return new RegExp(pattern, "gi");
}


function giRegForText(pattern) {
    return new RegExp(pattern, "gi");
}


function getTextWithoutMarkup(text){
    var pattern = new RegExp('(\\{\\{(.*?)\\|)(.*?)\\|(.*?)\\|(.*?)\\}\\}', 'g');

    var replacements = [];
    while(result = pattern.exec(text)){
        var fullString = result[0];
        var dateString = result[3];
        var index = result.index;
        
        var replacement = {
            index,
            length:fullString.length,
            replacement: dateString
        };
        replacements.push(replacement);
    }
    
    if(!replacements.length)return null;

    var cleanText = '';
    var lastIndex = 0;

    replacements.forEach(function({ index, length, replacement }) {
        cleanText += text.substr(lastIndex, index - lastIndex);
        cleanText += replacement;
        lastIndex = index + length;
    });

    cleanText += text.substr(lastIndex, text.length - lastIndex);
       
    return cleanText;
}


