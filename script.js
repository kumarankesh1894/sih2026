document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupActiveNavigation();
  setupScrollReveal();
  setupAuthForms();
  setupInteractiveCards();
});

function setupMobileMenu() {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".navbar nav a");

  if (!navbar || !menuToggle) {
    return;
  }

  function closeMenu() {
    navbar.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  menuToggle.addEventListener("click", function () {
    const isOpen = navbar.classList.toggle("menu-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  menuLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

function setupActiveNavigation() {
  const sectionLinks = document.querySelectorAll('.navbar nav a[href^="#"]');
  const sections = Array.from(sectionLinks)
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (!sectionLinks.length || !sections.length) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        sectionLinks.forEach(function (link) {
          const isActive = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0,
    },
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(
    ".hero-content, .hero-card, .section-heading, .feature-card, .opportunity-card, .about > div, .stats div, .cta",
  );

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  revealItems.forEach(function (item) {
    item.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
}

function setupAuthForms() {
  const forms = document.querySelectorAll(".auth-card");

  forms.forEach(function (form) {
    const passwordInput = form.querySelector('input[type="password"]');

    form.querySelectorAll("input, select").forEach(function (field) {
      field.addEventListener("input", function () {
        updateFieldState(field);
      });

      field.addEventListener("blur", function () {
        updateFieldState(field);
      });
    });

    if (passwordInput) {
      addPasswordToggle(passwordInput);
      addPasswordStrength(passwordInput);
    }
  });
}

function addPasswordToggle(passwordInput) {
  const toggle = document.createElement("button");

  toggle.type = "button";
  toggle.className = "password-toggle";
  toggle.textContent = "Show";

  passwordInput.insertAdjacentElement("afterend", toggle);

  toggle.addEventListener("click", function () {
    const shouldShow = passwordInput.type === "password";

    passwordInput.type = shouldShow ? "text" : "password";
    toggle.textContent = shouldShow ? "Hide" : "Show";
    passwordInput.focus();
  });
}

function addPasswordStrength(passwordInput) {
  const meter = document.createElement("div");

  meter.className = "password-strength";
  meter.innerHTML = "<span></span><small>Password strength</small>";

  passwordInput.parentElement.insertBefore(
    meter,
    passwordInput.nextElementSibling.nextElementSibling,
  );

  passwordInput.addEventListener("input", function () {
    const score = getPasswordScore(passwordInput.value);
    const labels = ["Password strength", "Weak", "Good", "Strong"];

    meter.dataset.strength = String(score);
    meter.querySelector("small").textContent = labels[score];
  });
}

function getPasswordScore(value) {
  let score = 0;

  if (value.length >= 6) score += 1;
  if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value) && value.length >= 8) score += 1;

  return Math.min(score, 3);
}

function updateFieldState(field) {
  const shouldValidate =
    field.value.trim() !== "" || field.matches(":focus") === false;

  if (!shouldValidate) {
    field.classList.remove("field-valid", "field-invalid");
    return;
  }

  field.classList.toggle("field-valid", field.checkValidity());
  field.classList.toggle("field-invalid", !field.checkValidity());
}

function setupInteractiveCards() {
  const cards = document.querySelectorAll(".feature-card, .opportunity-card");

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.classList.add("card-active");
    });

    card.addEventListener("mouseleave", function () {
      card.classList.remove("card-active");
    });
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast-message");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-message";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(function () {
    toast.classList.remove("show");
  }, 2600);
}

function login() {
  window.location.href = "login.html";
}

function signup() {
  window.location.href = "signup.html";
}

function getStarted() {
  window.location.href = "signup.html";
}

function exploreOpportunities() {
  document.getElementById("opportunities")?.scrollIntoView({
    behavior: "smooth",
  });
}

function openFeature(featureName) {
  showToast(featureName + " will be available after login.");
}

function apply(opportunityName) {
  showToast("Please login or sign up to apply for " + opportunityName + ".");
}

function handleLogin(event) {
  event.preventDefault();
  showToast("Login successful. Dashboard integration can be added next.");
}

function handleSignup(event) {
  event.preventDefault();
  showToast("Account created. Dashboard integration can be added next.");
}
