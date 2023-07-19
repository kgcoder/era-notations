/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */




function htmlWithIgnoredParts(html) {

    

    const pattern = new RegExp(`(<body.*?>|</body>|<span class="mw-editsection">.*?</span></span>|<link rel="mw-deduplicated-inline-style"[^>]*?/>|<h1.*?>|<(div|span|table) class="[^>]*?mw-collapsible[^>]*?>|<style[^>]*?>[^<]*?</style>|<script[^>]*?>[^<]*?</script>)`,'gm')
    const ignoredParts = []
    const newHTML = html.replace(pattern, (match) => {
        ignoredParts.push(match)
        return '<IgnoredPart>'
    })

    return { htmlWithIgParts: newHTML, ignoredParts }
}


function createHTMLWithMarkers(replacementsArray, htmlWithIgParts, ignoredParts) {
    let result = ''
    let lastIndex = 0

    replacementsArray.forEach(({ index, length, replacement }) => {
        result += htmlWithIgParts.substr(lastIndex, index - lastIndex)
        result += replacement
        lastIndex = index + length
    })

    result += htmlWithIgParts.substr(lastIndex, htmlWithIgParts.length - lastIndex)


    const chunks = result.split('<IgnoredPart>')
    if (chunks.length === 1) return result
    let newHtml = ''
    for (let i = 0; i < ignoredParts.length; i++) {
        newHtml += chunks[i] + ignoredParts[i]
    }
    newHtml += chunks[chunks.length - 1]

    return newHtml
}


function removeAttributesFromTags(html){
    
    let indexInHtml = 0
    let result = ''
    let isReadingTagname = false
    let isReadingText = true
    let isIgnoring = false
    let insideComment = false
    while(indexInHtml < html.length){
        const characterInHtml = html.slice(indexInHtml,indexInHtml + 1)
        if(isReadingTagname && characterInHtml === ' '){
            isReadingTagname = false
            isIgnoring = true
            indexInHtml++
            continue
        }else if(characterInHtml === '<'){
            const fourCharachters = html.slice(indexInHtml,indexInHtml + 4)
            if(fourCharachters === '<!--'){
                insideComment = true
                result += '<!-- '
                indexInHtml += 4
                continue
            }

            isReadingTagname = true  
            isReadingText = false
            result += characterInHtml      
            indexInHtml++
            isIgnoring = false

            continue;
        }else if(characterInHtml === '>'){
            if(insideComment){
                const threeCharachters = html.slice(indexInHtml - 2,indexInHtml + 1)
                if(threeCharachters === '-->'){
                    insideComment = false
                    result += '-->'
                    indexInHtml++
                    continue
                }

            }
            isIgnoring = false
            isReadingText = true
            isReadingTagname = false
            result += characterInHtml  
            indexInHtml++
            isIgnoring = false
            continue;
        }

        if(isIgnoring && characterInHtml === '/'){
            const nextCharacter = html.slice(indexInHtml + 1,indexInHtml + 2)
            if(nextCharacter === '>'){
                result += characterInHtml
                indexInHtml++
                isReadingTagname = false
                continue
            }
        }

        if(!isIgnoring && !insideComment){
            result += characterInHtml

        }

        indexInHtml++


    }

    return result
}