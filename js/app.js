(() => {
  "use strict";

  const { C, MP, MC, CO, PR, TOT, NY, DR, TS, S } = window.KoreaStudentsData;

  /* ========================================================================
     DOM References
     ======================================================================== */
  const prog = document.getElementById("prog");
  const mapEl = document.getElementById("map");
  const steps = document.getElementById("steps");
  const stage = document.getElementById("stage");
  const legend = document.getElementById("legend");
  const bars = document.getElementById("bars");
  const sg = document.getElementById("chart");
  const c2 = document.getElementById("chart2");
  const lg2 = document.getElementById("legend2");
  const st2 = document.getElementById("steps2");
  const drill = document.getElementById("drill");

  /* ========================================================================
     Color & Map Helpers
     ======================================================================== */
  const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

  const lerpColor = (a, b, t) => {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    return (
      "#" +
      A.map((x, i) => Math.round(x + (B[i] - x) * t).toString(16).padStart(2, "0")).join("")
    );
  };

  const MET = {
    growth: {
      v: (n) => (PR[n][1] / PR[n][0] - 1) * 100,
      f: (v) => `+${Math.round(v)}%`,
      rg: ["#e9faf2", "#3fbf8e"],
      cap: "Growth in students, April 2025 → April 2026"
    },
    lang: {
      v: (n) => (PR[n][3] / PR[n][1]) * 100,
      f: (v) => `${Math.round(v)}%`,
      rg: ["#fff6dc", "#f2b630"],
      cap: "Share of students in language courses, April 2026"
    },
    women: {
      v: (n) => (PR[n][2] / PR[n][1]) * 100,
      f: (v) => `${Math.round(v)}%`,
      div: true,
      cap: "Share of women among students, April 2026"
    }
  };

  const DOTS_MAP_CAP = "Each dot is about 3,000 students · hover or tap a province for details";
  let defaultMapCap = "";

  function drawMap(key) {
    if (key === "dots") {
      mapEl.innerHTML = Object.keys(MP)
        .map((n) => `<path class="prov" data-n="${n}" d="${MP[n]}" style="fill:var(--n)"/>`)
        .join("");
      defaultMapCap = DOTS_MAP_CAP;
      legend.innerHTML = `<span class="cap2" id="mcap">${defaultMapCap}</span>`;
      mapEl.dataset.k = key;
      return;
    }

    const M = MET[key];
    const ns = Object.keys(MP);
    const vs = ns.map(M.v);
    const lo = Math.min(...vs);
    const hi = Math.max(...vs);

    const col = (v) => {
      if (M.div) {
        const d = (v - 50) / 20;
        return d < 0
          ? lerpColor("#ffffff", "#7ec8ee", Math.min(1, -d))
          : lerpColor("#ffffff", "#f6819f", Math.min(1, d));
      }
      const t = (v - lo) / (hi - lo);
      return lerpColor(M.rg[0], M.rg[1], t);
    };

    let pathsHtml = "";
    let labelsHtml = "";

    ns.forEach((n) => {
      const v = M.v(n);
      pathsHtml += `<path class="prov" data-n="${n}" d="${MP[n]}" fill="${col(v)}"/>`;
      const [x, y] = MC[n];
      const c = CO[n];
      if (c) {
        labelsHtml +=
          `<line class="ml" x1="${x}" y1="${y}" x2="${c[0] + (c[2] === "end" ? 4 : -4)}" y2="${c[1] - 3}"/>` +
          `<circle cx="${x}" cy="${y}" r="1.6" fill="var(--ink)"/>` +
          `<text class="mo" x="${c[0]}" y="${c[1]}" text-anchor="${c[2]}">${n} ${M.f(v)}</text>`;
      } else {
        labelsHtml += `<text class="mt" x="${x}" y="${y}">${n}<tspan class="mv" x="${x}" dy="11">${M.f(v)}</tspan></text>`;
      }
    });

    mapEl.innerHTML = pathsHtml + labelsHtml;
    defaultMapCap = M.cap;

    const grad = M.div
      ? "linear-gradient(90deg,#7ec8ee,#ffffff,#f6819f)"
      : `linear-gradient(90deg,${M.rg[0]},${M.rg[1]})`;

    legend.innerHTML =
      `<div class="rw">` +
      `<div class="ramp" style="background:${grad};border:1px solid var(--n)"></div>` +
      `<div class="rl"><b>${M.div ? "More men" : M.f(lo)}</b><b>${M.div ? "More women" : M.f(hi)}</b></div>` +
      `</div>` +
      `<span class="cap2" id="mcap">${defaultMapCap}</span>`;
    mapEl.dataset.k = key;
  }

  function showProvinceDetails(e) {
    const prov = e.target.closest(".prov");
    if (!prov) return;
    const n = prov.dataset.n;
    const P = PR[n];
    const capEl = document.getElementById("mcap");
    if (!capEl || !P) return;
    const sign = P[1] >= P[0] ? "+" : "";
    const growth = Math.round((P[1] / P[0] - 1) * 100);
    const womenPct = Math.round((P[2] / P[1]) * 100);
    const langPct = Math.round((P[3] / P[1]) * 100);
    capEl.textContent =
      `${n} · ${P[1].toLocaleString("en-US")} students · ${sign}${growth}% vs 2025 · ${womenPct}% women · ${langPct}% in language courses`;
  }

  mapEl.addEventListener("pointerover", showProvinceDetails);
  mapEl.addEventListener("pointerdown", showProvinceDetails);
  mapEl.addEventListener("pointerleave", () => {
    const capEl = document.getElementById("mcap");
    if (capEl && defaultMapCap) capEl.textContent = defaultMapCap;
  });

  /* ========================================================================
     Section 2: 100-Student Figure Stage & Bar Charts
     ======================================================================== */
  const PSVG =
    '<svg viewBox="0 0 24 40" aria-hidden="true"><g class="bob">' +
    '<circle cx="12" cy="6" r="5.5"/>' +
    '<rect x="4" y="13" width="16" height="15" rx="6"/>' +
    '<rect class="am a1" x="5.2" y="16" width="3.6" height="12.5" rx="1.8"/>' +
    '<rect class="am a2" x="15.2" y="16" width="3.6" height="12.5" rx="1.8"/>' +
    '<rect class="lg l" x="6.5" y="24" width="4.5" height="15" rx="2"/>' +
    '<rect class="lg r" x="13" y="24" width="4.5" height="15" rx="2"/>' +
    "</g></svg>";

  const dots = [];
  for (let i = 0; i < 100; i++) {
    const d = document.createElement("div");
    d.className = "dot";
    d.dataset.k = "n";
    d.innerHTML = PSVG;
    d.style.setProperty("--ph", (-Math.random() * 0.5).toFixed(2) + "s");
    stage.appendChild(d);
    dots.push(d);
  }

  const labs = [];
  for (let i = 0; i < 6; i++) {
    const d = document.createElement("div");
    d.className = "gl";
    stage.appendChild(d);
    labs.push(d);
  }

  S.forEach((s, i) => {
    const el = document.createElement("section");
    el.className = "step";
    el.dataset.i = i;
    el.innerHTML = `<div class="box"><h2>${s.h}</h2><p>${s.t}</p></div>`;
    steps.appendChild(el);
  });

  let sel = null;

  function dim() {
    dots.forEach((d) => d.classList.toggle("dim", Boolean(sel) && d.dataset.k !== sel));
    [...legend.querySelectorAll("button[data-k]")].forEach((btn) => {
      const active = btn.dataset.k === sel;
      btn.classList.toggle("sel", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  const PRESET = {
    2: [[30, 190], [290, 190]],
    3: [[30, 120], [290, 120], [160, 300]],
    4: [[30, 105], [290, 105], [30, 285], [290, 285]],
    5: [[20, 100], [300, 100], [20, 285], [300, 285], [160, 195]]
  };

  const MD = {
    Seoul: [125, 66],
    Gyeonggi: [186, 92],
    Incheon: [92, 100]
  };

  const SQ = Math.sqrt;

  function sunflower(cx, cy, n, c, kx = 1, ky = 1) {
    const out = [];
    for (let j = 0; j < n; j++) {
      const r = c * SQ(j + 0.5);
      const a = j * 2.39996;
      out.push([cx + r * kx * Math.cos(a), cy + r * ky * Math.sin(a), 1]);
    }
    return out;
  }

  function layout(s) {
    const P = [];
    const Lb = [];

    if (s.map === "dots") {
      const ns = Object.keys(PR);
      const tot = ns.reduce((a, n) => a + PR[n][1], 0);
      const raw = ns.map((n) => (PR[n][1] / tot) * 100);
      const cnt = raw.map(Math.floor);
      raw
        .map((v, i) => [v - Math.floor(v), i])
        .sort((a, b) => b[0] - a[0])
        .slice(0, 100 - cnt.reduce((a, b) => a + b, 0))
        .forEach(([, i]) => cnt[i]++);

      ns.forEach((n, i) => {
        const center = MD[n] || MC[n];
        sunflower(center[0], center[1], cnt[i], 5.2, 0.9, 1.45).forEach((q) => {
          q[2] = 0.55;
          P.push(q);
        });
        if (["Seoul", "Gyeonggi", "Busan"].includes(n)) {
          Lb.push([center[0], center[1] - 5.2 * 1.45 * SQ(cnt[i]) - 16, `${n} ${cnt[i]}%`]);
        }
      });
      return { P, Lb };
    }

    if (s.ppl || s.a.length === 1) {
      for (let i = 0; i < 100; i++) {
        P.push([160 + ((i % 10) - 4.5) * 28, 190 + (Math.floor(i / 10) - 4.5) * 34, 1]);
      }
      return { P, Lb };
    }

    const g = s.a;
    const pr = PRESET[Math.min(g.length, 5)];
    const st = [];
    let acc = 0;
    g.forEach((x, i) => {
      st[i] = acc;
      acc += x[1];
    });

    g.map((x, i) => [x, i])
      .sort((a, b) => b[0][1] - a[0][1])
      .forEach(([[key, n], gi], k) => {
        const [cx, cy] = pr[k];
        const cols = Math.max(3, Math.ceil(SQ(n * 1.3)));
        const rows = Math.ceil(n / cols);
        for (let j = 0; j < n; j++) {
          const r = Math.floor(j / cols);
          const c = j % cols;
          const w = r < rows - 1 ? cols : n - cols * (rows - 1);
          P[st[gi] + j] = [cx + (c - (w - 1) / 2) * 16, cy + (r - (rows - 1) / 2) * 28, 1];
        }
        const nm = (s.lg.find((l) => l[0] === key) || [])[1];
        if (nm) Lb.push([cx, cy + rows * 14 + 16, `${nm} · ${n}`]);
      });

    return { P, Lb };
  }

  function show(i) {
    sel = null;
    const s = S[i];

    if (s.bars) {
      stage.classList.add("hide");
      bars.classList.add("show");
      const b = s.bars;
      bars.innerHTML = b.rows
        .map(([label, value, colorKey, text, desc]) => {
          const widthPct = (Math.abs(value) / b.max) * 76;
          const fill = C[colorKey] || colorKey;
          const extraStyle = desc ? ";height:auto;min-height:30px" : "";
          const descHtml = desc ? `<span class="bd" style="--w:${widthPct}">${desc}</span>` : "";
          return (
            `<div class="row">` +
            `<span class="lab">${label}</span>` +
            `<div class="track">` +
            `<div class="bar" data-w="${widthPct}" style="background:${fill}${extraStyle}">${descHtml}</div>` +
            `<b class="val">${text || value.toLocaleString("en-US")}</b>` +
            `</div></div>`
          );
        })
        .join("");
      legend.innerHTML = `<span class="cap">${b.cap}</span>`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          bars.querySelectorAll(".bar").forEach((x) => {
            x.style.width = `${x.dataset.w}%`;
          });
        })
      );
      return;
    }

    if (stage.classList.contains("hide")) {
      stage.classList.remove("hide");
      void stage.offsetWidth;
    }
    bars.classList.remove("show");

    const fade = Boolean(s.map) && s.map !== "dots";
    const L = fade ? { P: [], Lb: [] } : layout(s);
    const pct = (x, y) => [((x + 60) / 440) * 100, (y / 379) * 100];

    dots.forEach((d, j) => {
      if (!fade) {
        const q = L.P[j] || [160, 190, 1];
        const [x, y] = pct(q[0], q[1]);
        if (Math.abs((d._x || 0) - x) > 0.05 || Math.abs((d._y || 0) - y) > 0.05) {
          d.classList.add("walk");
          clearTimeout(d._t);
          d._t = setTimeout(() => d.classList.remove("walk"), 1250 + j * 5);
        }
        d._x = x;
        d._y = y;
        d.style.left = `${x}%`;
        d.style.top = `${y}%`;
        d.style.setProperty("--s", q[2]);
        d.style.transitionDelay = `${j * 5}ms`;
      }
      d.classList.toggle("off", fade);
    });

    if (s.map) {
      if (!fade) {
        dots.forEach((d) => {
          d.style.color = C.v;
          d.dataset.k = "x";
        });
      }
    } else {
      let k = 0;
      s.a.forEach(([key, n]) => {
        for (let j = 0; j < n && k < dots.length; j++, k++) {
          dots[k].style.color = C[key];
          dots[k].dataset.k = key;
        }
      });
    }

    labs.forEach((el, j) => {
      const t = L.Lb[j];
      if (t) {
        const [x, y] = pct(t[0], t[1]);
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.textContent = t[2];
        el.style.opacity = 1;
      } else {
        el.style.opacity = 0;
      }
    });

    mapEl.classList.toggle("show", Boolean(s.map));
    if (s.map) {
      drawMap(s.map);
      return;
    }

    legend.innerHTML = s.lg
      .map(
        ([key, name]) =>
          `<button type="button" data-k="${key}" aria-pressed="false"><i style="background:${C[key]}"></i>${name}</button>`
      )
      .join("");

    legend.querySelectorAll("button[data-k]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sel = sel === btn.dataset.k ? null : btn.dataset.k;
        dim();
      });
    });

    dim();
  }

  /* ========================================================================
     Section 1: Timeline Bar Chart & 2018-2026 Nationality Line Race
     ======================================================================== */
  const CC = { n: "var(--o)" };

  TS.forEach((s, i) => {
    const el = document.createElement("section");
    el.className = "step";
    el.dataset.i = i;
    el.dataset.g = "2";
    el.innerHTML = `<div class="box"><h2>${s.h}</h2><p>${s.t}</p></div>`;
    st2.appendChild(el);
  });

  const CW = 600;
  const CH = 330;
  const CL = 8;
  const CB = 30;
  const CT = 26;
  const SP = (CW - 2 * CL) / TOT.length;
  const BW = 15;
  const MAXV = 320000;
  const SC = (CH - CB - CT) / MAXV;

  let barSvg = "";
  TOT.forEach((v, i) => {
    const y = 1999 + i;
    const x = CL + i * SP + (SP - BW) / 2;
    const h = v * SC;
    const top = CH - CB - h;
    barSvg += `<rect class="seg" data-y="${y}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${BW}" height="${h.toFixed(1)}" rx="1.5" fill="${CC.n}" opacity="0"/>`;
  });

  TOT.forEach((_, i) => {
    barSvg += `<rect class="hy" data-y="${1999 + i}" x="${(CL + i * SP).toFixed(1)}" y="${CT}" width="${SP.toFixed(1)}" height="${CH - CB - CT}" fill="transparent"/>`;
  });

  [1999, 2005, 2010, 2015, 2020, 2026].forEach((y) => {
    barSvg += `<text x="${(CL + (y - 1999) * SP + SP / 2).toFixed(1)}" y="${CH - 10}" text-anchor="middle">${y}</text>`;
  });

  barSvg += `<text class="tv" id="tv" text-anchor="middle" x="0" y="0"></text>`;
  sg.innerHTML = barSvg;

  const segEls = [...sg.querySelectorAll(".seg")];
  const tv = document.getElementById("tv");
  let cur2 = null;

  const yearCaption = (y) => `${y} · ${TOT[y - 1999].toLocaleString("en-US")} students`;

  const YR = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const LC = { c: "#4fb7e8", v: "#ff6f9b", u: "#45c997", o: "#9a8fd0" };
  const LL = { c: "China", v: "Vietnam", u: "Uzbekistan", o: "Everyone else (incl. Mongolia)" };
  const LS = { c: "China", v: "Vietnam", u: "Uzbekistan", o: "Others" };
  const KO = ["c", "v", "u", "o"];

  const SER = {
    c: YR.map((y) => NY[y][0]),
    v: YR.map((y) => NY[y][1]),
    u: YR.map((y) => NY[y][2]),
    o: YR.map((y) => TOT[y - 1999] - NY[y][0] - NY[y][1] - NY[y][2])
  };

  const X0 = 46;
  const XW = 600 - 46 - 118;
  const Y1 = 298;
  const YH = 276;
  const X = (i) => X0 + (i * XW) / 8;
  const Y = (v) => Y1 - (v / 120000) * YH;

  (function buildLineChart() {
    let h = `<text id="yr" x="${X0 + 12}" y="76">2018</text>`;
    [0, 40000, 80000, 120000].forEach((v) => {
      h +=
        `<line class="gridl" x1="${X0}" x2="${X0 + XW}" y1="${Y(v)}" y2="${Y(v)}"/>` +
        `<text x="${X0 - 8}" y="${Y(v) + 4}" text-anchor="end">${v ? `${v / 1000}k` : "0"}</text>`;
    });

    YR.forEach((y, i) => {
      h += `<text x="${X(i)}" y="318" text-anchor="middle">${y}${y === 2026 ? "*" : ""}</text>`;
    });

    ["o", "u", "c", "v"].forEach((k) => {
      const pts = SER[k].map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
      const last = SER[k][8];
      h +=
        `<g class="lg" data-k="${k}">` +
        `<path class="ln" d="M${pts.join("L")}" stroke="${LC[k]}" fill="none" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<circle class="ed" cx="${X(8)}" cy="${Y(last)}" r="5" fill="${LC[k]}"/>` +
        `<text class="el" x="${X(8) + 10}" y="${Y(last) + 4}">${LS[k]} ${(last / 1000).toFixed(1)}k</text>` +
        `</g>`;
    });

    h +=
      `<line id="gd" y1="22" y2="${Y1}" stroke="var(--mute)" stroke-dasharray="3 3" opacity="0"/>` +
      `<rect id="hit" width="600" height="330" fill="transparent"/>`;
    c2.innerHTML = h;
  })();

  const gd = c2.querySelector("#gd");
  let curR = 0;

  function race(r) {
    curR = r;
    const n = Math.min(8, Math.floor(r));
    const f = Math.min(1, r - n);
    const labels = [];

    KO.forEach((k) => {
      const series = SER[k];
      const pts = [];
      for (let i = 0; i <= n; i++) pts.push([X(i), Y(series[i])]);

      let hv = series[n];
      let hx = X(n);
      let hy = Y(hv);
      if (f > 0 && n < 8) {
        hv = series[n] + (series[n + 1] - series[n]) * f;
        hx = X(n + f);
        hy = Y(hv);
        pts.push([hx, hy]);
      }

      const g = c2.querySelector(`.lg[data-k="${k}"]`);
      const dStr =
        "M" +
        pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join("L") +
        (pts.length === 1 ? "l.1,0" : "");
      g.querySelector(".ln").setAttribute("d", dStr);

      const dot = g.querySelector(".ed");
      dot.setAttribute("cx", hx);
      dot.setAttribute("cy", hy);
      labels.push({ k, hx, ty: hy + 4, hv, t: g.querySelector(".el") });
    });

    labels.sort((a, b) => a.ty - b.ty);
    for (let i = 1; i < labels.length; i++) {
      if (labels[i].ty - labels[i - 1].ty < 15) {
        labels[i].ty = labels[i - 1].ty + 15;
      }
    }

    labels.forEach((o) => {
      o.t.setAttribute("x", o.hx + 10);
      o.t.setAttribute("y", o.ty);
      o.t.textContent = `${LS[o.k]} ${(o.hv / 1000).toFixed(1)}k`;
    });

    const yi = Math.min(8, Math.round(r));
    c2.querySelector("#yr").textContent = YR[yi] + (yi === 8 ? "*" : "");
  }

  function raceAt(a, t) {
    const s = TS[a];
    if (!s || s.mode !== "l") return;
    const nx = TS[a + 1];
    race(nx && nx.mode === "l" ? s.yr + (nx.yr - s.yr) * t : s.yr);
  }

  function tip(y) {
    if (!cur2) return;
    const targetYear = y || cur2.lim;
    const li = targetYear - 1999;
    const x = Math.max(60, Math.min(CW - 60, CL + li * SP + SP / 2));
    tv.textContent = (y ? `${y} · ` : "") + TOT[li].toLocaleString("en-US");
    tv.setAttribute("x", x.toFixed(1));
    tv.setAttribute("y", (CH - CB - TOT[li] * SC - 8).toFixed(1));
    segEls.forEach((r) => {
      r.style.opacity = y && +r.dataset.y <= cur2.lim && +r.dataset.y !== y ? 0.4 : "";
    });
  }

  function show2(i) {
    const s = TS[i];
    cur2 = s;
    const isLine = s.mode === "l";
    closeDrill();
    sg.classList.toggle("gone", isLine);
    c2.classList.toggle("live", isLine);

    if (isLine) {
      c2.querySelectorAll(".lg").forEach((g) => {
        g.style.opacity = s.hl.length && !s.hl.includes(g.dataset.k) ? 0.15 : 1;
      });
      lg2.innerHTML =
        KO.map((k) =>
          k === "o"
            ? `<button type="button" id="oth" class="oth-btn${s.hl.includes("o") ? " pulse" : ""}"><i style="background:${LC[k]}"></i>${LL[k]} ▸ click</button>`
            : `<span><i style="background:${LC[k]}"></i>${LL[k]}</span>`
        ).join("") + `<span class="cap2" id="cap2">${s.note}</span>`;
      const othBtn = document.getElementById("oth");
      if (othBtn) othBtn.addEventListener("click", openDrill);
      return;
    }

    segEls.forEach((r) => {
      r.style.opacity = "";
      r.setAttribute("fill", CC.n);
      r.setAttribute("opacity", +r.dataset.y <= s.lim ? 1 : 0);
    });
    tip(0);
    lg2.innerHTML = `<span class="cap2" id="cap2">${yearCaption(s.lim)}</span>`;
  }

  race(0);

  /* ========================================================================
     "Others" Country Drill-down Modal
     ======================================================================== */
  function openDrill() {
    drill.innerHTML =
      `<button type="button" class="dx" aria-label="Close">×</button>` +
      `<h3>What’s inside “Others”?</h3>` +
      `<p>The 85,963 students from outside China, Vietnam and Uzbekistan, by country, April 2025</p>` +
      `<div class="dbars">${DR.map(
        ([name, count], idx) =>
          `<div class="row"><span class="lab">${name}</span><div class="track">` +
          `<div class="bar" data-w="${(count / 24000) * 76}" style="background:${idx === DR.length - 1 ? "var(--g)" : "#b9a2f5"}"></div>` +
          `<b class="val">${count.toLocaleString("en-US")}</b></div></div>`
      ).join("")}</div>` +
      `<small>Country-level detail is only available for 2025 in the data files. Press Esc or tap × to go back.</small>`;
    drill.classList.add("show");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        drill.querySelectorAll(".bar").forEach((b) => {
          b.style.width = `${b.dataset.w}%`;
        });
      })
    );
  }

  function closeDrill() {
    drill.classList.remove("show");
  }

  drill.addEventListener("click", (e) => {
    if (e.target === drill || e.target.closest(".dx")) closeDrill();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrill();
  });

  /* ========================================================================
     Chart Hover / Click Interactions
     ======================================================================== */
  function nearOthers(e) {
    if (!cur2 || cur2.mode !== "l") return false;
    const labelEl = c2.querySelector('.lg[data-k="o"] .el');
    if (!labelEl) return false;
    const rect = labelEl.getBoundingClientRect();
    const pad = 12;
    return (
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    );
  }

  function clientToSvgX(svgEl, clientX, clientY) {
    const ctm = svgEl.getScreenCTM();
    if (ctm) {
      const pt = svgEl.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      return pt.matrixTransform(ctm.inverse()).x;
    }
    const r = svgEl.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 600;
  }

  c2.addEventListener("click", (e) => {
    if (nearOthers(e)) openDrill();
  });

  c2.addEventListener("pointermove", (e) => {
    c2.style.cursor = nearOthers(e) ? "pointer" : "";
    if (!cur2 || cur2.mode !== "l") return;

    const vx = clientToSvgX(c2, e.clientX, e.clientY);
    const maxIdx = Math.floor(curR + 1e-6);
    const idx = Math.max(0, Math.min(maxIdx, Math.round((vx - X0) / (XW / 8))));

    gd.setAttribute("x1", X(idx));
    gd.setAttribute("x2", X(idx));
    gd.setAttribute("opacity", 1);

    const capEl = document.getElementById("cap2");
    if (capEl) {
      capEl.textContent =
        `${YR[idx]}${idx === 8 ? "*" : ""} · ` +
        KO.map((k) => `${LS[k]} ${SER[k][idx].toLocaleString("en-US")}`).join(" · ");
    }
  });

  c2.addEventListener("pointerleave", () => {
    gd.setAttribute("opacity", 0);
    const capEl = document.getElementById("cap2");
    if (capEl && cur2 && cur2.note) capEl.textContent = cur2.note;
  });

  const handleBarHover = (e) => {
    const target = e.target.closest(".seg, .hy");
    if (!target || !cur2 || cur2.mode === "l" || +target.dataset.y > cur2.lim) return;
    const y = +target.dataset.y;
    tip(y);
    const capEl = document.getElementById("cap2");
    if (capEl) capEl.textContent = yearCaption(y);
  };

  sg.addEventListener("pointerover", handleBarHover);
  sg.addEventListener("pointerdown", handleBarHover);
  sg.addEventListener("pointerleave", () => {
    if (cur2 && cur2.mode !== "l") {
      tip(0);
      const capEl = document.getElementById("cap2");
      if (capEl) capEl.textContent = yearCaption(cur2.lim);
    }
  });

  /* ========================================================================
     Scroll Synchronization & Progress Bar
     ======================================================================== */
  const groups = [
    { w: steps.closest(".wrap"), el: steps, fn: show, i: -1 },
    { w: st2.closest(".wrap"), el: st2, fn: show2, pf: raceAt, i: -1 }
  ];

  let rafId = 0;

  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.max(0, Math.min(100, (window.scrollY / maxScroll) * 100)) : 0;
    prog.style.width = `${pct}%`;
  }

  function sync() {
    rafId = 0;
    updateProgress();

    const line = window.innerHeight * (window.innerWidth <= 760 ? 0.85 : 0.55);
    groups.forEach((g) => {
      const r = g.w.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;

      const stepEls = [...g.el.children];
      const centers = stepEls.map((el) => {
        const box = el.firstElementChild.getBoundingClientRect();
        return box.top + box.height / 2;
      });

      let active = 0;
      centers.forEach((c, idx) => {
        if (c <= line) active = idx;
      });

      stepEls.forEach((el, idx) => el.classList.toggle("on", idx === active));

      if (active !== g.i) {
        g.i = active;
        g.fn(active);
      }

      if (g.pf) {
        const t =
          active < centers.length - 1
            ? Math.max(0, Math.min(1, (line - centers[active]) / (centers[active + 1] - centers[active])))
            : 0;
        g.pf(active, t);
      }
    });
  }

  const requestSync = () => {
    if (!rafId) rafId = requestAnimationFrame(sync);
  };

  window.addEventListener("scroll", requestSync, { passive: true });
  window.addEventListener("resize", requestSync);
  window.addEventListener("load", requestSync);

  // Ensure initial state renders cleanly even on short viewports
  show2(0);
  groups[1].i = 0;
  sync();
})();
