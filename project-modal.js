// Attribution: Anna Wang, with assistance from ChatGPT (OpenAI) for initial structure; integrated by the author.
// Project card modal: one instance per page, data from each card (dataset + card DOM + link heuristics).

(() => {
  const MODAL_ID = "project-modal";
  const OPEN_CLASS = "project-modal--open";
  const BODY_CLASS = "project-modal--open";

  function ensureModal() {
    if (document.getElementById(MODAL_ID)) return;

    const html = `
<div id="${MODAL_ID}" class="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" hidden>
  <div class="project-modal__backdrop" data-modal-dismiss tabindex="-1" aria-hidden="true"></div>
  <div class="project-modal__panel" role="document">
    <button type="button" class="project-modal__close" aria-label="Close dialog">&times;</button>
    <div class="project-modal__grid">
      <div class="project-modal__media">
        <img class="project-modal__img" src="" alt="" hidden decoding="async" />
        <p class="project-modal__placeholder">Image coming soon</p>
      </div>
      <div class="project-modal__body">
        <h2 id="project-modal-title" class="project-modal__title"></h2>
        <div class="project-modal__section">
          <h3 class="project-modal__label">Description</h3>
          <p class="project-modal__text"></p>
        </div>
        <div class="project-modal__actions">
          <a class="btn btn-ghost project-modal__btn project-modal__btn--demo" href="#" target="_blank" rel="noopener noreferrer" hidden>Demo</a>
          <a class="btn project-modal__btn project-modal__btn--gh" href="#" target="_blank" rel="noopener noreferrer" hidden>GitHub</a>
        </div>
      </div>
    </div>
  </div>
</div>`;
    document.body.insertAdjacentHTML("beforeend", html);
  }

  function readTitle(el) {
    return (
      (el.dataset.title && el.dataset.title.trim()) ||
      el.querySelector(".project-archive-card__title")?.textContent?.trim() ||
      ""
    );
  }

  function readDesc(el) {
    return (
      (el.dataset.desc && el.dataset.desc.trim()) ||
      el.querySelector(".project-archive-card__desc")?.textContent?.trim() ||
      ""
    );
  }

  function readImage(el) {
    return (el.dataset.image && el.dataset.image.trim()) || "";
  }

  function readLinks(el) {
    let demo = (el.dataset.demo && el.dataset.demo.trim()) || "";
    let github = (el.dataset.github && el.dataset.github.trim()) || "";

    if (el.tagName === "A" && el.href) {
      const h = el.href;
      if (h && h !== "" && h !== window.location.href + "#") {
        if (h.includes("github.com")) {
          if (!github) github = h;
        } else if (!demo) {
          demo = h;
        }
      }
    }

    if (el.tagName === "ARTICLE") {
      const links = el.querySelectorAll(".project-archive-card__links a[href]");
      links.forEach((a) => {
        const t = a.textContent.toLowerCase();
        if (!a.href) return;
        if (a.href.includes("github.com") || t.includes("repo")) {
          if (!github) github = a.href;
        } else {
          if (!demo) demo = a.href;
        }
      });
    }

    return { demo, github };
  }

  function populateModal(root, data) {
    const titleEl = root.querySelector("#project-modal-title");
    const textEl = root.querySelector(".project-modal__text");
    const img = root.querySelector(".project-modal__img");
    const ph = root.querySelector(".project-modal__placeholder");
    const btnDemo = root.querySelector(".project-modal__btn--demo");
    const btnGh = root.querySelector(".project-modal__btn--gh");

    titleEl.textContent = data.title;
    textEl.textContent = data.desc || "Add a longer description in the data-desc attribute or in the card copy.";

    if (data.image) {
      ph.setAttribute("hidden", "");
      img.alt = data.title ? `Preview: ${data.title}` : "Project preview";
      img.onerror = function () {
        this.setAttribute("hidden", "");
        ph.removeAttribute("hidden");
      };
      img.onload = function () {
        this.removeAttribute("hidden");
        ph.setAttribute("hidden", "");
      };
      img.src = data.image;
    } else {
      img.setAttribute("hidden", "");
      img.removeAttribute("src");
      ph.removeAttribute("hidden");
    }

    if (data.demo && data.demo !== "#") {
      btnDemo.href = data.demo;
      btnDemo.removeAttribute("hidden");
    } else {
      btnDemo.setAttribute("hidden", "");
      btnDemo.href = "#";
    }

    if (data.github && data.github !== "#") {
      btnGh.href = data.github;
      btnGh.removeAttribute("hidden");
    } else {
      btnGh.setAttribute("hidden", "");
      btnGh.href = "#";
    }
  }

  let lastFocus = null;

  function openModal(fromEl) {
    ensureModal();
    const root = document.getElementById(MODAL_ID);
    if (!root) return;

    const { demo, github } = readLinks(fromEl);
    const data = {
      title: readTitle(fromEl),
      desc: readDesc(fromEl),
      image: readImage(fromEl),
      demo,
      github,
    };

    populateModal(root, data);
    lastFocus = document.activeElement;
    root.removeAttribute("hidden");
    root.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      root.classList.add(OPEN_CLASS);
      document.body.classList.add(BODY_CLASS);
    });
    const closeBtn = root.querySelector(".project-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  const CLOSE_MS = 240;

  function closeModal() {
    const root = document.getElementById(MODAL_ID);
    if (!root) return;
    root.classList.remove(OPEN_CLASS);
    document.body.classList.remove(BODY_CLASS);
    root.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (!root.classList.contains(OPEN_CLASS)) {
        root.setAttribute("hidden", "");
      }
    }, CLOSE_MS);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function isModifier(e) {
    return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
  }

  function onCardClick(e) {
    const el = e.currentTarget;
    if (el.tagName === "ARTICLE" && e.target.closest("a")) {
      return;
    }
    if (isModifier(e) || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    openModal(el);
  }

  function onCardKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.key === " ") e.preventDefault();
    if (isModifier(e)) return;
    e.preventDefault();
    openModal(e.currentTarget);
  }

  function bindCard(el) {
    if (!el.hasAttribute("data-project-modal")) return;
    el.addEventListener("click", onCardClick);
    if (el.tagName === "A") {
      el.addEventListener("keydown", onCardKeydown);
    }
  }

  function onDocumentKeydown(e) {
    if (e.key === "Escape" && document.body.classList.contains(BODY_CLASS)) {
      e.preventDefault();
      closeModal();
    }
  }

  function init() {
    const cards = document.querySelectorAll("[data-project-modal]");
    if (cards.length === 0) return;

    ensureModal();
    const root = document.getElementById(MODAL_ID);
    if (!root) return;

    cards.forEach(bindCard);
    if (!root.hasAttribute("hidden")) root.setAttribute("hidden", "");
    root.setAttribute("aria-hidden", "true");

    root.querySelector(".project-modal__close")?.addEventListener("click", closeModal);
    root.querySelector("[data-modal-dismiss]")?.addEventListener("click", closeModal);
    root.querySelector(".project-modal__panel")?.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("keydown", onDocumentKeydown);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
