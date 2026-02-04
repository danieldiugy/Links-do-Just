// ano no footer
document.getElementById("year").textContent = new Date().getFullYear();

// impede que clicar nos ⋮ abra o link
document.querySelectorAll(".dots").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});
