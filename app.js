/* =====================================================
   CONFIGURACION Y DATOS POR DEFECTO
===================================================== */

const defaults = {

  profile: {

    name: "Mi Portfolio",

    headline:
      "Tecnología, análisis y creatividad",

    profession:
      "Desarrollador",

    location:
      "Perú",

    avatar_url: "",

    email: "",

    phone: "",

    linkedin: "",

    github: "",

    about:
      "Perfil profesional.",

    focus:
      "Aprendizaje continuo."

  },

  highlights: [],

  photos: [],

  experience: [],

  projects: [],

  social_links: []

};

/* =====================================================
   UTILIDADES
===================================================== */

const $ = (selector) =>
  document.querySelector(selector);

const $$ = (selector) =>
  document.querySelectorAll(selector);

const hasSupabaseConfig = () =>
  Boolean(
    window.SUPABASE_CONFIG?.url &&
    window.SUPABASE_CONFIG?.anonKey
  );

const localGet = (key, fallback) => {

  const saved =
    localStorage.getItem(key);

  return saved
    ? JSON.parse(saved)
    : fallback;

};

function createClient() {

  if (!hasSupabaseConfig())
    return null;

  return window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.anonKey
  );

}

/* =====================================================
   CARGA DE DATOS
===================================================== */

async function loadData() {

  const client =
    createClient();

  if (!client) {

    return {

      profile:
        localGet(
          "profile",
          defaults.profile
        ),

      highlights:
        localGet(
          "highlights",
          defaults.highlights
        ),

      photos:
        localGet(
          "photos",
          defaults.photos
        ),

      experience:
        localGet(
          "experience",
          defaults.experience
        ),

      projects:
        localGet(
          "projects",
          defaults.projects
        ),

      social_links:
        localGet(
          "social_links",
          defaults.social_links
        )

    };

  }

  try {

    const [

      { data: profile },

      { data: highlights },

      { data: photos },

      { data: experience },

      { data: projects },

      { data: socialLinks }

    ] = await Promise.all([

      client
        .from("profile")
        .select("*")
        .eq("id", 1)
        .single(),

      client
        .from("highlights")
        .select("*")
        .order(
          "sort_order",
          { ascending: true }
        ),

      client
        .from("photos")
        .select("*")
        .order(
          "sort_order",
          { ascending: true }
        ),

      client
        .from("experience")
        .select("*")
        .order(
          "sort_order",
          { ascending: true }
        ),

      client
        .from("projects")
        .select("*")
        .order(
          "sort_order",
          { ascending: true }
        ),

      client
        .from("social_links")
        .select("*")
        .order(
          "sort_order",
          { ascending: true }
        )

    ]);

    return {

      profile:
        profile ||
        defaults.profile,

      highlights:
        highlights || [],

      photos:
        photos || [],

      experience:
        experience || [],

      projects:
        projects || [],

      social_links:
        socialLinks || []

    };

  } catch (error) {

    console.error(
      "Error cargando datos:",
      error
    );

    return {

      profile:
        defaults.profile,

      highlights: [],

      photos: [],

      experience: [],

      projects: [],

      social_links: []

    };

  }

}

/* =====================================================
   PERFIL
===================================================== */

function renderProfile(profile) {

  $("#profile-name").textContent =
    profile.name || "Portfolio";

  $("#profile-headline").textContent =
    profile.headline || "";

  $("#profile-about").textContent =
    profile.about || "";

  $("#profile-focus").textContent =
    profile.focus || "";

  $("#profile-location").textContent =
    profile.location || "";

  $("#footer-name").textContent =
    profile.name || "Portfolio";

  $("#logo-name").textContent =
    profile.name || "Portfolio";

  document.title =
    profile.name
      ? `${profile.name} | Portfolio`
      : "Portfolio Profesional";

  const avatar =
    $("#profile-avatar");

  const fallback =
    $("#avatar-fallback");

  if (profile.avatar_url) {

    avatar.src =
      profile.avatar_url;

    avatar.style.display =
      "block";

    fallback.style.display =
      "none";

  } else {

    avatar.style.display =
      "none";

    fallback.style.display =
      "flex";

  }

}

/* =====================================================
   ESPECIALIDADES
===================================================== */

function renderHighlights(
  highlights
) {

  const grid =
    $("#highlight-grid");

  if (!grid) return;

  grid.innerHTML = "";

  if (!highlights.length) {

    grid.innerHTML = `
      <div class="empty-state">
        No hay especialidades registradas.
      </div>
    `;

    return;

  }

  highlights.forEach(
    (item, index) => {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "skill-card reveal";

      card.innerHTML = `

        <div class="skill-number">
          ${(index + 1)
            .toString()
            .padStart(2, "0")}
        </div>

        <h3>
          ${item.title}
        </h3>

        <p>
          ${item.description}
        </p>

      `;

      grid.append(card);

    }
  );

  const counter =
    $("#highlights-count");

  if (counter) {

    counter.textContent =
      highlights.length;

  }

}

/* =====================================================
   EXPERIENCIA
===================================================== */

function renderExperience(
  experience
) {

  const timeline =
    $("#experience-timeline");

  if (!timeline) return;

  timeline.innerHTML = "";

  if (!experience.length) {

    timeline.innerHTML = `
      <div class="empty-state">
        No hay experiencia registrada.
      </div>
    `;

    return;

  }

  experience.forEach(item => {

    const card =
      document.createElement("div");

    card.className =
      "timeline-item reveal";

    card.innerHTML = `

      <div class="timeline-year">
        ${item.year}
      </div>

      <div class="timeline-content">

        <h3>
          ${item.title}
        </h3>

        <p>
          ${item.description || ""}
        </p>

      </div>

    `;

    timeline.append(card);

  });

}

/* =====================================================
   PROYECTOS
===================================================== */

function renderProjects(
  projects
) {

  const grid =
    $("#projects-grid");

  if (!grid) return;

  grid.innerHTML = "";

  if (!projects.length) {

    grid.innerHTML = `
      <div class="empty-state">
        No hay proyectos registrados.
      </div>
    `;

    return;

  }

  projects.forEach(project => {

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "project-card reveal";

    card.innerHTML = `

      <img
        src="${project.image_url || ""}"
        alt="${project.title}"
      >

      <div class="project-content">

        <h3>
          ${project.title}
        </h3>

        <p>
          ${project.description || ""}
        </p>

        ${
          project.url
            ? `
            <a
              href="${project.url}"
              target="_blank"
              class="project-btn"
            >
              Ver Proyecto
            </a>
            `
            : ""
        }

      </div>

    `;

    grid.append(card);

  });

}
/* =====================================================
   REDES SOCIALES
===================================================== */

function renderSocialLinks(
  socialLinks
) {

  const grid =
    $("#social-links");

  if (!grid) return;

  grid.innerHTML = "";

  if (!socialLinks.length) {

    grid.innerHTML = `
      <div class="empty-state">
        No hay redes configuradas.
      </div>
    `;

    return;

  }

  socialLinks.forEach(link => {

    const card =
      document.createElement("a");

    card.href =
      link.url;

    card.target =
      "_blank";

    card.rel =
      "noopener noreferrer";

    card.className =
      "social-card reveal";

    card.innerHTML = `

      <span>
        ${link.platform}
      </span>

    `;

    grid.append(card);

  });

}

/* =====================================================
   GALERIA
===================================================== */

function renderPhotos(
  photos
) {

  const grid =
    $("#gallery-grid");

  if (!grid) return;

  grid.innerHTML = "";

  if (!photos.length) {

    grid.innerHTML = `
      <div class="empty-state">
        Todavía no hay fotografías publicadas.
      </div>
    `;

    return;

  }

  photos.forEach(photo => {

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "gallery-item reveal";

    card.innerHTML = `

      <img
        src="${photo.image_url}"
        alt="${photo.title}"
        loading="lazy"
      >

      <div class="gallery-overlay">

        <h3>
          ${photo.title}
        </h3>

        <p>
          ${photo.location || ""}
        </p>

      </div>

    `;

    card.addEventListener(
      "click",
      () => openLightbox(photo)
    );

    grid.append(card);

  });

  const counter =
    $("#photos-count");

  if (counter) {

    animateCounter(
      counter,
      photos.length
    );

  }

}

/* =====================================================
   LIGHTBOX
===================================================== */

const lightbox =
  $("#lightbox");

function openLightbox(
  photo
) {

  $("#lightbox-image").src =
    photo.image_url || "";

  $("#lightbox-title").textContent =
    photo.title || "";

  $("#lightbox-location").textContent =
    photo.location || "";

  $("#lightbox-description").textContent =
    photo.description || "";

  lightbox.classList.add(
    "active"
  );

  document.body.style.overflow =
    "hidden";

}

function closeLightbox() {

  lightbox.classList.remove(
    "active"
  );

  document.body.style.overflow =
    "auto";

}

$("#close-lightbox")
?.addEventListener(
  "click",
  closeLightbox
);

lightbox
?.addEventListener(
  "click",
  event => {

    if (
      event.target === lightbox
    ) {

      closeLightbox();

    }

  }
);

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeLightbox();

    }

  }
);

/* =====================================================
   CONTADORES
===================================================== */

function animateCounter(
  element,
  target
) {

  let current = 0;

  const increment =
    Math.max(
      1,
      Math.ceil(target / 40)
    );

  const timer =
    setInterval(() => {

      current += increment;

      if (
        current >= target
      ) {

        current = target;

        clearInterval(timer);

      }

      element.textContent =
        current;

    }, 30);

}

/* =====================================================
   SCROLL REVEAL
===================================================== */

function initReveal() {

  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "active"
              );

            }

          }
        );

      },

      {
        threshold: 0.15
      }

    );

  document
    .querySelectorAll(
      ".reveal"
    )
    .forEach(el =>
      observer.observe(el)
    );

}

/* =====================================================
   CURSOR GLOW
===================================================== */

function initCursorGlow() {

  const glow =
    document.querySelector(
      ".cursor-glow"
    );

  if (!glow) return;

  document.addEventListener(
    "mousemove",
    e => {

      glow.style.left =
        e.clientX + "px";

      glow.style.top =
        e.clientY + "px";

    }
  );

}

/* =====================================================
   NAVBAR
===================================================== */

function initNavbar() {

  const header =
    document.querySelector(
      ".site-header"
    );

  if (!header) return;

  window.addEventListener(
    "scroll",
    () => {

      if (
        window.scrollY > 50
      ) {

        header.classList.add(
          "scrolled"
        );

      } else {

        header.classList.remove(
          "scrolled"
        );

      }

    }
  );

}

/* =====================================================
   SMOOTH SCROLL
===================================================== */

function initSmoothScroll() {

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(anchor => {

      anchor.addEventListener(
        "click",
        function(e) {

          const target =
            document.querySelector(
              this.getAttribute(
                "href"
              )
            );

          if (!target)
            return;

          e.preventDefault();

          target.scrollIntoView({

            behavior: "smooth",

            block: "start"

          });

        }
      );

    });

}

/* =====================================================
   HERO
===================================================== */

function animateHero() {

  const heroName =
    $("#profile-name");

  if (!heroName) return;

  heroName.classList.add(
    "hero-visible"
  );

}

/* =====================================================
   INICIO
===================================================== */

async function init() {

  const {

    profile,

    highlights,

    photos,

    experience,

    projects,

    social_links

  } = await loadData();

  renderProfile(
    profile
  );

  renderHighlights(
    highlights
  );

  renderExperience(
    experience
  );

  renderProjects(
    projects
  );

  renderSocialLinks(
    social_links
  );

  renderPhotos(
    photos
  );

  initReveal();

  initCursorGlow();

  initNavbar();

  initSmoothScroll();

  animateHero();

}

document.addEventListener(
  "DOMContentLoaded",
  init
);
