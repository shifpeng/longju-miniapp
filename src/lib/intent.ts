// Reuse a key for the same payload after timeout/503; a changed form is a new intent.
// Keep keys and form content in memory only, never persist personal information.
export class Intent {
  private fingerprint = '';
  private key = '';
  private retryAt = 0;
  async for(data: unknown): Promise<string> {
    if (Date.now() < this.retryAt)
      throw new Error(`请 ${Math.ceil((this.retryAt - Date.now()) / 1000)} 秒后重试`);
    const fingerprint = JSON.stringify(data);
    if (fingerprint !== this.fingerprint || !this.key) {
      const bytes = await new Promise<ArrayBuffer>((resolve, reject) =>
        wx.getRandomValues({
          length: 16,
          success: (r) => resolve(r.randomValues),
          fail: () => reject(new Error('无法创建提交凭据，请重试')),
        }),
      );
      const value = new Uint8Array(bytes);
      value[6] = (value[6] & 15) | 64;
      value[8] = (value[8] & 63) | 128;
      const h = Array.from(value, (b) => b.toString(16).padStart(2, '0')).join('');
      this.key = `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
      this.fingerprint = fingerprint;
    }
    return this.key;
  }
  failed(error: unknown) {
    const e = error as { retryAfter?: number; status?: number };
    if (e.retryAfter) this.retryAt = Date.now() + e.retryAfter * 1000;
    if (e.status && e.status < 500 && e.status !== 429) this.clear();
  }
  clear() {
    this.key = '';
    this.fingerprint = '';
  }
}
