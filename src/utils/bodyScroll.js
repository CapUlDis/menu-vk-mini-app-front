import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';


export const disableScroll = (id) => {
  const panel = document.getElementById(id);
  disableBodyScroll(panel);
};

export const enableScroll = (id) => {
  const panel = document.getElementById(id);
  enableBodyScroll(panel);
};

