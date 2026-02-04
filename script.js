// ano no footer
document.getElementById("year").textContent = new Date().getFullYear();

// ripple suave ao clicar/tocar
document.querySelectorAll(".linkCard").forEach(card => {
  card.addEventListener("pointerdown", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    card.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }, { passive: true });
});
