class CampusRideApp {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async checkServer() {
    const response = await fetch(`${this.apiUrl}/health`);
    return response.json();
  }
}

const campusRideApp = new CampusRideApp("/api");
window.campusRideApp = campusRideApp;

