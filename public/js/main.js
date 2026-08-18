/* =========================================================
   HOLY NATION — shared site behaviour
   ========================================================= */

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
/* State travel photos captured on Kim Chadwell's fifty-state
   repentance journey. Only states with a confirmed photo from
   holynation.world are listed here — every other state highlights
   on hover/focus but intentionally shows no photo. */
const STATE_PHOTOS = {
  washington: {
    file: "washington.jpg",
    caption: "Washington",
    detail: "Praying at the Washington state line.",
  },
  california: {
    file: "california.jpg",
    caption: "California",
    detail: "Praying at the California state line.",
  },
  nevada: {
    file: "nevada.jpg",
    caption: "Nevada",
    detail: "Praying near the Las Vegas Strip.",
  },
  utah: {
    file: "utah.jpg",
    caption: "Utah",
    detail: "Praying near the Salt Lake Temple.",
  },
  texas: {
    file: "texas.jpg",
    caption: "Texas",
    detail: "Praying at the Texas state line.",
  },
  kansas: {
    file: "kansas.jpg",
    caption: "Kansas",
    detail: "Praying at the Kansas state line.",
  },
  nebraska: {
    file: "nebraska.jpg",
    caption: "Nebraska",
    detail: "Praying at the Nebraska state line.",
  },
  missouri: {
    file: "missouri.jpg",
    caption: "Missouri",
    detail: "Praying at the Gateway Arch in St. Louis.",
  },
  georgia: {
    file: "georgia.jpg",
    caption: "Georgia",
    detail: "Praying at the Georgia Guidestones.",
  },
  tennessee: {
    file: "tennessee.jpg",
    caption: "Tennessee",
    detail: "Praying at the Tennessee state line.",
  },
  florida: {
    file: "florida.jpg",
    caption: "Florida",
    detail: "Praying at the Florida state line.",
  },
  "new-york": {
    file: "new-york.jpg",
    caption: "New York",
    detail: "Kneeling in prayer facing the Statue of Liberty.",
  },
};

function initMap() {
  const svg = document.getElementById("us-map");
  const wrap = document.querySelector(".map-wrap");
  const card = document.getElementById("map-card");
  if (!svg || !wrap || !card || typeof US_STATES === "undefined") return;

  const cardImg = card.querySelector("img");
  const cardTitle = card.querySelector(".map-card-title");
  const cardDetail = card.querySelector(".map-card-detail");

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

    const showCard = (evt) => {
      path.classList.add("is-active");
      if (!photo) {
        card.classList.remove("is-visible");
        return;
      }
      cardImg.src = `assets/images/states/${photo.file}`;
      cardImg.alt = `Kim Chadwell of Holy Nation — ${photo.detail}`;
      cardTitle.textContent = photo.caption;
      cardDetail.textContent = photo.detail;
      positionCard(evt);
      card.classList.add("is-visible");
    };

    const hideCard = () => {
      path.classList.remove("is-active");
      card.classList.remove("is-visible");
    };

    const positionCard = (evt) => {
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
    };

    path.addEventListener("mouseenter", showCard);
    path.addEventListener("mousemove", (evt) => {
      if (photo) positionCard(evt);
    });
    path.addEventListener("mouseleave", hideCard);
    path.addEventListener("focus", (evt) => showCard(evt));
    path.addEventListener("blur", hideCard);
    path.addEventListener(
      "click",
      (evt) => {
        evt.preventDefault();
        if (card.classList.contains("is-visible")) {
          hideCard();
        } else {
          showCard(evt);
        }
      },
      { passive: false }
    );

    svg.appendChild(path);
  });
}
