/**
 * options.js
 * 
 * This script is responsible for managing the options/settings of the extension.
 * 
 * @module
 * 
 * @requires shared.js - Contains shared constants and default values.
 * 
 * @function saveOptions() - Saves the user's options to local storage.
 * 
 * @event save.onclick - Triggers the saveOptions function when the save button is clicked.
 * 
 */

import { LS } from './shared.js';

function refreshDOMState() {
   
    chrome.runtime.sendMessage({ message: 'checkUpdate' }, function(response) {
        // Handle response from Chrome extension
        console.debug(response);
        document.getElementById('status').innerHTML = 'Updated!';

    });
    
    return false;
}

function viewDebugInfo() {
    LS.getAllItems().then(items => {
        console.debug(items);
        document.getElementById('status').innerHTML = JSON.stringify(items);
    });
    return false;
}


document.getElementById('refresh').onclick = refreshDOMState;
document.getElementById('debug').onclick = viewDebugInfo;