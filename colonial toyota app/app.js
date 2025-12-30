const scrollButtons = document.querySelectorAll("[data-scroll]");

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const tradeForm = document.getElementById("tradeForm");
const tradeResult = document.getElementById("tradeResult");

tradeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const year = Number(tradeForm.year.value || 0);
  const miles = Number(tradeForm.miles.value || 0);
  const condition = tradeForm.condition.value;
  const demand = Number(tradeForm.demand.value || 5);

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);
  const base = Math.max(2500, 24000 - age * 1200 - miles * 0.05);
  const conditionBoost =
    condition === "excellent" ? 1.12 : condition === "good" ? 1.0 : condition === "fair" ? 0.88 : 0.75;
  const demandBoost = 0.85 + demand * 0.03;

  const estimate = Math.max(1500, base * conditionBoost * demandBoost);
  const low = Math.round(estimate * 0.92);
  const high = Math.round(estimate * 1.06);

  tradeResult.querySelector("h3").textContent = `$${low.toLocaleString()} – $${high.toLocaleString()}`;
});

const financeForm = document.getElementById("financeForm");
const financeResult = document.getElementById("financeResult");

financeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const price = Number(financeForm.price.value || 0);
  const trade = Number(financeForm.trade.value || 0);
  const down = Number(financeForm.down.value || 0);
  const term = Number(financeForm.term.value || 60);
  const apr = Number(financeForm.apr.value || 0);

  const amountFinanced = Math.max(0, price - trade - down);
  const monthlyRate = apr / 100 / 12;
  const payment =
    monthlyRate === 0
      ? amountFinanced / term
      : (amountFinanced * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  const totalCost = payment * term;
  const totalInterest = Math.max(0, totalCost - amountFinanced);

  financeResult.querySelector("h3").textContent = `$${Math.round(payment).toLocaleString()} / month`;
  const breakdown = financeResult.querySelectorAll("strong");
  breakdown[0].textContent = `$${Math.round(amountFinanced).toLocaleString()}`;
  breakdown[1].textContent = `$${Math.round(totalInterest).toLocaleString()}`;
  breakdown[2].textContent = `$${Math.round(totalCost).toLocaleString()}`;
});

const serviceForm = document.getElementById("serviceForm");
const serviceResult = document.getElementById("serviceResult");

serviceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = serviceForm.name.value.trim();
  const service = serviceForm.service.options[serviceForm.service.selectedIndex].text;
  const date = serviceForm.date.value;
  const time = serviceForm.time.value;

  const displayDate = date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";
  const displayTime = time ? formatTime(time) : "";

  serviceResult.querySelector("h3").textContent = `${name || "Appointment"} — ${service}`;
  const list = serviceResult.querySelectorAll("li");
  list[0].textContent = `Advisor: Casey N. (prep for ${service.toLowerCase()})`;
  list[1].textContent = `Arrival: ${displayDate} at ${displayTime}`;
});

function formatTime(value) {
  const [hour, minute] = value.split(":");
  const hourNum = Number(hour);
  const suffix = hourNum >= 12 ? "PM" : "AM";
  const normalized = ((hourNum + 11) % 12) + 1;
  return `${normalized}:${minute} ${suffix}`;
}

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));
