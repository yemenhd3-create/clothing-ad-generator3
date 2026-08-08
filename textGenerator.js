// ========== Smart Marketing Text Generator ==========

const TEMPLATES = {
  girl: [
    `✨ {productName} ✨
{subtitle}
👗 تشكيلة بناتي أنيقة
💰 السعر: {newPrice} {currency} {discountText}
📏 المقاسات: {sizes}
🎨 الألوان: {colors}
📦 الكمية: {quantity} | العدد: {pieces}
{featuresText}
{storeText}
{contactText}
👇 للطلب تواصل واتساب 📲`,

    `🌸 {productName} 🌸
{subtitle}
✨ أناقة لأميرتك الصغيرة
{discountText}
🏷️ {newPrice} {currency}
📏 {sizes}
🎨 {colors}
📦 {quantity} قطع
{featuresText}
{storeText}
{contactText}
📲 تواصل الآن`,

    `👑 {productName} 👑
{subtitle}
💫 تشكيلة العيد الفاخرة
{discountText}
💵 فقط {newPrice} {currency}
📐 {sizes}
🎨 {colors}
📦 {quantity}
{featuresText}
{storeText}
{contactText}
🛒 اطلب الآن 👇`
  ],

  women: [
    `✨ {productName} ✨
{subtitle}
👗 أناقة يومية بأرقى التصاميم
💰 {newPrice} {currency} {discountText}
📏 المقاسات: {sizes}
🎨 الألوان: {colors}
📦 الكمية: {quantity}
{featuresText}
{storeText}
{contactText}
👇 للطلب والاستفسار 📲`,

    `🌹 {productName} 🌹
{subtitle}
تألقي بأجمل الإطلالات ✨
{discountText}
🏷️ {newPrice} {currency}
📏 {sizes}
🎨 {colors}
📦 {quantity}
{featuresText}
{storeText}
{contactText}
📲 تواصلي معنا`,

    `💎 {productName} 💎
{subtitle}
فخامة وأناقة في قطعة واحدة
{discountText}
💵 {newPrice} {currency}
📐 {sizes}
🎨 {colors}
📦 {quantity}
{featuresText}
{storeText}
{contactText}
🛍️ اطلبي الآن 👇`
  ],

  boy: [
    `✨ {productName} ✨
{subtitle}
👕 تشكيلة ولادي أنيقة
💰 {newPrice} {currency} {discountText}
📏 المقاسات: {sizes}
🎨 الألوان: {colors}
📦 العدد: {pieces}
{featuresText}
{storeText}
{contactText}
👇 للطلب 📲`,

    `🎯 {productName} 🎯
{subtitle}
أناقة وراحة لأميرك الصغير
{discountText}
🏷️ {newPrice} {currency}
📏 {sizes}
🎨 {colors}
📦 {pieces}
{featuresText}
{storeText}
{contactText}
📲 تواصل الآن`
  ],

  baby: [
    `✨ {productName} ✨
{subtitle}
👶 راحة وأناقة لمواليدك
💰 {newPrice} {currency} {discountText}
📏 المقاسات: {sizes}
🎨 الألوان: {colors}
📦 الكمية: {quantity}
{featuresText}
{storeText}
{contactText}
👇 للطلب 📲`,

    `🍼 {productName} 🍼
{subtitle}
نعومة وراحة لأطفالك
{discountText}
🏷️ {newPrice} {currency}
📏 {sizes}
🎨 {colors}
📦 {quantity}
{featuresText}
{storeText}
{contactText}
📲 تواصل معنا`
  ],

  men: [
    `✨ {productName} ✨
{subtitle}
👔 أناقة رجالية بأفضل الأسعار
💰 {newPrice} {currency} {discountText}
📏 المقاسات: {sizes}
🎨 الألوان: {colors}
📦 العدد: {pieces}
{featuresText}
{storeText}
{contactText}
👇 للطلب 📲`,

    `🎯 {productName} 🎯
{subtitle}
أناقة وراحة في كل قطعة
{discountText}
🏷️ {newPrice} {currency}
📏 {sizes}
🎨 {colors}
📦 {pieces}
{featuresText}
{storeText}
{contactText}
📲 تواصل الآن`
  ]
};

export function generateMarketingText(settings) {
  const category = settings.gender || settings.category || 'girl';
  const templates = TEMPLATES[category] || TEMPLATES.girl;
  // Pick template based on hash of product name for consistency
  const hash = settings.productName?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 0;
  const template = templates[hash % templates.length];

  const oldP = parseFloat(settings.oldPrice) || 0;
  const newP = parseFloat(settings.newPrice) || 0;
  const discount = oldP > newP && oldP > 0 ? Math.round(((oldP - newP) / oldP) * 100) : 0;

  const discountText = discount > 0
    ? `🔥 خصم ${discount}% (بدلاً من ${settings.oldPrice})`
    : '';

  const featuresText = settings.features
    ? settings.features.split('\n').filter(f => f.trim()).map(f => `✅ ${f.trim()}`).join('\n')
    : '';

  const storeText = settings.showStoreName && settings.storeName
    ? `🏪 ${settings.storeName}`
    : '';

  const contactPhone = settings.storePhone || settings.storeWhatsapp || settings.storePhone2 || '';
  const contactText = settings.showContact && contactPhone
    ? `📞 ${contactPhone}`
    : '';

  return template
    .replace(/{productName}/g, settings.productName || 'منتج مميز')
    .replace(/{subtitle}/g, settings.subtitle || '')
    .replace(/{newPrice}/g, settings.newPrice || '')
    .replace(/{oldPrice}/g, settings.oldPrice || '')
    .replace(/{currency}/g, settings.currency || 'ر.ي')
    .replace(/{discountText}/g, discountText)
    .replace(/{sizes}/g, settings.sizes || 'جميع المقاسات')
    .replace(/{colors}/g, settings.colors || 'متعدد')
    .replace(/{quantity}/g, settings.quantity || 'متوفر')
    .replace(/{pieces}/g, settings.pieces || '1')
    .replace(/{featuresText}/g, featuresText)
    .replace(/{storeText}/g, storeText)
    .replace(/{contactText}/g, contactText)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function generateShortCaption(settings) {
  const oldP = parseFloat(settings.oldPrice) || 0;
  const newP = parseFloat(settings.newPrice) || 0;
  const discount = oldP > newP && oldP > 0 ? Math.round(((oldP - newP) / oldP) * 100) : 0;

  let caption = `${settings.productName || 'منتج مميز'}\n`;
  if (settings.subtitle) caption += `${settings.subtitle}\n`;
  if (discount > 0) {
    caption += `🔥 خصم ${discount}% | ${settings.newPrice} ${settings.currency}\n`;
    caption += `❌ ${settings.oldPrice} ${settings.currency}\n`;
  } else {
    caption += `💰 ${settings.newPrice} ${settings.currency}\n`;
  }
  caption += `📏 ${settings.sizes || 'جميع المقاسات'}\n`;
  caption += `🎨 ${settings.colors || 'متعدد'}\n`;
  if (settings.quantity) caption += `📦 ${settings.quantity}\n`;
  if (settings.pieces) caption += `👕 العدد: ${settings.pieces}\n`;
  if (settings.showStoreName && settings.storeName) caption += `🏪 ${settings.storeName}\n`;
  const phone = settings.storePhone || settings.storeWhatsapp || '';
  if (phone) caption += `📞 ${phone}\n`;
  caption += `👇 للطلب تواصل واتساب`;

  return caption;
}
