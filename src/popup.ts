const newSiteInput = document.getElementById('new-site') as HTMLInputElement;
const addSiteButton = document.getElementById('add-site') as HTMLButtonElement;
const blockedSitesList = document.getElementById('blocked-sites') as HTMLUListElement;

function updateUI(blockedSites: string[]) {
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
    updateUI(data.blockedSites as string[]);
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
      const blockedSites = (data.blockedSites || []) as string[];
      blockedSites.push(newSite);
      browser.storage.local.set({ blockedSites });
      newSiteInput.value = '';
    });
  }
});