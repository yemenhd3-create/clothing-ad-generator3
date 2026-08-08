// ========== Main Application ==========
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from './storage.js';
import { renderAd } from './canvasRenderer.js';
import { generateMarketingText, generateShortCaption } from './textGenerator.js';
import { shareToWhatsApp, downloadImage, copyText, openWhatsAppChat } from './share.js';
import { tryOnWithFallback } from './aiTryOn.js';
import { generateAccessCode, storeAccessCode, getDevSecret } from './subscription.js';
import { showToast } from './utils.js';

// ===== State =====
let settings = { ...DEFAULT_SETTINGS };
let currentStep = 1;
let productImage = null;
let generatedAdImage = null;
let isGenerating = false;
let hasUnsavedChanges = false;

// ===== DOM Elements =====
const els = {};

function cacheElements() {
  // Steps
  els.steps = [1,2,3,4].map(i => document.getElementById(`step-${i}`));
  els.stepperItems = document.querySelectorAll('.stepper-item');
  els.navBtns = [1,2,3,4].map(i => document.getElementById(`nav-step-${i}`));

  // Upload
  els.uploadArea = document.getElementById('upload-area');
  els.fileInput = document.getElementById('file-input');
  els.previewImg = document.getElementById('preview-img');
  els.uploadPlaceholder = document.getElementById('upload-placeholder');
  els.btnGallery = document.getElementById('btn-gallery');
  els.btnCamera = document.getElementById('btn-camera');

  // Inputs
  els.inputProductName = document.getElementById('input-product-name');
  els.inputSubtitle = document.getElementById('input-subtitle');
  els.inputOldPrice = document.getElementById('input-old-price');
  els.inputNewPrice = document.getElementById('input-new-price');
  els.inputCurrency = document.getElementById('input-currency');
  els.inputQuantity = document.getElementById('input-quantity');
  els.inputPieces = document.getElementById('input-pieces');
  els.inputSizes = document.getElementById('input-sizes');
  els.inputColors = document.getElementById('input-colors');
  els.inputFeatures = document.getElementById('input-features');
  els.inputGender = document.getElementById('input-gender');
  els.inputAge = document.getElementById('input-age');

  // Preview
  els.adPreviewImg = document.getElementById('ad-preview-img');
  els.adPreviewPlaceholder = document.getElementById('ad-preview-placeholder');
  els.btnGenerate = document.getElementById('btn-generate');
  els.generateText = document.getElementById('generate-text');
  els.generateSpinner = document.getElementById('generate-spinner');
  els.btnAiTryon = document.getElementById('btn-ai-tryon');
  els.aiSection = document.getElementById('ai-section');
  els.providersList = document.getElementById('providers-list');
  els.btnAddProvider = document.getElementById('btn-add-provider');

  // Final
  els.finalAdImg = document.getElementById('final-ad-img');
  els.finalPlaceholder = document.getElementById('final-placeholder');
  els.marketingText = document.getElementById('marketing-text');
  els.btnCopyText = document.getElementById('btn-copy-text');
  els.btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
  els.btnDownload = document.getElementById('btn-download');
  els.btnShareNative = document.getElementById('btn-share-native');

  // Settings Modal
  els.modalSettings = document.getElementById('modal-settings');
  els.btnCloseSettings = document.getElementById('btn-close-settings');
  els.btnSaveSettings = document.getElementById('btn-save-settings');
  els.settingStoreName = document.getElementById('setting-store-name');
  els.settingStoreAddress = document.getElementById('setting-store-address');
  els.settingStorePhone = document.getElementById('setting-store-phone');
  els.settingStoreWhatsapp = document.getElementById('setting-store-whatsapp');
  els.settingStorePhone2 = document.getElementById('setting-store-phone2');
  els.settingAccent = document.getElementById('setting-accent');
  els.settingSecondary = document.getElementById('setting-secondary');
  els.optShowDiscount = document.getElementById('opt-show-discount');
  els.optShowStore = document.getElementById('opt-show-store');
  els.optShowContact = document.getElementById('opt-show-contact');
  els.optShowQuality = document.getElementById('opt-show-quality');

  // Settings button (⚙️)
  els.btnSettings = document.getElementById('btn-settings');

  // Dev Modal (🔐)
  els.btnDev = document.getElementById('btn-dev');
  els.modalDev = document.getElementById('modal-dev');
  els.btnCloseDev = document.getElementById('btn-close-dev');
  els.devLoginForm = document.getElementById('dev-login-form');
  els.devPanel = document.getElementById('dev-panel');
  els.devPassword = document.getElementById('dev-password');
  els.devKey = document.getElementById('dev-key');
  els.btnDevLogin = document.getElementById('btn-dev-login');
  els.subDuration = document.getElementById('sub-duration');
  els.btnGenCode = document.getElementById('btn-gen-code');
  els.generatedCodes = document.getElementById('generated-codes');
  els.btnClearData = document.getElementById('btn-clear-data');
  els.btnExportData = document.getElementById('btn-export-data');
}

// ===== Initialization =====
function init() {
  cacheElements();
  loadFromStorage();
  bindEvents();
  updateUI();
  registerServiceWorker();
  preventAccidentalLeave();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

function preventAccidentalLeave() {
  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

function loadFromStorage() {
  settings = loadSettings();
  // Fill inputs
  els.inputProductName.value = settings.productName || '';
  els.inputSubtitle.value = settings.subtitle || '';
  els.inputOldPrice.value = settings.oldPrice || '';
  els.inputNewPrice.value = settings.newPrice || '';
  els.inputCurrency.value = settings.currency || 'ر.ي';
  els.inputQuantity.value = settings.quantity || '';
  els.inputPieces.value = settings.pieces || '';
  els.inputSizes.value = settings.sizes || '';
  els.inputColors.value = settings.colors || '';
  els.inputFeatures.value = settings.features || '';
  els.inputGender.value = settings.gender || 'girl';
  els.inputAge.value = settings.ageGroup || 'kids';

  // Settings modal
  els.settingStoreName.value = settings.storeName || '';
  els.settingStoreAddress.value = settings.storeAddress || '';
  els.settingStorePhone.value = settings.storePhone || '';
  els.settingStoreWhatsapp.value = settings.storeWhatsapp || '';
  els.settingStorePhone2.value = settings.storePhone2 || '';
  els.settingAccent.value = settings.accent || '#C41A1A';
  els.settingSecondary.value = settings.secondary || '#F5C200';
  els.optShowDiscount.checked = settings.showDiscount !== false;
  els.optShowStore.checked = settings.showStoreName !== false;
  els.optShowContact.checked = settings.showContact !== false;
  els.optShowQuality.checked = settings.showQualityBadge !== false;
}

function saveToSettings() {
  settings.productName = els.inputProductName.value;
  settings.subtitle = els.inputSubtitle.value;
  settings.oldPrice = els.inputOldPrice.value;
  settings.newPrice = els.inputNewPrice.value;
  settings.currency = els.inputCurrency.value;
  settings.quantity = els.inputQuantity.value;
  settings.pieces = els.inputPieces.value;
  settings.sizes = els.inputSizes.value;
  settings.colors = els.inputColors.value;
  settings.features = els.inputFeatures.value;
  settings.gender = els.inputGender.value;
  settings.ageGroup = els.inputAge.value;
  saveSettings(settings);
  hasUnsavedChanges = false;
}

// ===== Step Navigation =====
function goToStep(step) {
  if (step < 1 || step > 4) return;

  // Validation
  if (step === 3 && !productImage) {
    showToast('الرجاء رفع صورة أولاً', 'error');
    goToStep(1);
    return;
  }
  if (step === 4 && !generatedAdImage) {
    showToast('الرجاء توليد الإعلان أولاً', 'error');
    goToStep(3);
    return;
  }

  currentStep = step;

  // Hide all steps
  els.steps.forEach((s, i) => {
    s.classList.toggle('hidden', i + 1 !== step);
  });

  // Update stepper
  els.stepperItems.forEach((item, i) => {
    item.classList.remove('active', 'completed');
    if (i + 1 === step) item.classList.add('active');
    else if (i + 1 < step) item.classList.add('completed');
  });

  // Update nav buttons
  els.navBtns.forEach((btn, i) => {
    btn.classList.toggle('btn-primary', i + 1 === step);
    btn.classList.toggle('btn-secondary', i + 1 !== step);
  });

  // Auto-save when leaving step 2
  if (step !== 2) saveToSettings();

  // Auto-generate when entering step 3
  if (step === 3 && productImage && !generatedAdImage) {
    generateAd();
  }

  // Auto-fill final when entering step 4
  if (step === 4 && generatedAdImage) {
    els.finalAdImg.src = generatedAdImage;
    els.finalAdImg.classList.remove('hidden');
    els.finalPlaceholder.classList.add('hidden');
    els.marketingText.value = generateMarketingText(settings);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Image Upload =====
function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('الرجاء اختيار ملف صورة', 'error');
    return;
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showToast('حجم الصورة كبير جداً (الحد الأقصى 10 ميجا)', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    productImage = e.target.result;
    els.previewImg.src = productImage;
    els.previewImg.classList.remove('hidden');
    els.uploadPlaceholder.classList.add('hidden');
    els.uploadArea.classList.add('has-image');
    generatedAdImage = null; // Reset
    hasUnsavedChanges = true;
    showToast('تم رفع الصورة بنجاح');
  };
  reader.onerror = () => {
    showToast('فشل قراءة الصورة', 'error');
  };
  reader.readAsDataURL(file);
}

// ===== Generate Ad =====
async function generateAd() {
  if (!productImage) {
    showToast('الرجاء رفع صورة أولاً', 'error');
    return;
  }
  if (isGenerating) return;

  isGenerating = true;
  els.generateText.classList.add('hidden');
  els.generateSpinner.classList.remove('hidden');
  els.btnGenerate.disabled = true;

  try {
    saveToSettings();
    generatedAdImage = await renderAd(settings, productImage);

    els.adPreviewImg.src = generatedAdImage;
    els.adPreviewImg.classList.remove('hidden');
    els.adPreviewPlaceholder.classList.add('hidden');

    showToast('تم توليد الإعلان بنجاح!');
  } catch (err) {
    console.error('Generate error:', err);
    showToast('حدث خطأ أثناء توليد الإعلان', 'error');
  } finally {
    isGenerating = false;
    els.generateText.classList.remove('hidden');
    els.generateSpinner.classList.add('hidden');
    els.btnGenerate.disabled = false;
  }
}

// ===== AI Try-On =====
async function aiTryOn() {
  if (!productImage) {
    showToast('الرجاء رفع صورة أولاً', 'error');
    return;
  }

  // Filter: enabled providers (allow empty apiKey for free providers like Pollinations)
  const enabledProviders = settings.providers?.filter(p => p.enabled);
  if (!enabledProviders?.length) {
    showToast('الرجاء إضافة مزود ذكاء اصطناعي في الإعدادات', 'error');
    els.aiSection.classList.remove('hidden');
    return;
  }

  isGenerating = true;
  els.generateText.classList.add('hidden');
  els.generateSpinner.classList.remove('hidden');
  els.btnAiTryon.disabled = true;

  try {
    saveToSettings();
    const result = await tryOnWithFallback(settings, productImage, enabledProviders);

    if (result.success && result.imageUrl) {
      if (result.imageUrl.startsWith('http')) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          productImage = result.imageUrl;
          els.previewImg.src = productImage;
          showToast(`تم التلبيس عبر ${result.provider}`);
          generateAd();
        };
        img.onerror = () => {
          showToast('فشل تحميل الصورة من الذكاء الاصطناعي', 'error');
        };
        img.src = result.imageUrl;
      }
    } else {
      showToast(result.error || 'فشل التلبيس', 'error');
    }
  } catch (err) {
    console.error('AI Try-On error:', err);
    showToast('حدث خطأ في التلبيس', 'error');
  } finally {
    isGenerating = false;
    els.generateText.classList.remove('hidden');
    els.generateSpinner.classList.add('hidden');
    els.btnAiTryon.disabled = false;
  }
}

// ===== Providers Management =====
function renderProviders() {
  els.providersList.innerHTML = '';
  if (!settings.providers || settings.providers.length === 0) {
    settings.providers = [{
      id: 'provider-1',
      name: 'Pollinations.ai',
      baseUrl: 'https://image.pollinations.ai/prompt/',
      model: 'flux',
      apiKey: '',
      enabled: true,
      type: 'image'
    }];
    saveSettings(settings);
  }

  settings.providers.forEach((p, idx) => {
    const div = document.createElement('div');
    div.className = 'provider-card';
    div.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;margin-bottom:8px;">
        <input type="text" class="input" style="font-size:12px;" value="${escapeHtml(p.name)}" placeholder="الاسم" data-idx="${idx}" data-field="name">
        <input type="text" class="input" style="font-size:12px;width:90px;" value="${escapeHtml(p.model)}" placeholder="الموديل" data-idx="${idx}" data-field="model">
        <button class="btn btn-primary" style="font-size:12px;padding:6px 10px;" data-remove="${idx}">🗑️</button>
      </div>
      <input type="text" class="input" style="font-size:12px;margin-bottom:4px;" value="${escapeHtml(p.baseUrl)}" placeholder="الرابط" data-idx="${idx}" data-field="baseUrl">
      <div style="display:flex;align-items:center;gap:8px;">
        <input type="password" class="input" style="font-size:12px;flex:1;" value="${escapeHtml(p.apiKey)}" placeholder="API Key (اختياري للمزودين المجانية)" data-idx="${idx}" data-field="apiKey">
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap;">
          <input type="checkbox" ${p.enabled ? 'checked' : ''} data-idx="${idx}" data-field="enabled">
          مفعل
        </label>
      </div>
    `;
    els.providersList.appendChild(div);
  });

  // Bind provider inputs
  els.providersList.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      const field = e.target.dataset.field;
      const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      settings.providers[idx][field] = val;
      saveSettings(settings);
    });
  });

  els.providersList.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.remove);
      if (settings.providers.length <= 1) {
        showToast('يجب الاحتفاظ بمزود واحد على الأقل', 'error');
        return;
      }
      settings.providers.splice(idx, 1);
      saveSettings(settings);
      renderProviders();
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addProvider() {
  settings.providers.push({
    id: 'provider-' + Date.now(),
    name: 'مزود جديد',
    baseUrl: 'https://image.pollinations.ai/prompt/',
    model: 'flux',
    apiKey: '',
    enabled: true,
    type: 'image'
  });
  saveSettings(settings);
  renderProviders();
}

// ===== Share =====
async function handleShareWhatsApp() {
  if (!generatedAdImage) {
    showToast('الرجاء توليد الإعلان أولاً', 'error');
    return;
  }
  const text = generateShortCaption(settings);
  const result = await shareToWhatsApp(generatedAdImage, text);
  if (result.success) {
    if (result.method === 'native-share') {
      showToast('تمت المشاركة بنجاح');
    } else {
      showToast('تم تحميل الصورة ونسخ النص. افتح واتساب للمشاركة.');
    }
  } else {
    showToast(result.error || 'تعذرت المشاركة', 'error');
  }
}

async function handleDownload() {
  if (!generatedAdImage) {
    showToast('الرجاء توليد الإعلان أولاً', 'error');
    return;
  }
  const safeName = (settings.productName || 'product').replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
  await downloadImage(generatedAdImage, `ad-${safeName}.png`);
  showToast('تم تحميل الصورة');
}

async function handleShareNative() {
  if (!generatedAdImage) {
    showToast('الرجاء توليد الإعلان أولاً', 'error');
    return;
  }
  const text = generateShortCaption(settings);
  const blob = await (await fetch(generatedAdImage)).blob();
  const file = new File([blob], 'clothing-ad.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: settings.productName || 'إعلان ملابس',
        text: text,
        files: [file]
      });
      showToast('تمت المشاركة');
    } catch (err) {
      if (err.name !== 'AbortError') {
        showToast('فشلت المشاركة المباشرة', 'error');
      }
    }
  } else {
    showToast('المشاركة المباشرة غير مدعومة على هذا الجهاز', 'error');
  }
}

async function handleCopyText() {
  const text = els.marketingText.value;
  if (!text) {
    showToast('لا يوجد نص لنسخه', 'error');
    return;
  }
  const result = await copyText(text);
  if (result.success) {
    showToast('تم نسخ النص التسويقي');
  } else {
    showToast('فشل النسخ', 'error');
  }
}

// ===== Settings Modal =====
function openSettings() {
  els.modalSettings.classList.add('open');
}

function closeSettings() {
  els.modalSettings.classList.remove('open');
}

function saveSettingsFromModal() {
  settings.storeName = els.settingStoreName.value;
  settings.storeAddress = els.settingStoreAddress.value;
  settings.storePhone = els.settingStorePhone.value;
  settings.storeWhatsapp = els.settingStoreWhatsapp.value;
  settings.storePhone2 = els.settingStorePhone2.value;
  settings.accent = els.settingAccent.value;
  settings.secondary = els.settingSecondary.value;
  settings.showDiscount = els.optShowDiscount.checked;
  settings.showStoreName = els.optShowStore.checked;
  settings.showContact = els.optShowContact.checked;
  settings.showQualityBadge = els.optShowQuality.checked;
  saveSettings(settings);
  closeSettings();
  showToast('تم حفظ الإعدادات');
  // Regenerate if we have an image
  if (productImage && generatedAdImage) {
    generateAd();
  }
}

// ===== Dev Modal =====
function openDev() {
  els.modalDev.classList.add('open');
  if (settings.devUnlocked) {
    els.devLoginForm.classList.add('hidden');
    els.devPanel.classList.remove('hidden');
  } else {
    els.devLoginForm.classList.remove('hidden');
    els.devPanel.classList.add('hidden');
  }
}

function closeDev() {
  els.modalDev.classList.remove('open');
}

function devLogin() {
  const pass = els.devPassword.value;
  const key = els.devKey.value;

  if (pass === 'dev1234' && key === getDevSecret()) {
    settings.devUnlocked = true;
    saveSettings(settings);
    els.devLoginForm.classList.add('hidden');
    els.devPanel.classList.remove('hidden');
    showToast('تم فتح لوحة المطور');
  } else {
    showToast('بيانات الدخول غير صحيحة', 'error');
  }
}

function generateSubCode() {
  const days = parseInt(els.subDuration.value) || 30;
  const { code, expiresAt } = generateAccessCode(days);
  storeAccessCode(code, expiresAt, days);

  const div = document.createElement('div');
  div.style.cssText = 'display:flex;align-items:center;justify-content:space-between;background:#f9fafb;padding:8px 12px;border-radius:12px;margin-bottom:4px;';
  const date = new Date(expiresAt).toLocaleDateString('ar-YE');
  div.innerHTML = `
    <span style="font-family:monospace;font-weight:700;color:var(--primary);">${code}</span>
    <span style="font-size:12px;color:#6b7280;">حتى ${date}</span>
  `;
  els.generatedCodes.appendChild(div);
  showToast('تم توليد الرمز');
}

function clearAll() {
  if (confirm('هل أنت متأكد من مسح جميع البيانات؟\nلا يمكن التراجع عن هذا الإجراء.')) {
    localStorage.clear();
    settings = { ...DEFAULT_SETTINGS };
    productImage = null;
    generatedAdImage = null;
    hasUnsavedChanges = false;
    location.reload();
  }
}

function exportData() {
  const data = {
    settings: loadSettings(),
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clothing-ad-settings-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('تم تصدير الإعدادات');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.settings) {
        settings = { ...DEFAULT_SETTINGS, ...data.settings };
        saveSettings(settings);
        showToast('تم استيراد الإعدادات بنجاح');
        setTimeout(() => location.reload(), 1000);
      } else {
        showToast('ملف غير صالح', 'error');
      }
    } catch {
      showToast('فشل استيراد الإعدادات', 'error');
    }
  };
  input.click();
}

// ===== Event Binding =====
function bindEvents() {
  // Step nav
  els.navBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => goToStep(i + 1));
  });

  // Upload
  els.btnGallery.addEventListener('click', () => {
    els.fileInput.removeAttribute('capture');
    els.fileInput.click();
  });
  els.btnCamera.addEventListener('click', () => {
    els.fileInput.setAttribute('capture', 'environment');
    els.fileInput.click();
  });
  els.fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  els.uploadArea.addEventListener('click', () => els.fileInput.click());
  els.uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    els.uploadArea.style.borderColor = 'var(--primary)';
  });
  els.uploadArea.addEventListener('dragleave', () => {
    els.uploadArea.style.borderColor = '';
  });
  els.uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    els.uploadArea.style.borderColor = '';
    handleFile(e.dataTransfer.files[0]);
  });

  // Generate
  els.btnGenerate.addEventListener('click', generateAd);
  els.btnAiTryon.addEventListener('click', aiTryOn);
  els.btnAddProvider.addEventListener('click', addProvider);

  // Share
  els.btnShareWhatsapp.addEventListener('click', handleShareWhatsApp);
  els.btnDownload.addEventListener('click', handleDownload);
  els.btnShareNative.addEventListener('click', handleShareNative);
  els.btnCopyText.addEventListener('click', handleCopyText);

  // Settings (⚙️ button)
  els.btnSettings.addEventListener('click', openSettings);
  els.btnCloseSettings.addEventListener('click', closeSettings);
  els.btnSaveSettings.addEventListener('click', saveSettingsFromModal);
  els.modalSettings.addEventListener('click', (e) => {
    if (e.target === els.modalSettings) closeSettings();
  });

  // Dev (🔐 button) - long press or double click
  let devPressTimer;
  const startDevPress = () => {
    devPressTimer = setTimeout(openDev, 800);
  };
  const cancelDevPress = () => {
    clearTimeout(devPressTimer);
  };

  els.btnDev.addEventListener('mousedown', startDevPress);
  els.btnDev.addEventListener('mouseup', cancelDevPress);
  els.btnDev.addEventListener('mouseleave', cancelDevPress);
  els.btnDev.addEventListener('touchstart', startDevPress, { passive: true });
  els.btnDev.addEventListener('touchend', cancelDevPress);
  els.btnDev.addEventListener('dblclick', openDev);

  els.btnCloseDev.addEventListener('click', closeDev);
  els.btnDevLogin.addEventListener('click', devLogin);
  els.btnGenCode.addEventListener('click', generateSubCode);
  els.btnClearData.addEventListener('click', clearAll);
  els.btnExportData.addEventListener('click', exportData);
  els.modalDev.addEventListener('click', (e) => {
    if (e.target === els.modalDev) closeDev();
  });

  // Auto-save inputs
  const autoSaveInputs = [
    els.inputProductName, els.inputSubtitle, els.inputOldPrice,
    els.inputNewPrice, els.inputCurrency, els.inputQuantity,
    els.inputPieces, els.inputSizes, els.inputColors, els.inputFeatures
  ];
  autoSaveInputs.forEach(input => {
    input.addEventListener('input', () => { hasUnsavedChanges = true; });
    input.addEventListener('change', saveToSettings);
  });
  [els.inputGender, els.inputAge].forEach(sel => {
    sel.addEventListener('change', saveToSettings);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
      closeSettings();
      closeDev();
    }
  });
}

function updateUI() {
  renderProviders();
}

// ===== Start =====
init();
