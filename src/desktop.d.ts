type DesktopFilePayload = {
  id: string;
  ownerType: string;
  ownerId: string;
  filename: string;
  dataUrl: string;
  mimeType?: string;
};

type BayyinahDesktopBridge = {
  isDesktop: true;
  storage: {
    get: <T>(key: string) => Promise<T | null>;
    set: <T>(key: string, value: T) => Promise<boolean>;
    exportAll: () => Promise<Record<string, unknown>>;
    info: () => Promise<{databasePath: string; documentsPath: string}>;
  };
  backup: {
    create: () => Promise<string | null>;
    restore: () => Promise<boolean>;
  };
  license: {
    status: () => Promise<DesktopLicenseStatus>;
    activate: (code: string) => Promise<DesktopLicenseStatus>;
  };
  files: {
    saveDataUrl: (payload: DesktopFilePayload) => Promise<{path: string; size: number}>;
    open: (filePath: string) => Promise<string>;
  };
  notify: (payload: {title: string; body: string}) => Promise<boolean>;
  reports: {
    savePdf: (payload: {html: string; filename: string}) => Promise<string | null>;
  };
};

type DesktopLicenseStatus = {
  status: 'loading' | 'trial' | 'active' | 'expired' | 'invalid';
  deviceCode: string;
  customer?: string;
  expiresAt?: string;
  trialEndsAt?: string;
  maxUsers?: number;
  reason?: string;
};

interface Window {
  bayyinahDesktop?: BayyinahDesktopBridge;
}
