(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- content (edited from /admin, stored in /content/*.json) ---------- */
  const load = name => fetch(`content/${name}.json`, { cache: "no-cache" })
    .then(r => r.ok ? r.json() : {}).catch(() => ({}));
  const [settings, stats, news, office, courses, fieldsData, timeline, gallery, partnersData] =
    await Promise.all(["settings", "stats", "news", "office", "courses", "fields", "timeline", "gallery", "partners"].map(load));
  const list = o => Array.isArray(o && o.items) ? o.items : [];

  const esc = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Images come from the CMS media folder or the original /images folder.
  const src = p => { p = String(p || "").trim(); return /^(https:\/\/|\/|images\/)/.test(p) && !/^\/\//.test(p) ? esc(p) : ""; };
  const digits = n => String(n || "").replace(/[^\d+]/g, "");
  const localPhone = n => { const d = digits(n); return d.startsWith("+212") ? ("0" + d.slice(4)).replace(/(\d{2})(?=\d)/g, "$1 ").trim() : d; };
  const waNumber = digits(settings.whatsapp || "+212668963619").replace("+", "");
  const months = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
  const parseDate = d => { const m = String(d || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? { y: m[1], m: months[+m[2] - 1] || "", d: String(+m[3]) } : null; };
  // Minimal markdown: paragraphs, "* " / "- " / "1. " lists, **bold**.
  const md = text => esc(text).split(/\r?\n\s*\r?\n/).map(block => {
    const lines = block.split(/\r?\n/).filter(Boolean);
    const bold = s => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (lines.length && lines.every(l => /^\s*[*-]\s+/.test(l))) return `<ul>${lines.map(l => `<li>${bold(l.replace(/^\s*[*-]\s+/, ""))}</li>`).join("")}</ul>`;
    if (lines.length && lines.every(l => /^\s*\d+[.)]\s+/.test(l))) return `<ol>${lines.map(l => `<li>${bold(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
    return lines.length ? `<p>${bold(lines.join("<br>"))}</p>` : "";
  }).join("");

  /* ---------- simple text bindings (hero) ---------- */
  $$("[data-c]").forEach(el => { const v = settings[el.dataset.c]; if (v) el.textContent = v; });

  /* ---------- phones & contact ---------- */
  const phones = (settings.phones || []).filter(p => p && p.number);
  $("#sosPhones").innerHTML = phones.map(p =>
    `<a class="sos-branch" href="tel:${esc(digits(p.number))}">${esc(p.label || "الهلال الأحمر – الحوز")} <b dir="ltr">${esc(p.number)}</b></a>`).join("");
  $("#contactList").innerHTML =
    phones.map(p => `<li><span>الهاتف</span><a href="tel:${esc(digits(p.number))}" dir="ltr">${esc(localPhone(p.number))}</a></li>`).join("") +
    `<li><span>واتساب</span><a href="https://wa.me/${esc(waNumber)}" target="_blank" rel="noopener">راسلنا مباشرة</a></li>` +
    (settings.address ? `<li><span>العنوان</span>${esc(settings.address)}</li>` : "") +
    (settings.facebook_name ? `<li><span>فيسبوك</span>${/^https:\/\//.test(settings.facebook_url || "")
      ? `<a href="${esc(settings.facebook_url)}" target="_blank" rel="noopener">${esc(settings.facebook_name)}</a>` : esc(settings.facebook_name)}</li>` : "");

  /* ---------- numbers ---------- */
  $("#statsTitle").textContent = stats.title || "";
  $("#statsSub").textContent = stats.subtitle || "";
  $("#statsGrid").innerHTML = list(stats).map(s =>
    `<div class="stat"><b class="count" data-to="${Math.max(0, parseInt(s.value, 10) || 0)}">0</b><span>${esc(s.label)}</span></div>`).join("");

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

  /* ---------- modal ---------- */
  const modal = $("#modal"), modalBody = $("#modalBody");
  let lastFocus = null;
  const openModal = html => { lastFocus = document.activeElement; modalBody.innerHTML = html; modal.hidden = false; $("#modalX").focus(); document.body.style.overflow = "hidden"; };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  $("#modalX").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

  /* ---------- news ---------- */
  const newsItems = list(news).filter(n => n && n.title).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  const dateBadge = n => { const d = parseDate(n.date); return d ? `<div class="news-date" aria-hidden="true"><b>${d.d}</b><span>${d.m}</span><span>${d.y}</span></div>` : ""; };
  const dateText = n => { const d = parseDate(n.date); return d ? `${d.d} ${d.m} ${d.y}` : ""; };
  const newsList = $("#newsList");
  if (newsItems.length) {
    const [top, ...rest] = newsItems;
    newsList.innerHTML = `
      <article class="news-card">
        ${dateBadge(top)}
        <div class="news-text">
          <span class="kicker">آخر الأخبار</span>
          <h2>${esc(top.title)}</h2>
          ${top.subtitle ? `<p class="news-sub">${esc(top.subtitle)}</p>` : ""}
          ${src(top.image) ? `<img class="news-img" src="${src(top.image)}" alt="" loading="lazy">` : ""}
          ${md(top.body)}
        </div>
      </article>
      ${rest.length ? `<h3 class="news-more-title">أخبار سابقة</h3>
      <div class="news-grid">${rest.map((n, i) => `
        <button class="news-mini" data-i="${i + 1}">
          ${src(n.image) ? `<img src="${src(n.image)}" alt="" loading="lazy">` : ""}
          <span class="nm-date">${esc(dateText(n))}</span>
          <b>${esc(n.title)}</b>
          ${n.subtitle ? `<span class="nm-sub">${esc(n.subtitle)}</span>` : ""}
          <span class="more">اقرأ الخبر ←</span>
        </button>`).join("")}</div>` : ""}`;
    newsList.addEventListener("click", e => {
      const b = e.target.closest(".news-mini"); if (!b) return;
      const n = newsItems[+b.dataset.i];
      openModal(`${src(n.image) ? `<img class="m-hero" src="${src(n.image)}" alt="">` : ""}
        <div class="m-body"><span class="kicker">${esc(dateText(n))}</span><h2 id="modalTitle">${esc(n.title)}</h2>
        ${n.subtitle ? `<p class="news-sub">${esc(n.subtitle)}</p>` : ""}${md(n.body)}</div>`);
    });
  }

  /* ---------- office: board & roadmap ---------- */
  const members = (office.members || []).filter(m => m && m.name);
  $("#board").innerHTML = members.map(m =>
    `<li class="${m.lead ? "board-lead" : ""}"><span class="b-ini">${esc([...String(m.name).trim()][0] || "")}</span><b>${esc(m.name)}</b><span>${esc(m.role)}</span></li>`).join("");
  $("#roadmapTitle").textContent = office.roadmap_title || "";
  $("#roadmapIntro").textContent = office.roadmap_intro || "";
  $("#pillars").innerHTML = (office.pillars || []).map(p => `<li><b>${esc(p.title)}</b><span>${esc(p.text)}</span></li>`).join("");

  /* ---------- courses ---------- */
  const courseItems = list(courses).filter(c => c && c.title);
  $("#courseList").innerHTML = courseItems.map(c => `<li>${esc(c.title)}</li>`).join("");
  $("#regCourses").innerHTML = courseItems.filter(c => c.registration).map((c, i) =>
    `<li><span>${String(i + 1).padStart(2, "0")}</span>${esc(c.title)}</li>`).join("");

  /* ---------- fields ---------- */
  const fields = list(fieldsData);
  $("#fieldGrid").innerHTML = fields.map((f, i) => `
    <button class="field" data-i="${i}">
      <img src="${src(f.image)}" alt="" loading="lazy">
      <div class="field-inner">
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.summary)}</p>
        <span class="more">اكتشف المزيد ←</span>
      </div>
    </button>`).join("");
  $("#fieldGrid").addEventListener("click", e => {
    const b = e.target.closest(".field"); if (!b) return;
    const f = fields[b.dataset.i];
    openModal(`<img class="m-hero" src="${src(f.image)}" alt="">
      <div class="m-body"><span class="kicker">مجال ${String(+b.dataset.i + 1).padStart(2, "0")}</span><h2 id="modalTitle">${esc(f.title)}</h2>
      <ul>${(f.points || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="m-thumbs">${(f.photos || []).map(t => `<img src="${src(t)}" alt="" loading="lazy">`).join("")}</div></div>`);
  });

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
  const events = list(timeline).filter(e => e && e.title);
  const years = ["الكل", ...[...new Set(events.map(e => String(e.year)))].sort()];
  const tabs = $("#yearTabs"), tl = $("#timeline");
  tabs.innerHTML = years.map((y, i) => `<button role="tab" aria-selected="${i === 0}" data-y="${esc(y)}">${esc(y)}</button>`).join("");
  const renderTL = y => {
    tl.innerHTML = events.filter(e => y === "الكل" || String(e.year) === y).map((e, i) =>
      `<li class="tl" style="animation-delay:${i * 40}ms"><span class="tl-dot">${esc(e.icon || "✚")}</span>
       <div class="tl-card"><time>${esc(e.date)} ${esc(e.year)}</time><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p></div></li>`).join("");
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
  const gal = list(gallery).filter(g => g && src(g.image));
  const filters = $("#filters"), mas = $("#masonry");
  filters.innerHTML = Object.entries(cats).filter(([k]) => k === "all" || gal.some(g => g.category === k))
    .map(([k, v], i) => `<button class="${i ? "" : "on"}" data-c="${k}">${v}</button>`).join("");
  let shown = [];
  const renderGal = c => {
    shown = gal.filter(g => c === "all" || g.category === c);
    mas.innerHTML = shown.map((g, i) => `<figure data-i="${i}" style="animation-delay:${i * 30}ms"><img src="${src(g.image)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join("");
  };
  filters.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", filters).forEach(x => x.classList.toggle("on", x === b));
    renderGal(b.dataset.c);
  });
  renderGal("all");

  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let cur = 0;
  const showLB = i => { cur = (i + shown.length) % shown.length; lbImg.src = src(shown[cur].image); lbImg.alt = shown[cur].caption || ""; lbCap.textContent = shown[cur].caption || ""; };
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
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  /* ---------- partners marquee ---------- */
  const partners = list(partnersData).map(p => p && p.name).filter(Boolean);
  $("#marquee").innerHTML = [...partners, ...partners].map(p => `<span>${esc(p)}</span>`).join("");

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

  /* ---------- training registration form ---------- */
  const formEmbed = $("#formEmbed");
  const formSrc = (() => {
    try {
      const u = new URL(settings.training_form_url || "");
      if (!/(^|\.)docs\.google\.com$/.test(u.hostname) || !u.pathname.startsWith("/forms/")) return "";
      u.pathname = u.pathname.replace(/\/(edit|viewform)?$/, "/viewform");
      u.search = "";
      u.searchParams.set("embedded", "true");
      return u.toString();
    } catch (e) { return ""; }
  })();
  if (formSrc) {
    formEmbed.innerHTML = `<div class="form-loading">جارٍ تحميل الاستمارة…</div>`;
    const loadForm = () => {
      formEmbed.innerHTML = `<iframe src="${esc(formSrc)}" title="استمارة التسجيل في الدورات التكوينية" loading="lazy">جارٍ التحميل…</iframe>
        <a class="form-open" href="${esc(formSrc.replace("embedded=true", "usp=sf_link"))}" target="_blank" rel="noopener">الاستمارة لا تظهر؟ افتحها في صفحة مستقلة ↗</a>`;
    };
    const fio = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { loadForm(); fio.disconnect(); } }, { rootMargin: "400px" });
    fio.observe(formEmbed);
  } else {
    const msg = encodeURIComponent("السلام عليكم، أرغب في التسجيل في إحدى الدورات التكوينية للهلال الأحمر المغربي بالحوز.");
    formEmbed.innerHTML = `<div class="form-pending">
      <div class="fp-icon">✚</div>
      <h3>الاستمارة الإلكترونية قيد الإعداد</h3>
      <p>إلى حين فتح التسجيل الإلكتروني، يمكنك تسجيل اهتمامك مباشرة عبر واتساب مع المكتب الإقليمي.</p>
      <a class="btn btn-red" href="https://wa.me/${esc(waNumber)}?text=${msg}" target="_blank" rel="noopener">التسجيل عبر واتساب</a>
    </div>`;
  }

  $("#yr").textContent = new Date().getFullYear();
})();
