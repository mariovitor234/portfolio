// Partículas animadas no fundo
const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.inset = 0;
canvas.style.zIndex = 0;
canvas.style.pointerEvents = "none";
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

// Troca de tema
const themeBtn = document.getElementById("theme-toggle");
function setTheme(light) {
  document.body.classList.toggle("light", light);
  localStorage.setItem("theme", light ? "light" : "dark");
  themeBtn.innerHTML = light
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
}
// Detectar tema do sistema se não houver tema salvo
(function () {
  const userTheme = localStorage.getItem("theme");
  if (userTheme === "light") {
    document.body.classList.add("light");
    setTheme(true);
  } else if (userTheme === "dark") {
    document.body.classList.remove("light");
    setTheme(false);
  } else {
    // Detecta preferência do sistema
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    document.body.classList.toggle("light", prefersLight);
    setTheme(prefersLight);
  }
})();
themeBtn.addEventListener("click", () => {
  const isLight = !document.body.classList.contains("light");
  setTheme(isLight);
});

// Scroll reveal para seções
const revealEls = document.querySelectorAll("section, .card, .skill-bar");
const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.92;
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) el.classList.add("visible");
  });
};
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Animação das barras de skills
function animateSkillBars() {
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    if (bar.classList.contains("visible")) {
      const el = bar.querySelector(".bar");
      el.style.setProperty("width", el.dataset.width);
      el.style.transition = "width 1.2s cubic-bezier(.21,1.02,.73,1)";
    } else {
      const el = bar.querySelector(".bar");
      el.style.width = "0";
    }
  });
}
window.addEventListener("scroll", animateSkillBars);
window.addEventListener("load", animateSkillBars);
window.addEventListener("resize", animateSkillBars);

// Feedback acessível para envio de formulário
const feedbackDiv = document.createElement('div');
feedbackDiv.setAttribute('aria-live', 'polite');
feedbackDiv.setAttribute('role', 'status');
feedbackDiv.style.position = 'fixed';
feedbackDiv.style.bottom = '1rem';
feedbackDiv.style.left = '50%';
feedbackDiv.style.transform = 'translateX(-50%)';
feedbackDiv.style.background = 'var(--card-bg)';
feedbackDiv.style.color = 'var(--primary)';
feedbackDiv.style.padding = '0.75rem 1.5rem';
feedbackDiv.style.borderRadius = '8px';
feedbackDiv.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
feedbackDiv.style.zIndex = '9999';
feedbackDiv.style.display = 'none';
document.body.appendChild(feedbackDiv);

// Remover preventDefault para permitir envio real
// document.querySelectorAll("form").forEach((f) =>
//   f.addEventListener("submit", (e) => {
//     e.preventDefault();
//     alert("Mensagem enviada! (demo)");
//   })
// );

document.querySelectorAll("form").forEach((f) =>
  f.addEventListener("submit", (e) => {
    feedbackDiv.textContent = "Mensagem enviada!";
    feedbackDiv.style.display = 'block';
    setTimeout(() => {
      feedbackDiv.style.display = 'none';
    }, 3000);
  })
);

// Rolagem suave para âncoras internas
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

// Tornar listeners de scroll passivos
window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("scroll", animateSkillBars, { passive: true });
window.addEventListener("scroll", () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    const currentScroll = window.pageYOffset;
    const scrollDelta = currentScroll - lastScroll;
    if (currentScroll > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    lastScroll = currentScroll;
  });
}, { passive: true });

// Feedback visual ao expandir formulário de contato
const contactBtn = document.querySelector('.contact-collapsed');
const contactFields = document.querySelector('.contact-fields');
if (contactBtn && contactFields) {
  contactBtn.addEventListener('click', () => {
    contactFields.classList.toggle('expanded');
    if (contactFields.classList.contains('expanded')) {
      contactFields.style.boxShadow = '0 0 0 3px var(--primary-glow)';
      contactFields.style.transition = 'box-shadow 0.3s';
    } else {
      contactFields.style.boxShadow = '';
    }
  });
}

// Loading Screen com Fade Elegante
const loadingOverlay = document.createElement("div");
loadingOverlay.className = "loading-overlay";
loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
document.body.appendChild(loadingOverlay);

// Header Scroll Suave
const header = document.querySelector("header");
let lastScroll = 0;
let scrollTimeout;

window.addEventListener("scroll", () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }

  scrollTimeout = window.requestAnimationFrame(() => {
    const currentScroll = window.pageYOffset;
    const scrollDelta = currentScroll - lastScroll;

    if (currentScroll > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });
});

// Scroll Reveal Refinado
const sections = document.querySelectorAll("main section");
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Animar elementos dentro da seção
      const elements = entry.target.querySelectorAll(
        ".card, .skill-item, h2, p"
      );
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("visible");
        }, index * 100);
      });
    }
  });
}, observerOptions);

sections.forEach((section) => {
  section.classList.add("scroll-reveal");
  sectionObserver.observe(section);
});

// Remover Loading Screen com Fade Suave
window.addEventListener("load", () => {
  setTimeout(() => {
    loadingOverlay.style.opacity = "0";
    setTimeout(() => {
      loadingOverlay.style.visibility = "hidden";
    }, 500);
  }, 500);
});

// Parallax Suave para Hero
const hero = document.querySelector(".hero");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.2;
      const yPos = scrolled * parallaxSpeed;

      hero.style.transform = `translate3d(0, ${yPos}px, 0)`;
      ticking = false;
    });

    ticking = true;
  }
});

// Smooth Scroll Aprimorado
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Adicionar classe 'visible' aos elementos quando entrarem na viewport
function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // Opcional: parar de observar após a primeira vez
    }
  });
}

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver(handleIntersection, options);

// Observar cards, skills e outros elementos que devem animar
document
  .querySelectorAll(".card, .skill-item, .hero h1, .hero p")
  .forEach((el) => {
    observer.observe(el);
  });
