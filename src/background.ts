let blockedSites: string[] = [];

browser.storage.local.get('blockedSites').then((data) => {
  if (data.blockedSites) {
    blockedSites = data.blockedSites as string[];
  }
});

function redirect(requestDetails: { url: string; }): browser.webRequest.BlockingResponse {
  for (const site of blockedSites) {
    if (requestDetails.url.includes(site)) {
      return {
        cancel: true,
      };
    }
  }
  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: ['<all_urls>'] },
  ['blocking'],
);

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue;
  }
});