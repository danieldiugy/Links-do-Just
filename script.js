// year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

async function updateTwitchCard() {
  const card = document.getElementById("twitchCard");
  if (!card) return;

  const textEl = card.querySelector(".cardText");
  if (!textEl) return;

  const channel = "just99c";
  const offlineText = "Twitch (Live às 21:30)";
  const liveText = "Twitch (🔴 AO VIVO)";

  try {
    const res = await fetch(
      `https://decapi.me/twitch/uptime/${encodeURIComponent(channel)}`,
      { cache: "no-store" }
    );

    const t = (await res.text()).trim().toLowerCase();
    const isLive = t !== "offline" && !t.includes("offline");

    if (isLive) {
      textEl.textContent = liveText;

      let label = "";
      if (t.includes("hour")) {
        const h = t.match(/(\d+)\s*hour/)?.[1];
        label = h === "1" ? "há 1 hora" : `há ${h} horas`;
      } else if (t.includes("minute")) {
        const m = t.match(/(\d+)\s*minute/)?.[1];
        label = `há ${m}min`;
      }

      card.dataset.uptime = label;
      card.classList.add("is-live");
    } else {
      textEl.textContent = offlineText;
      card.classList.remove("is-live");
      delete card.dataset.uptime;
    }
  } catch (e) {
    textEl.textContent = offlineText;
    card.classList.remove("is-live");
    delete card.dataset.uptime;
  }
}

updateTwitchCard();
setInterval(updateTwitchCard, 60_000);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateTwitchCard();
});
