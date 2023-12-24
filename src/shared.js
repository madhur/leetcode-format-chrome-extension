/**
 * shared.js
 * 
 * This script is responsible for managing shared constants, default values, and local storage operations.
 * 
 * @module
 * 
 * @exports {Object} LS - An object with methods for interacting with chrome's local storage.
 * @exports {Object} defaults - An object containing default values for the extension's settings.
 * @exports {Object} constants - An object containing constant keys used in the extension.
 * 
 * @property {Object} LS.getAllItems - Returns all items in chrome's local storage.
 * @property {Function} LS.getItem - Returns a specific item from chrome's local storage.
 * @property {Function} LS.setItem - Sets a specific item in chrome's local storage.
 * @property {Function} LS.removeItems - Removes specific items from chrome's local storage.
 * 
 */

export const LS = {
    getAllItems: () => chrome.storage.local.get(),
    getItem: async key => (await chrome.storage.local.get(key))[key],
    setItem: (key, val) => chrome.storage.local.set({ [key]: val }),
    removeItems: keys => chrome.storage.local.remove(keys),
};

export const defaults = {
    v1_button: ".mr-auto.flex.flex-nowrap.items-center.gap-3",
    v2_button: "div.flex.flex-nowrap.items-center",
    check_interval_ms : 24*60*60*1000,
    last_checked_ms: 0
};

