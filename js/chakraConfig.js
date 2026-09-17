/**
 * chakraConfig.js
 * 紋章とチャクラ系統の対応関係を管理する設定ファイル。
 *
 * 目的：チャクラの分類ロジック（どの紋章がどのチャクラ系に属するか）を
 * 計算ロジック本体（mayaCalc.js）から分離し、将来の見解の変更や
 * 別の分類体系への切り替えを容易にするためのファイル。
 *
 * 編集方法：
 *  - CHAKRA_GROUPS の各配列に紋章番号(1-20)を追加・削除することで分類を変更できる。
 *  - 各グループには名称(label)・対応する部位(part)・簡単な解説(description)を持たせている。
 */

(function () {
window.MayaApp = window.MayaApp || {};

/** @typedef {{ key: string, label: string, part: string, description: string, seals: number[] }} ChakraGroup */

/** @type {ChakraGroup[]} */
const CHAKRA_GROUPS = [
  {
    key: 'chakra0',
    label: 'チャクラ0系',
    part: '頭頂（クラウン）',
    description: '宇宙・大いなる存在とつながる、目に見えない世界からエネルギーを受け取るタイプ。',
    seals: [20, 5, 10, 15], // 黄色い太陽・赤い蛇・白い犬・青い鷲
  },
  {
    key: 'chakra1',
    label: 'チャクラ1系',
    part: '喉（スロート）',
    description: 'コミュニケーション能力が鍵となる、伝える・つなぐことが得意なタイプ。',
    seals: [1, 6, 11, 16], // 赤い龍・白い世界の橋渡し・青い猿・黄色い戦士
  },
  {
    key: 'chakra2',
    label: 'チャクラ2系',
    part: '心臓（ハート）',
    description: '人を癒し、心を動かすことに長けた、ハートで生きるタイプ。',
    seals: [2, 7, 12, 17], // 白い風・青い手・黄色い人・赤い地球
  },
  {
    key: 'chakra3',
    label: 'チャクラ3系',
    part: '太陽叢（ソーラープレクサス）',
    description: '行動力・実行力に優れ、現実を動かしていく力を持つタイプ。',
    seals: [3, 8, 13, 18], // 青い夜・黄色い星・赤い空歩く人・白い鏡
  },
  {
    key: 'chakra4',
    label: 'チャクラ4系',
    part: '丹田（おへその下）',
    description: '生命力・本能の強さで物事を生み出していく、土台となるタイプ。',
    seals: [4, 9, 14, 19], // 黄色い種・赤い月・白い魔法師・青い嵐
  },
];

/**
 * 紋章番号からチャクラ系統のグループを取得する。
 * @param {number} sealId 紋章番号(1-20)
 * @returns {ChakraGroup}
 */
function getChakraGroupBySeal(sealId) {
  const group = CHAKRA_GROUPS.find((g) => g.seals.includes(sealId));
  if (!group) {
    throw new Error(`紋章番号 ${sealId} に対応するチャクラ系が見つかりません。`);
  }
  return group;
}

window.MayaApp.CHAKRA_GROUPS = CHAKRA_GROUPS;
window.MayaApp.getChakraGroupBySeal = getChakraGroupBySeal;
})();
