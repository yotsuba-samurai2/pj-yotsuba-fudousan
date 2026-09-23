/* global L */
// 地図の文言（4言語）。親ページが iframe の src に ?lang=en|zh-tw|zh を付ける。
// 校名・学校所在地は区の公表どおり日本語のまま出す（学区ページの「校名沿用官方日文名稱」と同じ方針）。
const LANG = (() => {
  const lang = new URLSearchParams(location.search).get("lang");
  return ["en", "zh-tw", "zh"].includes(lang) ? lang : "ja";
})();
const localePath = path => (LANG === "ja" ? path : `/${LANG}${path}`);
const NOTE_SOURCE = "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-2023.html";
const NOTE_CITY = "https://www.city.bunkyo.lg.jp/b048/p002107.html";
const T = {
  ja: {
    mapOn: "地図を動かす", mapOff: "地図操作を終了",
    helpScroll: "地図の上でも上下にスクロールできます。拡大・縮小は＋／−ボタンで操作できます。",
    helpDrag: "地図を指で動かせます。ページに戻るときは「地図操作を終了」を押してください。",
    pick: "学校名を選ぶと学区が拡大します", gsi: "国土地理院",
    tooltip: n => `${n}の学区（参考図）`, showing: n => `${n}の学区を表示中`, zoomTitle: n => `${n}の学区を拡大`,
    hint: "地図を拡大", address: a => `学校所在地：${a}`, rentals: "この学区の賃貸物件を見る →", guide: "通学区域の紹介",
  },
  en: {
    navLabel: "Map controls and return", back: "← Back to the school district page", backToList: "Back to school list ↓",
    mapOn: "Move the map", mapOff: "Stop moving the map",
    helpScroll: "You can scroll the page over the map. Use the + / − buttons to zoom.",
    helpDrag: "You can move the map with your finger. Press “Stop moving the map” to return to the page.",
    mapLabel: "Outline map of the 20 Bunkyo city elementary school districts",
    pick: "Choose a school to zoom in on its district", reset: "Show all districts",
    error: r => `The map could not be loaded. Reload the page or see the <a href="${r}" target="_top">rentals by school district</a>.`,
    listLabel: "Choose an elementary school to show on the map", gsi: "GSI Japan",
    note: `Map: processed from the Ministry of Land, Infrastructure, Transport and Tourism <a href="${NOTE_SOURCE}" target="_blank" rel="noopener">National Land Numerical Information: Elementary School District Data (FY2023)</a> (CC BY 4.0, retrieved September 23, 2026). All 20 districts are drawn from the same source. Seishi, Sendagi, Showa and Kubomachi are shown in color; the other 16 schools in black and white. School-name labels mark the district, not the school building. This map shows approximate areas for reference and may differ from the latest designations, lot and building numbers, or divisions by former town names. Check the exact districts in <a href="${NOTE_CITY}" target="_blank" rel="noopener">Bunkyo City’s school district table (updated January 9, 2026)</a>. We determine the school district of a property from the city’s table, not from this map. Base map: Geospatial Information Authority of Japan. School names and addresses are shown in their official Japanese form.`,
    tooltip: n => `${n} district (reference map)`, showing: n => `Showing the ${n} district`, zoomTitle: n => `Zoom in on the ${n} district`,
    hint: "Zoom in on map", address: a => `School address: ${a}`, rentals: "View rentals in this district →", guide: "School district guide",
  },
  "zh-tw": {
    navLabel: "地圖操作與返回", back: "← 返回學區頁面", backToList: "返回學校列表 ↓",
    mapOn: "移動地圖", mapOff: "結束地圖操作",
    helpScroll: "在地圖上也可以上下捲動頁面。請用＋／−按鈕放大或縮小。",
    helpDrag: "可以用手指移動地圖。要回到頁面時，請按「結束地圖操作」。",
    mapLabel: "文京區20所小學學區概略圖",
    pick: "選擇學校即可放大該學區", reset: "顯示全部學區",
    error: r => `無法載入地圖。請重新整理頁面，或查看<a href="${r}" target="_top">依學區分類的出租物件列表</a>。`,
    listLabel: "選擇要在地圖上顯示的小學", gsi: "國土地理院",
    note: `地圖：依國土交通省<a href="${NOTE_SOURCE}" target="_blank" rel="noopener">「國土數值資訊 小學校區資料（2023年度）」</a>加工（CC BY 4.0，2026年9月23日取得）。20校的界線皆以同一資料繪製。誠之、千駄木、昭和、窪町4校以彩色顯示，其他16校為黑白。校名標示的位置為學區的標記，並非校舍所在地。本地圖為顯示大致範圍的參考圖，可能與最新的指定狀況、番・號或依舊町名的劃分不同。正確的通學區域請以<a href="${NOTE_CITY}" target="_blank" rel="noopener">文京區的通學區域表（2026年1月9日更新）</a>為準。判定物件的學區時，本公司使用區的通學區域表，而非本參考圖。底圖：國土地理院。校名與地址沿用官方日文名稱。`,
    tooltip: n => `${n}的學區（參考圖）`, showing: n => `正在顯示${n}的學區`, zoomTitle: n => `放大${n}的學區`,
    hint: "放大地圖", address: a => `學校地址：${a}`, rentals: "查看此學區的出租物件 →", guide: "通學區域介紹",
  },
  zh: {
    navLabel: "地图操作与返回", back: "← 返回学区页面", backToList: "返回学校列表 ↓",
    mapOn: "移动地图", mapOff: "结束地图操作",
    helpScroll: "在地图上也可以上下滚动页面。请用＋／−按钮放大或缩小。",
    helpDrag: "可以用手指移动地图。要返回页面时，请按「结束地图操作」。",
    mapLabel: "文京区20所小学学区概略图",
    pick: "选择学校即可放大该学区", reset: "显示全部学区",
    error: r => `无法加载地图。请刷新页面，或查看<a href="${r}" target="_top">按学区分类的出租房源列表</a>。`,
    listLabel: "选择要在地图上显示的小学", gsi: "国土地理院",
    note: `地图：依据国土交通省<a href="${NOTE_SOURCE}" target="_blank" rel="noopener">「国土数值信息 小学校区数据（2023年度）」</a>加工（CC BY 4.0，2026年9月23日获取）。20校的边界均按同一资料绘制。誠之、千駄木、昭和、窪町4校以彩色显示，其他16校为黑白。校名标注的位置是学区的标记，并非校舍所在地。本地图是显示大致范围的参考图，可能与最新的指定情况、番・号或按旧町名的划分不同。准确的通学区域请以<a href="${NOTE_CITY}" target="_blank" rel="noopener">文京区的通学区域表（2026年1月9日更新）</a>为准。判定房源的学区时，本公司使用区的通学区域表，而非本参考图。底图：国土地理院。校名与地址沿用官方日文名称。`,
    tooltip: n => `${n}的学区（参考图）`, showing: n => `正在显示${n}的学区`, zoomTitle: n => `放大${n}的学区`,
    hint: "放大地图", address: a => `学校地址：${a}`, rentals: "查看此学区的出租房源 →", guide: "通学区域介绍",
  },
}[LANG];
// 日本語は HTML の原文をそのまま使う。他言語だけ静的な文言を差し替える。
if (LANG !== "ja") {
  document.documentElement.lang = LANG === "zh-tw" ? "zh-Hant-TW" : LANG === "zh" ? "zh-Hans-CN" : "en";
  document.getElementById("map-nav").setAttribute("aria-label", T.navLabel);
  document.getElementById("back-to-list").textContent = T.backToList;
  document.getElementById("map").setAttribute("aria-label", T.mapLabel);
  document.getElementById("selection").textContent = T.pick;
  document.getElementById("reset").textContent = T.reset;
  document.getElementById("error").innerHTML = T.error(localePath("/gakku/rentals"));
  document.getElementById("list").setAttribute("aria-label", T.listLabel);
  document.getElementById("note").innerHTML = T.note;
}
{
  const back = document.getElementById("back-to-page");
  back.href = localePath("/gakku");
  if (T.back) back.textContent = T.back;
}
(async function () {
  const colors = { seishi: "#A23B3B", sendagi: "#3C7A4A", showa: "#2F5E8C", kubomachi: "#6B4E8A" };
  const list = document.getElementById("list");
  const selection = document.getElementById("selection");
  const reset = document.getElementById("reset");
  const interaction = document.getElementById("map-interaction");
  const gestureHelp = document.getElementById("gesture-help");
  const mapElement = document.getElementById("map");
  const touchLayout = window.matchMedia("(any-pointer: coarse), (max-width: 600px)");
  let endMapInteraction;
  document.getElementById("back-to-page").hidden = parent !== window;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const notify = type => parent.postMessage({ type }, location.origin);
  const postHeight = () => parent.postMessage({ type: "gakku-map-height", h: document.documentElement.scrollHeight }, location.origin);
  new ResizeObserver(postHeight).observe(document.body);
  window.addEventListener("load", postHeight);
  // A real return action; scrolling does not add iframe/browser history entries.
  document.getElementById("back-to-list").addEventListener("click", () => {
    endMapInteraction?.();
    const target = list.querySelector(".school.selected") || list;
    target.querySelector("button")?.focus({ preventScroll: true });
    if (parent === window) target.scrollIntoView({ block: "start", behavior: "instant" });
    else notify("gakku-map-list");
  });
  try {
    const response = await fetch("/gakku/bunkyo-school-areas.json");
    if (!response.ok) throw new Error("School areas unavailable");
    const data = await response.json();
    if (data.features.length !== 20) throw new Error("Incomplete school areas");
    const map = L.map("map", {
      scrollWheelZoom: false, zoomSnap: 0.25, zoomDelta: 0.5,
      dragging: !touchLayout.matches, touchZoom: !touchLayout.matches,
      doubleClickZoom: !touchLayout.matches, tapHold: false,
    }).setView([35.722, 139.748], 14);
    function setInteraction(enabled) {
      const pageScroll = touchLayout.matches && !enabled;
      for (const handler of [map.dragging, map.touchZoom, map.doubleClickZoom]) {
        if (pageScroll) handler.disable(); else handler.enable();
      }
      mapElement.dataset.pageScroll = String(pageScroll);
      interaction.hidden = !touchLayout.matches;
      gestureHelp.hidden = !touchLayout.matches;
      interaction.setAttribute("aria-pressed", String(touchLayout.matches && enabled));
      interaction.textContent = enabled ? T.mapOff : T.mapOn;
      gestureHelp.textContent = pageScroll ? T.helpScroll : T.helpDrag;
    }
    setInteraction(false);
    interaction.disabled = false;
    interaction.addEventListener("click", () => setInteraction(interaction.getAttribute("aria-pressed") !== "true"));
    endMapInteraction = () => setInteraction(false);
    touchLayout.addEventListener("change", () => setInteraction(false));
    mapElement.addEventListener("keydown", event => { if (event.key === "Escape") setInteraction(false); });
    L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: `<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">${T.gsi}</a>`,
    }).addTo(map);
    const layers = new Map(), cards = new Map(), labels = new Map();
    let selected = null;
    const style = feature => {
      const key = feature.properties.school, color = colors[key];
      return { color: key === selected ? "#333" : (color || "#666"), weight: key === selected ? 1.8 : 1,
        fillColor: color || (key === selected ? "#777" : "#ddd"), fillOpacity: key === selected ? 0.34 : (color ? 0.3 : 0.16) };
    };
    const zones = L.geoJSON(data, {
      style,
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layers.set(p.school, layer);
        layer.bindTooltip(T.tooltip(p.name), { sticky: true });
        layer.on("click", () => select(p.school, false));
      },
    }).addTo(map);
    const allBounds = zones.getBounds();
    function select(key, scroll) {
      const layer = layers.get(key);
      if (!layer) return;
      setInteraction(false);
      selected = key;
      zones.setStyle(style);
      layer.bringToFront();
      for (const [slug, card] of cards) {
        card.classList.toggle("selected", slug === key);
        card.querySelector("button").setAttribute("aria-expanded", String(slug === key));
        card.querySelector(".detail").hidden = slug !== key;
        labels.get(slug).getElement()?.querySelector(".area-label")?.classList.toggle("selected", slug === key);
        labels.get(slug).setZIndexOffset(slug === key ? 1000 : 0);
      }
      selection.textContent = T.showing(layer.feature.properties.name);
      map.flyToBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 16, animate: !reducedMotion, duration: 0.5 });
      if (scroll) {
        if (parent === window) document.getElementById("map").scrollIntoView({ block: "start", behavior: reducedMotion ? "instant" : "smooth" });
        else notify("gakku-map-focus");
      }
    }
    for (const feature of data.features) {
      const p = feature.properties, color = colors[p.school];
      const label = document.createElement("span");
      label.className = `area-label${color ? " featured" : ""}`;
      label.textContent = p.short;
      if (color) label.style.setProperty("--c", color);
      const marker = L.marker([p.labelPoint[1], p.labelPoint[0]], {
        icon: L.divIcon({ className: "", html: label.outerHTML, iconSize: [0, 0], iconAnchor: [0, 0] }),
        title: T.zoomTitle(p.name), alt: T.zoomTitle(p.name), keyboard: true,
      }).addTo(map).on("click", () => select(p.school, false));
      labels.set(p.school, marker);
      const card = document.createElement("li");
      card.className = "school"; card.style.setProperty("--c", color || "#555");
      const button = document.createElement("button");
      button.type = "button"; button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", `school-${p.school}`);
      const name = document.createElement("span"); name.className = "nm"; name.textContent = p.name;
      const hint = document.createElement("span"); hint.className = "hint"; hint.textContent = T.hint;
      button.append(name, hint); button.addEventListener("click", () => select(p.school, true));
      const detail = document.createElement("div"); detail.className = "detail"; detail.id = `school-${p.school}`; detail.hidden = true;
      const address = document.createElement("p"); address.textContent = T.address(p.address);
      const rentals = document.createElement("a"); rentals.href = localePath(`/gakku/${p.school}/rentals`); rentals.target = "_top"; rentals.textContent = T.rentals;
      detail.append(address, rentals);
      if (color) {
        const guide = document.createElement("a"); guide.href = localePath(`/gakku/${p.school}`); guide.target = "_top"; guide.textContent = T.guide; detail.append(guide);
      }
      card.append(button, detail); list.append(card); cards.set(p.school, card);
    }
    reset.disabled = false;
    reset.addEventListener("click", () => {
      setInteraction(false);
      selected = null; zones.setStyle(style);
      for (const [slug, card] of cards) {
        card.classList.remove("selected"); card.querySelector("button").setAttribute("aria-expanded", "false"); card.querySelector(".detail").hidden = true;
        labels.get(slug).getElement()?.querySelector(".area-label")?.classList.remove("selected"); labels.get(slug).setZIndexOffset(0);
      }
      selection.textContent = T.pick;
      map.flyToBounds(allBounds, { padding: [22, 22], animate: !reducedMotion, duration: 0.5 });
    });
    map.fitBounds(allBounds, { padding: [22, 22] });
  } catch (error) {
    document.getElementById("error").hidden = false;
    console.error("School map:", error);
  }
})();
