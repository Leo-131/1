const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('customerDev', {
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url),
  credentialStatus: () => ipcRenderer.invoke('credential-status'),
  saveCredential: (payload) => ipcRenderer.invoke('save-credential', payload),
  unlockVault: (masterPassword) => ipcRenderer.invoke('unlock-vault', masterPassword),
  launchPlatformAcquisition: (payload) => ipcRenderer.invoke('launch-platform-acquisition', payload),
  glmStatus: () => ipcRenderer.invoke('glm-status'),
  saveGlmConfig: (payload) => ipcRenderer.invoke('save-glm-config', payload),
  optimizeLeadWithGlm: (payload) => ipcRenderer.invoke('optimize-lead-with-glm', payload),
  runGlmDirectAutomation: (payload) => ipcRenderer.invoke('run-glm-direct-automation', payload),
  runDailyAutomationQueue: (payload) => ipcRenderer.invoke('run-daily-automation-queue', payload),
  emailChannelStatus: () => ipcRenderer.invoke('email-channel-status'),
});
