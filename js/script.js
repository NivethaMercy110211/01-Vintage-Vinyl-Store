/* ========================================= */
/* VINYL CLASSICS — MAIN SCRIPT */
/* ========================================= */

lucide.createIcons();

/* ========================================= */
/* THEME TOGGLE */
/* ========================================= */

const body = document.body;
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");
const savedDirection = localStorage.getItem("direction") || "ltr";
let cartCount = Number(localStorage.getItem("cartCount") || "0");

root.setAttribute("dir", savedDirection);

/* ========================================= */
/* POLISHED UI HELPERS */
/* ========================================= */

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.prepend(progressBar);

const toastStack = document.createElement("div");
toastStack.className = "toast-stack";
toastStack.setAttribute("aria-live", "polite");
document.body.appendChild(toastStack);

function showToast(title, message, icon = "check-circle") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <div>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
  `;
  toastStack.appendChild(toast);
  lucide.createIcons();

  requestAnimationFrame(() => toast.classList.add("show"));

  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 260);
  }, 3200);
}

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

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
/* RTL / LTR TOGGLE */
/* ========================================= */

document.querySelectorAll(".header-actions").forEach((actions) => {
  if (actions.querySelector(".direction-toggle")) return;

  const cartToggle = document.createElement("button");
  cartToggle.type = "button";
  cartToggle.className = "cart-toggle";
  cartToggle.setAttribute("aria-label", "Cart items");
  cartToggle.innerHTML = `
    <i data-lucide="shopping-bag"></i>
    <span class="cart-count" hidden>0</span>
  `;
  actions.insertBefore(cartToggle, themeToggle || actions.firstChild);

  const directionToggle = document.createElement("button");
  directionToggle.type = "button";
  directionToggle.className = "direction-toggle";
  directionToggle.setAttribute("aria-label", "Switch text direction");
  actions.insertBefore(directionToggle, themeToggle || actions.firstChild);

  const cartBadge = cartToggle.querySelector(".cart-count");

  function syncCartBadge() {
    cartBadge.textContent = String(cartCount);
    cartBadge.hidden = cartCount === 0;
  }

  cartToggle.addEventListener("click", () => {
    showToast(
      cartCount ? "Cart saved" : "Cart is empty",
      cartCount
        ? `${cartCount} item${cartCount === 1 ? "" : "s"} ready for review.`
        : "Add a record or turntable to begin.",
      "shopping-bag"
    );
  });

  syncCartBadge();

  function syncDirectionToggle() {
    const isRtl = root.getAttribute("dir") === "rtl";
    directionToggle.textContent = isRtl ? "RTL" : "LTR";
    directionToggle.setAttribute(
      "title",
      isRtl ? "Switch to LTR layout" : "Switch to RTL layout"
    );
  }

  directionToggle.addEventListener("click", () => {
    const nextDirection = root.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
    root.setAttribute("dir", nextDirection);
    localStorage.setItem("direction", nextDirection);
    closeAllDropdowns();
    closeMobileMenu();
    syncDirectionToggle();
  });

  syncDirectionToggle();
});

function addToCartFromCard(card) {
  const title =
    card.querySelector("h3")?.textContent.trim() || "Selected item";
  cartCount += 1;
  localStorage.setItem("cartCount", String(cartCount));
  document.querySelectorAll(".cart-count").forEach((badge) => {
    badge.textContent = String(cartCount);
    badge.hidden = false;
  });
  showToast("Added to cart", `${title} has been added to your cart.`, "shopping-bag");
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
/* BACK TO TOP */
/* ========================================= */

const backToTop = document.createElement("button");
backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.innerHTML = `<i data-lucide="arrow-up"></i>`;
document.body.appendChild(backToTop);

function syncBackToTop() {
  backToTop.classList.toggle("visible", window.scrollY > 520);
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", syncBackToTop, { passive: true });
syncBackToTop();

/* ========================================= */
/* SCROLL REVEAL */
/* ========================================= */

const revealSelector =
  ".product-card, .guide-item, .guide-card, .guide-step, .turntable-card, .genre-card, .faq-item, .info-card, .content-card, .metric-card, .feature-split";

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
/* CARD MOTION + QUICK VIEW */
/* ========================================= */

const interactiveCards = document.querySelectorAll(
  ".product-card, .turntable-card, .info-card, .content-card, .metric-card"
);

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const quickViewOverlay = document.createElement("div");
quickViewOverlay.className = "quick-view-overlay";
quickViewOverlay.innerHTML = `
  <div class="quick-view-modal" role="dialog" aria-modal="true" aria-label="Item quick view">
    <img class="quick-view-img" src="" alt="">
    <div class="quick-view-content">
      <button class="quick-view-close" type="button" aria-label="Close quick view">
        <i data-lucide="x"></i>
      </button>
      <span class="product-category quick-view-category"></span>
      <h3 class="quick-view-title"></h3>
      <p class="quick-view-description"></p>
      <strong class="quick-view-price"></strong>
      <button class="btn btn-primary quick-view-add" type="button">
        Add To Cart
      </button>
    </div>
  </div>
`;
document.body.appendChild(quickViewOverlay);

const quickViewClose = quickViewOverlay.querySelector(".quick-view-close");
const quickViewAdd = quickViewOverlay.querySelector(".quick-view-add");
let activeQuickViewCard = null;

function openQuickView(card) {
  const img = card.querySelector("img");
  const title = card.querySelector("h3")?.textContent.trim() || "Vinyl item";
  const category =
    card.querySelector(".product-category")?.textContent.trim() ||
    card.querySelector(".info-kicker")?.textContent.trim() ||
    "Vinyl Classics";
  const description = card.querySelector("p")?.textContent.trim() || "";
  const price = card.querySelector(".price")?.textContent.trim() || "Ask in store";

  if (!img) return;

  activeQuickViewCard = card;
  quickViewOverlay.querySelector(".quick-view-img").src = img.src;
  quickViewOverlay.querySelector(".quick-view-img").alt = img.alt || title;
  quickViewOverlay.querySelector(".quick-view-category").textContent = category;
  quickViewOverlay.querySelector(".quick-view-title").textContent = title;
  quickViewOverlay.querySelector(".quick-view-description").textContent = description;
  quickViewOverlay.querySelector(".quick-view-price").textContent = price;
  quickViewAdd.hidden = !card.matches(".product-card, .turntable-card");
  quickViewOverlay.classList.add("active");
  body.classList.add("menu-open");
  lucide.createIcons();
}

function closeQuickView() {
  quickViewOverlay.classList.remove("active");
  body.classList.remove("menu-open");
  activeQuickViewCard = null;
}

document.querySelectorAll(".product-card, .turntable-card").forEach((card) => {
  const image = card.querySelector("img");
  const title = card.querySelector("h3");

  image?.addEventListener("click", () => openQuickView(card));
  title?.addEventListener("click", () => openQuickView(card));
  image?.setAttribute("role", "button");
  image?.setAttribute("tabindex", "0");
  image?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openQuickView(card);
  });
});

quickViewClose.addEventListener("click", closeQuickView);
quickViewOverlay.addEventListener("click", (e) => {
  if (e.target === quickViewOverlay) closeQuickView();
});
quickViewAdd.addEventListener("click", () => {
  if (activeQuickViewCard) addToCartFromCard(activeQuickViewCard);
  closeQuickView();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeQuickView();
});

document.querySelectorAll(".product-card .btn, .turntable-card .btn").forEach((btn) => {
  const label = btn.textContent.trim().toLowerCase();
  if (!label.includes("cart") && !label.includes("buy")) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const card = btn.closest(".product-card, .turntable-card");
    if (card) addToCartFromCard(card);
  });
});

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
/* TRADE-IN ESTIMATOR */
/* ========================================= */

const tradeForm = document.querySelector(".trade-box form");

if (tradeForm && currentPage === "trade.html") {
  const tradeBox = tradeForm.closest(".trade-box");
  const estimator = document.createElement("div");
  estimator.className = "trade-estimator";
  estimator.innerHTML = `
    <h3>Quick Value Preview</h3>
    <p>Use this lightweight estimator before submitting. Final values depend on exact pressing, playback condition, and demand.</p>
    <div class="estimator-grid">
      <div class="estimator-field">
        <label for="estimateRecords">Records</label>
        <input id="estimateRecords" type="number" min="0" max="2000" value="25">
      </div>
      <div class="estimator-field">
        <label for="estimateGear">Audio Gear</label>
        <select id="estimateGear">
          <option value="0">No equipment</option>
          <option value="75">Entry turntable</option>
          <option value="175">Premium turntable</option>
          <option value="260">Full audio setup</option>
        </select>
      </div>
      <div class="estimator-field">
        <label for="estimateCondition">Condition</label>
        <select id="estimateCondition">
          <option value="1">Very good</option>
          <option value="1.25">Excellent / collector</option>
          <option value="0.72">Mixed condition</option>
          <option value="0.45">Needs cleaning</option>
        </select>
      </div>
    </div>
    <div class="estimator-output">
      <div class="estimate-box">
        <span>Estimated Cash</span>
        <strong id="estimateCash">$0 - $0</strong>
      </div>
      <div class="estimate-box">
        <span>Estimated Store Credit</span>
        <strong id="estimateCredit">$0 - $0</strong>
      </div>
    </div>
  `;

  tradeBox.parentElement.insertBefore(estimator, tradeBox);

  const recordsInput = estimator.querySelector("#estimateRecords");
  const gearInput = estimator.querySelector("#estimateGear");
  const conditionInput = estimator.querySelector("#estimateCondition");
  const cashOutput = estimator.querySelector("#estimateCash");
  const creditOutput = estimator.querySelector("#estimateCredit");

  function money(value) {
    return `$${Math.max(0, Math.round(value))}`;
  }

  function updateEstimate() {
    const records = Number(recordsInput.value || 0);
    const gear = Number(gearInput.value || 0);
    const condition = Number(conditionInput.value || 1);
    const base = records * 2.8 * condition + gear;
    const low = base * 0.72;
    const high = base * 1.18;

    cashOutput.textContent = `${money(low)} - ${money(high)}`;
    creditOutput.textContent = `${money(low * 1.18)} - ${money(high * 1.25)}`;
  }

  [recordsInput, gearInput, conditionInput].forEach((input) => {
    input.addEventListener("input", updateEstimate);
    input.addEventListener("change", updateEstimate);
  });

  updateEstimate();
}

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
      showToast(
        "Reset link requested",
        "If an account exists for that email, a password reset link has been sent.",
        "key-round"
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
        showToast("Check passwords", "Both password fields must match.", "circle-alert");
        return;
      }
    }

    showToast(
      "Request submitted",
      form.closest(".trade-box")
        ? "Our trade-in team will review your details and follow up."
        : "Thank you. Your form has been submitted.",
      "send"
    );
    form.reset();
    clearSignupErrors(form);
  });
});

lucide.createIcons();
