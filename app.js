function switchView(targetId) {
  const views = document.querySelectorAll(".view");
  const tabs = document.querySelectorAll(".nav-tab");

  views.forEach((view) => {
    view.classList.toggle("view--active", view.id === targetId);
  });

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.target === targetId);
  });

  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setupNavigation() {
  document.addEventListener("click", (event) => {
    const tab = event.target.closest(".nav-tab");
    const goto = event.target.closest("[data-goto]");

    if (tab && tab.dataset.target) {
      switchView(tab.dataset.target);
    } else if (goto && goto.dataset.goto) {
      switchView(goto.dataset.goto);
    }
  });
}

function setupInquiryForm() {
  const form = document.getElementById("inquiry-form");
  const statusEl = document.getElementById("inquiry-status");
  if (!form || !statusEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const distraction = (data.get("distraction") || "").toString().trim();

    statusEl.classList.remove("form-status--success", "form-status--error");

    if (!distraction) {
      statusEl.textContent = "Tell us at least one distraction so we can learn from it.";
      statusEl.classList.add("form-status--error");
      return;
    }

    statusEl.textContent =
      "Thank you – story captured locally. In a real release this would be sent to the TimePact team.";
    statusEl.classList.add("form-status--success");
    form.reset();
  });
}

function setupDurationSlider() {
  const input = document.getElementById("duration-input");
  const label = document.getElementById("duration-label");
  if (!input || !label) return;

  const updateLabel = () => {
    const value = Number(input.value || 0);
    label.textContent = `${value} minutes`;
  };

  input.addEventListener("input", updateLabel);
  updateLabel();
}

function setupAppChips() {
  const container = document.getElementById("app-choices");
  if (!container) return;

  container.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    const selected = Array.from(container.querySelectorAll(".chip--selected"));
    const isSelected = chip.classList.contains("chip--selected");

    if (isSelected) {
      chip.classList.remove("chip--selected");
      return;
    }

    if (selected.length >= 3) {
      const first = selected[0];
      first.classList.remove("chip--selected");
    }

    chip.classList.add("chip--selected");
  });
}

function setupScheduleForm() {
  const form = document.getElementById("schedule-form");
  const statusEl = document.getElementById("schedule-status");
  if (!form || !statusEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const sessionName = (formData.get("sessionName") || "").toString().trim();
    const duration = Number(formData.get("duration") || 0);
    const startTime = (formData.get("startTime") || "").toString();

    const selectedApps = Array.from(
      document.querySelectorAll("#app-choices .chip--selected")
    ).map((chip) => chip.dataset.app);

    statusEl.classList.remove("form-status--success", "form-status--error");

    if (!sessionName) {
      statusEl.textContent = "Name your session so future you knows what this block was for.";
      statusEl.classList.add("form-status--error");
      return;
    }

    if (selectedApps.length === 0) {
      statusEl.textContent = "Pick at least one allowed app to anchor your pact.";
      statusEl.classList.add("form-status--error");
      return;
    }

    const timing =
      startTime.trim().length === 0
        ? "starting as soon as you’re ready"
        : `starting at ${new Date(startTime).toLocaleString()}`;

    const appsText = selectedApps.join(", ");

    statusEl.textContent = `Demo pact created: “${sessionName}” · ${duration} minutes with ${appsText} ${timing}. (This is just a front‑end preview.)`;
    statusEl.classList.add("form-status--success");
  });
}

function setupMiniChart() {
  const container = document.getElementById("mini-chart-bars");
  const hoursEl = document.getElementById("stat-hours");
  const honorEl = document.getElementById("stat-honor");
  if (!container || !hoursEl || !honorEl) return;

  function randomSeries() {
    const base = 0.8 + Math.random() * 0.7;
    return Array.from({ length: 7 }, (_, i) => {
      const wave = 0.4 * Math.sin((i / 6) * Math.PI * 1.2);
      const noise = (Math.random() - 0.5) * 0.2;
      return Math.max(0.15, Math.min(1, base + wave + noise));
    });
  }

  function render() {
    const series = randomSeries();
    container.innerHTML = "";
    let totalHours = 0;

    series.forEach((value) => {
      const hoursForDay = 1 + value * 1.6;
      totalHours += hoursForDay;

      const bar = document.createElement("div");
      bar.className = "mini-chart-bar";
      bar.style.height = `${20 + value * 80}%`;
      container.appendChild(bar);
    });

    const avgHonor = 70 + Math.round(Math.random() * 20);
    hoursEl.textContent = totalHours.toFixed(1);
    honorEl.textContent = String(avgHonor);
  }

  render();

  setInterval(render, 15000);
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupInquiryForm();
  setupDurationSlider();
  setupAppChips();
  setupScheduleForm();
  setupMiniChart();
});

