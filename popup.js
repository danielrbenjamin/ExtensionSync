async function getSettings() {
  return await chrome.storage.sync.get(["token", "gistId"]);
}

async function saveSettings(token, gistId) {
  await chrome.storage.sync.set({ token, gistId });
}

document.getElementById("save").onclick = async () => {
  const token = document.getElementById("token").value.trim();
  const gistId = document.getElementById("gistId").value.trim();
  await saveSettings(token, gistId);
  alert("✅ Settings saved.");
};

document.getElementById("upload").onclick = async () => {
  const { token, gistId } = await getSettings();
  if (!token || !gistId) return alert("Please set token and gist ID first.");

  const installed = await chrome.runtime.sendMessage({ action: "getInstalled" });
  await chrome.runtime.sendMessage({ action: "upload", token, gistId, extensions: installed });
  alert("✅ Extensions uploaded to Gist!");
};

document.getElementById("sync").onclick = async () => {
  const { token, gistId } = await getSettings();
  if (!token || !gistId) return alert("Please set token and gist ID first.");

  const remote = await chrome.runtime.sendMessage({ action: "download", token, gistId });
  const local = await chrome.runtime.sendMessage({ action: "getInstalled" });
  const localIds = new Set(local.map(e => e.id));
  const missing = remote.filter(r => !localIds.has(r.id));

  const container = document.getElementById("missing");
  container.innerHTML = "";

  if (missing.length === 0) {
    container.innerHTML = "<p>✅ All extensions are installed!</p>";
    return;
  }

  missing.forEach(ext => {
    const div = document.createElement("div");
    div.className = "ext-card";
    div.innerHTML = `
      <h4>${ext.name}</h4>
      <button>Add to Chrome</button>
    `;
    div.querySelector("button").onclick = () => {
      const url = `https://chrome.google.com/webstore/detail/${ext.id}`;
      chrome.tabs.create({ url });
    };
    container.appendChild(div);
  });
};