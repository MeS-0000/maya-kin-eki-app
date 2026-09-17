/**
 * castleData.js
 * 260KINを52日ずつ5分割した「城（52年/52日サイクル）」のデータ。
 * 第1の城〜第5の城が、260日（あるいは260年の年廻り）を巡る大きな物語のステージを表す。
 */

(function () {
window.MayaApp = window.MayaApp || {};

/** @typedef {{ id: number, label: string, color: string, theme: string }} Castle */

/** @type {Castle[]} */
const CASTLES = [
  { id: 1, label: '第1の城', color: '赤', theme: '種をまく：起点・始まり・気づき' },
  { id: 2, label: '第2の城', color: '白', theme: '洗練する：試練・浄化・鍛錬' },
  { id: 3, label: '第3の城', color: '青', theme: '変容する：変化・成長・進化' },
  { id: 4, label: '第4の城', color: '黄', theme: '熟成する：結果・実り・調和' },
  { id: 5, label: '第5の城', color: '緑', theme: '解放する：統合・完結・次のステージへ' },
];

/**
 * KIN番号(1-260)から、所属する城とその城内での順番(1-52)を求める。
 * @param {number} kin
 * @returns {{ castle: Castle, position: number }}
 */
function getCastleInfo(kin) {
  const castleIndex = Math.floor((kin - 1) / 52); // 0-4
  const position = ((kin - 1) % 52) + 1; // 1-52
  return { castle: CASTLES[castleIndex], position };
}

window.MayaApp.CASTLES = CASTLES;
window.MayaApp.getCastleInfo = getCastleInfo;
})();
