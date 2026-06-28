/* ============================================================
   Urbatrix Homepage — Animations trigger
   - IntersectionObserver para .ic-frame (animaciones de entrada)
   - Reveal on scroll para .container-card-bento (cards bento)
   ============================================================ */

(function () {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Marquee de los chips del hero (en móvil: una sola línea en bucle) ----
  // Envuelve los chips en una pista con DOS grupos idénticos (original + clon),
  // y el CSS anima translateX(-50%) en bucle sin costuras. En desktop el grupo
  // clon se oculta y queda la fila estática de 3. Con reduced-motion no se monta.
  (function setupHeroMarquee() {
    const row = document.querySelector('.hero .features');
    if (!row || row.dataset.marquee || reducedMotion) return;
    const chips = Array.prototype.slice.call(row.children);
    if (chips.length < 2) return;
    const track = document.createElement('div');
    track.className = 'chips-track';
    const g1 = document.createElement('div');
    g1.className = 'chips-group';
    const g2 = document.createElement('div');
    g2.className = 'chips-group';
    g2.setAttribute('aria-hidden', 'true');
    chips.forEach((c) => g1.appendChild(c));
    chips.forEach((c) => g2.appendChild(c.cloneNode(true)));
    track.appendChild(g1);
    track.appendChild(g2);
    row.appendChild(track);
    row.classList.add('has-marquee');
    row.dataset.marquee = '1';
  })();

  // ---- 0. Animaciones de entrada del header + hero (al cargar) ----
  // Timeline de aparición: el header baja, el texto del hero sube en cascada,
  // el dashboard entra con un leve scale y los chips/logos cierran. Usa
  // autoAlpha (opacity + visibility). No toca .box-dashboard (reservado al tilt);
  // anima su wrapper .box-dashboard-wrap. Con reduced-motion se omite (todo
  // queda visible).
  if (window.gsap && !reducedMotion) {
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
    const header = q('.header');
    const heroText = [
      '.hero .badge',
      '.hero .vende-tu-desarrollo',
      '.hero .analiza',
      '.hero .button-container',
    ].map(q).filter(Boolean);
    const dash = q('.hero .box-dashboard-wrap');
    const heroCards = qa('.hero .card-feature, .hero .card-feature-2');
    const subc = q('.hero .sub-container');

    // Estado inicial oculto (evita el flash antes de animar)
    // El header sólo se desvanece (sin y/transform): un transform en .header
    // rompería el position:fixed del navbar central (sección 7).
    if (header) gsap.set(header, { autoAlpha: 0 });
    if (heroText.length) gsap.set(heroText, { y: 26, autoAlpha: 0 });
    if (dash) gsap.set(dash, { y: 42, scale: 0.96, autoAlpha: 0 });
    if (heroCards.length) gsap.set(heroCards, { y: 18, autoAlpha: 0 });
    if (subc) gsap.set(subc, { y: 18, autoAlpha: 0 });

    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.8 },
      delay: 0.05,
    });
    if (header) introTl.to(header, { autoAlpha: 1, duration: 0.6 }, 0);
    if (heroText.length)
      introTl.to(heroText, { y: 0, autoAlpha: 1, stagger: 0.1 }, 0.15);
    if (dash)
      introTl.to(dash, { y: 0, scale: 1, autoAlpha: 1, duration: 1 }, 0.35);
    if (heroCards.length)
      introTl.to(heroCards, { y: 0, autoAlpha: 1, stagger: 0.08 }, 0.55);
    if (subc) introTl.to(subc, { y: 0, autoAlpha: 1 }, 0.7);
  }

  // ---- 1. Activar .ic-frame.in-view cuando entra al viewport ----
  // (las animaciones de entrada dependen de esta clase, no de auto-trigger)
  const icFrames = document.querySelectorAll('.ic-frame');
  if ('IntersectionObserver' in window && icFrames.length) {
    const icIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          icIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    icFrames.forEach((el) => icIO.observe(el));
  } else {
    icFrames.forEach((el) => el.classList.add('in-view'));
  }

  // ---- 2. Reveal de cards bento al entrar al viewport ----
  // Se hace con la clase .reveal-hidden (no con estilos inline): al
  // quitarla, el transform vuelve a estar 100% bajo control del CSS, así
  // el hover del bento (que también usa transform) nunca queda pisado.
  // Reveal on-scroll reutilizable: oculta las cards (.reveal-hidden) y al entrar
  // al viewport las muestra en cascada con una transición lenta. El delay y la
  // transición lenta son SÓLO para la entrada y se limpian luego, para no
  // ralentizar/retrasar el hover (que usa la transición del CSS).
  const revealOnScroll = (sel, step, dur) => {
    const cards = Array.prototype.slice.call(document.querySelectorAll(sel));
    if (!('IntersectionObserver' in window) || !cards.length || reducedMotion) return;
    cards.forEach((c) => c.classList.add('reveal-hidden'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const group = el.parentElement
            ? Array.prototype.slice.call(el.parentElement.querySelectorAll(sel))
            : [el];
          // En móvil las cards entran de una en una: sin stagger acumulado
          // (si no, las últimas esperarían su índice × step ya estando en pantalla).
          const mobile = window.matchMedia('(max-width: 900px)').matches;
          const delay = mobile ? 0 : Math.max(0, group.indexOf(el)) * step;
          el.style.transition =
            'transform ' + dur + 'ms cubic-bezier(.22,.61,.36,1) ' + delay + 'ms, ' +
            'opacity ' + dur + 'ms ease ' + delay + 'ms';
          el.classList.remove('reveal-hidden');
          io.unobserve(el);
          setTimeout(() => {
            el.style.transition = '';
          }, delay + dur + 80);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    cards.forEach((c) => io.observe(c));
  };

  // Bento features (más marcado) y tarjetas de .client-types (más sutil).
  revealOnScroll('.container-card-bento', 180, 850);
  revealOnScroll('.client-types .content-wrapper', 150, 700);
  // Si no hay IntersectionObserver o hay reduced-motion, las cards quedan
  // visibles por defecto (no se les añade la clase), sin estilos inline.

  // ---- Página Producto: entrada del hero + reveal de cards y CTA ----
  // (no-op en otras páginas: los selectores no existen).
  const productHero = document.querySelector('.product-hero');
  if (productHero && window.gsap && !reducedMotion) {
    const heroEls = productHero.querySelectorAll(
      '.product-eyebrow, .product-hero__title, .product-hero__desc'
    );
    gsap.from(heroEls, {
      autoAlpha: 0,
      y: 26,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.08,
    });
  }
  // (las cards de producto son .client-types .content-wrapper → ya cubiertas
  // por el revealOnScroll de client-types de arriba)
  const productCta = document.querySelector('.product-cta');
  if (productCta && window.gsap && window.ScrollTrigger && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(
      productCta.querySelectorAll(
        '.product-cta__title, .product-cta__desc, .product-cta__actions'
      ),
      {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: productCta, start: 'top 82%', once: true },
      }
    );
  }

  // ---- 3. Carrusel de las 3 tabs de la card Reserva ----
  // Rotan de posición (izq -> centro -> der) y la del centro queda activa.
  const r2Track = document.querySelector('.r2-frame .r2-div');
  if (r2Track && !reducedMotion) {
    const tabs = Array.prototype.slice.call(r2Track.children);
    if (tabs.length === 3) {
      r2Track.classList.add('r2-carousel');
      const POS = ['r2-pos-left', 'r2-pos-center', 'r2-pos-right'];
      let order = [0, 1, 2]; // order[pos] = índice de la tab en esa posición
      const place = () => {
        order.forEach((tabIdx, pos) => {
          const t = tabs[tabIdx];
          t.classList.remove('r2-pos-left', 'r2-pos-center', 'r2-pos-right');
          t.classList.add(POS[pos]);
        });
      };
      place();
      setInterval(() => {
        // Desplazar a la izquierda: la tab de la izquierda envuelve a la
        // derecha. A esa se le quita la transición para que no cruce toda
        // la pantalla (salta directa, oculta detrás de la central).
        const wrap = tabs[order[0]];
        wrap.style.transition = 'none';
        order = [order[1], order[2], order[0]];
        place();
        void wrap.offsetWidth; // forzar reflow
        requestAnimationFrame(() => { wrap.style.transition = ''; });
      }, 2400);
    }
  }

  // ---- 4. Tilt 3D del dashboard del hero siguiendo el mouse ----
  // Da vida al hero: el panel "mira" hacia el cursor de forma sutil y suave.
  // El transform se aplica a .box-dashboard (no a la imagen hija), así el
  // linear-gradient de fondo del contenedor también rota y el efecto 3D se
  // percibe de forma coherente. La perspective vive en el wrapper ancestro
  // .box-dashboard-wrap, que queda libre para animar la entrada con GSAP.
  const tiltBox = document.querySelector('.box-dashboard');
  const tiltEl = tiltBox; // tilt sobre el contenedor, no sobre la imagen
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (tiltBox && tiltEl && !reducedMotion && finePointer) {
    const MAX = 4.5;               // grados máx. de inclinación (presente pero sutil)
    const EASE = 0.07;             // suavizado (menor = más suave/lento)
    let trX = 0, trY = 0, cuX = 0, cuY = 0, raf = null;
    let rect = tiltBox.getBoundingClientRect();
    const refreshRect = () => { rect = tiltBox.getBoundingClientRect(); };
    const clamp = (v) => Math.max(-1.1, Math.min(1.1, v));

    function tick() {
      cuX += (trX - cuX) * EASE;
      cuY += (trY - cuY) * EASE;
      tiltEl.style.transform =
        'rotateX(' + cuX.toFixed(2) + 'deg) rotateY(' + cuY.toFixed(2) + 'deg)';
      if (Math.abs(trX - cuX) > 0.02 || Math.abs(trY - cuY) > 0.02) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }

    window.addEventListener('mousemove', (e) => {
      const px = clamp((e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2));
      const py = clamp((e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2));
      trY = px * MAX;    // rotateY: el panel mira a izquierda/derecha
      trX = -py * MAX;   // rotateX: mira arriba/abajo
      kick();
    }, { passive: true });

    // al sacar el mouse de la ventana, vuelve a plano
    window.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) { trX = 0; trY = 0; kick(); }
    });
    window.addEventListener('scroll', refreshRect, { passive: true });
    window.addEventListener('resize', refreshRect);
  }

  // ---- 5. Features · timeline (izq) + card-stack (der) con GSAP ScrollTrigger
  // Izquierda: lista vertical de pasos dentro de un .features-track que se
  // DESPLAZA para anclar el paso ACTIVO en una zona de lectura fija. El activo
  // muestra todo (label, título, descripción, stat) y su punto se ilumina;
  // arriba quedan los pasados en compacto (sólo label+título, atenuados) y
  // abajo los futuros, cada vez más tenues. Una línea continua (.features-line)
  // que se sale del viewport marca el recorrido, con relleno verde hasta el
  // punto activo.
  // Derecha: 4 cards apiladas; las de atrás asoman HACIA ABAJO y la del frente
  // se va hacia arriba al avanzar. Todo pineado (N-1) viewports con scrub.
  // ≤900px: sin pin, columna normal.
  const featuresGrid = document.querySelector('.section-features-grid');
  const featuresStage = document.querySelector('.section-features-stage');
  const featuresCols = document.querySelector('.section-features-cols');
  const featureCards = featuresStage
    ? Array.prototype.slice.call(featuresStage.querySelectorAll('.div-right-feature'))
    : [];
  const featureSteps = Array.prototype.slice.call(
    document.querySelectorAll('.features-step')
  );

  if (
    featuresGrid &&
    featuresStage &&
    featuresCols &&
    featureCards.length >= 2 &&
    !reducedMotion
  ) {
    const mq = window.matchMedia('(min-width: 901px)');
    let tl = null;
    let currentPos = 0;     // posición continua actual (0..N-1) para re-aplicar en refresh
    let dotY = [];          // posición vertical (compacta) del centro de cada punto
    const N = featureCards.length;
    const PEEK = 26;        // px que asoma cada card detrás (hacia abajo)
    const SCALE = 0.05;     // reducción de escala por nivel
    // "Desvanecido" por profundidad en el stack: activa (0) = sin velo, y cada
    // card detrás con un poco más de velo del color de fondo. Se aplica como
    // opacidad del velo (--fade), no como opacidad de la card, para que las
    // cards sigan siendo opacas y no se transparenten entre sí.
    const stackFade = (depth) => Math.min(0.9, depth * 0.28);
    const STEP_VH = 1.35;   // viewports de scroll por transición (más alto = más largo/fluido)
    const vh = () => window.innerHeight;
    // El paso activo se ancla de modo que su bloque quede centrado vertical,
    // alineado con el centro del video (que va centrado en el grid). El punto
    // del dot va ~70px por encima del centro para compensar la altura del bloque.
    const anchorY = () => Math.round(vh() * 0.5 - 33);

    // ---- Videos de las features: solo se reproduce el del paso ACTIVO ----
    // (mute + autoplay en loop); el resto en pausa. Va alternando con el scroll
    // y al salir de la sección se pausan todos.
    const featureVideos = featureCards.map((c) =>
      c.querySelector('.feature-video')
    );
    let activeVideoIdx = -1;
    const activateVideo = (idx) => {
      if (document.fullscreenElement) return; // no interrumpir en pantalla completa
      idx = Math.max(0, Math.min(N - 1, idx));
      if (idx === activeVideoIdx) return;
      activeVideoIdx = idx;
      featureVideos.forEach((v, i) => {
        if (!v) return;
        if (i === idx) {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
        }
      });
    };
    const pauseAllVideos = () => {
      activeVideoIdx = -1;
      featureVideos.forEach((v) => v && v.pause());
    };

    // Botón de pantalla completa por video
    featureCards.forEach((card) => {
      const v = card.querySelector('.feature-video');
      const fsBtn = card.querySelector('.feature-fs');
      if (!v || !fsBtn) return;
      fsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (v.requestFullscreen) v.requestFullscreen();
        else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
        else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS
      });
    });
    // Al entrar a pantalla completa: con sonido y controles; al salir: restaurar.
    document.addEventListener('fullscreenchange', () => {
      const fsEl = document.fullscreenElement;
      featureVideos.forEach((v) => {
        if (!v) return;
        if (v === fsEl) {
          v.controls = true;
          v.muted = false;
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          v.controls = false;
          v.muted = true;
        }
      });
      if (!fsEl) {
        const idx = activeVideoIdx >= 0 ? activeVideoIdx : 0;
        activeVideoIdx = -1; // forzar re-activación por scroll
        activateVideo(idx);
      }
    });

    // ---- Construir el track (envuelve los pasos) + la línea continua ----
    let track = featuresCols.querySelector('.features-track');
    let line = null;
    let lineFill = null;
    if (!track) {
      track = document.createElement('div');
      track.className = 'features-track';
      line = document.createElement('span');
      line.className = 'features-line';
      line.setAttribute('aria-hidden', 'true');
      lineFill = document.createElement('span');
      lineFill.className = 'features-line__fill';
      line.appendChild(lineFill);
      track.appendChild(line);
      Array.prototype.slice
        .call(featuresCols.querySelectorAll(':scope > .div-inner-section'))
        .forEach((a) => track.appendChild(a));
      featuresCols.appendChild(track);
    } else {
      line = track.querySelector('.features-line');
      lineFill = track.querySelector('.features-line__fill');
    }

    // Mide la posición compacta de cada punto (con el track sin transform y
    // todos los pasos colapsados), y coloca la línea continua.
    const measure = () => {
      const prevTransform = track.style.transform;
      track.style.transition = 'none';
      track.style.transform = 'none';
      featureSteps.forEach((s) =>
        s.classList.remove(
          'features-step--past',
          'features-step--active',
          'features-step--future'
        )
      );
      const tRect = track.getBoundingClientRect();
      dotY = featureSteps.map((step) => {
        const dot = step.querySelector('.features-step__dot');
        const r = dot.getBoundingClientRect();
        return r.top - tRect.top + r.height / 2;
      });
      if (line && dotY.length === N) {
        const first = featureSteps[0].querySelector('.features-step__dot').getBoundingClientRect();
        const dotX = first.left - tRect.left + first.width / 2;
        line.style.left = dotX + 'px';
        line.style.top = dotY[0] + 'px';
        // la línea termina exactamente en el último paso
        line.style.height = dotY[N - 1] - dotY[0] + 'px';
      }
      track.style.transform = prevTransform || '';
      requestAnimationFrame(() => {
        track.style.transition = '';
      });
    };

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    // Opacidad base del título cuando NO es el activo (atenuado uniforme):
    // pasados ~0.4; futuros cada vez más tenues con la distancia.
    const dimBaseFor = (d) => {
      if (d >= 0) return 0.1; // pasados (arriba)
      const ad = -d;
      return Math.max(0.04, 0.1 - (ad - 1) * 0.03); // futuros (abajo)
    };

    // TODO el movimiento es continuo y atado al scroll (sin transición CSS):
    // la lista se desliza, la línea crece y las opacidades cruzan de forma
    // lineal según la posición fraccional `pos` (0..N-1).
    const render = (pos) => {
      currentPos = pos;
      if (dotY.length !== N) return;
      // 1) desplazamiento del track + relleno de la línea (interpolado)
      const i = Math.max(0, Math.min(N - 2, Math.floor(pos)));
      const f = clamp01(pos - i);
      const y = pos >= N - 1 ? dotY[N - 1] : lerp(dotY[i], dotY[i + 1], f);
      track.style.transform = 'translateY(' + (anchorY() - y) + 'px)';
      if (lineFill) lineFill.style.height = y - dotY[0] + 'px';

      // 2) opacidades por paso + estado del punto (todo continuo)
      const ring = Math.max(0, Math.min(N - 1, Math.round(pos)));
      featureSteps.forEach((step, idx) => {
        const d = pos - idx;
        const ad = Math.abs(d);
        const near = clamp01(1 - ad);
        const base = dimBaseFor(d);
        const titleOp = base + (1 - base) * near; // activo→1, lejos→base
        const descOp = clamp01(1 - ad * 1.5);     // sólo visible cerca del activo
        const label = step.querySelector('.features-step__label');
        const title = step.querySelector('.features-step__title');
        const desc = step.querySelector('.features-step__desc');
        if (label) label.style.opacity = titleOp;
        if (title) title.style.opacity = titleOp;
        if (desc) desc.style.opacity = descOp;
        // punto: relleno/anillo/gris según cercanía al ancla
        step.classList.remove(
          'features-step--past',
          'features-step--active',
          'features-step--future'
        );
        step.classList.add(
          idx < ring
            ? 'features-step--past'
            : idx === ring
            ? 'features-step--active'
            : 'features-step--future'
        );
      });
      // 3) reproducir solo el video del paso activo
      activateVideo(ring);
    };

    const setup = () => {
      if (!window.gsap || !window.ScrollTrigger || tl) return;
      gsap.registerPlugin(ScrollTrigger);

      // Estado inicial: la card 0 al frente/centrada; las demás asoman ABAJO,
      // cada una un poco más transparente que la de delante.
      featureCards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: -50,
          y: i * PEEK,
          scale: 1 - i * SCALE,
          rotation: 0,
          opacity: 1,
          '--fade': stackFade(i),
          zIndex: N - i,
          transformOrigin: '50% 50%',
        });
      });
      measure();
      render(0);

      tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'feat-grid',
          trigger: featuresGrid,
          start: 'top top',
          end: () => '+=' + vh() * (N - 1) * STEP_VH,
          pin: true,
          scrub: 0.5,        // menor = más responsivo (menos "arrastre"); mayor = más suave
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          onRefresh: () => {
            measure();
            render(currentPos);
          },
          onUpdate: (self) => {
            render(self.progress * (N - 1));
          },
          // al salir de la sección (arriba o abajo), pausar todos los videos
          onLeave: pauseAllVideos,
          onLeaveBack: pauseAllVideos,
        },
      });

      for (let s = 0; s < N - 1; s++) {
        // la card del frente sale: sube y se lanza a la derecha girando (más
        // pronunciado) y se desvanece pronto/rápido.
        tl.to(
          featureCards[s],
          { y: -vh() * 1.1, x: 320, rotation: 32, duration: 1 },
          s
        );
        // fade a opacity 0 antes (empieza al inicio del lanzamiento) y rápido
        tl.to(
          featureCards[s],
          { opacity: 0, duration: 0.3, ease: 'power2.in' },
          s + 0.18
        );
        // las de atrás avanzan un nivel (siguen asomando hacia abajo) y suben
        // su opacidad según su nueva profundidad.
        for (let i = s + 1; i < N; i++) {
          const depth = i - (s + 1);
          tl.to(
            featureCards[i],
            {
              y: depth * PEEK,
              scale: 1 - depth * SCALE,
              '--fade': stackFade(depth),
              duration: 1,
            },
            s
          );
        }
      }

      ScrollTrigger.refresh();
    };

    const teardown = () => {
      if (tl) {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
        tl = null;
      }
      featureCards.forEach((c) => {
        if (window.gsap) gsap.set(c, { clearProps: 'all' });
      });
      featureSteps.forEach((s) => {
        s.classList.remove(
          'features-step--past',
          'features-step--active',
          'features-step--future'
        );
        ['.features-step__label', '.features-step__title', '.features-step__desc'].forEach(
          (sel) => {
            const el = s.querySelector(sel);
            if (el) el.style.opacity = '';
          }
        );
      });
      track.style.transform = '';
      if (lineFill) lineFill.style.height = '0px';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };

    // ===== Móvil =====
    const articlesM = () =>
      Array.prototype.slice.call(
        document.querySelectorAll('.section-features-cols .div-inner-section')
      );
    const PEEK_M = 16; // px que asoma cada box detrás (móvil)
    const SCALE_M = 0.05;

    // Fallback reduced-motion: intercalar el box dentro de su paso (columna).
    const interleaveBoxes = () => {
      const arts = articlesM();
      featureCards.forEach((box, i) => {
        if (arts[i] && box.parentElement !== arts[i]) arts[i].appendChild(box);
      });
    };

    // Layout animado: dos zonas dentro del pin.
    //   .m-stage → boxes apilados (peek/scale/velo + "lanzamiento" como desktop)
    //   .m-text  → texto con crossfade vertical (el activo baja+fade-out; el
    //              nuevo entra desde abajo+fade-in — como si se intercambiaran).
    let mobileTl = null;
    const buildMobileLayout = () => {
      let mStage = featuresCols.querySelector('.m-stage');
      let mText = featuresCols.querySelector('.m-text');
      if (!mStage) {
        mStage = document.createElement('div');
        mStage.className = 'm-stage';
        mStage.setAttribute('aria-hidden', 'true');
        mText = document.createElement('div');
        mText.className = 'm-text';
        featuresCols.appendChild(mStage);
        featuresCols.appendChild(mText);
      }
      articlesM().forEach((art, i) => {
        const text = art.querySelector('.div-left-feature');
        if (featureCards[i]) mStage.appendChild(featureCards[i]); // box arriba
        if (text) mText.appendChild(text); // texto abajo
      });
      return { mStage, mText };
    };
    const restoreDesktopLayout = () => {
      const arts = articlesM();
      const mText = featuresCols.querySelector('.m-text');
      if (mText) {
        Array.prototype.slice.call(mText.children).forEach((t, i) => {
          if (arts[i]) arts[i].appendChild(t);
        });
      }
      featureCards.forEach((box) => {
        if (box.parentElement !== featuresStage) featuresStage.appendChild(box);
      });
    };

    const setupMobilePinned = () => {
      if (!window.gsap || !window.ScrollTrigger || reducedMotion || mobileTl) return;
      if (articlesM().length < 2 || featureCards.length < 2) return;
      const N = featureCards.length;
      const vh = () => window.innerHeight;

      featuresCols.classList.add('is-mobile-pinned');
      const grid = featuresCols.parentElement;
      if (grid) grid.classList.add('is-mobile-pin-host');

      const { mText } = buildMobileLayout();
      const texts = Array.prototype.slice.call(mText.children);

      // Estado inicial. Boxes: stack (activo al frente; los demás asoman abajo,
      // más velados). Textos: el primero visible, el resto abajo e invisibles.
      featureCards.forEach((box, i) => {
        gsap.set(box, {
          yPercent: -50,
          y: i * PEEK_M,
          scale: 1 - i * SCALE_M,
          rotation: 0,
          autoAlpha: 1,
          '--fade': stackFade(i),
          zIndex: N - i,
          transformOrigin: '50% 50%',
        });
      });
      gsap.set(texts, { autoAlpha: 0, y: 90, filter: 'blur(12px)' });
      if (texts[0]) gsap.set(texts[0], { autoAlpha: 1, y: 0, filter: 'blur(0px)' });

      mobileTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'feat-mobile',
          trigger: featuresCols,
          start: 'top top',
          end: () => '+=' + vh() * (N - 1) * 1.1,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          // reproducir solo el video del paso activo; pausar al salir
          onUpdate: (self) =>
            activateVideo(Math.round(self.progress * (N - 1))),
          onLeave: pauseAllVideos,
          onLeaveBack: pauseAllVideos,
        },
      });

      for (let s = 0; s < N - 1; s++) {
        // BOX del frente se lanza: sube + a la derecha + rota + fade (como desktop)
        mobileTl.to(
          featureCards[s],
          { y: -vh() * 0.7, x: 150, rotation: 20, duration: 1 },
          s
        );
        mobileTl.to(
          featureCards[s],
          { autoAlpha: 0, duration: 0.3, ease: 'power2.in' },
          s + 0.18
        );
        // las de atrás avanzan un nivel (asoman menos, menos velo)
        for (let i = s + 1; i < N; i++) {
          const depth = i - (s + 1);
          mobileTl.to(
            featureCards[i],
            {
              y: depth * PEEK_M,
              scale: 1 - depth * SCALE_M,
              '--fade': stackFade(depth),
              duration: 1,
            },
            s
          );
        }
        // TEXTO: el activo baja + fade-out; el nuevo entra desde abajo + fade-in.
        if (texts[s])
          mobileTl.to(
            texts[s],
            {
              y: 90,
              autoAlpha: 0,
              filter: 'blur(12px)',
              duration: 0.5,
              ease: 'power2.in',
            },
            s
          );
        if (texts[s + 1])
          mobileTl.fromTo(
            texts[s + 1],
            { y: 90, autoAlpha: 0, filter: 'blur(12px)' },
            {
              y: 0,
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: 0.5,
              ease: 'power2.out',
            },
            s + 0.28
          );
      }

      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };

    const killMobilePinned = () => {
      if (mobileTl) {
        if (mobileTl.scrollTrigger) mobileTl.scrollTrigger.kill();
        mobileTl.kill();
        mobileTl = null;
      }
      if (featuresCols) {
        featuresCols.classList.remove('is-mobile-pinned');
        const grid = featuresCols.parentElement;
        if (grid) grid.classList.remove('is-mobile-pin-host');
      }
      featureCards.forEach((b) => {
        if (window.gsap) gsap.set(b, { clearProps: 'all' });
      });
      const mText = featuresCols.querySelector('.m-text');
      if (mText)
        Array.prototype.slice.call(mText.children).forEach((t) => {
          if (window.gsap) gsap.set(t, { clearProps: 'all' });
        });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };

    const onMQ = (e) => {
      if (e.matches) {
        killMobilePinned();
        restoreDesktopLayout();
        setup();
      } else {
        teardown();
        if (reducedMotion) interleaveBoxes();
        else setupMobilePinned();
      }
    };
    if (mq.matches) setup();
    else if (reducedMotion) interleaveBoxes();
    else setupMobilePinned();
    mq.addEventListener('change', onMQ);

    // El contenido por encima (hero, bento) carga imágenes lazy que cambian
    // la altura tras el primer cálculo. Recalcular en 'load' evita que el pin
    // arranque en una posición de scroll equivocada (sección "no se queda fija").
    window.addEventListener('load', () => {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  // ---- 6. Features · cabecera: reveal de palabras (pin) + split de salida ----
  // Fase 1 (pin): la cabecera queda fija y la DESCRIPCIÓN se revela palabra a
  //   palabra con el scroll (de gris claro/fino a oscuro/grueso).
  // Fase 2 (sin pin): título → izquierda y descripción → derecha, ambos a
  //   opacity 0, saliendo de pantalla mientras la sección de features sube por
  //   detrás (cuando features queda fija, la cabecera ya desapareció).
  const featHeader = document.querySelector('.section-features .title');
  const featHeadline = featHeader && featHeader.querySelector('.features-headline');
  const featDesc = featHeader && featHeader.querySelector('.text-wrapper-8');

  if (featHeader && featHeadline && featDesc && !reducedMotion) {
    const mqH = window.matchMedia('(min-width: 901px)');
    const vhH = () => window.innerHeight;
    const stEnd = (id) => {
      const st = window.ScrollTrigger && ScrollTrigger.getById(id);
      return st ? st.end : 0;
    };
    const stStart = (id) => {
      const st = window.ScrollTrigger && ScrollTrigger.getById(id);
      return st ? st.start : 0;
    };
    let revealTl = null;
    let exitTl = null;

    // Envolver cada palabra de la descripción en un <span class="fw"> (1 vez).
    if (!featDesc.dataset.split) {
      const words = featDesc.textContent.trim().split(/\s+/);
      featDesc.textContent = '';
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'fw';
        span.textContent = w;
        featDesc.appendChild(span);
        if (i < words.length - 1) {
          featDesc.appendChild(document.createTextNode(' '));
        }
      });
      featDesc.dataset.split = '1';
    }
    const wordSpans = Array.prototype.slice.call(featDesc.querySelectorAll('.fw'));

    const setupH = () => {
      if (!window.gsap || !window.ScrollTrigger || revealTl) return;
      gsap.registerPlugin(ScrollTrigger);

      // Estado inicial: palabras gris claro y peso normal; header completo.
      gsap.set(wordSpans, { color: '#cfd4dc', fontWeight: 400 });
      gsap.set([featHeadline, featDesc], { xPercent: 0, opacity: 1, filter: 'blur(0px)' });

      // Fase 1 — reveal (PINEADO): la cabecera queda fija centrada y cada
      // palabra de la descripción pasa de gris claro/fino a oscuro/grueso.
      revealTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'feat-reveal',
          trigger: featHeader,
          start: 'center center',
          end: () => '+=' + vhH() * 1.3,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 3,
        },
      });
      revealTl.to(
        wordSpans,
        { color: '#1a2330', fontWeight: 600, duration: 0.5, stagger: { amount: 1 } },
        0
      );

      // Fase 2 — split (SIN pin): empieza al terminar el reveal y termina cuando
      // el grid de features se fija. Como aquí no hay pin, al hacer scroll el
      // header se va hacia arriba/los lados y se desvanece MIENTRAS la sección
      // de features sube por detrás (solapamiento). Cuando features queda fija,
      // la cabecera ya desapareció.
      exitTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'feat-exit',
          trigger: featHeader,
          start: () => stEnd('feat-reveal'),
          end: () => {
            const g = stStart('feat-grid');
            return g || stEnd('feat-reveal') + vhH() * 0.7;
          },
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });
      exitTl
        .to(featHeadline, { xPercent: -160, duration: 1 }, 0)
        .to(featDesc, { xPercent: 160, duration: 1 }, 0)
        // blur creciente a medida que se alejan
        .to([featHeadline, featDesc], { filter: 'blur(12px)', duration: 1 }, 0)
        // el fade termina antes del final, para que ya esté invisible cuando
        // features se fija
        .to([featHeadline, featDesc], { opacity: 0, ease: 'power1.in', duration: 0.7 }, 0);

      ScrollTrigger.refresh();
    };

    const teardownH = () => {
      [revealTl, exitTl].forEach((t) => {
        if (t) {
          if (t.scrollTrigger) t.scrollTrigger.kill();
          t.kill();
        }
      });
      revealTl = null;
      exitTl = null;
      if (window.gsap) {
        gsap.set(wordSpans, { clearProps: 'color,fontWeight' });
        gsap.set([featHeadline, featDesc], { clearProps: 'transform,opacity,filter' });
      }
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };

    const onMQH = (e) => {
      if (e.matches) setupH();
      else teardownH();
    };
    if (mqH.matches) setupH();
    mqH.addEventListener('change', onMQH);
  }

  // ---- 7. Navbar central fijo al hacer scroll ----
  // Al pasar el umbral, el box del menú se fija centrado arriba (fondo negro
  // translúcido vía .is-stuck) y muestra el isotipo + el botón "Solicitar Demo".
  const navBox = document.querySelector('.div-menu-navbar');
  if (navBox) {
    const navHeader = document.querySelector('.header');
    const STICK_AT = 90; // px de scroll para fijarlo (header ya fuera de vista)
    let stuck = false;
    const onScrollNav = () => {
      const should = window.scrollY > STICK_AT;
      if (should !== stuck) {
        stuck = should;
        navBox.classList.toggle('is-stuck', stuck);
        // header móvil: al scrollear se transforma en dos cuadraditos
        if (navHeader) navHeader.classList.toggle('scrolled', stuck);
        // un transform en .header rompería el position:fixed del navbar; al
        // fijarlo aseguramos que el header no tenga transform residual.
        if (stuck && navHeader) navHeader.style.transform = 'none';
      }
    };
    onScrollNav();
    window.addEventListener('scroll', onScrollNav, { passive: true });
  }

  // ---- 8. Indicador deslizante del menú (activo + hover) ----
  // Un único "pill" verde que se mueve y se adapta al tamaño del item activo
  // (home por defecto). Al hacer hover sobre un link se desplaza y redimensiona
  // hacia él; al salir, vuelve al activo.
  const navItemsWrap = document.querySelector('.div-menu-navbar .nav-items');
  if (navItemsWrap) {
    const items = Array.prototype.slice.call(
      navItemsWrap.querySelectorAll('.nav-item')
    );
    if (items.length) {
      const indicator = document.createElement('span');
      indicator.className = 'nav-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      navItemsWrap.insertBefore(indicator, navItemsWrap.firstChild);

      let activeItem =
        items.find((it) => it.getAttribute('aria-current') === 'page') || items[0];

      const moveTo = (el) => {
        if (!el) return;
        const wrap = navItemsWrap.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        indicator.style.width = r.width + 'px';
        indicator.style.height = r.height + 'px';
        indicator.style.transform =
          'translate(' + (r.left - wrap.left) + 'px,' + (r.top - wrap.top) + 'px)';
      };
      const highlight = (el) => {
        items.forEach((it) => it.classList.toggle('nav-on', it === el));
      };
      const placeActive = () => {
        moveTo(activeItem);
        highlight(activeItem);
      };
      // Mientras un mega menú está abierto, el indicador queda "bloqueado" en su
      // tab. Al asentar: prioridad al bloqueado, luego al item bajo el cursor,
      // y si no, al activo real.
      let lockedItem = null;
      const settle = () => {
        const hovered = navItemsWrap.querySelector('.nav-item:hover');
        const el = lockedItem || hovered || activeItem;
        moveTo(el);
        highlight(el);
      };

      // Colocación inicial sin transición (evita el "vuelo" desde la esquina).
      requestAnimationFrame(() => {
        indicator.style.transition = 'none';
        placeActive();
        void indicator.offsetWidth; // reflow
        indicator.style.transition = '';
        indicator.classList.add('ready');
      });
      window.addEventListener('load', placeActive);
      window.addEventListener('resize', settle);

      // Hover: el indicador sigue al item; al salir del menú vuelve al activo
      // (o se queda en el tab del mega menú abierto, si está bloqueado).
      items.forEach((it) => {
        it.addEventListener('mouseenter', () => {
          moveTo(it);
          highlight(it);
        });
        // permite fijar el activo al hacer click (p. ej. cambiar de "página")
        it.addEventListener('click', () => {
          activeItem = it;
        });
      });
      navItemsWrap.addEventListener('mouseleave', settle);

      // API para que el mega menú fije/libere el indicador en su tab.
      window.__navIndicator = {
        lock(el) {
          lockedItem = el;
          moveTo(el);
          highlight(el);
        },
        unlock() {
          lockedItem = null;
          settle();
        },
      };
    }
  }

  // ---- 9. Entrada de .stats-metrics: barras en cascada → números → título ----
  // Al entrar la sección: 1) crecen las barras (rectángulos) en cascada, 2)
  // aparecen los números (y etiquetas), y 3) al final entra el título + el CTA.
  const statsSection = document.querySelector('.stats-metrics');
  if (
    statsSection &&
    window.gsap &&
    window.ScrollTrigger &&
    !reducedMotion
  ) {
    gsap.registerPlugin(ScrollTrigger);
    const bars = statsSection.querySelectorAll('.line-14, .line-15');
    const numbers = statsSection.querySelectorAll(
      '.text-wrapper-21, .text-wrapper-22'
    );
    const titleBlock = statsSection.querySelector('.title-2');
    const tail = ['.divider', '.action']
      .map((s) => statsSection.querySelector(s))
      .filter(Boolean);

    // En móvil los números/título salen antes (cuando las barras van ~50%),
    // sin esperar a que terminen de revelarse.
    const statsMobile = window.matchMedia('(max-width: 900px)').matches;

    const stTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: statsSection, start: 'top 72%', once: true },
    });
    if (bars.length)
      stTl.from(bars, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.45,
        ease: 'power2.out',
        stagger: { amount: 0.9 },
      });
    if (numbers.length)
      stTl.from(
        numbers,
        { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.08 },
        // desktop: ~66% de las barras; móvil: ~32% (salen mucho antes)
        statsMobile ? '-=0.92' : '-=0.45'
      );
    if (titleBlock)
      // el título entra a la vez que el primer número ('<' = inicio del tween anterior)
      stTl.from(titleBlock, { autoAlpha: 0, y: 24, duration: 0.6 }, '<');
    if (tail.length)
      stTl.from(
        tail,
        { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.12 },
        '-=0.3'
      );
  }

  // ---- 10. Entrada de las 2 últimas secciones (confianza + caso de éxito) ----
  if (window.gsap && window.ScrollTrigger && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // 10a. "Construido sobre cimientos de confianza": título + badges en cascada.
    const trustSection = document.querySelector('.stats-metrics-2');
    if (trustSection) {
      const trustTitle = trustSection.querySelector('.title-4');
      const trustBadges = trustSection.querySelectorAll('.badge-3');
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: trustSection, start: 'top 78%', once: true },
      });
      if (trustTitle) tl.from(trustTitle, { autoAlpha: 0, y: 28, duration: 0.7 });
      if (trustBadges.length)
        tl.from(
          trustBadges,
          { autoAlpha: 0, y: 22, duration: 0.5, stagger: 0.08 },
          '-=0.35'
        );
    }

    // 10b. "Caso de éxito": el texto entra, y la imagen del dashboard sube desde
    // abajo con una animación suave y larga.
    const ctaSection = document.querySelector('.CTA');
    if (ctaSection) {
      const ctaText = ctaSection.querySelector('.div-left-4');
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: ctaSection, start: 'top 78%', once: true },
      });
      if (ctaText) tl.from(ctaText, { autoAlpha: 0, y: 28, duration: 0.7 });
      // La imagen del dashboard NO tiene animación de entrada (el usuario no
      // quiere que suba desde abajo); aparece estática. El hover (CSS) la anima.
    }
  }
})();

/* ===================== Mega menús (Producto / Soluciones) =====================
   Desktop: al pasar el mouse (o hacer focus/click) sobre los tabs, baja el panel
   correspondiente con blur y animación. Se cierra al salir, con Escape o clic
   fuera. El panel se posiciona justo debajo del navbar (top calculado). */
(function () {
  'use strict';
  const navbar = document.querySelector('.div-menu-navbar');
  if (!navbar) return;
  const tabs = Array.prototype.slice.call(
    navbar.querySelectorAll('.tab[data-mega]')
  );
  if (!tabs.length) return;

  const panelFor = (tab) => document.getElementById('mega-' + tab.dataset.mega);
  let openKey = null;
  let closeTimer = null;

  const position = (panel) => {
    const r = navbar.getBoundingClientRect();
    panel.style.top = Math.round(r.bottom + 12) + 'px';
  };
  const open = (tab) => {
    clearTimeout(closeTimer);
    tabs.forEach((t) => {
      const p = panelFor(t);
      const isThis = t === tab;
      if (p) {
        if (isThis) position(p);
        p.hidden = !isThis;
      }
      t.setAttribute('aria-expanded', isThis ? 'true' : 'false');
    });
    openKey = tab.dataset.mega;
    // fija el bg-active del navbar en este tab mientras el mega menú esté abierto
    if (window.__navIndicator) window.__navIndicator.lock(tab);
  };
  const closeAll = () => {
    tabs.forEach((t) => {
      const p = panelFor(t);
      if (p) p.hidden = true;
      t.setAttribute('aria-expanded', 'false');
    });
    openKey = null;
    // libera el indicador → vuelve al activo real
    if (window.__navIndicator) window.__navIndicator.unlock();
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeAll, 170);
  };

  tabs.forEach((tab) => {
    const panel = panelFor(tab);
    tab.addEventListener('mouseenter', () => open(tab));
    tab.addEventListener('mouseleave', scheduleClose);
    tab.addEventListener('focus', () => open(tab));
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      open(tab);
    });
    if (panel) {
      panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
      panel.addEventListener('mouseleave', scheduleClose);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  document.addEventListener('click', (e) => {
    const inside =
      tabs.some((t) => t.contains(e.target)) ||
      tabs.some((t) => {
        const p = panelFor(t);
        return p && p.contains(e.target);
      });
    if (!inside) closeAll();
  });
  window.addEventListener(
    'resize',
    () => {
      if (openKey) {
        const p = document.getElementById('mega-' + openKey);
        if (p) position(p);
      }
    },
    { passive: true }
  );
})();
