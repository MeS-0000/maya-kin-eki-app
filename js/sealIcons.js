/**
 * sealIcons.js
 * 20の太陽の紋章それぞれに対応するイラスト画像（img/ に配置）と、
 * 紋章名表示用のHTMLを組み立てるユーティリティ。
 * 画像ファイル名は紋章ごとに用意されたものをそのまま使用している
 * （ファイル名と紋章名の表記が一部異なるものはここで対応付けている）。
 */
(function () {
  window.MayaApp = window.MayaApp || {};

  /**
   * 紋章番号(1-20) → img/ 内の画像ファイル名。
   * @type {Record<number, string>}
   */
  const SEAL_IMAGE_FILES = {
    1: '赤い龍.jpg',
    2: '白い風.jpg',
    3: '青い夜.jpg',
    4: '黄色い種.jpg',
    5: '赤い蛇.jpg',
    6: '世界の橋渡し.jpg',
    7: '青い手.jpg',
    8: '黄色い星.jpg',
    9: '赤い月.jpg',
    10: '白い犬.jpg',
    11: '青い猿.jpg',
    12: '黄色い人.jpg',
    13: '赤い空歩く人.jpg',
    14: '白い魔法使い.jpg',
    15: '青い鷲.jpg',
    16: '黄色い戦士.jpg',
    17: '赤い地球.jpg',
    18: '白い鏡.jpg',
    19: '青い嵐.jpg',
    20: '黄色い太陽.jpg',
  };

  /**
   * 紋章情報からイラスト画像のURL（img/ からの相対パス）を求める。
   * @param {{id: number, name: string}} seal
   * @returns {string}
   */
  function getSealIconSrc(seal) {
    const file = SEAL_IMAGE_FILES[seal.id];
    return `img/${encodeURIComponent(file)}`;
  }

  /**
   * 紋章情報からイラスト画像付きのHTML文字列（"<img>【id】name"）を組み立てる。
   * @param {{id: number, name: string}} seal
   * @returns {string} innerHTML用のHTML文字列
   */
  function renderSealLabel(seal) {
    const icon = `<img class="seal-icon" src="${getSealIconSrc(seal)}" alt="${seal.name}の紋章イラスト" />`;
    return `<span class="seal-label">${icon}<span>【${seal.id}】${seal.name}</span></span>`;
  }

  window.MayaApp.getSealIconSrc = getSealIconSrc;
  window.MayaApp.renderSealLabel = renderSealLabel;
})();
