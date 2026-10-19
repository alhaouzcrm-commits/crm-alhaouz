(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const img = n => `images/${n}.jpg`;

  /* ---------- theme ---------- */
  const root = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#themeBtn").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  /* ---------- mobile menu ---------- */
  const nav = $("#nav"), menuBtn = $("#menuBtn");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- fields ---------- */
  const fields = [
    { t: "التكوين في الإسعافات الأولية", s: "دورات في المدارس والجمعيات ولفائدة نساء ورجال التعليم.", img: "fa1", thumbs: ["fa3", "fa7", "fa6"],
      items: ["دورة لفائدة 54 مربية ومربيًا من مؤسسات تعليمية مختلفة (يونيو 2024).",
              "دورات بالثانوية الإعدادية مولاي رشيد وأوريكا والفضاء الجمعوي بتحناوت (ماي 2023).",
              "برنامج الإسعافات الأولية للمدارس بدعم من الصليب الأحمر الفرنسي: آيت أورير وأوريكا ومدارس الجماعات المتضررة من الزلزال (2025).",
              "دورات لنساء المجتمع المدني بأمزميز، وللشباب بمقر بلدية تحناوت."] },
    { t: "الخدمات الصحية والاجتماعية", s: "قوافل طبية متعددة التخصصات وفحوصات للنظر والسمع.", img: "h3", thumbs: ["h2", "h5", "h7"],
      items: ["تأطير الحملة الطبية لجراحة العيون بتحناوت لفائدة أكثر من 3200 مستفيد (غشت 2022).",
              "الحملة الطبية متعددة التخصصات بأمزميز يومي 9 و10 ماي 2024.",
              "قافلة الكشف المبكر عن السرطان بدوار بويحيى بشراكة مع جمعية «دار بابانا» (يونيو 2023).",
              "قوافل الفحوصات الطبية لتصحيح النظر والسمع لفائدة تلاميذ المدارس العمومية (2024–2025)."] },
    { t: "الرياضة والتطوع", s: "التغطية الإسعافية للبطولات والسباقات الجبلية.", img: "s1", thumbs: ["s2", "s4", "s5"],
      items: ["التغطية الإسعافية للبطولة الجهوية لألعاب القوى بأغواطيم – تحناوت.",
              "إسعاف المشاركين في سباق جبلي عالمي بمنطقة ماريغا (النسخ 2022 و2023 و2024).",
              "المساهمة في إنجاح البطولة الوطنية المدرسية للعدو الريفي بتحناوت (25–28 أبريل 2024)."] },
    { t: "السلامة الطرقية", s: "ورشات تطبيقية للأطفال واحتفال سنوي باليوم الوطني.", img: "r1", thumbs: ["r2", "r4", "r5"],
      items: ["برنامج للتربية الطرقية في 30 مؤسسة تعليمية استفاد منه أكثر من 3000 متعلم.",
              "تخليد اليوم الوطني للسلامة الطرقية (18 فبراير) كل سنة منذ 2022.",
              "ورشات بشراكة مع جمعية تنمية التعاون المدرسي والمديرية الإقليمية للتربية الوطنية."] },
    { t: "الدعم النفسي", s: "حصص الرسم والحكاية والتنشيط في مخيمات الناجين.", img: "eq_kids2", thumbs: ["eq_kids", "eq_camp2", "eq_camp3"],
      items: ["حصص للدعم النفسي تكتشف نقاط الضعف عبر الرسم والتعبير بحضور أطباء ومختصين بشراكة مع جمعية شمس.",
              "ورشات للرسم والتنشيط والحكاية في مخيمات الإيواء بعد الزلزال.",
              "زيارات ميدانية منتظمة للمخيمات لتقديم الدعم الطبي والنفسي."] },
    { t: "الروابط العائلية والمشاركة المجتمعية", s: "تكوين فرق RFL وتشخيص تشاركي مع الساكنة.", img: "fa8", thumbs: ["fa5", "fa10", "fa4"],
      items: ["الدورة الثانية لتكوين فريق إعادة الروابط العائلية (R.F.L) بمدرسة السلام بآيت أورير.",
              "برنامج المشاركة المجتمعية بثلاث نيعقوب مع الصليب الأحمر الإسباني والاتحاد الدولي (16–20 أكتوبر 2024).",
              "المشاركة في دورة وطنية حول حماية الروابط العائلية (24–27 أكتوبر 2024)."] }
  ];
  $("#fieldGrid").innerHTML = fields.map((f, i) => `
    <button class="field" data-i="${i}">
      <img src="${img(f.img)}" alt="" loading="lazy">
      <div class="field-inner">
        <span class="num">0${i + 1}</span>
        <h3>${f.t}</h3>
        <p>${f.s}</p>
        <span class="more">اكتشف المزيد ←</span>
      </div>
    </button>`).join("");

  const modal = $("#modal"), modalBody = $("#modalBody");
  let lastFocus = null;
  const openModal = html => { lastFocus = document.activeElement; modalBody.innerHTML = html; modal.hidden = false; $("#modalX").focus(); document.body.style.overflow = "hidden"; };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  $("#fieldGrid").addEventListener("click", e => {
    const b = e.target.closest(".field"); if (!b) return;
    const f = fields[b.dataset.i];
    openModal(`<img class="m-hero" src="${img(f.img)}" alt="">
      <div class="m-body"><span class="kicker">مجال 0${+b.dataset.i + 1}</span><h2 id="modalTitle">${f.t}</h2>
      <ul>${f.items.map(x => `<li>${x}</li>`).join("")}</ul>
      <div class="m-thumbs">${f.thumbs.map(t => `<img src="${img(t)}" alt="" loading="lazy">`).join("")}</div></div>`);
  });
  $("#modalX").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

  /* ---------- quake aid table ---------- */
  const aid = [["توزيع المواد الغذائية", "أسني / وزكيطة"], ["توزيع الملابس والأفرشة", "مولاي إبراهيم"], ["توزيع الأغطية", "تغدوين / أوكايمدن"],
    ["الدعم النفسي", "تيديلي مسفيوة"], ["التنشيط التربوي للأطفال", "إيجوكاك / أمسكر"], ["توزيع الخيام", "أمزميز / دار الجامع"],
    ["ألبسة الختان", "إنكال / أزادن"], ["القوافل الصحية", "ثلاث نيعقوب"], ["الخدمات الإسعافية", "أمكدال / ويركان"]];
  $("#aidTable").innerHTML = aid.map(([t, p]) => `<div class="aid-row" tabindex="0"><span class="type">${t}</span><span class="place">${p}</span></div>`).join("");

  /* ---------- training bars ---------- */
  const bars = [["الدورات التحسيسية", 3600, "45 دورة"], ["الإسعافات الأولية الأساسية", 582, "14 دورة"], ["التثقيف بالنظير (محلي)", 68, "6 دورات"],
    ["التكوينات مع الاتحاد الدولي", 54, "+20 تكوينًا"], ["التكوينات الوطنية", 17, "8 دورات"], ["الفرق الإسعافية", 5, "دورة واحدة"]];
  const max = Math.log10(3600);
  $("#bars").innerHTML = `<h3 style="margin-bottom:20px">عدد المستفيدين حسب نوع التكوين</h3>` + bars.map(([n, v, d]) =>
    `<div class="bar"><div class="bar-top"><b>${n}</b><span>${v.toLocaleString("en-US")} مستفيد · ${d}</span></div>
     <div class="bar-track"><div class="bar-fill" data-w="${Math.max(6, Math.log10(v) / max * 100)}"></div></div></div>`).join("") +
    `<p style="margin:16px 0 0;font-size:.82rem;color:var(--muted)">طول الأشرطة بمقياس لوغاريتمي حتى تظهر الأعداد الصغيرة بوضوح.</p>`;

  /* ---------- timeline ---------- */
  const events = [
    ["2022", "12 مارس", "✚", "تأطير نادي البيئة بمؤسسة واحة الزيتون 2", "ورشة في الإسعافات الأولية والصحة المدرسية بمراكش."],
    ["2022", "25 مارس", "★", "انتخاب المكتب الإقليمي بتحناوت", "تجديد الثقة في الرئيس المصطفى عصبان وجميع الأعضاء."],
    ["2022", "25 مارس", "♥", "مساعدات لـ130 أسرة بزرقطن", "مواد غذائية وأغطية وملابس بدعم من الهلال الأحمر الإماراتي."],
    ["2022", "23 ماي", "✚", "حملة تحسيسية لـ3530 تلميذًا", "النظافة الشخصية والبيئة المدرسية في 8 مؤسسات ضمن برنامج الاستجابة لكوفيد-19."],
    ["2022", "3 غشت", "◉", "الحملة الطبية لجراحة العيون", "أكثر من 3200 مستفيد بتحناوت ضمن برنامج «نور السعودية»."],
    ["2022", "22 نونبر", "♥", "ملابس شتوية لـ217 تلميذًا", "مدرسة جماعاتية بأعالي الأطلس الكبير بشراكة مع جمعية «فريق النجاح»."],
    ["2023", "فبراير", "⚑", "اليوم الوطني للسلامة الطرقية", "ورشات توعوية في عدة مؤسسات تعليمية بالإقليم."],
    ["2023", "3 يونيو", "◉", "قافلة الكشف المبكر عن السرطان", "بدوار بويحيى، جماعة أغمات، بشراكة مع جمعية «دار بابانا»."],
    ["2023", "شتنبر", "▲", "الاستجابة لزلزال الحوز", "تدخل فوري في أسني ومولاي إبراهيم وأمزميز وثلاث نيعقوب وغيرها."],
    ["2024", "11–15 يناير", "♥", "مساعدات لـ165 أسرة متضررة", "لفائدة الأشخاص في وضعية إعاقة بصرية، بدعم من USAID."],
    ["2024", "25–28 أبريل", "⚑", "البطولة الوطنية المدرسية للعدو الريفي", "تغطية إسعافية شاملة بتحناوت."],
    ["2024", "9–10 ماي", "◉", "الحملة الطبية متعددة الاختصاصات بأمزميز", "بشراكة مع المديرية الإقليمية للصحة."],
    ["2024", "16–20 أكتوبر", "★", "برنامج المشاركة المجتمعية", "بثلاث نيعقوب، بتعاون مع الصليب الأحمر الإسباني."],
    ["2024", "نونبر", "⚑", "ذكرى المسيرة الخضراء", "ورشات توعوية في الإسعافات الأولية والسلامة."],
    ["2025", "8 يناير", "✚", "انطلاق برنامج الإسعافات الأولية للمدارس", "بدعم من الصليب الأحمر الفرنسي، بمدرسة السلام بآيت أورير."],
    ["2025", "18 يناير", "◉", "قافلة فحوصات النظر والسمع", "لفائدة تلاميذ دائرة آيت أورير."],
    ["2025", "17–21 فبراير", "★", "التدريب الوطني التمهيدي بتارودانت", "الحركة الدولية للصليب الأحمر والهلال الأحمر."],
    ["2025", "28 فبراير", "⚑", "اليوم العالمي للوقاية المدنية", "مشاركة في الاحتفال الإقليمي بتحناوت."],
    ["2025", "18 ماي", "★", "الجمع العام التجديدي للمكتب الإقليمي", "تجديد الثقة في الرئيس مصطفى عصبان، وانتخاب مكتب جديد يقود خارطة طريق 2025–2028."]
  ];
  const years = ["الكل", "2022", "2023", "2024", "2025"];
  const tabs = $("#yearTabs"), tl = $("#timeline");
  tabs.innerHTML = years.map((y, i) => `<button role="tab" aria-selected="${i === 0}" data-y="${y}">${y}</button>`).join("");
  const renderTL = y => {
    tl.innerHTML = events.filter(e => y === "الكل" || e[0] === y).map((e, i) =>
      `<li class="tl" style="animation-delay:${i * 40}ms"><span class="tl-dot">${e[2]}</span>
       <div class="tl-card"><time>${e[1]} ${e[0]}</time><h3>${e[3]}</h3><p>${e[4]}</p></div></li>`).join("");
  };
  tabs.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", tabs).forEach(x => x.setAttribute("aria-selected", x === b));
    renderTL(b.dataset.y);
  });
  renderTL("الكل");

  /* ---------- first aid guide ---------- */
  const guide = [
    { k: "cpr", i: "♥", t: "الإنعاش القلبي", w: "شخص لا يستجيب ولا يتنفس بشكل طبيعي: كل ثانية مهمة.",
      s: ["تأكد من أن المكان آمن لك وللمصاب.", "ربّت على كتفيه ونادِه، ثم تحقق من تنفسه خلال 10 ثوانٍ على الأكثر.",
          "اتصل فورًا بالرقم 15 أو 141، واطلب جهاز الصدمات الكهربائية (DEA) إن وُجد.",
          "ضع كعب يدك في وسط الصدر واليد الأخرى فوقها، وذراعاك مستقيمتان.",
          "اضغط بعمق 5 إلى 6 سم وبسرعة 100 إلى 120 ضغطة في الدقيقة (استعمل الإيقاع أسفله).",
          "إن كنت متدربًا أعطِ نفَسين بعد كل 30 ضغطة، وإلا فواصل الضغط دون توقف.",
          "استمر حتى وصول الإسعاف أو استعادة المصاب لتنفسه."], metro: true },
    { k: "bleed", i: "✚", t: "النزيف", w: "النزيف الغزير يتطلب تدخلًا فوريًا.",
      s: ["احمِ نفسك بقفازات أو كيس بلاستيكي إن أمكن.", "اضغط مباشرة وبقوة على الجرح بقطعة قماش نظيفة.",
          "لا تنزع الضمادة الأولى إذا تشبّعت بالدم، بل أضف أخرى فوقها وواصل الضغط.",
          "اجعل المصاب يستلقي، وغطّه للحفاظ على حرارته.", "اتصل بالرقم 15 إذا لم يتوقف النزيف أو ظهرت علامات الصدمة (شحوب، عرق بارد، دوخة)."] },
    { k: "burn", i: "✹", t: "الحروق", w: "التبريد السريع يقلل عمق الحرق.",
      s: ["أبعد المصاب عن مصدر الحرارة.", "برّد الحرق بماء جارٍ معتدل البرودة لمدة 20 دقيقة.",
          "انزع الخواتم والساعات والملابس غير الملتصقة بالجلد.", "غطِّ الحرق بغلاف بلاستيكي نظيف أو بضمادة غير لاصقة.",
          "لا تضع معجون أسنان أو زيتًا أو زبدة أو ثلجًا.", "اطلب المساعدة الطبية إذا كان الحرق واسعًا أو في الوجه أو اليدين، أو إذا كان المصاب طفلًا."] },
    { k: "choke", i: "◎", t: "الاختناق", w: "شخص بالغ لا يستطيع الكلام أو السعال أو التنفس.",
      s: ["إذا كان يسعل، شجّعه على مواصلة السعال.", "إذا عجز عن السعال: أمِلْه إلى الأمام ووجّه 5 ضربات قوية بين لوحي الكتف بكعب يدك.",
          "إذا لم يخرج الجسم العالق: قف خلفه، وضع قبضتك فوق السرّة، واسحب بقوة نحو الداخل والأعلى 5 مرات.",
          "كرّر 5 ضربات ثم 5 ضغطات حتى يخرج الجسم العالق.", "إذا فقد وعيه: اتصل بالرقم 15 وابدأ الإنعاش القلبي."] },
    { k: "frac", i: "▣", t: "الكسور", w: "لا تحاول إعادة العظم إلى مكانه.",
      s: ["لا تحرك المصاب إلا إذا كان في خطر.", "ثبّت الطرف المصاب على وضعيته باستعمال وسادة أو قماش ملفوف.",
          "ضع كمادة باردة ملفوفة بقماش لتخفيف الألم والتورم.", "راقب لون الأطراف وإحساسها.", "اتصل بالإسعاف أو انقل المصاب بحذر إلى أقرب مركز صحي."] },
    { k: "quake", i: "▲", t: "عند الزلزال", w: "انخفض، احتمِ، وتمسّك: قاعدة ذهبية تعلّمناها من 2023.",
      s: ["انخفض على ركبتيك فورًا حتى لا تسقط.", "احتمِ تحت طاولة متينة، أو غطِّ رأسك ورقبتك بذراعيك.", "تمسّك بمكانك حتى تتوقف الهزة، وابتعد عن النوافذ والرفوف.",
          "بعد الهزة: اخرج بهدوء إلى مكان مفتوح بعيدًا عن المباني والأعمدة الكهربائية.", "توقّع حدوث هزات ارتدادية، ولا تعد إلى المباني المتصدعة.",
          "جهّز حقيبة طوارئ فيها ماء ومصباح وأدوية وأوراق ثبوتية."] }
  ];
  const gTabs = $("#guideTabs"), gPanel = $("#guidePanel");
  gTabs.innerHTML = guide.map((g, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}"><span class="gi">${g.i}</span>${g.t}</button>`).join("");
  let metroTimer = null, audio = null;
  const stopMetro = () => { clearInterval(metroTimer); metroTimer = null; const b = $("#metroBtn"); if (b) b.textContent = "▶ تشغيل إيقاع الضغط (110/د)"; };
  const beep = () => {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = 880; g.gain.setValueAtTime(.25, audio.currentTime); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .08);
      o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + .09);
    } catch (e) {}
    const h = $("#metroHeart"); if (h) { h.animate([{ transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 250 }); }
  };
  const renderGuide = i => {
    stopMetro();
    const g = guide[i];
    gPanel.innerHTML = `<h3>${g.t}</h3><div class="warn">⚠ ${g.w}</div>
      <ol class="steps">${g.s.map(x => `<li tabindex="0">${x}</li>`).join("")}</ol>
      ${g.metro ? `<div class="guide-foot" style="margin-top:22px"><button class="btn btn-red btn-sm" id="metroBtn">▶ تشغيل إيقاع الضغط (110/د)</button><span id="metroHeart" style="font-size:2rem;color:var(--red);display:inline-block">♥</span></div>` : ""}
      <div class="guide-foot"><span>اضغط على كل خطوة لتأشيرها</span><div class="progress"><i id="prog"></i></div></div>`;
    const lis = $$(".steps li", gPanel), prog = $("#prog");
    const upd = () => prog.style.width = (lis.filter(l => l.classList.contains("done")).length / lis.length * 100) + "%";
    lis.forEach(l => {
      const tog = () => { l.classList.toggle("done"); upd(); };
      l.addEventListener("click", tog);
      l.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } });
    });
    const mb = $("#metroBtn");
    if (mb) mb.addEventListener("click", () => {
      if (metroTimer) return stopMetro();
      beep(); metroTimer = setInterval(beep, 60000 / 110); mb.textContent = "■ إيقاف";
    });
  };
  gTabs.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", gTabs).forEach(x => x.setAttribute("aria-selected", x === b));
    renderGuide(+b.dataset.i);
  });
  renderGuide(0);

  /* ---------- gallery ---------- */
  const cats = { all: "الكل", fa: "التكوين", h: "الصحة", eq: "الزلزال", s: "الرياضة", r: "السلامة الطرقية", so: "التضامن" };
  const gal = [
    ["eq_trucks", "eq", "قافلة المساعدات في اتجاه الدواوير المتضررة"], ["fa1", "fa", "تمرين تطبيقي في الإسعافات الأولية"], ["h2", "h", "فحص النظر خلال الحملة الطبية"],
    ["s1", "s", "خط الوصول في السباق الجبلي"], ["r1", "r", "أطفال يتعلمون قواعد السلامة الطرقية"], ["so1", "so", "تجهيز المساعدات الغذائية بزرقطن"],
    ["eq_camp", "eq", "زيارة ميدانية لمخيم الإيواء"], ["fa2", "fa", "وضعية الإفاقة الجانبية"], ["h1", "h", "قافلة طبية بمدرسة أولاد يحيى"],
    ["team2", "all", "الفريق الإقليمي في الميدان"], ["eq_unload", "eq", "تفريغ شاحنات الأغطية والأفرشة"], ["s4", "s", "إسعاف طفلة خلال بطولة العدو الريفي"],
    ["fa7", "fa", "خريجو دورة الإسعافات الأولية"], ["r2", "r", "اليوم الوطني للسلامة الطرقية 2025"], ["so2", "so", "قافلة المساعدات الرمضانية بأكرفروان"],
    ["eq_camp3", "eq", "متطوعو المكتب داخل مخيم الإيواء"], ["h4", "h", "الحملة الطبية متعددة الاختصاصات بأمزميز"], ["fa9", "fa", "التدريب على الإنعاش القلبي"],
    ["s2", "s", "تغطية إسعافية لألعاب القوى"], ["eq_dist", "eq", "توزيع الملابس على الأطفال"], ["r4", "r", "ورشة السلامة الطرقية بالقسم"],
    ["team4", "all", "تدشين برنامج الدعم المدرسي"], ["h5", "h", "زيارة ميدانية لمؤسسة صحية"], ["eq_help", "eq", "مساعدة شخص في وضعية إعاقة"],
    ["fa6", "fa", "تسليم الشهادات للمتطوعين"], ["so3", "so", "توزيع القفف الرمضانية"], ["s3", "s", "خيمة الإسعاف في البطولة"], ["r5", "r", "مسرح العرائس للتوعية"]
  ];
  const filters = $("#filters"), mas = $("#masonry");
  filters.innerHTML = Object.entries(cats).map(([k, v], i) => `<button class="${i ? "" : "on"}" data-c="${k}">${v}</button>`).join("");
  let shown = [];
  const renderGal = c => {
    shown = gal.filter(g => c === "all" || g[1] === c);
    mas.innerHTML = shown.map((g, i) => `<figure data-i="${i}" style="animation-delay:${i * 30}ms"><img src="${img(g[0])}" alt="${g[2]}" loading="lazy"><figcaption>${g[2]}</figcaption></figure>`).join("");
  };
  filters.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", filters).forEach(x => x.classList.toggle("on", x === b));
    renderGal(b.dataset.c);
  });
  renderGal("all");

  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let cur = 0;
  const showLB = i => { cur = (i + shown.length) % shown.length; lbImg.src = img(shown[cur][0]); lbImg.alt = shown[cur][2]; lbCap.textContent = shown[cur][2]; };
  mas.addEventListener("click", e => { const f = e.target.closest("figure"); if (!f) return; showLB(+f.dataset.i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lbX").focus(); });
  const closeLB = () => { lb.hidden = true; document.body.style.overflow = ""; };
  $("#lbX").addEventListener("click", closeLB);
  $("#lbPrev").addEventListener("click", () => showLB(cur - 1));
  $("#lbNext").addEventListener("click", () => showLB(cur + 1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { if (!lb.hidden) closeLB(); if (!modal.hidden) closeModal(); }
    if (!lb.hidden && e.key === "ArrowLeft") showLB(cur + 1);
    if (!lb.hidden && e.key === "ArrowRight") showLB(cur - 1);
  });

  /* ---------- join form → WhatsApp ---------- */
  $("#joinForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, name = f.name.value.trim();
    if (!name) { f.name.classList.add("invalid"); f.name.focus(); return; }
    f.name.classList.remove("invalid");
    const ints = $$("input[name=i]:checked", f).map(x => x.value).join("، ") || "—";
    const msg = `السلام عليكم، أرغب في التطوع مع الهلال الأحمر المغربي بالحوز.\nالاسم: ${name}\nالسن: ${f.age.value || "—"}\nالجماعة: ${f.commune.value}\nمجالات الاهتمام: ${ints}`;
    window.open(`https://wa.me/212668963619?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  /* ---------- partners marquee ---------- */
  const partners = ["عمالة إقليم الحوز", "المديرية الإقليمية للتربية الوطنية", "المديرية الإقليمية للصحة", "الوقاية المدنية", "الدرك الملكي", "القوات المساعدة",
    "الاتحاد الدولي للصليب الأحمر والهلال الأحمر", "الصليب الأحمر الفرنسي", "الصليب الأحمر الإسباني", "الهلال الأحمر الإماراتي", "USAID",
    "جمعية شمس", "جمعية طريق النجاح", "جمعية تمزغارت أوريكا", "جمعية تنمية التعاون المدرسي", "الفضاء الجمعوي تحناوت"];
  $("#marquee").innerHTML = [...partners, ...partners].map(p => `<span>${p}</span>`).join("");

  /* ---------- counters, bars, reveal, active nav ---------- */
  const fmt = n => n.toLocaleString("en-US");
  const countUp = el => {
    const to = +el.dataset.to, t0 = performance.now(), d = 1600;
    const step = t => { const p = Math.min(1, (t - t0) / d); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  $$("section > .wrap > *:not(.hero-content)").forEach(el => { if (!el.closest(".hero")) el.classList.add("reveal"); });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("in");
    $$(".count", el).concat(el.matches(".count") ? [el] : []).forEach(countUp);
    $$(".bar-fill", el).forEach(b => b.style.width = b.dataset.w + "%");
    io.unobserve(el);
  }), { threshold: .15 });
  $$(".reveal").forEach(el => io.observe(el));

  const links = $$("#nav a");
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id], footer[id]").forEach(s => secIO.observe(s));

  $("#yr").textContent = new Date().getFullYear();
})();
