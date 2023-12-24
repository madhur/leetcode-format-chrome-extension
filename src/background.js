import { LS } from './shared.js';
import { defaults } from './shared.js';

function fetchAndUpdateStorage(sendResponse) {

    // Read JSON file from remote location
    fetch('https://madhur.co.in/leetcodeformat/data.json')
        .then(response => response.json())
        .then(data => {
            // Handle the received JSON data here
            console.debug('Received data from madhur.co.in:', data);
            if (data.v1_button && data.v2_button) {
                LS.setItem('v1_button', data.v1_button).then(() => { });
                LS.setItem('v2_button', data.v2_button).then(() => { });
                console.debug('Updated data in local chrome storage', data);
            }
            LS.setItem('last_checked_ms', Date.now());
            // Send a response back if needed
            sendResponse('Data received!');
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error:', error);
        });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.message === 'checkUpdate') {
        let last_checked_ms;
        LS.getItem('last_checked_ms').then(value => {
            last_checked_ms = value;
            console.debug(last_checked_ms);
            if (last_checked_ms === undefined) {
                fetchAndUpdateStorage();
                return;
            }

            if (Date.now() - last_checked_ms < defaults.check_interval_ms && !message.force) {
                // We have recently checked for an update, so don't check again.
                console.debug("Update recently checked, skipping.")
                return;
            }

            fetchAndUpdateStorage(sendResponse);
        });

    }
    else if (message && message.message === 'loadDOMStorage') {
        LS.getAllItems().then(items => {
            console.debug("Sending response to loadDOMStorage", items);
            sendResponse(items);
        });
    }

    return true;
});


