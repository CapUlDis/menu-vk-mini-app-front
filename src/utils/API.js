import axios from "axios";

export default axios.create({
  baseURL: "https://menu.dev1.hsstore.ru/api/",
  responseType: "json",
  headers: { Authorization: `Bearer ${window.location.search.slice(1)}` },
});