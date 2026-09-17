/**
 * cycleTable.js
 * 年廻り一覧表（0歳〜51歳・52年分）の計算・描画を担当する。
 * 1年につき2行で表示し、1行目に紋章等の情報、2行目にその年のKINに対応する易を表示する。
 */
(function () {
  window.MayaApp = window.MayaApp || {};
  const getYearForecast = window.MayaApp.getYearForecast;
  const renderSealLabel = window.MayaApp.renderSealLabel;
  const getSealColorKey = window.MayaApp.getSealColorKey;
  const getIchingByKin = window.MayaApp.getIchingByKin;

  /** 年廻り一覧表の対象年数（0歳〜51歳＝52年分） */
  const YEAR_RANGE = 52;

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

  /**
   * 年廻り一覧表を描画する。0歳〜51歳（52年分）のKIN・紋章・音・易を一覧表示する。
   * 1年につき2行を出力する（1行目: 年月日・年齢・KIN・音・紋章・ウェイブスペル、
   * 2行目: その年のKINに対応する易＝卦・よみかた・イメージ・メッセージ）。
   * @param {number} birthYear
   * @param {number} birthMonth
   * @param {number} birthDay
   * @param {Record<string, HTMLElement>} els
   */
  function renderCycleTable(birthYear, birthMonth, birthDay, els) {
    const currentAge = getCurrentAge(birthYear, birthMonth, birthDay);

    const rows = [];
    for (let age = 0; age < YEAR_RANGE; age++) {
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
    els.cycleTableBody.innerHTML = rows.join('');
    els.cycleCard.classList.remove('hidden');
  }

  window.MayaApp.getCurrentAge = getCurrentAge;
  window.MayaApp.renderCycleTable = renderCycleTable;
})();
