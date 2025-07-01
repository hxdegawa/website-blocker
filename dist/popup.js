"use strict";
const newSiteInput = document.getElementById('new-site');
const addSiteButton = document.getElementById('add-site');
const blockedSitesList = document.getElementById('blocked-sites');
function updateUI(blockedSites) {
    blockedSitesList.innerHTML = '';
    for (const site of blockedSites) {
        const listItem = document.createElement('li');
        listItem.textContent = site;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            const newBlockedSites = blockedSites.filter((s) => s !== site);
            browser.storage.local.set({ blockedSites: newBlockedSites });
        });
        listItem.appendChild(removeButton);
        blockedSitesList.appendChild(listItem);
    }
}
browser.storage.local.get('blockedSites').then((data) => {
    if (data.blockedSites) {
        updateUI(data.blockedSites);
    }
});
browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.blockedSites) {
        updateUI(changes.blockedSites.newValue);
    }
});
addSiteButton.addEventListener('click', () => {
    const newSite = newSiteInput.value;
    if (newSite) {
        browser.storage.local.get('blockedSites').then((data) => {
            const blockedSites = (data.blockedSites || []);
            blockedSites.push(newSite);
            browser.storage.local.set({ blockedSites });
            newSiteInput.value = '';
        });
    }
});
