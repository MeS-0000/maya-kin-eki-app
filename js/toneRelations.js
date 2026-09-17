/**
 * toneRelations.js
 * 銀河の音(1-13)同士の関係性（倍音関係・補完関係・協和関係・連携関係）と、
 * それぞれの一言キーワードを求めるモジュール。
 * 出典: https://mayalearningsociety.com/galactic-tones-relationship/
 */
(function () {
  window.MayaApp = window.MayaApp || {};

  /**
   * 倍音関係のグループ（音の差が5ずつになるまとまり）と、そのタイプを表すキーワード。
   * @type {{ tones: number[], keyword: string }[]}
   */
  const HARMONIC_GROUPS = [
    { tones: [1, 6, 11], keyword: '主導型・リーダータイプ' },
    { tones: [2, 7, 12], keyword: '直感型。好きなものがはっきりしている' },
    { tones: [3, 8, 13], keyword: 'ハイブリッド型。一人での決断が苦手で、人に合わせる' },
    { tones: [4, 9], keyword: 'スペシャリスト型' },
    { tones: [5, 10], keyword: '縁の下の力持ち型' },
  ];

  /**
   * 補完関係（音の和が14）における、各音1つ1つの一言キーワード。
   * @type {Record<number, string>}
   */
  const COMPLEMENT_KEYWORDS = {
    1: '意志が強い',
    2: '分ける',
    3: 'くっつける',
    4: '好きなものを追求する',
    5: '中心を定める',
    6: 'マイペースな',
    7: '自己完結型',
    8: '協調性が高い',
    9: '拡張拡大のエネルギーが強い',
    10: 'バックアップが得意な',
    11: '破壊する',
    12: '共有する',
    13: '迷いが多い',
  };

  /**
   * 協和関係のグループ（音の差が4ずつになるまとまり）と、そのタイプを表すキーワード。
   * @type {{ tones: number[], keyword: string }[]}
   */
  const HARMONY_GROUPS = [
    { tones: [1, 5, 9, 13], keyword: '目的志向。紋章とウェイブスペルの色が同じで、シンプルな目標設定が◎' },
    { tones: [2, 6, 10], keyword: 'チャレンジ・テーマ志向。新しいやり方や新規プロジェクトが◎' },
    { tones: [3, 7, 11], keyword: '奉仕・貢献志向。紋章とウェイブスペルの色が反対で、奉仕と打算のせめぎ合い' },
    { tones: [4, 8, 12], keyword: '絆・つながり志向。心のつながりで動く' },
  ];

  /** 連携関係の一言キーワード（音によらず共通）。 */
  const LINKED_KEYWORD = '円滑なコミュニケーション。スムーズなやり取りができ、流れを作りやすい関係';

  /**
   * 音が属するグループ（{tones, keyword}）を探す。
   * @param {{ tones: number[], keyword: string }[]} groups
   * @param {number} tone
   */
  function findGroup(groups, tone) {
    return groups.find((g) => g.tones.includes(tone));
  }

  /**
   * 倍音関係にある音とキーワードを求める（音の差が5のグループ内の他の音）。
   * @param {number} tone 1-13
   */
  function getHarmonicRelation(tone) {
    const group = findGroup(HARMONIC_GROUPS, tone);
    return { tones: group.tones.filter((t) => t !== tone), keyword: group.keyword };
  }

  /**
   * 補完関係にある音とキーワードを求める（音の和が14になる音。音7のみ自分自身と完結する）。
   * @param {number} tone 1-13
   */
  function getComplementRelation(tone) {
    const partnerTone = 14 - tone;
    const keyword = partnerTone === tone
      ? '自己完結型で、自分の中で補完関係が完成する'
      : `${COMPLEMENT_KEYWORDS[tone]} ⇔ ${COMPLEMENT_KEYWORDS[partnerTone]}`;
    return { tone: partnerTone, keyword };
  }

  /**
   * 協和関係にある音とキーワードを求める（音の差が4のグループ内の他の音）。
   * @param {number} tone 1-13
   */
  function getHarmonyRelation(tone) {
    const group = findGroup(HARMONY_GROUPS, tone);
    return { tones: group.tones.filter((t) => t !== tone), keyword: group.keyword };
  }

  /**
   * 連携関係にある音とキーワードを求める（自分の音を中心に、前後2つまでの音。1-13で周期的に扱う）。
   * @param {number} tone 1-13
   */
  function getLinkedRelation(tone) {
    const tones = [-2, -1, 1, 2].map((offset) => ((tone - 1 + offset + 13 * 10) % 13) + 1);
    return { tones, keyword: LINKED_KEYWORD };
  }

  /**
   * 音(1-13)から、倍音関係・補完関係・協和関係・連携関係（相手の音＋一言キーワード）をまとめて返す。
   * @param {number} tone 1-13
   */
  function getToneRelations(tone) {
    return {
      harmonic: getHarmonicRelation(tone),
      complement: getComplementRelation(tone),
      harmony: getHarmonyRelation(tone),
      linked: getLinkedRelation(tone),
    };
  }

  window.MayaApp.getToneRelations = getToneRelations;
})();
