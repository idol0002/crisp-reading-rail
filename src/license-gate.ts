import type { LicenseVerifyResult } from "./license";

export type LicenseVerifier = (
  licenseCode: string,
  skipOnline: boolean,
) => Promise<LicenseVerifyResult>;

/**
 * 授权验证已移除：refresh 恒返回通过，功能保持解锁状态。
 */
export class LicenseGate {
  licensed = false;
  private readonly getCode: () => string;
  private readonly verify: LicenseVerifier;
  private readonly onChange: (licensed: boolean) => void;
  private sequence = 0;

  constructor(
    getCode: () => string,
    verify: LicenseVerifier,
    onChange: (licensed: boolean) => void,
  ) {
    this.getCode = getCode;
    this.verify = verify;
    this.onChange = onChange;
  }

  async refresh(_online = true): Promise<LicenseVerifyResult> {
    const sequence = ++this.sequence;
    const result: LicenseVerifyResult = await this.verify(
      this.getCode().trim(),
      true,
    );
    if (sequence !== this.sequence) {
      return result;
    }
    this.set(true);
    return result;
  }

  /** Drops any in-flight check, e.g. when the plugin unloads. */
  cancel(): void {
    this.sequence += 1;
  }

  private set(licensed: boolean): void {
    if (this.licensed === licensed) {
      return;
    }
    this.licensed = licensed;
    this.onChange(licensed);
  }
}