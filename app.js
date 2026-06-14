const defaults = {
  profile: {
    name: "Mi perfil personal",
    headline: "Tecnologia, analisis y fotografia desde celular",
    location: "Peru",
    avatar_url: "",
    about:
      "Soy una persona proactiva, responsable y comprometida con mi crecimiento personal y profesional. Me caracteriza una mentalidad de aprendizaje constante, buscando siempre adquirir nuevos conocimientos y desarrollar habilidades para enfrentar retos en el ambito tecnologico y creativo.",
    focus:
      "Mi objetivo es seguir creciendo profesionalmente, integrando tecnologia, analisis y creatividad para desarrollar proyectos funcionales, modernos y con impacto positivo."
  },
  highlights: [
    {
      id: 1,
      title: "Desarrollo de sistemas",
      description:
        "Formacion en Desarrollo de Sistemas de Informacion, con capacidades en tecnologia, organizacion, analisis y resolucion de problemas.",
      sort_order: 1
    },
    {
      id: 2,
      title: "Fotografia y video",
      description:
        "Me apasiona capturar momentos, crear contenido visual y transmitir ideas mediante recursos audiovisuales usando principalmente mi celular.",
      sort_order: 2
    },
    {
      id: 3,
      title: "Investigacion operativa",
      description:
        "Estudio Investigacion Operativa para fortalecer mi pensamiento analitico, la toma de decisiones y el uso de modelos de optimizacion.",
      sort_order: 3
    }
  ],
  photos: [
    {
      id: 1,
      title: "Mi primera foto destacada",
      description:
        "Cuando conectes Supabase o uses el gestor, esta tarjeta se reemplazara por tus propias fotografias.",
      image_url: "",
      location: "Capturada con celular",
      sort_order: 1
    }
  ]
};

const hasSupabaseConfig = () =>
  Boolean(window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey);

const localGet = (key, fallback) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
};

const createClient = () => {
  if (!hasSupabaseConfig()) return null;
  return window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
};

async function loadData() {
  const client = createClient();

  if (!client) {
    return {
      profile: localGet("profile", defaults.profile),
      highlights: localGet("highlights", defaults.highlights),
      photos: localGet("photos", defaults.photos)
    };
  }

  const [{ data: profile }, { data: highlights }, { data: photos }] = await Promise.all([
    client.from("profile").select("*").eq("id", 1).single(),
    client.from("highlights").select("*").order("sort_order", { ascending: true }),
    client.from("photos").select("*").order("sort_order", { ascending: true })
  ]);

  return {
    profile: profile || defaults.profile,
    highlights: highlights?.length ? highlights : defaults.highlights,
    photos: photos || []
  };
}

function renderProfile(profile) {
  document.querySelector("#profile-name").textContent = profile.name;
  document.querySelector("#profile-headline").textContent = profile.headline;
  document.querySelector("#profile-about").textContent = profile.about;
  document.querySelector("#profile-focus").textContent = profile.focus;
  document.querySelector("#profile-location").textContent = profile.location || "";

  const avatar = document.querySelector("#profile-avatar");
  const fallback = document.querySelector("#avatar-fallback");
  avatar.src = profile.avatar_url || "";
  fallback.hidden = Boolean(profile.avatar_url);
}

function renderHighlights(highlights) {
  const grid = document.querySelector("#highlight-grid");
  grid.innerHTML = "";

  highlights
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .forEach((item) => {
      const card = document.createElement("article");
      card.className = "highlight-card";
      card.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
      grid.append(card);
    });
}

function renderPhotos(photos) {
  const grid = document.querySelector("#gallery-grid");
  grid.innerHTML = "";

  if (!photos.length) {
    grid.innerHTML = `<div class="empty-state">Todavia no hay fotografias publicadas. Agregalas desde el gestor.</div>`;
    return;
  }

  photos
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
    .forEach((photo) => {
      const card = document.createElement("article");
      card.className = "gallery-card";
      const image = photo.image_url
        ? `<img src="${photo.image_url}" alt="${photo.title}" />`
        : `<div class="photo-placeholder" aria-hidden="true"></div>`;
      card.innerHTML = `
        ${image}
        <div class="gallery-content">
          <h3>${photo.title}</h3>
          <p>${photo.description}</p>
          <p><strong>${photo.location || ""}</strong></p>
        </div>
      `;
      grid.append(card);
    });
}

loadData().then(({ profile, highlights, photos }) => {
  renderProfile(profile);
  renderHighlights(highlights);
  renderPhotos(photos);
});

