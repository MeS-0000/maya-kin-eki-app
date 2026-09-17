/**
 * urlSync.js
 * URLパラメータ(?birthday=YYYY-MM-DD)と入力フォームの同期を担当する。
 */
(function () {
  window.MayaApp = window.MayaApp || {};

  /** URLパラメータ ?birthday=YYYY-MM-DD を更新する（履歴は増やさない） */
  function syncUrl(year, month, day) {
    const params = new URLSearchParams();
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    params.set('birthday', `${year}-${mm}-${dd}`);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }

  /** URLパラメータ ?kin=1-260 を更新する（履歴は増やさない） */
  function syncKinUrl(kin) {
    const params = new URLSearchParams();
    params.set('kin', String(kin));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }

  /**
   * 入力フィールドに値を反映するヘルパー
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @param {Record<string, HTMLElement>} els
   */
  function fillInputs(year, month, day, els) {
    els.year.value = year;
    els.month.value = month;
    els.day.value = day;
    els.datePicker.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    els.inputKin.value = '';
  }

  /**
   * KIN番号の入力欄に値を反映し、生年月日側の入力はクリアするヘルパー。
   * @param {number} kin
   * @param {Record<string, HTMLElement>} els
   */
  function fillKinInput(kin, els) {
    els.inputKin.value = kin;
    els.year.value = '';
    els.month.value = '';
    els.day.value = '';
    els.datePicker.value = '';
  }

  /**
   * URLパラメータ ?birthday=YYYY-MM-DD を読み取る。
   * @returns {{year: number, month: number, day: number} | null}
   */
  function getBirthdayFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const birthday = params.get('birthday');
    if (birthday && /^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      const [year, month, day] = birthday.split('-').map(Number);
      return { year, month, day };
    }
    return null;
  }

  /**
   * URLパラメータ ?kin=1-260 を読み取る。
   * @returns {number | null}
   */
  function getKinFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const kin = Number(params.get('kin'));
    if (Number.isInteger(kin) && kin >= 1 && kin <= 260) {
      return kin;
    }
    return null;
  }

  window.MayaApp.syncUrl = syncUrl;
  window.MayaApp.syncKinUrl = syncKinUrl;
  window.MayaApp.fillInputs = fillInputs;
  window.MayaApp.fillKinInput = fillKinInput;
  window.MayaApp.getBirthdayFromUrl = getBirthdayFromUrl;
  window.MayaApp.getKinFromUrl = getKinFromUrl;
})();
