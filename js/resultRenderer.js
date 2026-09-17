/**
 * resultRenderer.js
 * buildKinProfile() の結果を、診断結果エリア（ヘッドライン・関係性グリッドなど）の
 * DOMに反映する。13年サイクル表は cycleTable.js が担当する。
 */
(function () {
  window.MayaApp = window.MayaApp || {};
  const renderSealLabel = window.MayaApp.renderSealLabel;
  const getSealIconSrc = window.MayaApp.getSealIconSrc;
  const getIchingByKin = window.MayaApp.getIchingByKin;
  const getToneRelations = window.MayaApp.getToneRelations;
  const getSeal = window.MayaApp.getSeal;
  const getSealId = window.MayaApp.getSealId;
  const getTone = window.MayaApp.getTone;
  const getWavespell = window.MayaApp.getWavespell;
  const TONE_KEYWORDS = window.MayaApp.TONE_KEYWORDS;

  /**
   * 指定したKIN番号の「太陽の紋章／ウェイブスペル　銀河の音」を1行で表示する
   * （鏡の向こうKIN・絶対反対KINの内訳表示用）。
   * @param {number} kin
   * @param {HTMLElement} el
   */
  function renderKinKeyPoints(kin, el) {
    const seal = getSeal(getSealId(kin));
    const wavespell = getWavespell(kin);
    const tone = getTone(kin);
    el.innerHTML = `${renderSealLabel(seal)} / ${renderSealLabel(wavespell.seal)}　音${tone}`;
  }

  /**
   * ヘッドライン部の「アイコン／番号／名前」を別々のセルに分けて表示する。
   * @param {{id: number, name: string}} seal
   * @param {{icon: HTMLImageElement, number: HTMLElement, name: HTMLElement}} targets
   */
  function renderHeadlineSealCells(seal, targets) {
    targets.icon.src = getSealIconSrc(seal);
    targets.icon.alt = `${seal.name}の紋章イラスト`;
    targets.number.textContent = `【${seal.id}】`;
    targets.name.textContent = seal.name;
  }

  /**
   * ガイドKIN（紋章）・反対KIN（紋章）・類似KIN（紋章）・神秘KIN（紋章）を、
   * 対応するDOM要素にまとめて反映する。鏡の向こうKIN・絶対反対KINは
   * 太陽の紋章のときだけ渡す（ウェイブスペルでは表示しないため省略可能）。
   * ガイドKINもウェイブスペルでは表示しないため省略可能。
   * @param {ReturnType<typeof window.MayaApp.buildKinProfile>['sealRelations']} relations
   * @param {{mirror?: HTMLElement, oppositeKin?: HTMLElement, oppositeSeal: HTMLElement, guide?: HTMLElement, analog: HTMLElement, mystic: HTMLElement}} targets
   */
  function renderRelations(relations, targets) {
    if (targets.mirror) {
      targets.mirror.textContent = `KIN${relations.mirrorKin}`;
    }
    if (targets.oppositeKin) {
      targets.oppositeKin.textContent = `KIN${relations.oppositeKin}`;
    }
    if (targets.guide) {
      targets.guide.innerHTML = renderSealLabel(relations.guideSeal);
    }
    targets.oppositeSeal.innerHTML = renderSealLabel(relations.oppositeSeal);
    targets.analog.innerHTML = renderSealLabel(relations.analogSeal);
    targets.mystic.innerHTML = renderSealLabel(relations.mysticSeal);
  }

  /**
   * 極性KIN・絶対拡張KIN・ナルシストKIN・特殊KINなどの特殊分類バッジを表示する。
   * 該当するものが無ければバッジ行ごと非表示にする。
   * @param {HTMLElement} container
   * @param {{key: string, label: string}[]} classifications
   */
  function renderBadges(container, classifications) {
    if (!classifications || classifications.length === 0) {
      container.innerHTML = '';
      container.classList.add('hidden');
      return;
    }
    container.innerHTML = classifications
      .map((c) => `<span class="badge badge-${c.key}">${c.label}</span>`)
      .join('');
    container.classList.remove('hidden');
  }

  /**
   * KINプロファイルを診断結果エリアのDOMに反映する。
   * @param {ReturnType<typeof window.MayaApp.buildKinProfile>} profile
   * @param {Record<string, HTMLElement>} els
   */
  function renderResultDisplay(profile, els) {
    els.resultKin.textContent = `KIN${profile.kin}`;
    els.kinBlackBadge.classList.toggle('hidden', !profile.isBlackKin);
    els.kinBlackBadge.textContent = profile.isCornerBlackKin ? '角黒KIN' : '黒KIN';
    renderHeadlineSealCells(profile.seal, {
      icon: els.resultHeadlineSealIcon,
      number: els.resultHeadlineSealNumber,
      name: els.resultHeadlineSealName,
    });
    renderHeadlineSealCells(profile.wavespell.seal, {
      icon: els.resultHeadlineWavespellIcon,
      number: els.resultHeadlineWavespellNumber,
      name: els.resultHeadlineWavespellName,
    });
    renderBadges(els.resultBadges, profile.specialClassifications);

    // 音3のときだけ、太陽の紋章の神秘KINとウェイブスペルの類似KINが同じ紋章になるため、
    // その紋章を「追加紋章」として表示する。
    const isToneThree = profile.tone === 3;
    els.resultHeadlineExtraRow.classList.toggle('hidden', !isToneThree);
    if (isToneThree) {
      renderHeadlineSealCells(profile.sealRelations.mysticSeal, {
        icon: els.resultHeadlineExtraIcon,
        number: els.resultHeadlineExtraNumber,
        name: els.resultHeadlineExtraName,
      });
    }

    els.resultTone.textContent = `音${profile.tone}(${profile.kinGroupOf20})`;
    els.resultToneKeyword.textContent = TONE_KEYWORDS[profile.tone];

    els.sealCenter.innerHTML = renderSealLabel(profile.seal);

    els.resultChakra.textContent = profile.chakra.label;
    els.resultChakraKeyword.textContent = profile.chakra.description;
    els.resultCastle.textContent = profile.castle.label;
    els.resultCastleKeyword.textContent = profile.castle.theme;

    renderRelations(profile.sealRelations, {
      mirror: els.sealMirror,
      oppositeKin: els.sealOppositeKin,
      oppositeSeal: els.sealOppositeSeal,
      guide: els.sealGuide,
      analog: els.sealAnalog,
      mystic: els.sealMystic,
    });
    renderKinKeyPoints(profile.sealRelations.mirrorKin, els.sealMirrorDetail);
    renderKinKeyPoints(profile.sealRelations.oppositeKin, els.sealOppositeKinDetail);

    // 音1のKINは「関係性【ウェイブスペル】」が「関係性【太陽の紋章】」と同じ内容になってしまうため、
    // その場合だけ鏡の向こうKINのウェイブスペルをタイトルごと差し替えて表示する。
    const isToneOne = profile.tone === 1;
    const waveDisplay = isToneOne ? profile.mirrorWavespell : profile.wavespell;
    const waveDisplayRelations = isToneOne ? profile.mirrorWavespellRelations : profile.wavespellRelations;

    els.waveSectionTitle.textContent = isToneOne
      ? '関係性【鏡の向こうKINのウェイブスペル】'
      : '関係性【ウェイブスペル】';
    els.waveCenter.innerHTML = renderSealLabel(waveDisplay.seal);

    renderRelations(waveDisplayRelations, {
      oppositeSeal: els.waveOppositeSeal,
      analog: els.waveAnalog,
      mystic: els.waveMystic,
    });

    const toneRelations = getToneRelations(profile.tone);
    els.toneHarmonic.textContent = toneRelations.harmonic.tones.map((t) => `音${t}`).join('、');
    els.toneHarmonicKeyword.textContent = toneRelations.harmonic.keyword;
    els.toneComplement.textContent = toneRelations.complement.tone === profile.tone
      ? `音${toneRelations.complement.tone}（自己完結）`
      : `音${toneRelations.complement.tone}`;
    els.toneComplementKeyword.textContent = toneRelations.complement.keyword;
    els.toneHarmony.textContent = toneRelations.harmony.tones.map((t) => `音${t}`).join('、');
    els.toneHarmonyKeyword.textContent = toneRelations.harmony.keyword;
    els.toneLinked.textContent = toneRelations.linked.tones.map((t) => `音${t}`).join('、');
    els.toneLinkedKeyword.textContent = toneRelations.linked.keyword;

    const iching = getIchingByKin(profile.kin);
    els.resultIchingName.textContent = `${iching.name}（${iching.reading}）`;
    els.resultIchingImage.textContent = iching.image;
    els.resultIchingMessage.textContent = iching.message;

    els.resultArea.classList.remove('hidden');
    els.shareCard.classList.remove('hidden');
  }

  window.MayaApp.renderBadges = renderBadges;
  window.MayaApp.renderRelations = renderRelations;
  window.MayaApp.renderResultDisplay = renderResultDisplay;
})();
