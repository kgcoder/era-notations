/*
 * Copyright (c) Karen Grigorian
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

let currentLocation = window.location.toString()

function prepareLocation() {


    domain = currentLocation
    .replace('https://www.','')
    .replace('https://','')
    .replace('http://www.','')
    .replace('http://','')
    
    domain = domain.split('/')[0]

}


