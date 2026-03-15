import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
  return dataUrl;
}
