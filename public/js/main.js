document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initMap();
});

/* ---------------- Mobile nav ---------------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------- Interactive US map ---------------- */
const STATE_PHOTOS = {
  washington: { file: "washington.jpg", caption: "Washington", detail: "Praying at the Washington state line." },
  california: { file: "california.jpg", caption: "California", detail: "Praying at the California state line." },
  nevada: { file: "nevada.jpg", caption: "Nevada", detail: "Praying near the Las Vegas Strip." },
  utah: { file: "utah.jpg", caption: "Utah", detail: "Praying near the Salt Lake Temple." },
  texas: { file: "texas.jpg", caption: "Texas", detail: "Praying at the Texas state line." },
  kansas: { file: "kansas.jpg", caption: "Kansas", detail: "Praying at the Kansas state line." },
  nebraska: { file: "nebraska.jpg", caption: "Nebraska", detail: "Praying at the Nebraska state line." },
  missouri: { file: "missouri.jpg", caption: "Missouri", detail: "Praying at the Gateway Arch in St. Louis." },
  georgia: { file: "georgia.jpg", caption: "Georgia", detail: "Praying at the Georgia Guidestones." },
  tennessee: { file: "tennessee.jpg", caption: "Tennessee", detail: "Praying at the Tennessee state line." },
  florida: { file: "florida.jpg", caption: "Florida", detail: "Praying at the Florida state line." },
  "new-york": { file: "new-york.jpg", caption: "New York", detail: "Kneeling in prayer facing the Statue of Liberty." },
  "west-virginia": { file: "west-virginia.jpg", caption: "West Virginia", detail: "Praying at the West Virginia state line." },
  virginia: { file: "virginia.jpg", caption: "Virginia", detail: "Praying at the Virginia state line." },
  delaware: { file: "delaware.jpg", caption: "Delaware", detail: "Praying at the Delaware state line." },
  maryland: { file: "maryland.jpg", caption: "Maryland", detail: "Praying at the Maryland state line." },
  connecticut: { file: "connecticut.jpg", caption: "Connecticut", detail: "Praying at the Connecticut state line." },
  "new-jersey": { file: "new-jersey.jpg", caption: "New Jersey", detail: "Praying at the New Jersey state line." },
  vermont: { file: "vermont.jpg", caption: "Vermont", detail: "Praying at the Vermont state line." },
  massachusetts: { file: "massachusetts.jpg", caption: "Massachusetts", detail: "Praying at the Massachusetts state line." },
  "rhode-island": { file: "rhode-island.jpg", caption: "Rhode Island", detail: "Praying at the Rhode Island state line." },
  maine: { file: "maine.jpg", caption: "Maine", detail: "Praying at the Maine state line." },
  "new-hampshire": { file: "new-hampshire.jpg", caption: "New Hampshire", detail: "Praying at the New Hampshire state line." },
  pennsylvania: { file: "pennsylvania.jpg", caption: "Pennsylvania", detail: "Praying at the Pennsylvania state line." },
  "north-carolina": { file: "north-carolina.jpg", caption: "North Carolina", detail: "Praying at the North Carolina state line." },
  "south-carolina": { file: "south-carolina.jpg", caption: "South Carolina", detail: "Praying at the South Carolina state line." },
  alabama: { file: "alabama.jpg", caption: "Alabama", detail: "Praying at the Alabama state line." },
  mississippi: { file: "mississippi.jpg", caption: "Mississippi", detail: "Praying at the Mississippi state line." },
  louisiana: { file: "louisiana.jpg", caption: "Louisiana", detail: "Praying at the Louisiana state line." },
  oklahoma: { file: "oklahoma.jpg", caption: "Oklahoma", detail: "Praying at the Oklahoma state line." },
  "new-mexico": { file: "new-mexico.jpg", caption: "New Mexico", detail: "Praying at the New Mexico state line." },
  arizona: { file: "arizona.jpg", caption: "Arizona", detail: "Praying at the Arizona state line." },
  colorado: { file: "colorado.jpg", caption: "Colorado", detail: "Praying at the Colorado state line." },
  arkansas: { file: "arkansas.jpg", caption: "Arkansas", detail: "Praying at the Arkansas state line." },
  indiana: { file: "indiana.jpg", caption: "Indiana", detail: "Praying at the Indiana state line." },
  kentucky: { file: "kentucky.jpg", caption: "Kentucky", detail: "Praying at the Kentucky state line." },
  ohio: { file: "ohio.jpg", caption: "Ohio", detail: "Praying at the Ohio state line." },
  michigan: { file: "michigan.jpg", caption: "Michigan", detail: "Praying at the Michigan state line." },
  illinois: { file: "illinois.jpg", caption: "Illinois", detail: "Praying at the Illinois state line." },
  wisconsin: { file: "wisconsin.jpg", caption: "Wisconsin", detail: "Praying at the Wisconsin state line." },
  minnesota: { file: "minnesota.jpg", caption: "Minnesota", detail: "Praying at the Minnesota state line." },
  "north-dakota": { file: "north-dakota.jpg", caption: "North Dakota", detail: "Praying at the North Dakota state line." },
  montana: { file: "montana.jpg", caption: "Montana", detail: "Praying at the Montana state line." },
  idaho: { file: "idaho.jpg", caption: "Idaho", detail: "Praying at the Idaho state line." },
  oregon: { file: "oregon.jpg", caption: "Oregon", detail: "Praying at the Oregon state line." },
  wyoming: { file: "wyoming.jpg", caption: "Wyoming", detail: "Praying at the Wyoming state line." },
  "south-dakota": { file: "south-dakota.jpg", caption: "South Dakota", detail: "Praying at the South Dakota state line." },
  iowa: { file: "iowa.jpg", caption: "Iowa", detail: "Praying at the Iowa state line." },
};

function initMap() {
  const svg = document.getElementById("us-map");
  const wrap = document.querySelector(".map-wrap");
  const card = document.getElementById("map-card");
  if (!svg || !wrap || !card || typeof US_STATES === "undefined") return;

  const cardImg = card.querySelector("img");
  const cardTitle = card.querySelector(".map-card-title");
  const cardDetail = card.querySelector(".map-card-detail");
  const cardClose = card.querySelector(".map-card-close");

  let activePath = null;

  function positionCard(path, evt) {
    const wrapRect = wrap.getBoundingClientRect();
    let x, y;
    if (evt && evt.clientX) {
      x = evt.clientX - wrapRect.left;
      y = evt.clientY - wrapRect.top;
    } else {
      const box = path.getBoundingClientRect();
      x = box.left + box.width / 2 - wrapRect.left;
      y = box.top - wrapRect.top;
    }
    const cardWidth = card.offsetWidth || 210;
    x = Math.min(Math.max(x - cardWidth / 2, 8), wrapRect.width - cardWidth - 8);
    y = Math.max(y - 190, 8);
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  }

  function openCard(path, photo, evt) {
    if (activePath) activePath.classList.remove("is-active");
    activePath = path;
    path.classList.add("is-active");
    cardImg.src = `assets/images/states/${photo.file}`;
    cardImg.alt = `Kim Chadwell of Holy Nation — ${photo.detail}`;
    cardTitle.textContent = photo.caption;
    cardDetail.textContent = photo.detail;
    positionCard(path, evt);
    card.classList.add("is-visible");
  }

  function closeCard() {
    if (activePath) activePath.classList.remove("is-active");
    activePath = null;
    card.classList.remove("is-visible");
  }

  cardClose.addEventListener("click", closeCard);

  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape") closeCard();
  });

  document.addEventListener("click", (evt) => {
    if (
      card.classList.contains("is-visible") &&
      !card.contains(evt.target) &&
      !evt.target.classList.contains("state")
    ) {
      closeCard();
    }
  });

  US_STATES.forEach((state) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const photo = STATE_PHOTOS[state.slug];
    path.setAttribute("d", state.d);
    path.setAttribute("class", "state" + (photo ? " has-photo" : ""));
    path.setAttribute("data-state", state.name);
    path.setAttribute("data-slug", state.slug);
    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "button");
    path.setAttribute(
      "aria-label",
      photo ? `${state.name} — view travel photo` : `${state.name}`
    );

    const handleActivate = (evt) => {
      evt.preventDefault();
      if (!photo) return;
      if (activePath === path && card.classList.contains("is-visible")) {
        closeCard();
      } else {
        openCard(path, photo, evt);
      }
    };

    path.addEventListener("click", handleActivate);
    path.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter" || evt.key === " ") handleActivate(evt);
    });

    svg.appendChild(path);
  });
}
