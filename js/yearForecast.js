/**
 * yearForecast.js
 * 「年廻り」機能：誕生月日はそのままに、対象年のKIN（その年のあなたのテーマ）を求め、
 * 簡単な解説文を自動生成するためのモジュール。
 */

(function () {
window.MayaApp = window.MayaApp || {};
const makeUTCDate = window.MayaApp.makeUTCDate;
const getKinFromDate = window.MayaApp.getKinFromDate;
const buildKinProfile = window.MayaApp.buildKinProfile;
const isLeapYear = window.MayaApp.isLeapYear;

/**
 * 0以上の剰余を返す mod 関数（JSの % は負数で負の値を返すため）
 * @param {number} n
 * @param {number} m
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * 3月生まれの年廻り計算における、うるう年のズレを補正する。
 * うるう年補正（3/31=4/1）は3月の日付では自分の年が対象にならないため、
 * 生年と対象年でうるう年かどうかが食い違うと1KINずれてしまう。
 *  - 3月生まれ・生年がうるう年でない人 → 対象年がうるう年のときだけKIN-1
 *  - 3月生まれ・生年がうるう年の人 　→ 対象年がうるう年でないときだけKIN+1
 * @param {number} kin
 * @param {number} birthYear
 * @param {number} targetYear
 * @param {number} birthMonth
 */
function applyMarchLeapCorrection(kin, birthYear, targetYear, birthMonth) {
  if (birthMonth !== 3) return kin;
  const correction = (isLeapYear(birthYear) ? 1 : 0) - (isLeapYear(targetYear) ? 1 : 0);
  if (correction === 0) return kin;
  return mod(kin - 1 + correction, 260) + 1;
}

/**
 * 紋章キーワードからテーマ文を組み立てるための簡易テンプレート。
 * 紋章のキーワード・ウェイブスペルのキーワード・銀河の音から、
 * 「〇〇と〇〇の年」という形の一言解説を自動生成する。
 */
function buildDescription(profile) {
  const sealTheme = profile.seal.keyword.split('・')[0];
  const waveTheme = profile.wavespell.seal.keyword.split('・')[1] || profile.wavespell.seal.keyword.split('・')[0];

  const toneFeel = profile.tone <= 4
    ? '土台を整える'
    : profile.tone <= 9
      ? '動きが活発になる'
      : '完成・統合に向かう';

  return `『${sealTheme}と${waveTheme}の年』 — 音${profile.tone}は${toneFeel}タイミング。${profile.castle.label}（${profile.castle.theme}）の${profile.castlePosition}番目にあたる1年です。`;
}

/**
 * 対象年の年廻りKIN情報を求める。
 * @param {number} targetYear 対象年（西暦）
 * @param {number} birthYear 誕生年（西暦。3月生まれのうるう年ズレ補正に使用）
 * @param {number} birthMonth 誕生月(1-12)
 * @param {number} birthDay 誕生日(1-31)
 */
function getYearForecast(targetYear, birthYear, birthMonth, birthDay) {
  const date = makeUTCDate(targetYear, birthMonth, birthDay);
  const rawKin = getKinFromDate(date);
  const kin = applyMarchLeapCorrection(rawKin, birthYear, targetYear, birthMonth);
  const profile = buildKinProfile(kin);
  const description = buildDescription(profile);
  return Object.assign({}, profile, { description });
}

window.MayaApp.getYearForecast = getYearForecast;
})();
