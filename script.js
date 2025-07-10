// ========== THEME TOGGLE ==========
function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });

  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
  }
}

// ========== EVENT DATA ==========
let savedEvents = JSON.parse(localStorage.getItem("events")) || [];

// ========== CREATE EVENT ==========
function handleCreateForm() {
  const form = document.getElementById("create-event-form");
  const successMsg = document.getElementById("success-msg");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const newEvent = {
      id: Date.now(),
      title: formData.get("title"),
      date: formData.get("date"),
      location: formData.get("location"),
      description: formData.get("description"),
    };

    savedEvents.push(newEvent);
    localStorage.setItem("events", JSON.stringify(savedEvents));
    successMsg.textContent = "🎉 Event created successfully!";
    form.reset();
  });
}

// ========== SHOW UPCOMING EVENTS ON HOMEPAGE ==========
function showUpcomingEvents() {
  const container = document.querySelector(".events-container");
  if (!container) return;

  const allEvents = JSON.parse(localStorage.getItem("events")) || [];

  if (allEvents.length === 0) {
    container.innerHTML = "<p>📭 No upcoming events yet.</p>";
    return;
  }

  container.innerHTML = "";
  allEvents
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((event) => {
      const div = document.createElement("div");
      div.className = "event-card";
      div.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
        <a href="event.html?id=${event.id}">View Details</a>
      `;
      container.appendChild(div);
    });
}

// ========== SHOW ALL EVENTS ON events.html ==========
function showAllEvents() {
  const container = document.getElementById("all-events");
  if (!container) return;

  const allEvents = JSON.parse(localStorage.getItem("events")) || [];

  if (allEvents.length === 0) {
    container.innerHTML = "<p>📭 No events found.</p>";
    return;
  }

  container.innerHTML = "";
  allEvents
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((event) => {
      const div = document.createElement("div");
      div.className = "event-card";
      div.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
        <a href="event.html?id=${event.id}">View Details</a>
      `;
      container.appendChild(div);
    });
}

// ========== SHOW EVENT DETAILS ==========
function showEventDetails() {
  const params = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id"));
  if (!eventId) return;

  const allEvents = JSON.parse(localStorage.getItem("events")) || [];
  const event = allEvents.find((ev) => ev.id === eventId);

  const titleEl = document.getElementById("event-title");
  const dateEl = document.getElementById("event-date");
  const locationEl = document.getElementById("event-location");
  const descriptionEl = document.getElementById("event-description");

  if (!event || !titleEl || !dateEl || !locationEl || !descriptionEl) {
    const detailsSection = document.querySelector(".event-details");
    if (detailsSection) detailsSection.innerHTML = "<p>⚠️ Event not found!</p>";
    return;
  }

  titleEl.textContent = event.title;
  dateEl.textContent = event.date;
  locationEl.textContent = event.location;
  descriptionEl.textContent = event.description;
}

// ========== HANDLE REGISTRATION ==========
function handleEventRegistration(eventId) {
  const form = document.getElementById("register-form");
  const successMsg = document.getElementById("register-success");

  if (!form || !eventId) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    if (!name || !email) return;

    const regKey = `registrations-${eventId}`;
    const existingRegs = JSON.parse(localStorage.getItem(regKey)) || [];

    existingRegs.push({ name, email, timestamp: Date.now() });
    localStorage.setItem(regKey, JSON.stringify(existingRegs));

    successMsg.textContent = "✅ Registered successfully!";
    form.reset();
  });
}

// ========== ADMIN PANEL VIEW ==========
function showAdminPanel() {
  const container = document.getElementById("admin-events");
  if (!container) return;

  const allEvents = JSON.parse(localStorage.getItem("events")) || [];

  if (allEvents.length === 0) {
    container.innerHTML = "<p>⚠️ No events found.</p>";
    return;
  }

  container.innerHTML = "";
  allEvents.forEach(event => {
    const regKey = `registrations-${event.id}`;
    const registrations = JSON.parse(localStorage.getItem(regKey)) || [];

    const div = document.createElement("div");
    div.className = "admin-event";
    div.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Registrations:</strong> ${registrations.length}</p>
      <ul>
        ${registrations.map(r => `<li>${r.name} (${r.email})</li>`).join("")}
      </ul>
    `;
    container.appendChild(div);
  });
}

// ========== EXPORT CSV ==========
function exportRegistrationsCSV() {
  const allEvents = JSON.parse(localStorage.getItem("events")) || [];
  let csv = "Event,Name,Email,Timestamp\n";

  allEvents.forEach(event => {
    const registrations = JSON.parse(localStorage.getItem(`registrations-${event.id}`)) || [];
    registrations.forEach(r => {
      csv += `"${event.title}","${r.name}","${r.email}","${new Date(r.timestamp).toLocaleString()}"\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "eventify-registrations.csv";
  a.click();
}

// ========== PAGE INITIALIZER ==========
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id"));

  setupThemeToggle();
  handleCreateForm();
  showUpcomingEvents();
  showAllEvents();
  showEventDetails();

  if (eventId) {
    handleEventRegistration(eventId);
  }

  if (window.location.pathname.includes("admin.html")) {
    showAdminPanel();
    const exportBtn = document.getElementById("export-csv");
    if (exportBtn) {
      exportBtn.addEventListener("click", exportRegistrationsCSV);
    }
  }
});
