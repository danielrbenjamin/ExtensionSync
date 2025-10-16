//
// Background script for ExtensionSync
//

// Get all installed extensions with installType
async function getInstalledExtensions() {
  const all = await chrome.management.getAll();
  return all
    .filter(e => e.type === "extension" && e.enabled && !e.isApp)
    .map(e => ({
      id: e.id,
      name: e.name,
      version: e.version,
      homepageUrl: e.homepageUrl || null,
      installType: e.installType // "normal", "development", "sideload", etc.
    }));
}

// Upload extensions to a GitHub Gist
async function uploadToGist(token, gistId, extensions) {
  const body = {
    files: {
      "extensions.json": { content: JSON.stringify(extensions, null, 2) }
    }
  };

  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`Failed to update Gist: ${res.status}`);
  return await res.json();
}

// Download extensions from GitHub Gist
async function downloadFromGist(token, gistId) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { "Authorization": `token ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch Gist: ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.files["extensions.json"].content);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg.action === "getInstalled") {
        sendResponse(await getInstalledExtensions());
      } else if (msg.action === "upload") {
        sendResponse(await uploadToGist(msg.token, msg.gistId, msg.extensions));
      } else if (msg.action === "download") {
        sendResponse(await downloadFromGist(msg.token, msg.gistId));
      }
    } catch (err) {
      console.error(err);
      sendResponse({ error: err.message });
    }
  })();
  return true;
});
