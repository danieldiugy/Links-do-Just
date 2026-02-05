// safe small helpers (optional)
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
    // DecAPI: retorna "OFFLINE" ou um texto com o uptime
    const res = await fetch(
      `https://decapi.me/twitch/uptime/${encodeURIComponent(channel)}`,
      { cache: "no-store" }
    );

    const t = (await res.text()).trim().toLowerCase();
    const isLive = t !== "offline" && !t.includes("offline");

    if (isLive) {
      textEl.textContent = liveText;

      // ex: "12 minutes", "1 hour, 5 minutes" → "há 12min", "há 1h 5min"
      card.dataset.uptime =
        "há " +
        t
          .replace("hours", "h")
          .replace("hour", "h")
          .replace("minutes", "min")
          .replace("minute", "min")
          .replace(",", "");

      card.classList.add("is-live");
    } else {
      textEl.textContent = offlineText;
      card.classList.remove("is-live");
      delete card.dataset.uptime;
    }
  } catch (e) {
    // fallback seguro
    textEl.textContent = offlineText;
    card.classList.remove("is-live");
    delete card.dataset.uptime;
  }
}

updateTwitchCard();
setInterval(updateTwitchCard, 60_000); // 1 minuto

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateTwitchCard();
});
