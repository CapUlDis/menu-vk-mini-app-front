import axios from "axios";

export default axios.create({
<<<<<<< HEAD
  baseURL: "https://menu.dev1.hsstore.ru/api/",
=======
  baseURL: "http://menu.dev1.hsstore.ru/api/",
>>>>>>> Change API url and vk_group_id in vk-hosting-config.
  responseType: "json",
  headers: { Authorization: `Bearer ${window.location.search.slice(1)}` },
});