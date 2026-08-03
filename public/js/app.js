class CampusRideApp {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async request(url, options = {}) { const response = await fetch(url, options); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Request failed"); return data; }
  rideCard(ride) { return `<article class="card"><h3>${ride.origin} to ${ride.destination}</h3><p><strong>Driver:</strong> ${ride.driverName}</p><p>${new Date(ride.departureTime).toLocaleString()}</p><p>${ride.availableSeats} seats - AED ${ride.price}</p><button data-ride-id="${ride._id}" data-seats="${ride.availableSeats}">Reserve seat</button></article>`; }

  async checkServer() {
    const response = await fetch(`${this.apiUrl}/health`);
    return response.json();
  }
}

const campusRideApp = new CampusRideApp("/api");
window.campusRideApp = campusRideApp;

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
      link.classList.add("is-current");
      link.removeAttribute("href");
    }
  });
  const offerForm = document.querySelector("#offer-form");
  const message = document.querySelector("#message");
  const showMessage = (text, error = false) => { if (message) { message.textContent = text; message.className = error ? "error" : "success"; } };
  document.querySelector("#driverEmail")?.addEventListener("blur", (event) => { const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value); showMessage(valid ? "Email looks valid." : "Enter a valid email address.", !valid); });
  offerForm?.addEventListener("submit", async (event) => { event.preventDefault(); try { const body = Object.fromEntries(new FormData(offerForm)); body.availableSeats = Number(body.availableSeats); body.price = Number(body.price); await campusRideApp.request("/api/rides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); offerForm.reset(); showMessage("Ride posted successfully."); } catch (error) { showMessage(error.message, true); } });
  const searchForm = document.querySelector("#search-form"); const results = document.querySelector("#results");
  async function loadRides() { if (!results) return; const query = new URLSearchParams(new FormData(searchForm || new FormData())); const rides = await campusRideApp.request(`/api/rides?${query}`); results.innerHTML = rides.length ? rides.map(campusRideApp.rideCard).join("") : "<p>No rides found.</p>"; }
  searchForm?.addEventListener("submit", (event) => { event.preventDefault(); loadRides(); }); if (results) loadRides();
  results?.addEventListener("click", async (event) => { if (!event.target.dataset.rideId) return; const riderName = prompt("Your name:"); const riderEmail = prompt("Your university email:"); if (!riderName || !riderEmail) return; try { await campusRideApp.request(`/api/rides/${event.target.dataset.rideId}/reservations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ riderName, riderEmail, seats: 1 }) }); alert("Seat reserved successfully."); loadRides(); } catch (error) { alert(error.message); } });
  document.querySelector("#history-form")?.addEventListener("submit", async (event) => { event.preventDefault(); const email = new FormData(event.target).get("email"); const history = await campusRideApp.request(`/api/rides/history/${encodeURIComponent(email)}`); document.querySelector("#history-results").innerHTML = `<h3>Rides offered</h3>${history.rides.map(campusRideApp.rideCard).join("") || "<p>None</p>"}<h3>Seats reserved</h3>${history.reservations.map(x => `<p>${x.ride?.origin || "Deleted ride"} to ${x.ride?.destination || ""} (${x.seats} seat)</p>`).join("") || "<p>None</p>"}`; });
});
