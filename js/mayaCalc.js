/**
 * mayaCalc.js
 * マヤ暦（ツォルキン暦）KIN番号にまつわる計算ロジックをまとめたモジュール。
 * UI（main.js）からはこのモジュールの関数だけを呼べば、紋章・音・関係KIN等が
 * すべて求められるようにしている。
 *
 * file:// で直接開いた場合でもESモジュールのCORS制限なく動作させるため、
 * import/export ではなく通常の<script>読み込み＋共通名前空間(window.MayaApp)方式を採用している。
 */

(function () {
window.MayaApp = window.MayaApp || {};
const SEALS = window.MayaApp.SEALS;
const getChakraGroupBySeal = window.MayaApp.getChakraGroupBySeal;
const getCastleInfo = window.MayaApp.getCastleInfo;

/**
 * 計算の基準点（1900-01-01）。
 * この日からの経過日数を数え、後述の「うるう日補正」を加えた値を
 * 260で割った余りからKINを求める。
 */
const REFERENCE_DATE = new Date(Date.UTC(1900, 0, 1));

/**
 * KINの剰余計算で使うオフセット定数。
 * 検証済みの実例から逆算して特定した値。
 *  - 1983-11-07 = KIN238
 *  - 2026-06-27 = KIN200
 *  - 1984-03-28 = KIN120（うるう年の3/31・4/1のうるう日補正を検証した実例）
 * （いずれもうるう日補正を適用したうえで一致することを確認済み）
 */
const KIN_OFFSET = 208;

/** 1日のミリ秒数 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * 0以上の剰余を返す mod 関数（JSの % は負数で負の値を返すため）
 * @param {number} n
 * @param {number} m
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * 年月日（ローカルなカレンダー上の日付）からUTC日付オブジェクトを作る。
 * 時刻情報を持たせず日付だけで扱うことで、タイムゾーンによるズレを防ぐ。
 * @param {number} year
 * @param {number} month 1-12
 * @param {number} day
 */
function makeUTCDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * 西暦年がうるう年かどうかを判定する。
 * @param {number} year
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 1900-01-01から指定日までの間に存在する「うるう年の4/1」の数を数える。
 * マヤ暦のKINカウントでは「うるう年の3/31と4/1は同じKIN番号」とする運用ルールがあるため、
 * 4/1を迎えるたびにKINのカウントを1日分減らす（足し戻す）補正が必要になる。
 * この関数はその補正量（=これまでに発生した「4/1の繰り延べ」の回数）を返す。
 * @param {Date} dateUTC
 */
function countLeapDayAdjustments(dateUTC) {
  let count = 0;
  for (let year = REFERENCE_DATE.getUTCFullYear(); year <= dateUTC.getUTCFullYear(); year++) {
    if (isLeapYear(year)) {
      const april1 = Date.UTC(year, 3, 1); // 4月1日(月は0始まりなので3)
      if (april1 <= dateUTC.getTime()) {
        count++;
      }
    }
  }
  return count;
}

/**
 * 指定した日付の「うるう日補正済みの経過日数（基準日からの連番）」を求める。
 * うるう年の3/31と4/1が同じ番号になるよう、4/1以降は1日分のズレを差し戻す。
 * @param {Date} dateUTC
 */
function getAdjustedDayIndex(dateUTC) {
  const rawDiffDays = Math.round((dateUTC.getTime() - REFERENCE_DATE.getTime()) / MS_PER_DAY);
  return rawDiffDays - countLeapDayAdjustments(dateUTC);
}

/**
 * 指定した日付のKIN番号(1-260)を求める。
 * うるう年の3/31と4/1は同じKIN番号になる（うるう日補正済みの連番を使うため）。
 * @param {Date} dateUTC makeUTCDate() で生成したUTC日付
 * @returns {number} KIN番号 1〜260
 */
function getKinFromDate(dateUTC) {
  const adjustedIndex = getAdjustedDayIndex(dateUTC);
  return mod(adjustedIndex - KIN_OFFSET, 260) + 1;
}

/**
 * KIN番号から太陽の紋章番号(1-20)を求める。
 * @param {number} kin
 */
function getSealId(kin) {
  return mod(kin - 1, 20) + 1;
}

/**
 * KIN番号から銀河の音(1-13)を求める。
 * @param {number} kin
 */
function getTone(kin) {
  return mod(kin - 1, 13) + 1;
}

/**
 * KIN番号からウェイブスペル番号(1-20)と、そのウェイブスペルの紋章を求める。
 * ウェイブスペルは13KINごとのまとまりで、そのまとまりの最初のKIN(音1)の紋章が
 * ウェイブスペル名として使われる。
 * @param {number} kin
 */
function getWavespell(kin) {
  const wavespellNumber = Math.floor((kin - 1) / 13) + 1; // 1-20
  const startKin = (wavespellNumber - 1) * 13 + 1; // そのウェイブスペルの音1のKIN
  const sealId = getSealId(startKin);
  return { wavespellNumber, seal: SEALS[sealId], startKin };
}

/**
 * 紋章番号(seal)と銀河の音(tone)の組から、対応する唯一のKIN番号(1-260)を求める。
 * 20と13は互いに素なので、(seal, tone) の組とKIN(1-260)は1対1に対応する（中国剰余定理）。
 * @param {number} sealId 1-20
 * @param {number} tone 1-13
 * @returns {number} KIN番号 1-260
 */
function getKinFromSealAndTone(sealId, tone) {
  for (let kin = 1; kin <= 260; kin++) {
    if (getSealId(kin) === sealId && getTone(kin) === tone) {
      return kin;
    }
  }
  // 数学的に必ず見つかるためここには到達しない
  throw new Error('対応するKINが見つかりませんでした。');
}

/**
 * 鏡の向こうKIN: 261 - KIN
 * @param {number} kin
 */
function getMirrorKin(kin) {
  return 261 - kin;
}

/**
 * 絶対反対KIN: KIN + 130（260を超えたら260を引く）
 * @param {number} kin
 */
function getOppositeKin(kin) {
  const value = kin + 130;
  return value > 260 ? value - 260 : value;
}

/**
 * ガイドKINを求める。
 * 銀河の音によって紋章からのオフセットが決まり、同じ音のまま紋章だけがずれる。
 *  - 音 1, 6, 11 → 紋章+0（紋章は変わらない）
 *  - 音 2, 7, 12 → 紋章+12
 *  - 音 3, 8, 13 → 紋章+4
 *  - 音 4, 9     → 紋章+16
 *  - 音 5, 10    → 紋章+8
 * （1983-11-07＝KIN238／【18】白い鏡／音4の場合にガイドが【14】白い魔法師になることで検証済み）
 * @param {number} kin
 */
function getGuideKin(kin) {
  const sealId = getSealId(kin);
  const tone = getTone(kin);

  /** @type {Record<number, number>} 音 → 紋章オフセット */
  const offsetByTone = {
    1: 0, 6: 0, 11: 0,
    2: 12, 7: 12, 12: 12,
    3: 4, 8: 4, 13: 4,
    4: 16, 9: 16,
    5: 8, 10: 8,
  };

  const offset = offsetByTone[tone];
  const guideSealId = mod(sealId - 1 + offset, 20) + 1;
  return getKinFromSealAndTone(guideSealId, tone);
}

/**
 * 類似KINを求める（同じ音のまま、紋章だけ「19 - 紋章番号」に対応する紋章に変わる）。
 * 19から引いた結果が0以下の場合は20を足して1-20の範囲に補正する。
 * @param {number} kin
 */
function getAnalogKin(kin) {
  const sealId = getSealId(kin);
  const tone = getTone(kin);
  let analogSealId = 19 - sealId;
  if (analogSealId <= 0) {
    analogSealId += 20;
  }
  return getKinFromSealAndTone(analogSealId, tone);
}

/**
 * 神秘KINを求める（同じ音のまま、紋章だけ「21 - 紋章番号」に対応する紋章に変わる）。
 * @param {number} kin
 */
function getMysticKin(kin) {
  const sealId = getSealId(kin);
  const tone = getTone(kin);
  const mysticSealId = 21 - sealId; // 紋章は1-20なので常に1-20の範囲に収まる
  return getKinFromSealAndTone(mysticSealId, tone);
}

/**
 * あるKINを基準に、鏡の向こうKIN・絶対反対KIN・反対KIN（紋章）・ガイドKIN（紋章）・
 * 類似KIN（紋章）・神秘KIN（紋章）をまとめて求める。
 * 太陽の紋章についても、ウェイブスペル（の音1にあたるKIN）についても、
 * 同じ考え方で計算できるよう共通化している。
 * @param {number} kin
 */
function buildRelations(kin) {
  const mirrorKin = getMirrorKin(kin);
  const oppositeKin = getOppositeKin(kin);
  const guideKin = getGuideKin(kin);
  const analogKin = getAnalogKin(kin);
  const mysticKin = getMysticKin(kin);

  return {
    mirrorKin,
    oppositeKin,
    // 絶対反対KINと同じKINだが、紋章名で見せるための「反対KIN」
    oppositeSeal: SEALS[getSealId(oppositeKin)],
    guideKin,
    guideSeal: SEALS[getSealId(guideKin)],
    analogKin,
    analogSeal: SEALS[getSealId(analogKin)],
    mysticKin,
    mysticSeal: SEALS[getSealId(mysticKin)],
  };
}

/**
 * KINを1-20ごとに区切ったとき、そのKINが何番目のグループに属するかを求める。
 * 例：KIN238 → 238/20 = 11.9 → 12番目のグループ
 * @param {number} kin
 */
function getKinGroupOf20(kin) {
  return Math.ceil(kin / 20);
}

/**
 * 黒KIN: ツォルキン表で背景が黒く塗られている52個のKIN番号（提供元の一覧に基づく固定リスト）。
 * @type {Set<number>}
 */
const BLACK_KINS = new Set([
  1, 20, 22, 39, 43, 50, 51, 58, 64, 69, 72, 77, 85, 88, 93, 96,
  106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
  146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
  165, 168, 173, 176, 184, 189, 192, 197, 203, 210, 211, 218, 222, 239, 241, 260,
]);

/**
 * 指定したKINが黒KINかどうかを判定する。
 * @param {number} kin
 * @returns {boolean}
 */
function isBlackKin(kin) {
  return BLACK_KINS.has(kin);
}

/**
 * 角黒KIN: 黒KINのうちツォルキン表の四隅にあたる4個(1・20・241・260)。
 * @type {Set<number>}
 */
const CORNER_BLACK_KINS = new Set([1, 20, 241, 260]);

/**
 * 指定したKINが角黒KINかどうかを判定する。
 * @param {number} kin
 * @returns {boolean}
 */
function isCornerBlackKin(kin) {
  return CORNER_BLACK_KINS.has(kin);
}

/**
 * 極性KIN・絶対拡張KIN・ナルシストKIN・よりナルシストKIN・特殊KINを判定する。
 * 判定条件（学習コンテンツの提供元定義に準拠）:
 *  - 極性KIN: チャクラ第0系（紋章5・10・15・20）× 銀河の音3・4・10・11
 *  - 絶対拡張KIN: KINが19の倍数
 *  - ナルシストKIN／よりナルシストKIN: 太陽の紋章の紋章番号とウェイブスペルの紋章番号の
 *    合計が19（ナルシストKIN）または21（よりナルシストKIN）になるもの。
 *    紋章20は伝統的な0-19表記に合わせて「0」としても扱い、その組み合わせも判定に含める
 *    （例: KIN80は紋章20を0として扱うことでウェイブスペル紋章19との合計が19になる）。
 *  - 特殊KIN: ナルシストKIN／よりナルシストKINのうち銀河の音が2のもの（KIN41・80・171・210のみ）
 * @param {number} kin
 * @returns {{key: string, label: string}[]}
 */
function getSpecialClassifications(kin) {
  const sealId = getSealId(kin);
  const tone = getTone(kin);
  const chakra = getChakraGroupBySeal(sealId);
  const waveSealId = getWavespell(kin).seal.id;

  const classifications = [];

  if (chakra.key === 'chakra0' && [3, 4, 10, 11].includes(tone)) {
    classifications.push({ key: 'polarity', label: '極性KIN' });
  }

  if (kin % 19 === 0) {
    classifications.push({ key: 'absoluteExpansion', label: '絶対拡張KIN' });
  }

  const sealValues = sealId === 20 ? [20, 0] : [sealId];
  const waveValues = waveSealId === 20 ? [20, 0] : [waveSealId];
  let isNarcissist19 = false;
  let isNarcissist21 = false;
  sealValues.forEach((sv) => {
    waveValues.forEach((wv) => {
      const sum = sv + wv;
      if (sum === 19) isNarcissist19 = true;
      if (sum === 21) isNarcissist21 = true;
    });
  });

  if (isNarcissist19) {
    classifications.push({ key: 'narcissist', label: 'ナルシストKIN' });
  }
  if (isNarcissist21) {
    classifications.push({ key: 'narcissistMore', label: 'よりナルシストKIN' });
  }
  if ((isNarcissist19 || isNarcissist21) && tone === 2) {
    classifications.push({ key: 'special', label: '特殊KIN' });
  }

  return classifications;
}

/**
 * KIN番号から、そのKINにまつわる情報をすべてまとめて返す。
 * @param {number} kin
 */
function buildKinProfile(kin) {
  const sealId = getSealId(kin);
  const seal = SEALS[sealId];
  const tone = getTone(kin);
  const kinGroupOf20 = getKinGroupOf20(kin);
  const wavespell = getWavespell(kin);
  const chakra = getChakraGroupBySeal(sealId);
  const { castle, position } = getCastleInfo(kin);

  const sealRelations = buildRelations(kin);

  // 音1のKINはウェイブスペルの音1（起点）と本人のKINが一致してしまい、
  // 「関係性【ウェイブスペル】」が「関係性【太陽の紋章】」と同じ内容になるため、
  // 代わりに鏡の向こうKINのウェイブスペルを求めておく（main.js側で音1のときのみ使用）。
  const mirrorWavespell = getWavespell(sealRelations.mirrorKin);

  return {
    kin,
    seal,
    tone,
    kinGroupOf20,
    wavespell,
    chakra,
    castle,
    castlePosition: position,
    // 太陽の紋章についての関連KIN
    sealRelations,
    // ウェイブスペル（音1にあたるKIN）についての関連KIN
    wavespellRelations: buildRelations(wavespell.startKin),
    // 鏡の向こうKINのウェイブスペルとその関連KIN（音1の代替表示用）
    mirrorWavespell,
    mirrorWavespellRelations: buildRelations(mirrorWavespell.startKin),
    // 極性KIN・絶対拡張KIN・ナルシストKIN・特殊KINなどの特殊分類
    specialClassifications: getSpecialClassifications(kin),
    // 黒KIN（ツォルキン表で背景が黒いKIN）かどうか
    isBlackKin: isBlackKin(kin),
    // 角黒KIN（黒KINのうち四隅にあたる1・20・241・260）かどうか
    isCornerBlackKin: isCornerBlackKin(kin),
  };
}

window.MayaApp.makeUTCDate = makeUTCDate;
window.MayaApp.isLeapYear = isLeapYear;
window.MayaApp.getKinFromDate = getKinFromDate;
window.MayaApp.getSealId = getSealId;
window.MayaApp.getTone = getTone;
window.MayaApp.getWavespell = getWavespell;
window.MayaApp.getKinFromSealAndTone = getKinFromSealAndTone;
window.MayaApp.getMirrorKin = getMirrorKin;
window.MayaApp.getOppositeKin = getOppositeKin;
window.MayaApp.getGuideKin = getGuideKin;
window.MayaApp.getAnalogKin = getAnalogKin;
window.MayaApp.getMysticKin = getMysticKin;
window.MayaApp.getSpecialClassifications = getSpecialClassifications;
window.MayaApp.isBlackKin = isBlackKin;
window.MayaApp.isCornerBlackKin = isCornerBlackKin;
window.MayaApp.buildKinProfile = buildKinProfile;
})();
