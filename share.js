// ========== Share System ==========

export async function shareToWhatsApp(imageDataUrl, text) {
  const blob = dataURLtoBlob(imageDataUrl);
  const file = new File([blob], 'clothing-ad.png', { type: 'image/png' });

  // Try native share with files first
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'إعلان ملابس',
        text: text,
        files: [file]
      });
      return { success: true, method: 'native-share' };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'تم إلغاء المشاركة' };
      }
      console.log('Native share failed, trying fallback:', err.message);
    }
  }

  // Fallback: download image + copy text + open WhatsApp
  try {
    // Download image
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = 'clothing-ad.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Copy text
    await copyText(text);

    // Open WhatsApp
    const encodedText = encodeURIComponent(text.substring(0, 500));
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');

    return { success: true, method: 'download-clipboard-wa' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function downloadImage(imageDataUrl, filename = 'clothing-ad.png') {
  const a = document.createElement('a');
  a.href = imageDataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // Small delay before removing to ensure click registers
  setTimeout(() => {
    if (a.parentNode) document.body.removeChild(a);
  }, 100);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch {
    // Fallback for non-HTTPS environments
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const success = document.execCommand('copy');
      document.body.removeChild(ta);
      return { success };
    } catch {
      return { success: false, error: 'فشل النسخ' };
    }
  }
}

export function openWhatsAppChat(phone, text = '') {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text.substring(0, 500));
  const url = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank');
}

function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}
