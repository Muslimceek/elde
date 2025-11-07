/**
 * ============================================================
 * main.js — СБОРЩИК КОМПОНЕНТОВ И ИНТЕРАКТИВНОСТЬ САЙТА EL&DI
 * ============================================================
 * Важно: запускать через локальный сервер (например, VS Code Live Server)
 * ============================================================
 */

// === 1. Список всех компонентов ===
const componentList = [
  { id: 'header-placeholder', path: 'components/header.html' },
  { id: 'hero-placeholder', path: 'components/hero.html' },
  { id: 'menu-placeholder', path: 'components/menu.html' },
  { id: 'coffee-info-placeholder', path: 'components/coffee-info.html' },
  { id: 'location-placeholder', path: 'components/location.html' },
  { id: 'contact-placeholder', path: 'components/contact.html' },
  { id: 'footer-placeholder', path: 'components/footer.html' }
];


/**
 * 2. Загрузка и вставка HTML-компонента с выполнением встроенных скриптов
 */
async function loadComponent(componentId, filePath) {
  const placeholder = document.getElementById(componentId);
  if (!placeholder) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    placeholder.innerHTML = html;

    // --- Выполняем встроенные <script> теги ---
    const scripts = placeholder.querySelectorAll("script");
    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
      oldScript.remove();
    });

  } catch (error) {
    console.error(`❌ Не удалось загрузить компонент: ${filePath}`, error);
    placeholder.innerHTML = `<p style="color:red;text-align:center;padding:20px;">
      Xatolik! Komponent ${componentId} yuklanmadi.
    </p>`;
  }
}


/**
 * 3. Инициализация карусели меню (если используется)
 */
function initializeMenuCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevMenuSlide');
  const nextBtn = document.getElementById('nextMenuSlide');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let currentSlide = 0;

  track.style.transition = 'transform 0.5s ease-in-out';

  function moveSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    else if (currentSlide >= totalSlides) currentSlide = 0;

    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  prevBtn.addEventListener('click', () => moveSlide(-1));
  nextBtn.addEventListener('click', () => moveSlide(1));

  // Клик по слайду → открыть изображение
  track.addEventListener('click', e => {
    const slide = e.target.closest('.carousel-slide');
    if (slide) {
      const img = slide.querySelector('img');
      if (img && img.src) window.open(img.src, '_blank');
    }
  });
}


/**
 * 4. Анимации появления секций (fade-in)
 */
function initializeFadeInAnimations() {
  const sections = document.querySelectorAll('section');
  const reveal = () => {
    const trigger = window.innerHeight * 0.85;
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < trigger) sec.classList.add('visible');
    });
  };
  window.addEventListener('scroll', reveal);
  window.addEventListener('load', reveal);
}


/**
 * 5. Основные интерактивные функции: плавный скролл и меню
 */
function initializeInteractions() {
  setTimeout(() => {
    // --- Плавный скролл по якорям ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // --- Мобильное меню (header) ---
    const header = document.getElementById('header-placeholder');
    const nav = header?.querySelector('.main-nav');
    const container = header?.querySelector('.container');

    if (nav && container) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'menu-toggle';
      toggleBtn.innerHTML = '&#9776;';
      container.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', () => nav.classList.toggle('menu-open'));
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('menu-open'));
      });
    }

    // --- Инициализация карусели ---
    initializeMenuCarousel();

    // --- Fade-in анимации ---
    initializeFadeInAnimations();

  }, 300);
}


/**
 * 6. Главная функция — загрузка всех компонентов и запуск интерактивности
 */
async function main() {
  await Promise.all(componentList.map(c => loadComponent(c.id, c.path)));
  initializeInteractions();
}


// === Запуск после загрузки DOM ===
document.addEventListener('DOMContentLoaded', main);
