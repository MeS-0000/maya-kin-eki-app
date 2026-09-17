/**
 * main.js
 * UIの初期化、DOM要素の参照、イベント紐付けを担当するエントリーポイント。
 * 計算ロジックは mayaCalc.js / yearForecast.js、
 * 結果表示・13年サイクル表・シェア機能・URL同期はそれぞれ
 * resultRenderer.js / cycleTable.js / shareActions.js / urlSync.js に分離されている。
 * このファイルはそれらを組み合わせてDOMイベントに繋ぐ役割のみを持つ。
 */

(function () {
const makeUTCDate = window.MayaApp.makeUTCDate;
const getKinFromDate = window.MayaApp.getKinFromDate;
const buildKinProfile = window.MayaApp.buildKinProfile;
const renderResultDisplay = window.MayaApp.renderResultDisplay;
const renderCycleTable = window.MayaApp.renderCycleTable;
const syncUrl = window.MayaApp.syncUrl;
const syncKinUrl = window.MayaApp.syncKinUrl;
const fillInputs = window.MayaApp.fillInputs;
const fillKinInput = window.MayaApp.fillKinInput;
const getBirthdayFromUrl = window.MayaApp.getBirthdayFromUrl;
const getKinFromUrl = window.MayaApp.getKinFromUrl;
const bindShareActions = window.MayaApp.bindShareActions;

const els = {
  form: document.getElementById('birthday-form'),
  year: document.getElementById('input-year'),
  month: document.getElementById('input-month'),
  day: document.getElementById('input-day'),
  datePicker: document.getElementById('input-date-picker'),
  inputKin: document.getElementById('input-kin'),
  formError: document.getElementById('form-error'),
  btnClear: document.getElementById('btn-clear'),

  resultArea: document.getElementById('result-area'),
  resultKin: document.getElementById('result-kin'),
  kinBlackBadge: document.getElementById('kin-black-badge'),
  resultHeadlineSealIcon: document.getElementById('result-headline-seal-icon'),
  resultHeadlineSealNumber: document.getElementById('result-headline-seal-number'),
  resultHeadlineSealName: document.getElementById('result-headline-seal-name'),
  resultHeadlineWavespellIcon: document.getElementById('result-headline-wavespell-icon'),
  resultHeadlineWavespellNumber: document.getElementById('result-headline-wavespell-number'),
  resultHeadlineWavespellName: document.getElementById('result-headline-wavespell-name'),
  resultHeadlineExtraRow: document.getElementById('result-headline-extra-row'),
  resultHeadlineExtraIcon: document.getElementById('result-headline-extra-icon'),
  resultHeadlineExtraNumber: document.getElementById('result-headline-extra-number'),
  resultHeadlineExtraName: document.getElementById('result-headline-extra-name'),
  resultBadges: document.getElementById('result-badges'),
  resultTone: document.getElementById('result-tone'),
  resultToneKeyword: document.getElementById('result-tone-keyword'),
  resultChakra: document.getElementById('result-chakra'),
  resultChakraKeyword: document.getElementById('result-chakra-keyword'),
  resultCastle: document.getElementById('result-castle'),
  resultCastleKeyword: document.getElementById('result-castle-keyword'),

  sealMirror: document.getElementById('seal-mirror'),
  sealMirrorDetail: document.getElementById('seal-mirror-detail'),
  sealOppositeKin: document.getElementById('seal-opposite-kin'),
  sealOppositeKinDetail: document.getElementById('seal-opposite-kin-detail'),
  sealCenter: document.getElementById('seal-center'),
  sealOppositeSeal: document.getElementById('seal-opposite-seal'),
  sealGuide: document.getElementById('seal-guide'),
  sealAnalog: document.getElementById('seal-analog'),
  sealMystic: document.getElementById('seal-mystic'),

  waveSectionTitle: document.getElementById('wave-section-title'),
  waveCenter: document.getElementById('wave-center'),
  waveOppositeSeal: document.getElementById('wave-opposite-seal'),
  waveAnalog: document.getElementById('wave-analog'),
  waveMystic: document.getElementById('wave-mystic'),

  toneHarmonic: document.getElementById('tone-harmonic'),
  toneHarmonicKeyword: document.getElementById('tone-harmonic-keyword'),
  toneComplement: document.getElementById('tone-complement'),
  toneComplementKeyword: document.getElementById('tone-complement-keyword'),
  toneHarmony: document.getElementById('tone-harmony'),
  toneHarmonyKeyword: document.getElementById('tone-harmony-keyword'),
  toneLinked: document.getElementById('tone-linked'),
  toneLinkedKeyword: document.getElementById('tone-linked-keyword'),

  resultIchingName: document.getElementById('result-iching-name'),
  resultIchingImage: document.getElementById('result-iching-image'),
  resultIchingMessage: document.getElementById('result-iching-message'),

  shareCard: document.getElementById('share-card'),
  shareX: document.getElementById('share-x'),
  shareLine: document.getElementById('share-line'),
  btnPrint: document.getElementById('btn-print'),
  btnCopyUrl: document.getElementById('btn-copy-url'),

  cycleCard: document.getElementById('cycle-card'),
  cycleTableBody: document.getElementById('cycle-table-body'),
};

/**
 * 生年月日を渡して診断結果（ヘッドライン・関係性・13年サイクル表）を表示する。
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
function renderResult(year, month, day) {
  const date = makeUTCDate(year, month, day);
  const kin = getKinFromDate(date);
  const profile = buildKinProfile(kin);

  renderResultDisplay(profile, els);
  renderCycleTable(year, month, day, els);
}

/**
 * KIN番号を渡して診断結果（ヘッドライン・関係性）を表示する。
 * 生年月日が分からないため、年齢計算が必要な13年サイクル表は表示しない。
 * @param {number} kin
 */
function renderResultFromKin(kin) {
  const profile = buildKinProfile(kin);

  renderResultDisplay(profile, els);
  els.cycleCard.classList.add('hidden');
  els.cycleTableBody.innerHTML = '';
}

// --- フォーム送信（生年月日 または KIN番号） ---
els.form.addEventListener('submit', (event) => {
  event.preventDefault();

  const kin = Number(els.inputKin.value);
  if (kin && kin >= 1 && kin <= 260) {
    els.formError.classList.add('hidden');
    fillKinInput(kin, els);
    renderResultFromKin(kin);
    syncKinUrl(kin);
    return;
  }

  const year = Number(els.year.value);
  const month = Number(els.month.value);
  const day = Number(els.day.value);
  if (!year || !month || !day) {
    els.formError.classList.remove('hidden');
    return;
  }

  els.formError.classList.add('hidden');
  fillInputs(year, month, day, els);
  renderResult(year, month, day);
  syncUrl(year, month, day);
});

// --- KIN番号入力での検索 ---
els.inputKin.addEventListener('change', () => {
  const kin = Number(els.inputKin.value);
  if (!kin || kin < 1 || kin > 260) return;
  els.formError.classList.add('hidden');
  fillKinInput(kin, els);
  renderResultFromKin(kin);
  syncKinUrl(kin);
});

// --- DatePickerでの選択 ---
els.datePicker.addEventListener('change', () => {
  const value = els.datePicker.value; // YYYY-MM-DD
  if (!value) return;
  els.formError.classList.add('hidden');
  const [y, m, d] = value.split('-').map(Number);
  fillInputs(y, m, d, els);
  renderResult(y, m, d);
  syncUrl(y, m, d);
});

// --- クリアボタン: 入力・結果をすべてリセットして最初の画面に戻す ---
els.btnClear.addEventListener('click', () => {
  els.form.reset();

  els.resultArea.classList.add('hidden');
  els.shareCard.classList.add('hidden');
  els.cycleCard.classList.add('hidden');
  els.cycleTableBody.innerHTML = '';
  els.formError.classList.add('hidden');

  window.history.replaceState(null, '', window.location.pathname);
  window.scrollTo({ top: 0 });
});

bindShareActions(els);

// --- 初期化：URLパラメータ ?birthday=YYYY-MM-DD または ?kin=1-260 があれば自動診断 ---
(function init() {
  const birthday = getBirthdayFromUrl();
  if (birthday) {
    fillInputs(birthday.year, birthday.month, birthday.day, els);
    renderResult(birthday.year, birthday.month, birthday.day);
    return;
  }

  const kin = getKinFromUrl();
  if (kin) {
    fillKinInput(kin, els);
    renderResultFromKin(kin);
  }
})();
})();
