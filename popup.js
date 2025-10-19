async function getSettings() {
  return await chrome.storage.sync.get(["token", "gistId"]);
}

async function saveSettings(token, gistId) {
  await chrome.storage.sync.set({ token, gistId });
}

// Render UI depending on saved settings
async function renderSettingsView() {
  const settingsContainer = document.getElementById("settings");
  const { token, gistId } = await getSettings();

  if (token && gistId) {
    // ✅ Settings already saved → show summary view
    settingsContainer.innerHTML = `
      <div class="settings-summary">
        <p>✅ <strong>Settings saved</strong></p>
        <p><b>Gist ID:</b> <code>${gistId}</code></p>
        <div style="display:flex; gap:8px;">
          <button id="editSettings">✏️ Edit Settings</button>
        </div>
      </div>
    `;
    document.getElementById("editSettings").onclick = showSettingsForm;
  } else {
    // ❌ No settings → show input form
    showSettingsForm();
  }
}

function showSettingsForm() {
  const settingsContainer = document.getElementById("settings");
  settingsContainer.innerHTML = `
    <div class="settings-form">
      <label>GitHub Token:</label>
      <input type="password" id="token" placeholder="ghp_..." />
      <label>Gist ID:</label>
      <input type="text" id="gistId" placeholder="Your Gist ID" />
      <div style="display:flex; gap:8px; margin-top:8px;">
        <button id="save">💾 Save</button>
        <button id="cancel">❌ Cancel</button>
      </div>
    </div>
  `;

  document.getElementById("save").onclick = async () => {
    const token = document.getElementById("token").value.trim();
    const gistId = document.getElementById("gistId").value.trim();
    if (!token || !gistId) return alert("Please fill in both fields.");
    await saveSettings(token, gistId);
    alert("✅ Settings saved.");
    renderSettingsView();
  };

  document.getElementById("cancel").onclick = renderSettingsView;
}

// Upload extensions to Gist
document.getElementById("upload").onclick = async () => {
  const { token, gistId } = await getSettings();
  if (!token || !gistId) return alert("Please set token and gist ID first.");

  const installed = await chrome.runtime.sendMessage({ action: "getInstalled" });
  await chrome.runtime.sendMessage({ action: "upload", token, gistId, extensions: installed });
  alert("✅ Extensions uploaded to Gist!");
};

// Sync and compare extensions
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

    if (ext.installType === "normal") {
      div.innerHTML = `
        <h4>${ext.name}</h4>
        <small>${ext.version}</small>
        <button>Add to Chrome</button>
      `;
      div.querySelector("button").onclick = () => {
        const url = `https://chrome.google.com/webstore/detail/${ext.id}`;
        chrome.tabs.create({ url });
      };
    } else {
      div.innerHTML = `
        <h4>${ext.name} <small>(local)</small></h4>
        <small>${ext.version}</small>
      `;
    }

    container.appendChild(div);
  });
};

// Initialize on popup load
renderSettingsView();
