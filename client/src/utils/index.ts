export const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  const popStateEvent = new PopStateEvent('popstate');
  window.dispatchEvent(popStateEvent);
};
