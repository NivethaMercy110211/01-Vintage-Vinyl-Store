/* ========================================= */
/* VINYL CLASSICS — MAIN SCRIPT */
/* ========================================= */

lucide.createIcons();

/* ========================================= */
/* THEME TOGGLE */
/* ========================================= */

const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

function setThemeIcon(isLight) {
  if (!themeToggle) return;
  themeToggle.innerHTML = isLight
    ? `<i data-lucide="sun"></i>`
    : `<i data-lucide="moon"></i>`;
  lucide.createIcons();
}

if (savedTheme === "light") {
  body.classList.add("light-mode");
  setThemeIcon(true);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    setThemeIcon(isLight);
  });
}

/* ========================================= */
/* ACTIVE NAV LINK */
/* ========================================= */

const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

const homePages = ["index.html", "home2.html", ""];

document.querySelectorAll(".nav-links > a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

document.querySelectorAll(".nav-dropdown-menu a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

if (homePages.includes(currentPage)) {
  document
    .querySelector(".nav-dropdown-toggle")
    ?.classList.add("active");
}

/* ========================================= */
/* NAV DROPDOWN */
/* ========================================= */

function closeAllDropdowns() {
  document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown
      .querySelector(".nav-dropdown-toggle")
      ?.setAttribute("aria-expanded", "false");
  });
}

document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");

  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains("open");
    closeAllDropdowns();
    if (!isOpen) {
      dropdown.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }
    lucide.createIcons();
  });
});

document.addEventListener("click", closeAllDropdowns);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeAllDropdowns();
});

/* ========================================= */
/* SCROLL HEADER */
/* ========================================= */

const header = document.querySelector("header");

if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ========================================= */
/* MOBILE MENU */
/* ========================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navLinks");

let navOverlay = document.querySelector(".nav-overlay");

if (!navOverlay && navMenu) {
  navOverlay = document.createElement("div");
  navOverlay.className = "nav-overlay";
  navOverlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(navOverlay);
}

function closeMobileMenu() {
  if (!navMenu) return;
  navMenu.classList.remove("active");
  navOverlay?.classList.remove("active");
  body.classList.remove("menu-open");
  if (mobileMenuBtn) {
    mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    lucide.createIcons();
  }
}

function openMobileMenu() {
  if (!navMenu) return;
  navMenu.classList.add("active");
  navOverlay?.classList.add("active");
  body.classList.add("menu-open");
  if (mobileMenuBtn) {
    mobileMenuBtn.innerHTML = `<i data-lucide="x"></i>`;
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    lucide.createIcons();
  }
}

function toggleMobileMenu() {
  if (!navMenu) return;
  navMenu.classList.contains("active") ? closeMobileMenu() : openMobileMenu();
}

if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.setAttribute("aria-label", "Toggle menu");
  mobileMenuBtn.setAttribute("aria-expanded", "false");

  mobileMenuBtn.addEventListener("click", toggleMobileMenu);

  navOverlay?.addEventListener("click", closeMobileMenu);

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMobileMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
      closeAllDropdowns();
    }
  });
}

/* ========================================= */
/* SCROLL REVEAL */
/* ========================================= */

const revealSelector =
  ".product-card, .guide-item, .guide-card, .guide-step, .turntable-card, .genre-card, .faq-item";

const revealItems = document.querySelectorAll(revealSelector);

if (revealItems.length) {
  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(40px)";
    item.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });

  const revealOnScroll = () => {
    revealItems.forEach((item) => {
      const top = item.getBoundingClientRect().top;
      if (top < window.innerHeight - 60) {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll, { passive: true });
  revealOnScroll();
}

/* ========================================= */
/* FAQ ACCORDION (guides page) */
/* ========================================= */

document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      openItem.classList.remove("open");
      openItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

/* ========================================= */
/* PASSWORD SHOW / HIDE */
/* ========================================= */

document.querySelectorAll(".password-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement?.querySelector("input");
    if (!input) return;

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";

    btn.innerHTML = isHidden
      ? `<i data-lucide="eye-off"></i>`
      : `<i data-lucide="eye"></i>`;

    btn.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    );

    lucide.createIcons();
  });
});

/* ========================================= */
/* FORM SUBMIT */
/* ========================================= */

function clearSignupErrors(form) {
  const errorEl = form.querySelector("#signupError");
  errorEl?.setAttribute("hidden", "");
  form.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });
}

document.querySelectorAll("form").forEach((form) => {
  if (form.id === "signupForm") {
    const password = form.querySelector("#signupPassword");
    const confirmPassword = form.querySelector("#signupConfirmPassword");

    [password, confirmPassword].forEach((input) => {
      input?.addEventListener("input", () => clearSignupErrors(form));
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (form.id === "forgotPasswordForm") {
      alert(
        "If an account exists for that email, a password reset link has been sent."
      );
      form.reset();
      return;
    }

    if (form.id === "signupForm") {
      const password = form.querySelector("#signupPassword");
      const confirmPassword = form.querySelector("#signupConfirmPassword");
      const errorEl = form.querySelector("#signupError");

      clearSignupErrors(form);

      if (password.value !== confirmPassword.value) {
        errorEl?.removeAttribute("hidden");
        password.classList.add("input-error");
        confirmPassword.classList.add("input-error");
        confirmPassword.focus();
        return;
      }
    }

    alert("Thank you! Your form has been submitted.");
    form.reset();
    clearSignupErrors(form);
  });
});

