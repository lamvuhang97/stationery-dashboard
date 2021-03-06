export const localstorage = {
  setToken(data) {
    localStorage.setItem("access_token", data);
  },
  setName(data) {
    localStorage.setItem("username", data);
  },
  getName() {
    return localStorage.getItem("username");
  },
  setRole(data) {
    localStorage.setItem("roleId", data);
  },
  getRole() {
    return localStorage.getItem("roleId");
  },
  getAccessToken() {
    return localStorage.getItem("access_token");
  },
  clearToken() {
    localStorage.removeItem("access_token");
  },
  setFilterDefault() {
    localStorage.setItem("filter", true);
  },
  getFilterDefault() {
    return localStorage.getItem("filter");
  },
  clearFilterDefault() {
    localStorage.removeItem("filter");
  }
};
