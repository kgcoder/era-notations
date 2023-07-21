/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let textsArray = []
let textNodesArray = []
let currentMode = 0

let conversionDone = false

let allowedSites = []

let isThisSiteAllowed = false
let currentDomain = ''

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   
    if(message === 'mode0'){
        currentMode = 0
        if(isThisSiteAllowed){
            updateDates()
        }
    }

    if(message === 'mode1'){
        currentMode = 1
        if(isThisSiteAllowed){
            if(conversionDone){
                updateDates()
            }else{
                detectAndEditEverything()
            }
        }

    }

    if(message === 'mode2'){
        currentMode = 2
        if(isThisSiteAllowed){
            if(conversionDone){
                updateDates()
            }else{
                detectAndEditEverything()
            }
        }
    }

    if (message === 'giveMePageMetadata') {
        sendPageMetadata(sendResponse)  
    }

    if(message === 'toggleSiteUsage'){
        window.location.reload()
    }


    console.log('message',message)

    return true

})



function sendPageMetadata(sendResponse) {
    sendResponse({
        isThisSiteAllowed,
        domain,
    })
}




prepareLocation()

window.onload = async () => {


    chrome.storage.local.get(['currentMode','sitesData'], function (result) {
        console.log('result from storage',result)
       
        if(result.sitesData){
            const sitesData = JSON.parse(result.sitesData)
            allowedSites = sitesData.allowedSites
        }else{
            allowedSites = ['en.wikipedia.org']
            chrome.storage.local.set({ ['sitesData']: JSON.stringify({allowedSites}) }).then(() => {});
        }

        console.log('currentLocation',currentLocation)
        console.log('domain',domain)
        console.log('allowed sites:',allowedSites)
        if(currentLocation){
            const index = allowedSites.findIndex(site => domain === site)
            isThisSiteAllowed = index !== -1
        }else{
            isThisSiteAllowed = false
        }


        if(isThisSiteAllowed && result.currentMode){
            currentMode = result.currentMode
          
            detectAndEditEverything()
           
        }

    })



}




function detectAndEditEverything(){
    let html = new XMLSerializer().serializeToString(document.body)


    let htmlWithMarkers

    const { htmlWithIgParts, ignoredParts } = htmlWithIgnoredParts(html)

    let replacementsArray = []
    getLocalReplacements(htmlWithIgParts, replacementsArray)
    replacementsArray = replacementsArray.sort((a, b) => a.index - b.index)



    htmlWithMarkers = createHTMLWithMarkers(replacementsArray, htmlWithIgParts, ignoredParts)




    if (htmlWithMarkers) {


        const parser = new DOMParser();
        const cleanHtml = removeAttributesFromTags(htmlWithMarkers)
        const bodyDOM = parser.parseFromString(cleanHtml, "text/xml");


        textsArray = []
        getTextsArray(bodyDOM.documentElement)

   
        textNodesArray = []
        getTextNodesArray(document.body)

  

        const textInFirstNode = textNodesArray[1].firstNode.data
  
        if(textNodesArray.length < textsArray.length){
      
            const index = textsArray.findIndex(item => {
                return textInFirstNode === item
            })

           
            if(index > 0){
                textsArray.splice(0, index);
            }
        }

      

        
        doReplacements()
        updateDates()

        conversionDone = true

    }
}





function createMarker(text, method, type = 'normal', originalSubstitute = '',otherNumberStringInRange = '') { 
    return `{{${method}|${text}|${type}|${originalSubstitute}|${otherNumberStringInRange}}}`
}


function getTextsArray(node) {
    if (node.nodeType === 3) {
      //  isOriginalHTML ?
           // originalTextsArray.push(node.data) :
            textsArray.push(node.data)
    }
    if (node = node.firstChild) do {
        getTextsArray(node);
    } while (node = node.nextSibling);
}

function getTextNodesArray(node) {
    if (node.nodeType === 3) { 
        textNodesArray.push({ firstNode: node, lastNode: node })
    }
    if (node = node.firstChild) do {
        getTextNodesArray(node);
    } while (node = node.nextSibling);
}


function doReplacements() {
    const reg = new RegExp('\\s|\\&nbsp;|\\&#160;|\\&#8201;','gi')
    const newTextNodesArray = []
    targets = []
    let lastIndexInNodes = 0;
    
    for (let i = 0; i < textsArray.length; i++) {
        let j = lastIndexInNodes;
        const text = textsArray[i]
        let nodes;
        let cleanText = getTextWithoutMarkup(text)?.replace(reg, ' ');;

       if(cleanText){
            while(true){
                if(j >= textNodesArray.length)break;
                nodes = textNodesArray[j];
                if(!nodes){
                    j++;
                    continue;
                }
                var textInNode = nodes.firstNode.data.replace(reg, ' ');
            
                if(cleanText !== textInNode) {
                    // console.log('something is wrong while replacing')
                    // console.log('clean text:',cleanText)
                    // console.log('text in node',textInNode)
                    // console.log('i',i)
                    j++;
                    continue;
                }else{
                    lastIndexInNodes = j + 1;
                    var pair = replaceTextInNodeIfNeeded(nodes, text);
                    newTextNodesArray.push(pair);
                    break;
                }
            }   
        }
       

    }

    textNodesArray = newTextNodesArray  

}



function replaceTextInNodeIfNeeded(oldNodes, sourceText) {
    const occurrences = []
    const pattern = new RegExp('\\{\\{(.*?)\\|(.*?)\\|(.*?)\\|(.*?)\\|(.*?)\\}\\}', 'g')
    while ((result = pattern.exec(sourceText))) {
        const obj = { index: result.index, length: result[0].length, method: result[1], originalText: result[2], type: result[3], originalSubstitute: result[4], otherNumberStringInRange: result[5] }
        occurrences.push(obj)
    }
    if (!occurrences.length) return oldNodes

    const { firstNode: firstOldNode, lastNode: lastOldNode } = oldNodes


    let lastIndex = 0
    let firstNode = undefined

    for (let obj of occurrences) {
        const precedingTextNode = document.createTextNode(
            sourceText.substr(lastIndex, obj.index - lastIndex)
        );

        firstOldNode.parentNode.insertBefore(precedingTextNode, firstOldNode)


        if (!firstNode) {
            firstNode = precedingTextNode
        }


        const replacementNode = getDateCaseNode(obj.originalText, obj.method, obj.type)

        if (replacementNode) {
            firstOldNode.parentNode.insertBefore(replacementNode, firstOldNode)

            targets.push(obj.originalText)
        }

        lastIndex = obj.index + obj.length

    }

    const lastNode = document.createTextNode(
        sourceText.substr(lastIndex, sourceText.length - lastIndex)
    );

    firstOldNode.parentNode.insertBefore(lastNode, firstOldNode)

    while (lastNode.nextSibling && lastNode.nextSibling !== lastOldNode) {
        lastNode.parentNode.removeChild(lastNode.nextSibling)
    }

    lastOldNode.parentNode.removeChild(lastOldNode);

    return { firstNode, lastNode }
}



function getDateCaseNode(originalText, method, type = 'normal'){
    const span = document.createElement('span')

    span.setAttribute("o",originalText)
    span.setAttribute("m",method)
    span.setAttribute("t",type)
    span.className = "rt-commentedText eracase"
    const textNode = document.createTextNode(originalText)
    span.appendChild(textNode)
  
    return span
}


function updateDates(){
    const spans = Array.from(document.body.getElementsByClassName('eracase'))

    spans.forEach(span => {
      updateDataInSpan(span)
    })

}


function updateDataInSpan(span){
  const originalText = span.getAttribute("o")
  const method = span.getAttribute("m")
  const type = span.getAttribute("t")

  const newEraLabel = getReplacementStrings(originalText,method)
  span.innerHTML = newEraLabel

  
}


function getReplacementStrings(originalText, method) {
   
    if(!isThisSiteAllowed || currentMode === 0)return originalText

    switch (method) {

   
        case 'bc': {

            return currentMode === 2 ? "BCE" : "BC"
        }
        case 'year':{
            return currentMode === 2 ? originalText + " CE" : originalText
        }
        case 'leading-ad':{
            return currentMode === 2 ? "" : "AD"
        }
        case 'ad-space':{
            return currentMode === 2 ? "" : originalText
        }
        default:
            return originalText
    }
}