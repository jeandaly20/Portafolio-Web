(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {}
    },
  };

  function initTheme() {
    const toggle = $("#theme-toggle");
    if (!toggle) return;

    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const currentTheme = () => {
      const attr = root.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      return systemPrefersDark.matches ? "dark" : "light";
    };

    const applyTheme = (theme) => {
      root.setAttribute("data-theme", theme);
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      storage.set("portafolio-tema", theme);
    };

    toggle.setAttribute("aria-pressed", String(currentTheme() === "dark"));

    toggle.addEventListener("click", () => {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });

    systemPrefersDark.addEventListener("change", (event) => {
      if (!storage.get("portafolio-tema")) {
        root.removeAttribute("data-theme");
        toggle.setAttribute("aria-pressed", String(event.matches));
      }
    });
  }

  function initNav() {
    const toggle = $("#nav-toggle");
    const nav = $("#nav-principal");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    $$(".navbar__link", nav).forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    window.matchMedia("(min-width: 48.0625em)").addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }

  function initScrollSpy() {
    const links = $$('.navbar__link[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;

    const sections = links
      .map((link) => $(link.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initProjectFilters() {
    const filters = $("#filtros-proyectos");
    const cards = $$(".project-card");
    const emptyMessage = $("#proyectos-vacio");
    if (!filters || !cards.length) return;

    filters.addEventListener("click", (event) => {
      const button = event.target.closest(".filter-chip");
      if (!button) return;

      const filter = button.dataset.filter;

      $$(".filter-chip", filters).forEach((chip) => {
        chip.setAttribute("aria-pressed", String(chip === button));
      });

      let visibles = 0;
      cards.forEach((card) => {
        const tech = (card.dataset.tech || "").split(" ");
        const matches = filter === "all" || tech.includes(filter);
        card.classList.toggle("is-hidden", !matches);
        if (matches) visibles += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visibles > 0;
    });
  }

  function initModal() {
    const modal = $("#modal-proyecto");
    const content = $("#modal-contenido");
    const closeButton = $("#modal-close");
    if (!modal || !content || !closeButton) return;

    let lastFocused = null;

    const focusables = () =>
      $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', modal);

    const open = (templateId) => {
      const template = document.getElementById(templateId);
      if (!template) return;

      content.innerHTML = "";
      content.appendChild(template.content.cloneNode(true));

      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      document.body.classList.add("is-locked");
      closeButton.focus();
    };

    const close = () => {
      modal.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      content.innerHTML = "";
      if (lastFocused) lastFocused.focus();
    };

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-modal-target]");
      if (trigger) open(trigger.dataset.modalTarget);
    });

    closeButton.addEventListener("click", close);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });

    document.addEventListener("keydown", (event) => {
      if (!modal.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initContactForm() {
    const form = $("#form-contacto");
    if (!form) return;

    const status = $("#estado-formulario");
    const textarea = $("#mensaje");
    const counter = $("#contador-mensaje");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    const rules = {
      nombre(value) {
        if (!value.trim()) return "Escribe tu nombre.";
        if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres.";
        return "";
      },
      email(value) {
        if (!value.trim()) return "Escribe tu correo electrónico.";
        if (!emailPattern.test(value.trim())) return "El formato del correo no es válido.";
        return "";
      },
      asunto(value) {
        return value ? "" : "Selecciona el motivo del mensaje.";
      },
      mensaje(value) {
        if (!value.trim()) return "Escribe tu mensaje.";
        if (value.trim().length < 15) return "Cuéntame un poco más: mínimo 15 caracteres.";
        return "";
      },
      consentimiento(value, field) {
        return field.checked ? "" : "Necesito tu autorización para responderte.";
      },
    };

    const showError = (field, message) => {
      const wrapper = field.closest(".field");
      const errorBox = $(`#error-${field.id}`);
      if (!wrapper || !errorBox) return;

      wrapper.classList.toggle("has-error", Boolean(message));
      errorBox.textContent = message;
      field.setAttribute("aria-invalid", String(Boolean(message)));
    };

    const validateField = (field) => {
      const rule = rules[field.id];
      if (!rule) return true;
      const message = rule(field.value, field);
      showError(field, message);
      return !message;
    };

    const fields = Object.keys(rules)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".field").classList.contains("has-error")) validateField(field);
      });
      if (field.type === "checkbox" || field.tagName === "SELECT") {
        field.addEventListener("change", () => validateField(field));
      }
    });

    if (textarea && counter) {
      const updateCounter = () => {
        counter.textContent = String(textarea.value.length);
      };
      textarea.addEventListener("input", updateCounter);
      updateCounter();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const results = fields.map((field) => validateField(field));
      const isValid = results.every(Boolean);

      if (!isValid) {
        status.textContent = "Revisa los campos marcados en rojo antes de enviar.";
        status.className = "form__status is-error";
        const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const nombre = $("#nombre").value.trim().split(" ")[0];
      status.textContent = `¡Gracias, ${nombre}! Mensaje validado correctamente. Te responderé al correo indicado.`;
      status.className = "form__status is-success";

      form.reset();
      fields.forEach((field) => showError(field, ""));
      if (counter) counter.textContent = "0";
    });
  }

  function initBackToTop() {
    const button = $("#back-to-top");
    if (!button) return;

    const toggleVisibility = () => {
      button.classList.toggle("is-visible", window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    button.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => entry.target.classList.add("is-visible"), index * 80);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initYear() {
    const year = $("#anio-actual");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNav();
    initScrollSpy();
    initProjectFilters();
    initModal();
    initContactForm();
    initBackToTop();
    initReveal();
    initYear();
  });
})();
