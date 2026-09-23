/* global L */
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
      interaction.textContent = enabled ? "地図操作を終了" : "地図を動かす";
      gestureHelp.textContent = pageScroll
        ? "地図の上でも上下にスクロールできます。拡大・縮小は＋／−ボタンで操作できます。"
        : "地図を指で動かせます。ページに戻るときは「地図操作を終了」を押してください。";
    }
    setInteraction(false);
    interaction.disabled = false;
    interaction.addEventListener("click", () => setInteraction(interaction.getAttribute("aria-pressed") !== "true"));
    endMapInteraction = () => setInteraction(false);
    touchLayout.addEventListener("change", () => setInteraction(false));
    mapElement.addEventListener("keydown", event => { if (event.key === "Escape") setInteraction(false); });
    L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院</a>',
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
        layer.bindTooltip(`${p.name}の学区（参考図）`, { sticky: true });
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
      selection.textContent = `${layer.feature.properties.name}の学区を表示中`;
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
        title: `${p.name}の学区を拡大`, alt: `${p.name}の学区を拡大`, keyboard: true,
      }).addTo(map).on("click", () => select(p.school, false));
      labels.set(p.school, marker);
      const card = document.createElement("li");
      card.className = "school"; card.style.setProperty("--c", color || "#555");
      const button = document.createElement("button");
      button.type = "button"; button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", `school-${p.school}`);
      const name = document.createElement("span"); name.className = "nm"; name.textContent = p.name;
      const hint = document.createElement("span"); hint.className = "hint"; hint.textContent = "地図を拡大";
      button.append(name, hint); button.addEventListener("click", () => select(p.school, true));
      const detail = document.createElement("div"); detail.className = "detail"; detail.id = `school-${p.school}`; detail.hidden = true;
      const address = document.createElement("p"); address.textContent = `学校所在地：${p.address}`;
      const rentals = document.createElement("a"); rentals.href = `/gakku/${p.school}/rentals`; rentals.target = "_top"; rentals.textContent = "この学区の賃貸物件を見る →";
      detail.append(address, rentals);
      if (color) {
        const guide = document.createElement("a"); guide.href = `/gakku/${p.school}`; guide.target = "_top"; guide.textContent = "通学区域の紹介"; detail.append(guide);
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
      selection.textContent = "学校名を選ぶと学区が拡大します";
      map.flyToBounds(allBounds, { padding: [22, 22], animate: !reducedMotion, duration: 0.5 });
    });
    map.fitBounds(allBounds, { padding: [22, 22] });
  } catch (error) {
    document.getElementById("error").hidden = false;
    console.error("School map:", error);
  }
})();
