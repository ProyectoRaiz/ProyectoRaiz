document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroAnimation();
  initScrollReveal();
  initServicesTilt();
  initPortfolio();
  initChat();
  initFaq();
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

function initHeroAnimation() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Simple animation for seeds/leaves floating
  const particles = [];
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * -1 - 0.5,
      color: Math.random() > 0.5 ? '#B7CBAE' : '#F2D9A1'
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Reveal text
  setTimeout(() => {
    const title = document.querySelector('.hero-title');
    const logo = document.querySelector('.hero-logo');
    const subtitle = document.querySelector('.hero-subtitle');

    if (logo) {
      logo.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
      logo.style.opacity = '1';
      logo.style.transform = 'translateY(0)';
    }

    if (title) {
      title.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }

    if (subtitle) {
      setTimeout(() => {
        subtitle.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }, 500);
    }
  }, 300);
}

function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('reveal');
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.pillar-card').forEach(el => observer.observe(el));
}

function initServicesTilt() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

function initPortfolio() {
  if (typeof portfolioData === 'undefined') return;

  const designGrid = document.getElementById('portfolio-design-grid');
  const webGrid = document.getElementById('portfolio-web-grid');
  const modal = document.getElementById('case-study-modal');

  if (!designGrid || !webGrid || !modal) return;

  function createCard(item) {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
      <div class="portfolio-overlay">
        <h3>${item.title}</h3>
        <p>${item.tags.join(' • ')}</p>
      </div>
    `;
    div.addEventListener('click', () => openModal(item));
    return div;
  }

  // Populate Design Grid
  portfolioData.diseno.forEach(item => {
    designGrid.appendChild(createCard(item));
  });

  // Populate Web Grid
  portfolioData.web.forEach(item => {
    webGrid.appendChild(createCard(item));
  });

  // Modal logic
  function openModal(item) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
      <button class="modal-close">&times;</button>
      <div class="case-study-header">
        <img src="${item.thumbnail}" alt="${item.title}">
      </div>
      <div class="case-study-body">
        <h2>${item.title}</h2>
        <div class="case-study-tags">
          ${item.tags.map(tag => `<span class="badge badge-popular">${tag}</span>`).join('')}
        </div>
        <p>${item.details}</p>
        <div class="case-study-gallery">
          ${item.gallery.map(img => `<img src="${img}" alt="Gallery image">`).join('')}
        </div>
        ${item.link !== '#' ? `<br><a href="${item.link}" target="_blank" class="btn btn-primary">Visitar Proyecto</a>` : ''}
      </div>
    `;

    modal.classList.add('active');

    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

function initChat() {
  const options = document.querySelectorAll('.chat-option-btn');
  const messagesContainer = document.getElementById('chat-messages');

  if (!messagesContainer) return;

  options.forEach(btn => {
    btn.addEventListener('click', function () {
      // Hide options
      this.parentElement.style.display = 'none';

      // User message
      const userText = this.textContent;
      addMessage(userText, 'user');

      // Show typing
      const typingId = showTyping();

      // Bot response based on action
      const action = this.getAttribute('data-action');
      setTimeout(() => {
        removeTyping(typingId);

        let responseHTML = '';
        if (action === 'identidad' || action === 'web' || action === 'retainer') {
          responseHTML = `¡Excelente elección! Cuéntanos más sobre tu idea y la haremos crecer. ¿Por dónde prefieres hablar?<br><br>
          <a href="https://wa.me/3113200214?text=Hola,%20me%20interesa%20el%20servicio%20de%20${encodeURIComponent(userText)}" target="_blank" class="btn btn-secondary" style="font-size:0.9rem; padding: 5px 10px;">📱 WhatsApp</a>
          <a href="https://instagram.com/raizestudio" target="_blank" class="btn btn-outline" style="font-size:0.9rem; padding: 5px 10px;">📸 Instagram</a>`;
        } else {
          responseHTML = `¡Claro! Estamos aquí para resolver tus dudas.<br><br>
          <a href="https://wa.me/3113200214" target="_blank" class="btn btn-secondary" style="font-size:0.9rem; padding: 5px 10px;">Escríbenos por WhatsApp</a>`;
        }

        addMessage(responseHTML, 'bot', true);
      }, 1500);
    });
  });

  function addMessage(text, sender, isHTML = false) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    if (isHTML) {
      div.innerHTML = text;
    } else {
      div.textContent = text;
    }
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = id;
    div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}

function initFaq() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(i => i.classList.remove('active'));

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Animación de burbujas al hacer scroll
window.addEventListener('scroll', function () {
  document.querySelectorAll('.bubble').forEach(bubble => {
    bubble.style.transform = 'scale(1.05) rotate(' + (window.scrollY % 360) + 'deg)';
    setTimeout(() => bubble.style.transform = '', 300);
  });
});

// Efecto 3D animado en cards interactivas
document.querySelectorAll('.interactive-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.transform = `rotateX(${-(y - rect.height / 2) / 14}deg) rotateY(${(x - rect.width / 2) / 14}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// FAQ interactivo (desplegable)
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('open');
    let p = item.querySelector('p');
    if (item.classList.contains('open')) {
      p.style.display = 'block';
    } else {
      p.style.display = 'none';
    }
  });
  const pInitial = item.querySelector('p');
  if (pInitial) pInitial.style.display = 'none';
});

// Efecto bounce en elementos interactivos
document.querySelectorAll('.interactive-bounce').forEach(el => {
  el.addEventListener('mouseover', () => {
    el.style.transform = 'scale(1.15) rotate(-5deg)';
  });
  el.addEventListener('mouseout', () => {
    el.style.transform = '';
  });
});

// Efecto hover en gráficos del Hero
const heroImg = document.querySelector('.animated-graphic');
if (heroImg) {
  heroImg.addEventListener('mouseenter', () => {
    heroImg.style.filter = 'drop-shadow(0 0 25px #2f80ed)';
    heroImg.style.transform = 'scale(1.07) rotate(-2deg)';
  });
  heroImg.addEventListener('mouseleave', () => {
    heroImg.style.filter = '';
    heroImg.style.transform = '';
  });
}

// Lógica de Dibujo en Canvas (Mouse y Touch)
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('draw-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches[0]) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }

    canvas.addEventListener('mousedown', (e) => { drawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); });
    canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
    canvas.addEventListener('mouseout', () => { drawing = false; ctx.beginPath(); });
    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      const pos = getPos(e);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#2f80ed';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); }, { passive: false });
    canvas.addEventListener('touchend', (e) => { e.preventDefault(); drawing = false; ctx.beginPath(); }, { passive: false });
    canvas.addEventListener('touchcancel', (e) => { e.preventDefault(); drawing = false; ctx.beginPath(); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!drawing) return;
      const pos = getPos(e);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#2f80ed';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }, { passive: false });
  }
});

// Lógica de Cambio de Tema (Modo Oscuro / Claro)
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      themeBtn.textContent = 'Modo Claro';
    } else {
      themeBtn.textContent = 'Modo Oscuro';
    }
  });
}

// Lógica de Generador de Partículas Mágicas en Botón
const particlesBtn = document.getElementById('particles-btn');
const particlesContainer = document.getElementById('particles-container');
if (particlesBtn && particlesContainer) {
  particlesBtn.addEventListener('click', () => {
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.position = 'absolute';
      p.style.left = '45px';
      p.style.top = '25px';
      p.style.width = '9px';
      p.style.height = '9px';
      p.style.borderRadius = '50%';
      p.style.background = `linear-gradient(90deg, #ff6a00, #2f80ed)`;
      p.style.opacity = Math.random() * 0.8 + 0.2;
      p.style.transform = `translate(-50%, -50%)`;
      particlesContainer.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 35 + 18;
      setTimeout(() => {
        p.style.transition = 'all .8s cubic-bezier(.7,.2,.4,1)';
        p.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) scale(0.5)`;
        p.style.opacity = 0;
      }, 10);
      setTimeout(() => particlesContainer.removeChild(p), 900);
    }
  });
}

// Lógica de Flip Card (Tarjeta Giratoria de Opiniones)
const flipCard = document.querySelector('.flip-card');
if (flipCard) {
  flipCard.addEventListener('click', () => {
    flipCard.classList.toggle('flipped');
  });
}

// Botón flotante "Ir arriba" (Scroll to Top)
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.title = 'Ir arriba';
scrollTopBtn.innerText = '↑';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function () {
  if (window.scrollY > 200) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});
scrollTopBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


document.addEventListener("DOMContentLoaded", function () {
  // 0. Botón "Descubre cómo" (Scroll suave)
  const descubreBtn = document.getElementById('descubre-btn');
  if (descubreBtn) {
    descubreBtn.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('primer-contenido').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 1. Lógica de Dibujo en Canvas
  const canvas = document.getElementById('draw-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches[0]) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      } else {
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    }

    canvas.addEventListener('mousedown', (e) => { drawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); });
    canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
    canvas.addEventListener('mouseout', () => { drawing = false; ctx.beginPath(); });
    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      const pos = getPos(e);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#6b5a4e';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); drawing = true; ctx.beginPath(); const pos = getPos(e); ctx.moveTo(pos.x, pos.y); }, { passive: false });
    canvas.addEventListener('touchend', (e) => { e.preventDefault(); drawing = false; ctx.beginPath(); }, { passive: false });
    canvas.addEventListener('touchcancel', (e) => { e.preventDefault(); drawing = false; ctx.beginPath(); }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!drawing) return;
      const pos = getPos(e);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#6b5a4e';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }, { passive: false });
  }

  // 2. Lógica de Cambio de Tema (Modo Oscuro / Claro) corregida
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      themeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
    });
  }

  // 3. Lógica de Generador de Partículas
  const particlesBtn = document.getElementById('particles-btn');
  const particlesContainer = document.getElementById('particles-container');
  if (particlesBtn && particlesContainer) {
    particlesBtn.addEventListener('click', () => {
      for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = '55px';
        p.style.top = '15px';
        particlesContainer.appendChild(p);
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 45 + 20;
        setTimeout(() => {
          p.style.transition = 'all .8s cubic-bezier(.7,.2,.4,1)';
          p.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) scale(0.4)`;
          p.style.opacity = 0;
        }, 10);
        setTimeout(() => particlesContainer.removeChild(p), 900);
      }
    });
  }

  // 4. Lógica de Flip Card (Opinión)
  const opinionFlip = document.getElementById('opinion-flip');
  if (opinionFlip) {
    opinionFlip.addEventListener('click', () => {
      opinionFlip.classList.toggle('flipped');
    });
  }

  // 5. Animación de rebote al pasar el mouse
  document.querySelectorAll('.interactive-bounce').forEach(el => {
    el.addEventListener('mouseover', () => {
      el.style.transform = 'scale(1.06) rotate(-2deg)';
    });
    el.addEventListener('mouseout', () => {
      el.style.transform = '';
    });
  });
});
