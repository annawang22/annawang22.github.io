// Attribution:
// This website was developed by Anna Wang. Portions of the HTML/CSS/JavaScript were generated and/or revised with assistance from ChatGPT (OpenAI, ChatGPT Pro; Jan 2026 version) based on the author’s prompts and subsequent edits.
// All final selections, modifications, and integration were performed by the author.

(() => {
  function setCurrentYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  function setProfilePhoto() {
    const img = document.getElementById("profile-photo");
    const path = window.SITE_CONFIG?.profilePhoto;
    if (img && path) img.src = path;
  }

  function setResumeRequestLink() {
    const link = document.getElementById("resume-request");
    const email = window.SITE_CONFIG?.resumeRequestEmail;
    if (link && email) {
      const subject = encodeURIComponent("Resume request – Anna Wang");
      link.href = `mailto:${email}?subject=${subject}`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setProfilePhoto();
    setResumeRequestLink();
    setCurrentYear();
  });
})();
