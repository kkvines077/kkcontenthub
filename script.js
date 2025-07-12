// 🌗 Theme Toggle with Local Storage
function toggleTheme() {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  const newTheme = current === "dark" ? "light" : "dark";
  document.body.classList.remove(current);
  document.body.classList.add(newTheme);
  localStorage.setItem("theme", newTheme);
}

// 🌍 Load theme from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }
});
