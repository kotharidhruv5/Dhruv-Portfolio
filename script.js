// Scroll progress bar
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress);
updateProgress();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Reveal-on-scroll animation
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Populate 49-dot grid (industry portfolios) for factor model viz
const dotGrid = document.getElementById('dotGrid');
if (dotGrid) {
  for (let i = 0; i < 49; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dotGrid.appendChild(dot);
  }
}

// Count-up animation for correlation stat
const corrEls = document.querySelectorAll('.corr-number');
if (corrEls.length) {
  const corrObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = (target * progress).toFixed(2);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        corrObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  corrEls.forEach(el => corrObserver.observe(el));
}

// --- Custom cursor (desktop / fine-pointer only) ---
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isFinePointer) {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverables = document.querySelectorAll('a, button, .card, .tags span');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });

  // --- Magnetic buttons ---
  const magnets = document.querySelectorAll('[data-magnetic]');
  magnets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// LinkedIn link placeholder guard (in case href reverts to '#')
const linkedinLink = document.getElementById('linkedinLink');
if (linkedinLink && linkedinLink.getAttribute('href') === '#') {
  linkedinLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Add your LinkedIn URL in index.html (search for id="linkedinLink") to activate this link.');
  });
}
