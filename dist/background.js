"use strict";
let blockedSites = [];
browser.storage.local.get('blockedSites').then((data) => {
    if (data.blockedSites) {
        blockedSites = data.blockedSites;
    }
});
function redirect(requestDetails) {
    for (const site of blockedSites) {
        if (requestDetails.url.includes(site)) {
            return {
                cancel: true,
            };
        }
    }
    return {};
}
browser.webRequest.onBeforeRequest.addListener(redirect, { urls: ['<all_urls>'] }, ['blocking']);
browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.blockedSites) {
        blockedSites = changes.blockedSites.newValue;
    }
});
