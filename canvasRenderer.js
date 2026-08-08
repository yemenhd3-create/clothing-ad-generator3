// ========== Canvas Ad Renderer - Professional Template ==========
// Matches the reference images: white bg, product centered, info panels on sides, footer bar

const CANVAS_W = 1080;
const CANVAS_H = 1350;

export async function renderAd(settings, productImageSrc) {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');

  // 1. White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 2. Discount badge (top-left corner)
  drawDiscountBadge(ctx, settings);

  // 3. Product title (top-center)
  drawProductTitle(ctx, settings);

  // 4. Quality badge (top-right)
  if (settings.showQualityBadge !== false) {
    drawQualityBadge(ctx);
  }

  // 5. Product image (center, large)
  if (productImageSrc) {
    await drawProductImage(ctx, productImageSrc);
  }

  // 6. Left info panel (quantity, pieces, colors)
  drawLeftInfoPanel(ctx, settings);

  // 7. Right price panel
  drawRightPricePanel(ctx, settings);

  // 8. Features badges (bottom-left, above footer)
  drawFeaturesBadges(ctx, settings);

  // 9. Footer bar (store info, contact, categories)
  drawFooterBar(ctx, settings);

  return canvas.toDataURL('image/png');
}

// ====== 1. Discount Badge (Top-Left Shield) ======
function drawDiscountBadge(ctx, settings) {
  const oldP = parseFloat(settings.oldPrice) || 0;
  const newP = parseFloat(settings.newPrice) || 0;
  const discount = oldP > newP && oldP > 0 ? Math.round(((oldP - newP) / oldP) * 100) : 0;

  if (discount <= 0 || settings.showDiscount === false) return;

  const x = 30;
  const y = 20;
  const w = 180;
  const h = 160;

  ctx.save();

  // Shield shape
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + 30);
  ctx.lineTo(x + w, y + h - 40);
  ctx.quadraticCurveTo(x + w, y + h, x + w / 2, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - 40);
  ctx.lineTo(x, y + 30);
  ctx.closePath();

  // Fill with gradient
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#DC2626');
  grad.addColorStop(1, '#991B1B');
  ctx.fillStyle = grad;
  ctx.fill();

  // Border
  ctx.strokeStyle = '#B91C1C';
  ctx.lineWidth = 2;
  ctx.stroke();

  // "خصم" text
  ctx.fillStyle = '#F5C200';
  ctx.font = 'bold 28px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('خصم', x + w / 2, y + 45);

  // Percentage
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px Cairo, Tahoma, sans-serif';
  ctx.fillText(`${discount}%`, x + w / 2, y + 95);

  // Sparkle lines
  ctx.strokeStyle = '#F5C200';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const sparkles = [
    [x + 15, y + 35, x + 5, y + 25],
    [x + 10, y + 50, x, y + 45],
    [x + w - 15, y + 35, x + w - 5, y + 25],
    [x + w - 10, y + 50, x + w, y + 45]
  ];
  sparkles.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  ctx.restore();
}

// ====== 2. Product Title (Top-Center) ======
function drawProductTitle(ctx, settings) {
  const title = settings.productName || 'منتج مميز';
  const subtitle = settings.subtitle || '';

  const centerX = CANVAS_W / 2;
  const startY = 40;

  // Main title
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 52px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(title, centerX, startY);

  // Subtitle with heart
  if (subtitle) {
    const subY = startY + 65;
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 42px Cairo, Tahoma, sans-serif';
    ctx.fillText(subtitle, centerX, subY);

    // Heart icon between lines
    ctx.fillStyle = '#DC2626';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤', centerX, subY + 55);

    // Decorative lines
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2;
    const lineLen = 80;
    const heartY = subY + 55;
    ctx.beginPath();
    ctx.moveTo(centerX - lineLen - 20, heartY + 2);
    ctx.lineTo(centerX - 20, heartY + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + 20, heartY + 2);
    ctx.lineTo(centerX + lineLen + 20, heartY + 2);
    ctx.stroke();
  }
}

// ====== 3. Quality Badge (Top-Right Gold Seal) ======
function drawQualityBadge(ctx) {
  const cx = CANVAS_W - 100;
  const cy = 100;
  const r = 55;

  ctx.save();

  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  const goldGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, r);
  goldGrad.addColorStop(0, '#FEF3C7');
  goldGrad.addColorStop(0.5, '#F59E0B');
  goldGrad.addColorStop(1, '#B45309');
  ctx.fillStyle = goldGrad;
  ctx.fill();

  // Border
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Crown icon
  ctx.fillStyle = '#92400E';
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('👑', cx, cy - 15);

  // Text
  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 18px Cairo, Tahoma, sans-serif';
  ctx.fillText('جودة', cx, cy + 12);
  ctx.fillText('عالية', cx, cy + 32);

  ctx.restore();
}

// ====== 4. Product Image (Center, Large) ======
async function drawProductImage(ctx, src) {
  return new Promise((resolve) => {
    const img = new Image();

    // Only set crossOrigin for external URLs, not data URLs
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      const maxW = CANVAS_W - 300; // Leave space for side panels
      const maxH = CANVAS_H * 0.62;
      const ratio = Math.min(maxW / img.width, maxH / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      const dx = (CANVAS_W - dw) / 2;
      const dy = 180; // Below title

      // Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;

      ctx.drawImage(img, dx, dy, dw, dh);

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      resolve();
    };

    img.onerror = () => {
      console.warn('Failed to load product image');
      resolve();
    };

    img.src = src;
  });
}

// ====== 5. Left Info Panel ======
function drawLeftInfoPanel(ctx, settings) {
  const x = 25;
  const startY = 280;
  const w = 140;
  const boxH = 100;
  const gap = 15;

  // Box 1: Quantity (العدد)
  if (settings.showQuantity !== false && settings.quantity) {
    drawInfoBox(ctx, x, startY, w, boxH, 'العدد', settings.quantity, '👕');
  }

  // Box 2: Pieces (الكمية)
  if (settings.showPieces !== false && settings.pieces) {
    const y2 = startY + boxH + gap;
    drawInfoBox(ctx, x, y2, w, boxH, 'الكمية', settings.pieces, '📦');
  }

  // Box 3: Colors (الألوان)
  if (settings.showColors !== false && settings.colors) {
    const y3 = startY + (boxH + gap) * 2;
    drawColorsBox(ctx, x, y3, w, boxH, settings.colors);
  }
}

function drawInfoBox(ctx, x, y, w, h, label, value, icon) {
  // Rounded rect background
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();

  // Border
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 16);
  ctx.stroke();

  // Label
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 18px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(label, x + w / 2, y + 10);

  // Icon
  ctx.font = '28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, x + w / 2, y + 42);

  // Value
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 36px Cairo, Tahoma, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x + w / 2, y + 72);
}

function drawColorsBox(ctx, x, y, w, h, colorsText) {
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 16);
  ctx.stroke();

  // Label
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 18px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('الألوان', x + w / 2, y + 10);

  // Color circles
  const colors = colorsText.split(/[،,]/).map(c => c.trim()).filter(c => c);
  const circleR = 16;
  const spacing = 34;
  const totalWidth = colors.length * spacing - (spacing - circleR * 2);
  const startCX = x + w / 2 - totalWidth / 2 + circleR;
  const cy = y + 58;

  colors.forEach((colorName, i) => {
    const cx = startCX + i * spacing;
    const color = getColorHex(colorName);

    ctx.beginPath();
    ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function getColorHex(colorName) {
  const map = {
    'أزرق': '#3B82F6', 'أزرق ملكي': '#1E40AF', 'وردي': '#EC4899', 'ورد': '#F472B6',
    'أبيض': '#F9FAFB', 'أسود': '#111827', 'أحمر': '#DC2626', 'أخضر': '#10B981',
    'أصفر': '#F59E0B', 'بني': '#92400E', 'رمادي': '#6B7280', 'بنفسجي': '#8B5CF6',
    'برتقالي': '#F97316', 'فضي': '#9CA3AF', 'ذهبي': '#D97706', 'بيج': '#F5F5DC',
    'كحلي': '#1E3A5F', 'نيلي': '#1E40AF', 'تركواز': '#14B8A6', 'كريم': '#FFFDD0',
    'lime': '#84CC16', 'navy': '#1E3A5F', 'teal': '#14B8A6', 'أخضر زيتي': '#556B2F',
    'أحمر نبيذي': '#722F37', 'أزرق سماوي': '#87CEEB', 'بنفسجي فاتح': '#D8BFD8',
    'كoral': '#FF7F50', 'أصفر ليموني': '#FFF44F', 'زهري': '#FFC0CB'
  };
  return map[colorName] || map[colorName.replace('ي', '')] || map[colorName.replace('ة', 'ة')] || '#D1D5DB';
}

// ====== 6. Right Price Panel ======
function drawRightPricePanel(ctx, settings) {
  const oldP = parseFloat(settings.oldPrice) || 0;
  const newP = parseFloat(settings.newPrice) || 0;
  const discount = oldP > newP && oldP > 0 ? Math.round(((oldP - newP) / oldP) * 100) : 0;
  const currency = settings.currency || 'ر.ي';

  const x = CANVAS_W - 195;
  const y = 320;
  const w = 170;

  // "السعر قبل الخصم" label
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 18px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('السعر قبل الخصم', x + w / 2, y);

  // Old price with strikethrough
  if (oldP > 0) {
    ctx.fillStyle = '#9CA3AF';
    ctx.font = 'bold 28px Cairo, Tahoma, sans-serif';
    const oldPriceText = `${oldP} ${currency}`;
    const textW = ctx.measureText(oldPriceText).width;
    ctx.fillText(oldPriceText, x + w / 2, y + 35);

    // Strikethrough
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - textW / 2 - 5, y + 48);
    ctx.lineTo(x + w / 2 + textW / 2 + 5, y + 48);
    ctx.stroke();
  }

  // Price box (red rounded rect)
  const boxY = y + 70;
  const boxH = 140;

  ctx.fillStyle = '#DC2626';
  roundRect(ctx, x, boxY, w, boxH, 20);
  ctx.fill();

  // "السعر بعد الخصم" label
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Cairo, Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('السعر بعد الخصم', x + w / 2, boxY + 15);

  // New price (big)
  ctx.font = 'bold 56px Cairo, Tahoma, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${newP}`, x + w / 2, boxY + 60);

  // Currency
  ctx.font = 'bold 28px Cairo, Tahoma, sans-serif';
  ctx.fillText(currency, x + w / 2, boxY + 100);

  // Discount tag at bottom of price box
  if (discount > 0) {
    const tagY = boxY + boxH - 5;
    const tagH = 45;
    ctx.fillStyle = '#F5C200';
    roundRect(ctx, x + 10, tagY, w - 20, tagH, 12);
    ctx.fill();

    ctx.fillStyle = '#7C2D12';
    ctx.font = 'bold 20px Cairo, Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${discount}% OFF`, x + w / 2, tagY + tagH / 2);
  }
}

// ====== 7. Features Badges (Bottom-Left) ======
function drawFeaturesBadges(ctx, settings) {
  if (settings.showFeatures === false) return;

  const features = settings.features ? settings.features.split('\n').filter(f => f.trim()) : [];
  if (features.length === 0) return;

  const x = 30;
  const startY = CANVAS_H - 290;
  const w = 300;
  const h = 42;
  const gap = 10;

  features.slice(0, 3).forEach((feature, i) => {
    const y = startY + i * (h + gap);

    // Badge background
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, x, y, w, h, 12);
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, 12);
    ctx.stroke();

    // Icon
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const icons = ['⭐', '🌿', '✅', '🏆', '💎'];
    ctx.fillText(icons[i % icons.length], x + 12, y + h / 2);

    // Text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px Cairo, Tahoma, sans-serif';
    ctx.fillText(feature.trim().substring(0, 25), x + 40, y + h / 2 + 2);
  });
}

// ====== 8. Footer Bar ======
function drawFooterBar(ctx, settings) {
  const barH = 130;
  const y = CANVAS_H - barH;

  // Dark background
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(0, y, CANVAS_W, barH);

  // Top accent line
  ctx.fillStyle = settings.accent || '#DC2626';
  ctx.fillRect(0, y, CANVAS_W, 4);

  // Store logo area (left)
  const logoX = 20;
  const logoY = y + 15;
  const logoW = 140;
  const logoH = 90;

  ctx.fillStyle = settings.accent || '#DC2626';
  roundRect(ctx, logoX, logoY, logoW, logoH, 12);
  ctx.fill();

  // Cart icon
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🛒', logoX + logoW / 2, logoY + 30);

  // Store name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px Cairo, Tahoma, sans-serif';
  const storeName = settings.storeName || 'متجرك';
  ctx.fillText(storeName.substring(0, 12), logoX + logoW / 2, logoY + 60);

  // Divider lines
  const divX1 = logoX + logoW + 15;
  ctx.strokeStyle = '#4B5563';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(divX1, y + 20);
  ctx.lineTo(divX1, y + barH - 20);
  ctx.stroke();

  // Address
  if (settings.storeAddress) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Cairo, Tahoma, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('📍 ' + settings.storeAddress.substring(0, 20), divX1 + 15, y + 35);
  }

  // Phone
  if (settings.storePhone) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Cairo, Tahoma, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('📞 ' + settings.storePhone, divX1 + 15, y + 62);
  }

  // WhatsApp
  const waPhone = settings.storeWhatsapp || settings.storePhone;
  if (waPhone) {
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 16px Cairo, Tahoma, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('💬 ' + waPhone, divX1 + 15, y + 89);
  }

  // Right side: Category icons
  const catX = CANVAS_W - 200;
  const cats = [
    { icon: '👶', label: 'مواليد' },
    { icon: '👧', label: 'بناتي' },
    { icon: '👦', label: 'ولادي' },
    { icon: '👩', label: 'نسائي' }
  ];

  cats.forEach((cat, i) => {
    const cx = catX + i * 50;
    const cy = y + 45;

    // Circle bg
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#374151';
    ctx.fill();
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Icon
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cat.icon, cx, cy);

    // Label
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '10px Cairo, Tahoma, sans-serif';
    ctx.fillText(cat.label, cx, cy + 32);
  });
}

// ====== Helper: Rounded Rectangle ======
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
