// year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

async function updateTwitchCard() {
  const card = document.getElementById("twitchCard");
  if (!card) return;

  const textEl = card.querySelector(".cardText");
  if (!textEl) return;

  const channel = "just99c";
  const offlineText = "Live às 21:30";
  const liveHtml = '(<span class="live-dot pulse"></span>EM LIVE)';

  try {
    const res = await fetch(
      `https://decapi.me/twitch/uptime/${encodeURIComponent(channel)}`,
      { cache: "no-store" }
    );

    const t = (await res.text()).trim().toLowerCase();
    const isLive = t !== "offline" && !t.includes("offline");

    if (isLive) {
      // LIVE
      textEl.innerHTML = liveHtml;

 let label = "";
if (t.includes("hour")) {
  const h = t.match(/(\d+)\s*hour/)?.[1];
  if (h) label = h === "1" ? "Há 1h" : `Há ${h} h`;
} else if (t.includes("minute")) {
  const m = t.match(/(\d+)\s*minute/)?.[1];
  if (m) label = m === "1" ? "Há 1min" : `Há ${m}min`;
}


      card.dataset.uptime = label;
      card.classList.add("is-live");
    } else {
      // OFFLINE
      textEl.textContent = offlineText;
      card.classList.remove("is-live");
      delete card.dataset.uptime;
    }
  } catch (e) {
    // ERROR fallback
    textEl.textContent = offlineText;
    card.classList.remove("is-live");
    delete card.dataset.uptime;
  }
}
}

// initial + auto updates
updateTwitchCard();
setInterval(updateTwitchCard, 60_000);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateTwitchCard();
});
