# 🔄 ExtensionSync

**Sync your Chrome extensions across devices using GitHub Gists.**  
Automatically back up your installed extensions to a Gist, and restore them anywhere with one click.

---

## 🚀 Features

- 🧩 **List Installed Extensions** — Scans all enabled Chrome extensions (excluding apps).  
- ☁️ **Sync to GitHub Gist** — Uploads your extension list as a JSON file to a private or public Gist.  
- 📥 **Restore Anywhere** — Download and re-install the same set of extensions on another browser or device.  
- 🔑 **Secure with Token** — Uses your personal GitHub token for authentication.  
- 🖼️ **Simple Toolbar UI** — Sync, Upload, or Download with a single click.  

---

## 🧠 How It Works

1. ExtensionSync uses the **Chrome Management API** to collect all installed extensions.  
2. The data is saved as `extensions.json` in your GitHub Gist.  
3. You can download this Gist later to view or re-install your extensions manually or with scripts.

---

## 📦 Installation

1. **Clone or download** this repository:
   ```
   git clone https://github.com/<yourusername>/ExtensionSync.git
   ```
2. Open Chrome → Extensions → Manage Extensions.
3. Enable Developer mode (top right).
4. Click “Load unpacked” and select the ExtensionSync folder.
5. The 🔄 ExtensionSync icon will appear in your toolbar.

---

##  ⚙️ Setup

1. Create a GitHub personal access token with gist scope.
2. Create a Gist (public or secret) and copy its ID (the long hash in the URL).
3. Open the ExtensionSync popup and enter:
- Your GitHub Token
- Your Gist ID
4. Click Upload to back up your extensions, or Check Missing Extensions to restore them.


<a target="_blank" href="https://icons8.com/icon/48332/puzzle">Extension</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
