/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let currentMode = 0


document.addEventListener('DOMContentLoaded', function () {

 
    const aboutLink = document.getElementById("aboutLink")

    aboutLink.addEventListener('click', function () {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'openAbout')
            window.close();

        })
    })

    chrome.storage.local.get(['currentMode'], function (result) {
        
        if(result.currentMode){
            currentMode = result.currentMode
        }


        updateUIInAccordanceWithMode()

    })


    


    document.getElementById('UseOnThisSiteCheckbox').addEventListener('click', () => {
        toggleWebsiteUsage()
    }, false)




    document.getElementById('radioOff').addEventListener('click', () => {
        setMode(0)
    }, false)

    document.getElementById('radioBCAD').addEventListener('click', () => {
        setMode(1)
    }, false)

    document.getElementById('radioBCECE').addEventListener('click', () => {
        setMode(2)
    }, false)



  

 


}, false)



function setMode(modeNumber){
    currentMode = modeNumber
    updateUIInAccordanceWithMode()

    chrome.storage.local.set({ currentMode })

    sendMessageToPage('mode' + currentMode)

}


function updateUIInAccordanceWithMode(){
    document.getElementById('radioOff').checked = currentMode === 0
    document.getElementById('radioBCAD').checked = currentMode === 1
    document.getElementById('radioBCECE').checked = currentMode === 2
}











function toggleWebsiteUsage() {
    isCurrentSiteAllowed = !isCurrentSiteAllowed
    if(!isCurrentSiteAllowed){
        allowedSites = allowedSites.filter(site => site !== currentDomain)

    }else{
        allowedSites.push(currentDomain)
    }

  

    
    chrome.storage.local.set({ ['sitesData']:JSON.stringify({allowedSites}) }).then(() => {
        sendMessageToPage('toggleSiteUsage')
    })
 

}










function sendMessageToPage(message) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message)
    })
}






function updateLinksSectionVisibility(visible){
    const div = document.getElementById("LinksSection")
    div.style.display = visible ? 'flex' : 'none'
}


