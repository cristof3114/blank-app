(() => {
  const { CATEGORIES, INGREDIENTS, RECIPES } = window.DATA;
  const ING = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));
  const $ = (s) => document.querySelector(s);

  /* ---------- Stockage (try/catch : peut être indisponible) ---------- */
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : d;
      } catch { return d; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignoré */ }
    },
  };

  const state = {
    owned: new Set(store.get("cb_owned", [])),
    tab: store.get("cb_tab", "bar"),
    filter: "ready",
    sFilter: "all", // puissance : all | light | mid | strong
    mFilter: "all", // méthode : all | shaker | stir | build
    dose: ["light", "normal", "strong"].includes(store.get("cb_dose", "normal")) ? store.get("cb_dose", "normal") : "normal",
    q: "",
    barQ: "",
    servings: 1,
    detail: null,   // id de la recette ouverte
    steps: null,    // { list: [...], i: n } quand le pas à pas est ouvert
  };

  const saveOwned = () => store.set("cb_owned", [...state.owned]);

  /* ---------- Logique de correspondance ---------- */
  const options = (ing) => [ing.id, ...(ing.alt || [])];
  const isOwned = (ing, owned = state.owned) => options(ing).some((x) => owned.has(x));

  function analyze(r, owned = state.owned) {
    const required = r.ing.filter((i) => !i.opt);
    return { r, missing: required.filter((i) => !isOwned(i, owned)) };
  }

  const names = (list) => list.map((r) => r.name).join(", ");
  const ingName = (id) => ING[id].name;

  /* Idées : ce qu'il faut ajouter pour débloquer des cocktails */
  function computeIdeas() {
    const singles = new Map(); // ingrédient -> recettes débloquées
    const pairs = new Map();   // "a|b" -> recettes débloquées
    const push = (m, k, r) => m.set(k, [...(m.get(k) || []), r]);

    for (const { r, missing } of RECIPES.map((r) => analyze(r))) {
      if (missing.length === 1) {
        for (const o of options(missing[0])) if (!state.owned.has(o)) push(singles, o, r);
      } else if (missing.length === 2) {
        for (const a of options(missing[0])) {
          for (const b of options(missing[1])) {
            if (a !== b) push(pairs, [a, b].sort().join("|"), r);
          }
        }
      }
    }
    const rank = (m) => [...m.entries()].sort((x, y) => y[1].length - x[1].length || x[0].localeCompare(y[0]));
    return { singles: rank(singles), pairs: rank(pairs) };
  }

  /* ---------- Formatage ---------- */
  const fmtNum = (n) => (Math.round(n * 2) / 2).toString().replace(".", ",");
  const plural = (u, q) => (q > 1 ? u + "s" : u);

  /* Dosage : multiplie les alcools (≥ 15 % vol) ; les mixers ne changent pas */
  const DOSES = {
    light: { label: "Léger", factor: 0.6 },
    normal: { label: "Normal", factor: 1 },
    strong: { label: "Fort", factor: 1.4 },
  };
  const doseFactor = () => DOSES[state.dose].factor;
  const abvOf = (i) => (ING[i.id] && ING[i.id].abv) || 0;
  const scalable = (i) => abvOf(i) >= 15;
  const mlOf = (i, n, f) => i.ml * n * (scalable(i) ? f : 1);

  function amount(i, n, f) {
    if (i.ml != null) return `${fmtNum(mlOf(i, n, f))} ml`;
    const q = i.qty * n;
    return `${fmtNum(q)} ${plural(i.unit, q)}`;
  }

  /* Puissance d'un verre : % vol final estimé, verres standard (10 g d'alcool pur ≈ 12,7 ml) */
  const DILUTION = { shaker: 0.25, stir: 0.2, build: 0.1 };
  const LEVELS = [
    { max: 0.8, label: "Léger" },
    { max: 1.3, label: "Doux" },
    { max: 1.8, label: "Moyen" },
    { max: 2.3, label: "Fort" },
    { max: Infinity, label: "Très fort" },
  ];

  function strength(r, f = doseFactor()) {
    let alc = 0, mixed = 0, topped = 0;
    for (const i of r.ing) {
      if (i.ml == null || (i.opt && !isOwned(i))) continue;
      const ml = mlOf(i, 1, f);
      alc += (ml * abvOf(i)) / 100;
      if (i.top) topped += ml; else mixed += ml;
    }
    const total = mixed * (1 + DILUTION[r.method || "shaker"]) + topped;
    const std = alc / 12.7;
    const level = LEVELS.findIndex((l) => std < l.max);
    return { abv: total ? (alc / total) * 100 : 0, std, level: level + 1, label: LEVELS[level].label };
  }

  const dots = (level) => "●".repeat(level) + "○".repeat(5 - level);
  const fmtStd = (s) => s.toFixed(1).replace(".", ",");

  const METHODS = {
    shaker: { label: "Shaker", emoji: "💪" },
    stir: { label: "Mélangé", emoji: "🥄" },
    build: { label: "Dans le verre", emoji: "🥃" },
  };

  const SERVE = {
    coupe: { glass: "coupe", prep: "Mets une <b>coupe</b> au congélateur (ou remplis-la de glaçons et d'eau) pour qu'elle soit bien froide." },
    rocks: { glass: "verre old fashioned", prep: "Prends un <b>verre old fashioned</b> et remplis-le de glaçons." },
    tall: { glass: "grand verre", prep: "Prends un <b>grand verre</b> et remplis-le de glaçons." },
    flute: { glass: "flûte", prep: "Mets une <b>flûte</b> au congélateur (ou remplis-la de glaçons et d'eau) pour qu'elle soit bien froide." },
    wine: { glass: "verre à vin", prep: "Prends un <b>grand verre à vin</b> (ou un ballon) et remplis-le de glaçons." },
  };

  /* ---------- Génération du pas à pas ---------- */
  function buildSteps(r, n) {
    const f = doseFactor();
    const serve = SERVE[r.serve];
    const method = r.method || "shaker";
    const amt = (i) => amount(i, n, f);
    const lower = (id) => ING[id].name.toLowerCase();
    const row = (i) => ({ a: amt(i), name: ING[i.id].name });

    const included = r.ing.filter((i) => !i.opt || isOwned(i));
    const muddled = included.filter((i) => (r.muddle || []).includes(i.id));
    const body = included.filter((i) => !i.top && !i.float && !muddled.includes(i));
    const tops = included.filter((i) => i.top);
    const floats = included.filter((i) => i.float);
    const hasEgg = body.some((i) => i.id === "blanc_oeuf");
    const shakeTime = r.shake || 12;
    const dry = r.serve === "coupe" || r.serve === "flute" || r.noIce;
    const steps = [];
    const st = strength(r);

    /* Verre */
    if (r.noIce || (method === "build" && muddled.length)) {
      steps.push({ icon: "🥶", title: "Prépare le verre", html: `Prends un <b>${serve.glass}</b>${r.noIce ? " (sans glaçons)" : ""}.` });
    } else {
      steps.push({ icon: "🥶", title: "Prépare le verre", html: serve.prep });
    }
    (r.pre || []).forEach((t) => steps.push({ icon: "🛠️", title: "Préparation", html: t }));

    if (method === "shaker") {
      steps.push({ icon: "🥄", title: "Mesure dans le shaker", html: "Verse dans le shaker, avec un verre doseur :", list: body.map(row) });
      if (hasEgg) {
        steps.push({ icon: "🥚", title: "Dry shake", html: "Ferme le shaker <b>sans glaçons</b> et secoue fort pour faire mousser le blanc d'œuf.", timer: 10 });
      }
      steps.push({
        icon: "🧊", title: "Ajoute la glace",
        html: "Remplis le shaker de glaçons aux trois quarts, puis ferme-le bien." +
          (n > 2 ? "<br><i>Un shaker contient 2 cocktails au maximum : fais-les en plusieurs fois.</i>" : ""),
      });
      steps.push({
        icon: "💪", title: "Shake !",
        html: `Secoue énergiquement pendant <b>${shakeTime} secondes</b>, jusqu'à ce que le shaker soit givré.`,
        timer: shakeTime,
      });
      steps.push({
        icon: "🍸", title: "Sers",
        html: dry
          ? "Filtre le cocktail dans le verre, <b>sans glaçons</b> (passoire du shaker + petite passoire pour un double filtrage)."
          : "Filtre le cocktail dans le verre, <b>sur les glaçons</b>.",
      });
    } else if (method === "stir") {
      steps.push({ icon: "🥄", title: "Mesure", html: "Verse dans un verre à mélange (ou un grand verre), avec un verre doseur :", list: body.map(row) });
      steps.push({ icon: "🧊", title: "Ajoute la glace", html: "Remplis le verre à mélange de glaçons jusqu'en haut." });
      steps.push({
        icon: "🌀", title: "Mélange",
        html: "Remue avec une cuillère à long manche, en la faisant tourner contre la paroi, pendant <b>25 secondes</b>. Le verre doit être givré.",
        timer: 25,
      });
      steps.push({
        icon: "🍸", title: "Sers",
        html: dry
          ? "Filtre le cocktail dans le verre, <b>sans glaçons</b>."
          : "Filtre le cocktail dans le verre, <b>sur les glaçons</b>.",
      });
    } else {
      if (muddled.length) {
        steps.push({
          icon: "🌿", title: "Écrase",
          html: "Dans le verre, écrase doucement avec un pilon ou le manche d'une cuillère :",
          list: muddled.map(row),
        });
        if (!r.noIce) steps.push({ icon: "🧊", title: "Ajoute la glace", html: "Remplis le verre de glaçons (pilés si possible)." });
      }
      if (body.length) {
        steps.push({ icon: "🥄", title: "Verse", html: "Verse directement dans le verre :", list: body.map(row) });
      }
    }

    /* Finitions communes */
    tops.forEach((i) => steps.push({
      icon: "🫧", title: "Complète",
      html: `Complète avec environ <b>${amt(i)}</b> de ${lower(i.id)}.`,
    }));
    if (method === "build") {
      steps.push({ icon: "🌀", title: "Mélange", html: "Remue délicatement avec une cuillère, une ou deux fois, sans casser les bulles.", timer: 8 });
    }
    floats.forEach((i) => steps.push({
      icon: "🫗", title: "Finition",
      html: `Verse délicatement <b>${amt(i)} de ${lower(i.id)}</b> sur le dessus, sans mélanger.`,
    }));

    if (f !== 1) {
      steps.push({
        icon: f < 1 ? "🍃" : "🔥", title: f < 1 ? "Version légère" : "Version forte",
        html: f < 1
          ? "Les alcools sont réduits : tu peux compléter avec un peu d'eau gazeuse ou laisser la glace fondre pour un verre plus long."
          : "Les alcools sont augmentés : goûte avant de boire, l'équilibre est plus alcoolisé.",
      });
    }
    if (r.note) steps.push({ icon: "💡", title: "Astuce", html: r.note });
    if (r.garnish && !/^Aucune/.test(r.garnish)) steps.push({ icon: "🌿", title: "Décore", html: r.garnish });
    steps.push({
      icon: "🥂", title: "Santé !",
      html: `Ton <b>${r.name}</b> est prêt.<br><small>≈ ${Math.round(st.abv)} % vol · ${fmtStd(st.std)} verre standard par verre.</small>`,
    });
    return steps;
  }

  /* ---------- Rendu : Mon bar ---------- */
  function renderBarList() {
    const q = state.barQ.trim().toLowerCase();
    let html = "";
    for (const c of CATEGORIES) {
      const items = INGREDIENTS.filter((i) => i.cat === c.id && (!q || i.name.toLowerCase().includes(q)));
      if (!items.length) continue;
      const have = items.filter((i) => state.owned.has(i.id)).length;
      html += `<div class="cat"><h2>${c.emoji} ${c.name}<span>${have}/${items.length}</span></h2><div class="chips">` +
        items.map((i) => {
          const on = state.owned.has(i.id);
          return `<button class="chip${on ? " on" : ""}" data-act="toggle" data-id="${i.id}" aria-pressed="${on}">${on ? "✓ " : ""}${i.name}</button>`;
        }).join("") + `</div></div>`;
    }
    $("#barList").innerHTML = html || `<p class="empty">Aucun ingrédient trouvé.</p>`;
    const n = state.owned.size;
    const ready = RECIPES.filter((r) => analyze(r).missing.length === 0).length;
    $("#barSummary").innerHTML = n
      ? `<b>${n}</b> ingrédient${n > 1 ? "s" : ""} · <b>${ready}</b> cocktail${ready > 1 ? "s" : ""} possible${ready > 1 ? "s" : ""}
         <button class="link" data-act="clear">Tout décocher</button>`
      : `Coche ce que tu as dans ton bar. 🧊 Les glaçons sont toujours supposés disponibles.`;
  }

  /* ---------- Rendu : Cocktails ---------- */
  function renderFilters(counts) {
    const chip = (act, key, cur, label, n) =>
      `<button class="chip${cur === key ? " on" : ""}" data-act="${act}" data-k="${key}">${label}${n != null ? ` <small>${n}</small>` : ""}</button>`;
    $("#filters").innerHTML =
      [["ready", "Prêts"], ["m1", "Il manque 1"], ["m2", "Il manque 2"], ["all", "Tous"]]
        .map(([k, l]) => chip("filter", k, state.filter, l, counts[k])).join("");
    $("#filters2").innerHTML =
      `<span class="lbl">Puissance</span>` +
      [["all", "Toutes"], ["light", "Légers"], ["mid", "Moyens"], ["strong", "Forts"]]
        .map(([k, l]) => chip("sfilter", k, state.sFilter, l)).join("");
    $("#filters3").innerHTML =
      `<span class="lbl">Méthode</span>` +
      [["all", "Toutes"], ["shaker", "💪 Shaker"], ["stir", "🥄 Mélangé"], ["build", "🥃 Dans le verre"]]
        .map(([k, l]) => chip("mfilter", k, state.mFilter, l)).join("");
  }

  const strengthGroup = (lvl) => (lvl <= 2 ? "light" : lvl === 3 ? "mid" : "strong");

  function renderCocktails() {
    const all = RECIPES.map((r) => analyze(r));
    const counts = {
      ready: all.filter((a) => a.missing.length === 0).length,
      m1: all.filter((a) => a.missing.length === 1).length,
      m2: all.filter((a) => a.missing.length === 2).length,
      all: all.length,
    };
    renderFilters(counts);

    const q = state.q.trim().toLowerCase();
    let list = all.filter((a) => {
      if (q && !(a.r.name.toLowerCase().includes(q) || a.r.ing.some((i) => ingName(i.id).toLowerCase().includes(q)))) return false;
      if (state.mFilter !== "all" && (a.r.method || "shaker") !== state.mFilter) return false;
      if (state.sFilter !== "all" && strengthGroup(strength(a.r).level) !== state.sFilter) return false;
      if (state.filter === "ready") return a.missing.length === 0;
      if (state.filter === "m1") return a.missing.length === 1;
      if (state.filter === "m2") return a.missing.length === 2;
      return true;
    });
    list.sort((x, y) => x.missing.length - y.missing.length || x.r.name.localeCompare(y.r.name));

    if (!list.length) {
      const hint = state.owned.size === 0
        ? `Ton bar est vide. Va dans <b>Mon bar</b> pour cocher tes bouteilles.`
        : state.filter === "ready"
          ? `Aucun cocktail complet pour l'instant. Regarde « Il manque 1 » ou l'onglet <b>Idées</b>.`
          : `Rien à afficher ici.`;
      $("#cList").innerHTML = `<p class="empty">${hint}</p>`;
      return;
    }

    $("#cList").innerHTML = list.map(({ r, missing }) => {
      const miss = missing.map((m) =>
        `<button class="chip add" data-act="addIng" data-id="${m.id}" title="J'en ai">＋ ${ingName(m.id)}</button>`).join("");
      const st = strength(r);
      return `<article class="card" data-act="open" data-id="${r.id}" tabindex="0" role="button">
        <div class="emoji">${r.emoji}</div>
        <div class="body">
          <h3>${r.name}</h3>
          <p class="taste">${r.taste}</p>
          <p class="str" title="${st.label} : ${fmtStd(st.std)} verre standard"><span class="dots l${st.level}">${dots(st.level)}</span> ${st.label} · ${Math.round(st.abv)} %</p>
          ${missing.length
            ? `<div class="chips small"><span class="lbl">Manque :</span>${miss}</div>`
            : `<span class="badge ok">✓ Prêt à préparer</span>`}
        </div>
      </article>`;
    }).join("");
  }

  /* ---------- Rendu : Idées ---------- */
  function renderIdeas() {
    if (state.owned.size === 0) {
      $("#ideasList").innerHTML = `<p class="empty">Commence par cocher quelques bouteilles dans <b>Mon bar</b> : je te dirai quoi acheter pour débloquer un maximum de cocktails.</p>`;
      return;
    }
    const { singles, pairs } = computeIdeas();
    let html = `<div class="cat"><h2>➕ Un seul achat</h2>`;
    if (!singles.length) html += `<p class="empty small">Aucun cocktail à un seul ingrédient de la réussite.</p>`;
    html += singles.slice(0, 12).map(([id, rs]) => `
      <div class="idea">
        <div>
          <h3>${ingName(id)}</h3>
          <p>Débloque <b>${rs.length}</b> cocktail${rs.length > 1 ? "s" : ""} : ${names(rs)}</p>
        </div>
        <button class="btn small" data-act="addIng" data-id="${id}">Je l'ai</button>
      </div>`).join("");
    html += `</div>`;

    const topPairs = pairs.filter(([, rs]) => rs.length >= 1).slice(0, 8);
    if (topPairs.length) {
      html += `<div class="cat"><h2>➕➕ Deux achats</h2>` + topPairs.map(([key, rs]) => {
        const [a, b] = key.split("|");
        return `<div class="idea">
          <div>
            <h3>${ingName(a)} + ${ingName(b)}</h3>
            <p>Débloque <b>${rs.length}</b> cocktail${rs.length > 1 ? "s" : ""} : ${names(rs)}</p>
          </div>
        </div>`;
      }).join("") + `</div>`;
    }
    $("#ideasList").innerHTML = html;
  }

  /* ---------- Rendu : fiche cocktail ---------- */
  function renderDetail() {
    const el = $("#detail");
    const r = RECIPES.find((x) => x.id === state.detail);
    if (!r) { el.hidden = true; return; }
    const n = state.servings;
    const { missing } = analyze(r);
    const st = strength(r);
    const m = METHODS[r.method || "shaker"];
    const rows = r.ing.map((i) => {
      const have = isOwned(i);
      const alt = (i.alt || []).length ? `<small>ou ${i.alt.map(ingName).join(" / ").toLowerCase()}</small>` : "";
      const tag = i.opt ? `<small>optionnel</small>` : i.top ? `<small>à compléter</small>` : i.float ? `<small>sur le dessus</small>` : "";
      return `<li class="${have ? "have" : i.opt ? "optional" : "need"}">
        <span class="mark">${have ? "✓" : i.opt ? "·" : "✗"}</span>
        <span class="amt">${amount(i, n, doseFactor())}</span>
        <span class="nm">${ingName(i.id)} ${alt} ${tag}</span>
      </li>`;
    }).join("");

    el.innerHTML = `
      <header class="ov-head">
        <button class="icon-btn" data-act="back" aria-label="Retour">←</button>
        <h1>${r.emoji} ${r.name}</h1>
      </header>
      <div class="ov-body">
        <p class="taste">${r.taste}</p>
        <p>${r.desc}</p>
        <div class="meta"><span>${r.emoji} Servi en ${SERVE[r.serve].glass}</span><span>${m.emoji} ${m.label}</span></div>
        <div class="strength">
          <div class="srow"><b>Puissance</b><span class="dots l${st.level}">${dots(st.level)}</span><span class="lvl">${st.label}</span></div>
          <p>≈ <b>${Math.round(st.abv)} % vol</b> · <b>${fmtStd(st.std)}</b> verre${st.std >= 2 ? "s" : ""} standard par verre</p>
          <div class="seg" role="group" aria-label="Dosage">
            ${Object.entries(DOSES).map(([k, d]) =>
              `<button class="${state.dose === k ? "on" : ""}" data-act="dose" data-k="${k}">${d.label}<small>alcool ×${String(d.factor).replace(".", ",")}</small></button>`).join("")}
          </div>
        </div>
        <div class="stepper" aria-label="Nombre de verres">
          <button data-act="serv" data-d="-1" ${n <= 1 ? "disabled" : ""} aria-label="Moins">−</button>
          <span><b>${n}</b> verre${n > 1 ? "s" : ""}</span>
          <button data-act="serv" data-d="1" ${n >= 4 ? "disabled" : ""} aria-label="Plus">＋</button>
        </div>
        <ul class="ings">${rows}</ul>
        ${missing.length
          ? `<div class="warn">Il te manque : ${missing.map((m) => `<button class="chip add" data-act="addIng" data-id="${m.id}">＋ ${ingName(m.id)}</button>`).join(" ")}</div>`
          : ""}
        <p class="tip">🥄 Sans doseur : 1 cl ≈ 2 cuillères à café ≈ 10 ml.<br>Un verre standard contient 10 g d'alcool pur (≈ 25 cl de bière, 10 cl de vin, 3 cl de spiritueux).</p>
      </div>
      <footer class="ov-foot">
        <button class="btn big" data-act="start">▶ Commencer le pas à pas</button>
      </footer>`;
    el.hidden = false;
  }

  /* ---------- Rendu : pas à pas ---------- */
  let timer = null; // { id, left }
  function clearTimer() { if (timer) { clearInterval(timer.id); timer = null; } }

  function renderSteps() {
    const el = $("#steps");
    if (!state.steps) { el.hidden = true; releaseWake(); clearTimer(); return; }
    const { list, i, name } = state.steps;
    const s = list[i];
    const last = i === list.length - 1;
    el.innerHTML = `
      <header class="ov-head">
        <button class="icon-btn" data-act="back" aria-label="Fermer">✕</button>
        <h1>${name}</h1>
        <span class="count">${i + 1}/${list.length}</span>
      </header>
      <div class="progress"><div style="width:${((i + 1) / list.length) * 100}%"></div></div>
      <div class="ov-body step">
        <div class="big-icon">${s.icon}</div>
        <h2>${s.title}</h2>
        <p class="step-text">${s.html}</p>
        ${s.list ? `<ul class="ings">${s.list.map((x) => `<li class="have"><span class="amt">${x.a}</span><span class="nm">${x.name}</span></li>`).join("")}</ul>` : ""}
        ${s.timer ? `<button class="btn timer" id="timerBtn" data-act="timer" data-s="${s.timer}">⏱ Lancer le chrono (${s.timer} s)</button>` : ""}
      </div>
      <footer class="ov-foot two">
        <button class="btn ghost" data-act="prev" ${i === 0 ? "disabled" : ""}>← Précédent</button>
        <button class="btn big" data-act="${last ? "finish" : "next"}">${last ? "Terminer" : "Suivant →"}</button>
      </footer>`;
    el.hidden = false;
    clearTimer();
  }

  function startTimer(seconds) {
    clearTimer();
    const btn = $("#timerBtn");
    if (!btn) return;
    timer = { left: seconds };
    const tick = () => {
      btn.textContent = timer.left > 0 ? `⏱ ${timer.left} s` : "✅ Terminé !";
      btn.classList.toggle("done", timer.left <= 0);
      if (timer.left <= 0) {
        try { navigator.vibrate && navigator.vibrate([250, 100, 250]); } catch { /* ignoré */ }
        clearInterval(timer.id);
        return;
      }
      timer.left -= 1;
    };
    tick();
    timer.id = setInterval(tick, 1000);
  }

  /* Garde l'écran allumé pendant la préparation */
  let wake = null;
  async function requestWake() {
    try { if ("wakeLock" in navigator) wake = await navigator.wakeLock.request("screen"); } catch { /* ignoré */ }
  }
  function releaseWake() {
    try { wake && wake.release(); } catch { /* ignoré */ }
    wake = null;
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.steps) requestWake();
  });

  /* ---------- Navigation (le bouton retour d'Android ferme les écrans) ---------- */
  function applyView(v) {
    v = v || {};
    state.detail = v.detail || null;
    if (!v.steps) state.steps = null;
    renderDetail();
    renderSteps();
  }
  window.addEventListener("popstate", (e) => applyView(e.state));

  function go(view) {
    history.pushState(view, "");
    if (view.detail) state.detail = view.detail;
    if (view.steps) {
      const r = RECIPES.find((x) => x.id === view.detail);
      state.steps = { list: buildSteps(r, state.servings), i: 0, name: r.name };
      requestWake();
    }
    renderDetail();
    renderSteps();
  }

  /* ---------- Onglets ---------- */
  function setTab(t) {
    state.tab = t;
    store.set("cb_tab", t);
    document.querySelectorAll(".tab").forEach((s) => (s.hidden = s.id !== "tab-" + t));
    document.querySelectorAll(".bottom button").forEach((b) => b.classList.toggle("active", b.dataset.tab === t));
    if (t === "bar") renderBarList();
    if (t === "cocktails") renderCocktails();
    if (t === "ideas") renderIdeas();
    window.scrollTo(0, 0);
  }

  function refreshAll() {
    saveOwned();
    setTab(state.tab);
    if (state.detail) renderDetail();
  }

  /* ---------- Événements ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act],[data-tab]");
    if (!t) return;
    if (t.dataset.tab) return setTab(t.dataset.tab);
    const id = t.dataset.id;
    switch (t.dataset.act) {
      case "toggle":
        state.owned.has(id) ? state.owned.delete(id) : state.owned.add(id);
        saveOwned();
        renderBarList();
        break;
      case "clear":
        if (confirm("Vider tout ton inventaire ?")) { state.owned.clear(); refreshAll(); }
        break;
      case "addIng":
        e.stopPropagation();
        state.owned.add(id);
        refreshAll();
        break;
      case "filter":
        state.filter = t.dataset.k;
        renderCocktails();
        break;
      case "sfilter":
        state.sFilter = t.dataset.k;
        renderCocktails();
        break;
      case "mfilter":
        state.mFilter = t.dataset.k;
        renderCocktails();
        break;
      case "dose":
        state.dose = t.dataset.k;
        store.set("cb_dose", state.dose);
        renderDetail();
        break;
      case "open":
        state.servings = 1;
        go({ detail: id });
        break;
      case "back":
        history.back();
        break;
      case "serv":
        state.servings = Math.min(4, Math.max(1, state.servings + Number(t.dataset.d)));
        renderDetail();
        break;
      case "start":
        go({ detail: state.detail, steps: true });
        break;
      case "next":
        state.steps.i += 1;
        renderSteps();
        break;
      case "prev":
        state.steps.i = Math.max(0, state.steps.i - 1);
        renderSteps();
        break;
      case "finish":
        history.go(-2); // ferme le pas à pas et la fiche
        break;
      case "timer":
        startTimer(Number(t.dataset.s));
        break;
    }
  });

  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card")) {
      e.preventDefault();
      e.target.click();
    }
  });

  $("#barSearch").addEventListener("input", (e) => { state.barQ = e.target.value; renderBarList(); });
  $("#cSearch").addEventListener("input", (e) => { state.q = e.target.value; renderCocktails(); });

  /* ---------- Démarrage ---------- */
  history.replaceState({}, "");
  if (state.owned.size === 0) state.tab = "bar";
  setTab(state.tab);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
