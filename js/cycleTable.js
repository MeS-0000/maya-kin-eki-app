/**
 * cycleTable.js
 * 年廻り一覧表（0歳〜51歳・最大52年分）の計算・描画を担当する。
 * 初期表示は現在の年齢の前後5年分のみとし、「前の5年」「次の5年」ボタンで
 * 押すたびに5年分ずつ表示範囲を拡張する（最大で0歳〜51歳まで）。
 * 1年につき2行で表示し、1行目に紋章等の情報、2行目にその年のKINに対応する易を表示する。
 */
(function () {
  window.MayaApp = window.MayaApp || {};
  const getYearForecast = window.MayaApp.getYearForecast;
  const renderSealLabel = window.MayaApp.renderSealLabel;
  const getSealColorKey = window.MayaApp.getSealColorKey;
  const getIchingByKin = window.MayaApp.getIchingByKin;

  /** 年廻り一覧表で表示しうる対象年数の上限（0歳〜51歳＝52年分） */
  const YEAR_RANGE = 52;
  /** 「前の5年」「次の5年」ボタン1回あたりに追加表示する年数 */
  const EXPAND_STEP = 5;
  /** 初期表示時、現在の年齢の前後に表示する年数 */
  const INITIAL_SPAN = 5;

  /** @type {{ birthYear: number, birthMonth: number, birthDay: number, currentAge: number, startAge: number, endAge: number, els: Record<string, HTMLElement> } | null} */
  let state = null;

  /**
   * 今日時点での満年齢を求める（誕生日を迎えているかどうかを考慮）。
   * @param {number} birthYear
   * @param {number} birthMonth
   * @param {number} birthDay
   * @returns {number}
   */
  function getCurrentAge(birthYear, birthMonth, birthDay) {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    let age = today.getFullYear() - birthYear;
    const hasHadBirthdayThisYear =
      todayMonth > birthMonth || (todayMonth === birthMonth && todayDay >= birthDay);
    if (!hasHadBirthdayThisYear) {
      age -= 1;
    }
    return age;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  /**
   * startAge〜endAge分の年廻りテーブル行（1年につき2行）のHTML文字列を組み立てる。
   * @param {number} startAge
   * @param {number} endAge
   */
  function buildRows(startAge, endAge) {
    const { birthYear, birthMonth, birthDay, currentAge } = state;
    const rows = [];
    for (let age = startAge; age <= endAge; age++) {
      const year = birthYear + age;
      const forecast = getYearForecast(year, birthYear, birthMonth, birthDay);
      const iching = getIchingByKin(forecast.kin);
      const wavespellColorKey = getSealColorKey(forecast.wavespell.seal.id);
      const rowClasses = ['cycle-row-' + wavespellColorKey];
      if (age === currentAge) rowClasses.push('cycle-row-current');

      rows.push(`
        <tr class="${rowClasses.join(' ')} cycle-row-data">
          <td>${year}年${birthMonth}月${birthDay}日-</td>
          <td>${age}歳</td>
          <td>KIN${forecast.kin}</td>
          <td>音${forecast.tone}</td>
          <td>${renderSealLabel(forecast.seal)}</td>
          <td>${renderSealLabel(forecast.wavespell.seal)}</td>
        </tr>
        <tr class="${rowClasses.join(' ')} cycle-row-iching">
          <td colspan="6">易：${iching.name}（${iching.reading}）｜${iching.image}｜${iching.message}</td>
        </tr>
      `);
    }
    return rows.join('');
  }

  /** 現在のstateにもとづいてテーブル本体とボタンの表示・非表示を更新する。 */
  function renderTable() {
    const { startAge, endAge, els } = state;
    els.cycleTableBody.innerHTML = buildRows(startAge, endAge);
    els.cyclePrevBtn.classList.toggle('hidden', startAge <= 0);
    els.cycleNextBtn.classList.toggle('hidden', endAge >= YEAR_RANGE - 1);
  }

  /**
   * 年廻り一覧表を初期表示する（現在の年齢の前後5年分のみ）。
   * @param {number} birthYear
   * @param {number} birthMonth
   * @param {number} birthDay
   * @param {Record<string, HTMLElement>} els
   */
  function renderCycleTable(birthYear, birthMonth, birthDay, els) {
    const currentAge = getCurrentAge(birthYear, birthMonth, birthDay);
    const startAge = clamp(currentAge - INITIAL_SPAN, 0, YEAR_RANGE - 1);
    const endAge = clamp(currentAge + INITIAL_SPAN, 0, YEAR_RANGE - 1);
    state = { birthYear, birthMonth, birthDay, currentAge, startAge, endAge, els };
    renderTable();
    els.cycleCard.classList.remove('hidden');
  }

  /** 「前の5年」ボタン: 表示範囲の開始年齢を5年分さかのぼって再描画する。 */
  function expandPrev() {
    if (!state) return;
    state.startAge = clamp(state.startAge - EXPAND_STEP, 0, YEAR_RANGE - 1);
    renderTable();
  }

  /** 「次の5年」ボタン: 表示範囲の終了年齢を5年分進めて再描画する。 */
  function expandNext() {
    if (!state) return;
    state.endAge = clamp(state.endAge + EXPAND_STEP, 0, YEAR_RANGE - 1);
    renderTable();
  }

  /**
   * 「前の5年」「次の5年」ボタンにクリックイベントを紐付ける（ページ読み込み時に1度だけ呼ぶ）。
   * @param {Record<string, HTMLElement>} els
   */
  function bindCycleExpand(els) {
    els.cyclePrevBtn.addEventListener('click', expandPrev);
    els.cycleNextBtn.addEventListener('click', expandNext);
  }

  window.MayaApp.getCurrentAge = getCurrentAge;
  window.MayaApp.renderCycleTable = renderCycleTable;
  window.MayaApp.bindCycleExpand = bindCycleExpand;
})();
