/**
 * shareActions.js
 * シェア(X/LINE)・印刷・結果URLコピーの各ボタンの挙動を担当する。
 */
(function () {
  window.MayaApp = window.MayaApp || {};

  /**
   * シェア文言を組み立てる。
   * @param {Record<string, HTMLElement>} els
   */
  function getShareText(els) {
    const kinText = els.resultKin.textContent;
    const sealText = `${els.resultHeadlineSealNumber.textContent}${els.resultHeadlineSealName.textContent}`;
    return `${kinText} ${sealText}｜マヤをまなぶ で診断しました`;
  }

  /**
   * シェア(X/LINE)・印刷・URLコピーの各ボタンにイベントを紐付ける。
   * @param {Record<string, HTMLElement>} els
   */
  function bindShareActions(els) {
    els.shareX.addEventListener('click', () => {
      const text = encodeURIComponent(getShareText(els));
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener');
    });

    els.shareLine.addEventListener('click', () => {
      const text = encodeURIComponent(`${getShareText(els)} ${window.location.href}`);
      window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank', 'noopener');
    });

    els.btnPrint.addEventListener('click', () => {
      window.print();
    });

    els.btnCopyUrl.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        els.btnCopyUrl.textContent = 'コピーしました';
        setTimeout(() => {
          els.btnCopyUrl.textContent = '結果のURLをコピー';
        }, 1800);
      } catch (e) {
        alert('URLのコピーに失敗しました。お使いのブラウザでは対応していない可能性があります。');
      }
    });
  }

  window.MayaApp.bindShareActions = bindShareActions;
})();
