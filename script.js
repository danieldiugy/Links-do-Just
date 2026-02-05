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
    const res = await fetch(`https://decapi.me/twitch/uptime/${encodeURIComponent(channel)}`, {
      cache: "no-store",
    });
    const t = (await res.text()).trim().toLowerCase();

    const isLive = t !== "offline" && !t.includes("offline");

    if (isLive) {
      textEl.textContent = liveText;
      card.classList.add("is-live");
    } else {
      textEl.textContent = offlineText;
      card.classList.remove("is-live");
    }
  } catch (e) {
    // Se falhar, mantém o texto normal
    textEl.textContent = offlineText;
    card.classList.remove("is-live");
  }
}

updateTwitchCard();
setInterval(updateTwitchCard, 60_000); // atualiza a cada 60s

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateTwitchCard();
});
