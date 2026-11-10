/**
 * TEDx Portland Event Deck - Reverse Engineered Component
 * Handles horizontal slider scrubbing, device-pixel snapped card lift,
 * dynamic 3D pointer parallax gliding, and smooth track navigation.
 */

(function () {
  'use strict';

  function initTedxDeck() {
    const sections = document.querySelectorAll('.tedx-deck-section');
    if (!sections.length) return;

    sections.forEach((section) => {
      const track = section.querySelector('.tedx-track');
      const prevBtn = section.querySelector('.tedx-nav-prev');
      const nextBtn = section.querySelector('.tedx-nav-next');
      const cards = section.querySelectorAll('.tedx-card');

      if (!track) return;

      // ----------------------------------------------------
      // 1. Slider Scroll & Drag Mechanics
      // ----------------------------------------------------
      let isDragging = false;
      let hasDragged = false;
      let startX = 0;
      let startScroll = 0;

      const updateNavButtons = () => {
        if (!prevBtn || !nextBtn) return;
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth - 2;

        if (scrollLeft <= 4) {
          prevBtn.classList.add('is-hidden');
        } else {
          prevBtn.classList.remove('is-hidden');
        }

        if (scrollLeft >= maxScroll) {
          nextBtn.classList.add('is-hidden');
        } else {
          nextBtn.classList.remove('is-hidden');
        }
      };

      track.addEventListener('scroll', updateNavButtons, { passive: true });
      window.addEventListener('resize', updateNavButtons, { passive: true });
      updateNavButtons();

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const scrollAmount = Math.max(340, track.clientWidth * 0.75);
          track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const scrollAmount = Math.max(340, track.clientWidth * 0.75);
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
      }

      // Pointer drag scrubbing on desktop
      const onPointerDown = (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        isDragging = false;
        hasDragged = false;
        startX = e.clientX;
        startScroll = track.scrollLeft;

        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
      };

      const onPointerMove = (e) => {
        const dx = e.clientX - startX;
        if (!isDragging) {
          if (Math.abs(dx) < 6) return;
          isDragging = true;
          hasDragged = true;
          track.classList.add('is-dragging');
        }
        e.preventDefault();
        track.scrollLeft = startScroll - dx;
      };

      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (isDragging) {
          isDragging = false;
          track.classList.remove('is-dragging');
          setTimeout(() => {
            hasDragged = false;
          }, 50);
        }
      };

      track.addEventListener('pointerdown', onPointerDown);

      // Prevent link navigation if dragging occurred
      track.addEventListener(
        'click',
        (e) => {
          if (hasDragged) {
            e.stopPropagation();
            e.preventDefault();
            hasDragged = false;
          }
        },
        true
      );

      // ----------------------------------------------------
      // 2. Card Hover Choreography & 3D Pointer Parallax
      // ----------------------------------------------------
      let settleZ = 20;

      cards.forEach((card) => {
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let rafId = null;
        let settleTimer = null;
        let isHovered = false;

        const snapLift = () => {
          const parentCol = card.parentElement;
          if (!parentCol) return;
          const wrap = parentCol.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          const unit = 1 / dpr;
          const snap = (v) => Math.round(v / unit) * unit;

          const scaledW = snap(wrap.width * 1.035);
          const scale = scaledW / wrap.width;
          const leftOffset = wrap.left + (wrap.width - scaledW) / 2;
          const subpixelX = snap(leftOffset) - leftOffset;

          card.style.setProperty('--lift-scale', scale.toFixed(6));
          card.style.setProperty('--lift-x', `${subpixelX.toFixed(3)}px`);
        };

        const glide = () => {
          currentX += (targetX - currentX) * 0.12;
          currentY += (targetY - currentY) * 0.12;

          card.style.setProperty('--px', currentX.toFixed(4));
          card.style.setProperty('--py', currentY.toFixed(4));

          if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
            rafId = requestAnimationFrame(glide);
          } else {
            rafId = null;
          }
        };

        const startGliding = () => {
          if (!rafId) rafId = requestAnimationFrame(glide);
        };

        const canHover = (e) => {
          return e.pointerType !== 'touch' && window.matchMedia('(hover: hover)').matches;
        };

        card.addEventListener('pointerenter', (e) => {
          if (!canHover(e)) return;
          clearTimeout(settleTimer);
          isHovered = true;
          snapLift();
          card.classList.remove('is-settling');
          card.classList.add('is-lifted');
          card.style.zIndex = '30';
        });

        card.addEventListener('pointermove', (e) => {
          if (!canHover(e)) return;
          const rect = card.getBoundingClientRect();
          targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          startGliding();
        });

        card.addEventListener('pointerleave', (e) => {
          if (!canHover(e)) return;
          isHovered = false;
          targetX = 0;
          targetY = 0;
          startGliding();

          card.classList.remove('is-lifted');
          card.classList.add('is-settling');
          card.style.zIndex = String(Math.min(29, ++settleZ));

          clearTimeout(settleTimer);
          settleTimer = setTimeout(() => {
            if (!isHovered) {
              card.classList.remove('is-settling');
              card.style.zIndex = '';
            }
          }, 350);
        });
      });

      // ----------------------------------------------------
      // 3. Ambient Video Optimization
      // ----------------------------------------------------
      const videos = section.querySelectorAll('video');
      if (videos.length && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver(
          ([entry]) => {
            videos.forEach((vid) => {
              if (entry.isIntersecting) {
                vid.play().catch(() => {});
              } else {
                vid.pause();
              }
            });
          },
          { threshold: 0.1 }
        );
        videoObserver.observe(section);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTedxDeck);
  } else {
    initTedxDeck();
  }

  window.initTedxDeck = initTedxDeck;
})();

