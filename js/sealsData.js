/**
 * sealsData.js
 * マヤ暦（ツォルキン暦）20の太陽の紋章データ。
 * 紋章番号は1〜20。Dreamspell系の一般的な並び順に準拠。
 *
 * window.MayaApp 名前空間にロジックをまとめている。
 * file:// で直接開いた場合でもESモジュールのCORS制限なく動作させるため、
 * import/export ではなく通常の<script>読み込み＋共通名前空間方式を採用している。
 * 各ファイルはIIFEで囲み、ファイル間でグローバル変数名が衝突しないようにしている。
 */
(function () {
  window.MayaApp = window.MayaApp || {};

  /** @typedef {{ id: number, name: string, keyword: string }} Seal */

  /** @type {Seal[]} 紋章番号1〜20に対応する配列（index 0 は使わず、id をそのまま添字に使う） */
  const SEALS = [
    null, // index 0 は未使用（紋章は1始まり）
    { id: 1, name: '赤い龍', keyword: '誕生・養育' },
    { id: 2, name: '白い風', keyword: '精神・コミュニケーション' },
    { id: 3, name: '青い夜', keyword: '豊かさ・直感' },
    { id: 4, name: '黄色い種', keyword: '開花・気づき' },
    { id: 5, name: '赤い蛇', keyword: '生命力・本能' },
    { id: 6, name: '白い世界の橋渡し', keyword: '橋渡し・死と再生' },
    { id: 7, name: '青い手', keyword: '達成・知恵' },
    { id: 8, name: '黄色い星', keyword: '芸術・調和' },
    { id: 9, name: '赤い月', keyword: '浄化・流れ' },
    { id: 10, name: '白い犬', keyword: '忠誠・愛' },
    { id: 11, name: '青い猿', keyword: '遊び・幻想' },
    { id: 12, name: '黄色い人', keyword: '自由意志・知性' },
    { id: 13, name: '赤い空歩く人', keyword: '探求・覚醒' },
    { id: 14, name: '白い魔法使い', keyword: '魔法・無心' },
    { id: 15, name: '青い鷲', keyword: '視野・計画' },
    { id: 16, name: '黄色い戦士', keyword: '知性・問いかけ' },
    { id: 17, name: '赤い地球', keyword: 'シンクロ・共鳴' },
    { id: 18, name: '白い鏡', keyword: '秩序・無限' },
    { id: 19, name: '青い嵐', keyword: '変容・自己発生' },
    { id: 20, name: '黄色い太陽', keyword: '悟り・生命' },
  ];

  /**
   * 紋章番号(1-20)から紋章データを取得する
   * @param {number} sealId
   * @returns {Seal}
   */
  function getSeal(sealId) {
    return SEALS[sealId];
  }

  /**
   * 紋章番号(1-20)から紋章の色（赤・白・青・黄）を求める。
   * 紋章は「赤→白→青→黄」の4色サイクルが5回繰り返される並びになっている。
   * @param {number} sealId
   * @returns {'red' | 'white' | 'blue' | 'yellow'}
   */
  const SEAL_COLOR_CYCLE = ['red', 'white', 'blue', 'yellow'];
  function getSealColorKey(sealId) {
    return SEAL_COLOR_CYCLE[(sealId - 1) % 4];
  }

  /**
   * 銀河の音 1〜13 のキーワードと特徴（補助表示用）。
   * 出典: https://cka-comfort.com/maya-relationship-1-sound/
   */
  const TONE_KEYWORDS = [
    null,
    '受容｜自分軸を持つ。決断力がある。ブレない。リーダータイプ。',
    '挑戦｜エネルギーが高い。常に目標がないとパワーが出ない。どちらかに決めたい。',
    '未知体験｜体験して覚える。人と人とを結びつける。協力体制で力を発揮する。',
    '探究｜安心、安定感。構成、編成をしてビジョンを描く。信頼されると輝きを増す。',
    '目標設定｜責任を持ちスピード感を持って取り組むことで力を発揮する。',
    '尊重｜マイペース。地に足をつける生活ができる。',
    '思い込み・フォーカス｜自分の中に反対の自分がいるので、迷いが多い。不思議なものが好き。情報がたくさん入ってくる。',
    'フォロー｜命あるものと接して生きる。無機質なものに合わない。四方八方どこへでも行く。',
    '傾聴｜元気。類まれなパワーがある。周りの人を元気づけ、勇気づける。',
    '調整｜企画、制作する能力がある。人と人とのバランスをとって形にする。',
    '初志貫徹｜エネルギーが高い。人まねしない。頑固で一途。葛藤多い改革者。',
    '共有｜カウンセラータイプ。人の話を聞いて問題解決ができる。',
    '没頭｜何でも器用にこなす。音1〜13のどの役割もできる。長期のスパンで結果を出すタイプ。',
  ];

  window.MayaApp.SEALS = SEALS;
  window.MayaApp.TONE_KEYWORDS = TONE_KEYWORDS;
  window.MayaApp.getSeal = getSeal;
  window.MayaApp.getSealColorKey = getSealColorKey;
})();
