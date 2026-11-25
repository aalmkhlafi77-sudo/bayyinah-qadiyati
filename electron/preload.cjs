const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('bayyinahDesktop', {
  isDesktop: true,
  storage: {
    get: (key) => ipcRenderer.invoke('storage:get', key),
    set: (key, value) => ipcRenderer.invoke('storage:set', key, value),
    exportAll: () => ipcRenderer.invoke('storage:export'),
    info: () => ipcRenderer.invoke('storage:info'),
  },
  backup: {
    create: () => ipcRenderer.invoke('backup:create'),
    restore: () => ipcRenderer.invoke('backup:restore'),
  },
  license: {
    status: () => ipcRenderer.invoke('license:status'),
    activate: (code) => ipcRenderer.invoke('license:activate', code),
  },
  files: {
    saveDataUrl: (payload) => ipcRenderer.invoke('files:save-data-url', payload),
    open: (filePath) => ipcRenderer.invoke('files:open', filePath),
  },
  notify: (payload) => ipcRenderer.invoke('desktop:notify', payload),
  reports: {
    savePdf: (payload) => ipcRenderer.invoke('reports:save-pdf', payload),
  },
});
