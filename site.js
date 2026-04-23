// Attribution:
// This website was developed by Anna Wang. Portions of the HTML/CSS/JavaScript were generated and/or revised with assistance from ChatGPT (OpenAI, ChatGPT Pro; Jan 2026 version) based on the author’s prompts and subsequent edits.
// All final selections, modifications, and integration were performed by the author.

(() => {
  function setCurrentYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
  });
})();
