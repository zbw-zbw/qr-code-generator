/**
 * 验证字符串是否为有效的 URL（仅允许安全协议）
 */
export const isValidUrl = (str: string): boolean => {
  try {
    const url = new URL(str)
    const safeProtocols = ['http:', 'https:', 'ftp:', 'ftps:']
    return safeProtocols.includes(url.protocol)
  } catch {
    return false
  }
}
