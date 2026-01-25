// Attribution:
// This website was developed by Anna Wang. Portions of the HTML/CSS/JavaScript were generated and/or revised with assistance from ChatGPT (OpenAI, ChatGPT Pro; Jan 2026 version) based on the author’s prompts and subsequent edits.
// All final selections, modifications, and integration were performed by the author.

(() => {
  function setCurrentYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  // Sets up the game carousel functionality.
  function initCarousel() {
    const track = document.getElementById("gameCarousel");
    const prev = document.querySelector(".carousel-btn.prev");
    const next = document.querySelector(".carousel-btn.next");
    if (!track || !prev || !next) return;

    // Calculates the width of one card plus gap.
    function cardStep() {
      const firstCard = track.querySelector(".carousel-card");
      if (!firstCard) return 320;

      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      return firstCard.getBoundingClientRect().width + gap;
    }

    // Enables/disables buttons based on scroll position.
    function updateButtons() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll - 2;
    }

    // Animates button click zoom effect.
    function clickZoom(btn) {
      btn.animate(
        [
          { transform: "translateY(-50%) scale(1)" },
          { transform: "translateY(-50%) scale(1.14)" },
          { transform: "translateY(-50%) scale(1)" },
        ],
        { duration: 180, easing: "ease-out" }
      );
    }

    // Moves carousel left or right on button click. Makes it smooth.
    prev.addEventListener("click", () => {
      clickZoom(prev);
      track.scrollBy({ left: -cardStep(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      clickZoom(next);
      track.scrollBy({ left: cardStep(), behavior: "smooth" });
    });

    // Makes sure that the keys only work when the carousel is focused on.
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev.click();
      if (e.key === "ArrowRight") next.click();
    });

    // Updates (enable/disable) buttons when all the way to left or right
    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  }

  // Run after HTML
  document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
    initCarousel();
  });
})();
