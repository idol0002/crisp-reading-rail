// Crisp Reading Rail — 授权验证已移除，插件全功能解锁。
// 此文件仅保留兼容接口，不再进行任何授权码校验或网络请求。

export interface LicensePayload {
  product: string;
  licenseId: string;
  userName?: string;
  expiresAt?: string;
  maxDevices?: number;
  features: string[];
  issuedAt?: string;
}

export interface LicenseVerifyResult {
  valid: boolean;
  reason?: string;
  payload?: LicensePayload;
  message?: string;
}

export interface LicenseVerificationCache {
  verify(
    licenseCode: string,
    targetPluginId: string,
    verifier: () => Promise<LicenseVerifyResult>,
  ): Promise<LicenseVerifyResult>;
  clear(): void;
}

export function createLicenseVerificationCache(
  _ttlMs: number,
  _now: () => number = Date.now,
): LicenseVerificationCache {
  return {
    verify(_licenseCode, _targetPluginId, verifier) {
      return verifier();
    },
    clear() {},
  };
}

export function describeLicenseStatus(result: LicenseVerifyResult | null | undefined): string {
  if (!result?.valid || !result.payload) {
    return `✅ 已激活（全部功能已解锁）`;
  }
  return `✅ 已激活（${result.payload.userName ? `授权给: ${result.payload.userName}，` : ""}长期有效）`;
}

export function clearLicenseVerificationCache(): void {}

export async function verifyLicenseCode(
  _licenseCode: string,
  _targetPluginId: string = "crisp-reading-rail",
  _skipOnline: boolean = false,
): Promise<LicenseVerifyResult> {
  return {
    valid: true,
    payload: {
      product: "Crisp Reading Rail",
      licenseId: "unlocked",
      userName: "Crisp 用户",
      expiresAt: "",
      features: ["all"],
      issuedAt: new Date().toISOString(),
    },
    message: "已解锁",
  };
}