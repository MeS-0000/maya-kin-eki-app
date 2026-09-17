/**
 * ichingData.js
 * KIN番号(1-260)に対応する周易六十四卦（+太極）のデータ。
 * 260KINを4KINずつ65グループに分割し、64卦＋太極（KIN129-132）を割り当てている。
 * 出典: https://misano-chiebukuro.com/ke_ichiran/
 */
(function () {
  window.MayaApp = window.MayaApp || {};

  /**
   * @typedef {{ start: number, end: number, name: string, reading: string, image: string, message: string }} IchingEntry
   * @type {IchingEntry[]}
   */
  const ICHING_TABLE = [
    { start: 1, end: 4, name: '乾為天', reading: 'けんいてん', image: '偉大なる天の象徴。', message: 'スタートさせる。自分で踏み出す。' },
    { start: 5, end: 8, name: '沢天夬', reading: 'たくてんかい', image: '強行突破NG。', message: '穏やかでポジティブな決断を積み重ねる。' },
    { start: 9, end: 12, name: '天風姤', reading: 'てんぷうこう', image: '女性はモテモテ。', message: '予期せぬ出会いを楽しむ。' },
    { start: 13, end: 16, name: '火天大有', reading: 'かてんたいゆう', image: '大いに所有、大いに輝く。', message: 'エネルギー◎。積極的に行動する。' },
    { start: 17, end: 20, name: '沢風大過', reading: 'たくふうたいか', image: '過剰。やりすぎ注意。', message: '落ち着いて状況確認、最善策を取る。' },
    { start: 21, end: 24, name: '雷天大壮', reading: 'らいてんたいそう', image: 'パワー全開で楽観的。', message: '興奮状態に陥るのをコントロールする。' },
    { start: 25, end: 28, name: '火風鼎', reading: 'かふうてい', image: 'じっくりことこと。', message: '周りと協力。知恵や技術を出し合う。' },
    { start: 29, end: 32, name: '風天小畜', reading: 'ふうてんしょうちく', image: '小さな停止。', message: '状況好転まで、忍耐強く待つ。' },
    { start: 33, end: 36, name: '雷風恒', reading: 'らいふうこう', image: '変わらないことの良さ。', message: 'チャレンジよりも安定を楽しみ喜ぶ気持ち。' },
    { start: 37, end: 40, name: '水天需', reading: 'すいてんじゅ', image: '長い順番待ち。', message: '気長に待てば吉が訪れる。' },
    { start: 41, end: 44, name: '巽為風', reading: 'そんいふう', image: '何かと迷いが生じやすい。', message: '信用できる人に相談。風を味方につけ追い風に。' },
    { start: 45, end: 48, name: '山天大畜', reading: 'さんてんたいちく', image: 'たくさんのものを蓄える。', message: '貯まってるならいけ、貯まってないなら貯めろ。' },
    { start: 49, end: 52, name: '水風井', reading: 'すいふうせい', image: '集まる。協力し合う。', message: '励まし合うような人間関係を築く。' },
    { start: 53, end: 56, name: '地天泰', reading: 'ちてんたい', image: '穏やかで安定した状態。', message: '悩みから解放される幸せな運気。感謝を忘れず。' },
    { start: 57, end: 60, name: '山風蠱', reading: 'さんぷうこ', image: '放っておくと状況悪化。', message: '適切な判断で勇気ある行動。' },
    { start: 61, end: 64, name: '天沢履', reading: 'てんたくり', image: '危険やリスクを伴う。', message: '分をわきまえた謙虚な振る舞いで状況好転。' },
    { start: 65, end: 68, name: '地風升', reading: 'ちふうしょう', image: '芽が出た状態。成長のとき。', message: '目の前のことを1つ1つ達成していく。' },
    { start: 69, end: 72, name: '兌為沢', reading: 'だいたく', image: '賑やかで愉快。わいわい。', message: '好奇心をくすぐる何かを優先するのが吉。' },
    { start: 73, end: 76, name: '天水訟', reading: 'てんすいしょう', image: '訴訟。揉め事多し。', message: '妥協し、和解。周囲と調和する。' },
    { start: 77, end: 80, name: '火沢睽', reading: 'かたくけい', image: '衝突ばかりが起こる。停滞。', message: '少しでも一致したら吉と考える。' },
    { start: 81, end: 84, name: '沢水困', reading: 'たくすいこん', image: '相当厳しい状態。', message: '抵抗せず、ひたすら忍耐で乗り切る。' },
    { start: 85, end: 88, name: '雷沢帰妹', reading: 'らいたくきまい', image: '順序を守る。結婚の卦。', message: 'ひとつひとつ順序立てて超えていく。' },
    { start: 89, end: 92, name: '火水未済', reading: 'かすいびせい', image: '準備が整っていない。', message: '来るべき日のためにコツコツと努力。' },
    { start: 93, end: 96, name: '風沢中孚', reading: 'ふうたくちゅうふ', image: '包むような愛情。', message: '1対1の関係で、世話を焼く。育てる。' },
    { start: 97, end: 100, name: '雷水解', reading: 'らいすいかい', image: '解放。苦労が報われる。', message: '問題が解決。合格、昇進。積極的に行動が◎。' },
    { start: 101, end: 104, name: '水沢節', reading: 'すいたくせつ', image: '節制、節約。適度な状態が大事。', message: 'ほどほどに。節度を持って取り組む。' },
    { start: 105, end: 108, name: '風水渙', reading: 'ふうすいかん', image: '氷が溶ける。', message: '抱えていた問題が解決。または何かが離れる。' },
    { start: 109, end: 112, name: '山沢損', reading: 'さんたくそん', image: '損して得取れ。', message: '相手に譲る気持ちがよい運気を引き寄せる。' },
    { start: 113, end: 116, name: '坎為水', reading: 'かんいすい', image: '災い転じて福となす。', message: '誠実さで困難を乗り越え、大きく成長。' },
    { start: 117, end: 120, name: '地沢臨', reading: 'ちたくりん', image: '新しいことに臨む。', message: '流れに逆らわず、柔軟性を持って対応。' },
    { start: 121, end: 124, name: '山水蒙', reading: 'さんすいもう', image: 'はっきりしない。迷いに迷う。', message: '何らかの導きを得るのが吉。学ぶとき。' },
    { start: 125, end: 128, name: '天下同人', reading: 'てんかどうじん', image: '類は友を呼ぶ。同志、仲間。', message: '気の合う仲間との行動で、不可能を可能に。' },
    { start: 129, end: 132, name: '太極', reading: 'たいきょく', image: '予期せぬ大きな力と出会う。', message: '人智を超えたできごとや現象を楽しむ。' },
    { start: 133, end: 136, name: '地水師', reading: 'ちすいし', image: '争いの中から学ぶ。軍師。', message: '自分が学ぶことで人をリードする。' },
    { start: 137, end: 140, name: '沢火革', reading: 'たくかかく', image: '衝突から変化が起こる。革命。', message: '守りたいものが壊れる or 決断から状況好転。' },
    { start: 141, end: 144, name: '天山遯', reading: 'てんざんとん', image: '引き際が肝心。', message: '潔く身を引く。円満に、きれいに締めくくる。' },
    { start: 145, end: 148, name: '離為火', reading: 'りいか', image: '火の象徴。激しく燃え上がる。', message: '激しく燃え上がる運気。冷静さを忘れない。' },
    { start: 149, end: 152, name: '沢山咸', reading: 'たくざんかん', image: '恋愛の卦。無欲、無心、純粋。', message: '恋愛・仕事・金銭、よい相性に恵まれる。' },
    { start: 153, end: 156, name: '雷火豊', reading: 'らいかほう', image: '盛大、繁盛。実り豊か。', message: '絶好調。おもしろいほどに願いが叶う。' },
    { start: 157, end: 160, name: '火山旅', reading: 'かざんりょ', image: '心の旅立ち。新たな決意。', message: '心を整える旅に出る。' },
    { start: 161, end: 164, name: '風火家人', reading: 'ふうかかじん', image: '家族や身近な人との協力関係。', message: '脇道にそれず、やるべきことに集中する。' },
    { start: 165, end: 168, name: '雷山小過', reading: 'らいざんしょうか', image: 'いっぱいいっぱい頑張る。', message: '攻めるよりも、一歩引いた様子見の気持ち。' },
    { start: 169, end: 172, name: '水火既済', reading: 'すいかきせい', image: '今が一番いい状態。', message: '万事整い、成功しやすい。謙虚に努力。' },
    { start: 173, end: 176, name: '風山漸', reading: 'ふうざんぜん', image: 'ゆっくりなペースで進展。', message: '1つずつ確実に積み重ねることで向上。' },
    { start: 177, end: 180, name: '山火賁', reading: 'さんかひ', image: '美しい夕陽の風景と着飾り。', message: '美しく着飾る。美しいものを見、触れ、聞く。' },
    { start: 181, end: 184, name: '水山蹇', reading: 'すいざんけん', image: '足が寒く進めない。非常に困難。', message: '諦めたり負けを認めたり、救いを求める。' },
    { start: 185, end: 188, name: '地火明夷', reading: 'ちかめいい', image: '傷ついた明るさ。', message: '明けない夜はない。忍耐強く過ごす。' },
    { start: 189, end: 192, name: '艮為山', reading: 'ごんいさん', image: '山のように動かない。', message: '与えられた境遇に感謝し、日々精進する。' },
    { start: 193, end: 196, name: '天雷旡妄', reading: 'てんらいむぼう', image: '澄んだ心。何かと変動。', message: 'ズルや自己中心的な考えは避ける。' },
    { start: 197, end: 200, name: '地山謙', reading: 'ちさんけん', image: '実るほど頭を垂れる稲穂かな。', message: '腰が低ければ希望が叶う。' },
    { start: 201, end: 204, name: '沢雷随', reading: 'たくらいずい', image: '従う。神や直感に従う。', message: '従うように動いていくことで導かれる。' },
    { start: 205, end: 208, name: '天地否', reading: 'てんちひ', image: '調和が取れていない。', message: '分かり合えないことから学んで進む。' },
    { start: 209, end: 212, name: '火雷噬嗑', reading: 'からいぜいごう', image: '歯に何かが挟まっている。', message: '障害を取り除いてすっきり。' },
    { start: 213, end: 216, name: '沢地萃', reading: 'たくちすい', image: '商売繁盛。繁栄のとき。', message: '大勢の人がいる場所で良いご縁が。' },
    { start: 217, end: 220, name: '震為雷', reading: 'しんいらい', image: '雷の象徴。活発。勢いがある。', message: '非常にタフ。何事もパワフルに取り組む。' },
    { start: 221, end: 224, name: '火地晋', reading: 'かちしん', image: '日が昇る。とてもよい運気。', message: '思い通りに物事がはかどる。絶好調。' },
    { start: 225, end: 228, name: '風雷益', reading: 'ふうらいえき', image: '利益。実りがある。充実。', message: '状況好転。一発逆転。思い切った挑戦◎。' },
    { start: 229, end: 232, name: '雷地豫', reading: 'らいちよ', image: '喜び、満足。あらかじめする。', message: '準備してきたことを実行に移す。' },
    { start: 233, end: 236, name: '水雷屯', reading: 'すいらいちゅん', image: '産む苦しみ。芽生え。', message: '希望を持って、丁寧にゆっくり進める。' },
    { start: 237, end: 240, name: '風地観', reading: 'ふうちかん', image: 'しっかり観察。心の目で見る。', message: '頑固になるより、流れに身を任せる。' },
    { start: 241, end: 244, name: '山雷頤', reading: 'さんらいい', image: '口は災いのもと。', message: '発する言葉を丁寧に整える。口車に乗らない。' },
    { start: 245, end: 248, name: '水地比', reading: 'すいちひ', image: '打ち解ける。親しむ。', message: '仲間や同志と親しむ。ピンときたら即行動。' },
    { start: 249, end: 252, name: '地雷復', reading: 'ちらいふく', image: 'ようやく回復。復活。', message: 'やり直し・再チャレンジのとき。無茶は禁物。' },
    { start: 253, end: 256, name: '山地剥', reading: 'さんちはく', image: '剥離。メッキが剥がれる。', message: '飾らない自分で勝負。' },
    { start: 257, end: 260, name: '坤為地', reading: 'こんいち', image: '天の恵みを受ける大地。', message: '基礎を固める。導きに素直に従う。' },
  ];

  /**
   * KIN番号(1-260)から対応する卦の情報を求める。
   * @param {number} kin
   * @returns {IchingEntry}
   */
  function getIchingByKin(kin) {
    const entry = ICHING_TABLE.find((row) => kin >= row.start && kin <= row.end);
    return entry;
  }

  window.MayaApp.ICHING_TABLE = ICHING_TABLE;
  window.MayaApp.getIchingByKin = getIchingByKin;
})();
