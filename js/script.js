// --- Partículas animadas no fundo ---
(function () {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  });
  document.getElementById("particles-js").appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let w = window.innerWidth,
    h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  window.addEventListener("resize", () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  });
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1.5,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    o: Math.random() * 0.5 + 0.3,
  }));
  function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(127,90,240,${p.o})`;
      ctx.shadowColor = "#7f5af0";
      ctx.shadowBlur = 12;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

// --- Tema (dark/light) ---
(function () {
  const themeBtn = document.getElementById("theme-toggle");
  function setTheme(light) {
    document.body.classList.toggle("light", light);
    localStorage.setItem("theme", light ? "light" : "dark");
    if (themeBtn)
      themeBtn.innerHTML = light
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
  }
  const userTheme = localStorage.getItem("theme");
  if (userTheme === "light") {
    document.body.classList.add("light");
    setTheme(true);
  } else if (userTheme === "dark") {
    document.body.classList.remove("light");
    setTheme(false);
  } else {
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    document.body.classList.toggle("light", prefersLight);
    setTheme(prefersLight);
  }
  if (themeBtn)
    themeBtn.addEventListener("click", () => {
      const isLight = !document.body.classList.contains("light");
      setTheme(isLight);
    });
})();

// --- Scroll reveal para seções e animação de barras de skills ---
(function () {
  const revealEls = document.querySelectorAll("section, .card, .skill-bar");
  const trigger = window.innerHeight * 0.92;
  function revealOnScroll() {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) el.classList.add("visible");
    });
  }
  function animateSkillBars() {
    document.querySelectorAll(".skill-bar").forEach((bar) => {
      const el = bar.querySelector(".bar");
      if (bar.classList.contains("visible")) {
        el.style.setProperty("width", el.dataset.width);
        el.style.transition = "width 1.2s cubic-bezier(.21,1.02,.73,1)";
      } else {
        el.style.width = "0";
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll, { passive: true });
  window.addEventListener("load", revealOnScroll);
  window.addEventListener("scroll", animateSkillBars, { passive: true });
  window.addEventListener("load", animateSkillBars);
  window.addEventListener("resize", animateSkillBars);
})();

// --- Rolagem suave para âncoras internas ---
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
  });
})();

// --- Header Scroll Suave e Parallax ---
(function () {
  const header = document.querySelector("header");
  let lastScroll = 0;
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
      scrollTimeout = window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
        lastScroll = currentScroll;
      });
    },
    { passive: true }
  );
  // Parallax Hero
  const hero = document.querySelector(".hero");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.2;
        const yPos = scrolled * parallaxSpeed;
        if (hero) hero.style.transform = `translate3d(0, ${yPos}px, 0)`;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// --- Loading Screen com Fade Elegante ---
(function () {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(loadingOverlay);
  window.addEventListener("load", () => {
    setTimeout(() => {
      loadingOverlay.style.opacity = "0";
      setTimeout(() => {
        loadingOverlay.style.visibility = "hidden";
      }, 500);
    }, 500);
  });
})();

// --- Intersection Observer para animações de entrada ---
(function () {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px", threshold: 0.1 }
  );
  document
    .querySelectorAll(".card, .skill-item, .hero h1, .hero p")
    .forEach((el) => {
      observer.observe(el);
    });
})();

// --- Feedback visual ao expandir formulário de contato ---
(function () {
  const contactBtn = document.querySelector(".contact-collapsed");
  const contactFields = document.querySelector(".contact-fields");
  if (contactBtn && contactFields) {
    contactBtn.addEventListener("click", () => {
      contactFields.classList.toggle("expanded");
      contactFields.style.boxShadow = contactFields.classList.contains(
        "expanded"
      )
        ? "0 0 0 3px var(--primary-glow)"
        : "";
      contactFields.style.transition = "box-shadow 0.3s";
    });
  }
})();

// --- Feedback visual no formulário de contato ---
const form = document.querySelector('form[action*="formspree"]');
if (form) {
  form.addEventListener("submit", function (e) {
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Enviando...";
    setTimeout(() => {
      btn.textContent = "Enviado!";
      btn.classList.add("enviado");
      setTimeout(() => {
        btn.textContent = "Enviar";
        btn.classList.remove("enviado");
        btn.disabled = false;
        form.reset();
      }, 2000);
    }, 1200);
  });
}

// --- Função para restaurar o cursor padrão do navegador ---
function restaurarCursorPadrao() {
  document.body.style.cursor = "auto";
}
// Você pode chamar essa função quando quiser voltar ao cursor padrão
// Exemplo: restaurarCursorPadrao();

window.addEventListener("DOMContentLoaded", function () {
  // Animação fade-in no header
  const header = document.querySelector("header");
  if (header) {
    header.style.opacity = "0";
    header.style.transform = "translateY(-30px)";
    setTimeout(() => {
      header.style.transition = "opacity 0.8s, transform 0.8s";
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }, 100);
  }

  // Botão voltar ao topo
  const btn = document.createElement("button");
  btn.innerHTML = "↑";
  btn.id = "back-to-top";
  btn.title = "Voltar ao topo";
  btn.setAttribute("aria-label", "Voltar ao topo");
  btn.style.display = "none";
  document.body.appendChild(btn);
  window.addEventListener(
    "scroll",
    () => {
      btn.style.display = window.scrollY > 300 ? "block" : "none";
    },
    { passive: true }
  );
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Tema automático
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  if (prefersDark) document.body.classList.add("dark-theme");
  if (prefersLight) document.body.classList.add("light");

  // Lazy loading para todas imagens
  document.querySelectorAll("img:not([loading])").forEach((img) => {
    img.setAttribute("loading", "lazy");
  });
});
