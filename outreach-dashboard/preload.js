const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('customerDev', {
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url),
  credentialStatus: () => ipcRenderer.invoke('credential-status'),
  saveCredential: (payload) => ipcRenderer.invoke('save-credential', payload),
  unlockVault: (masterPassword) => ipcRenderer.invoke('unlock-vault', masterPassword),
  launchPlatformAcquisition: (payload) => ipcRenderer.invoke('launch-platform-acquisition', payload),
});
