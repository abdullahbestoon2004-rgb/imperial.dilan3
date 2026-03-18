export const CONTACT_SECTION_ID = 'contact';

export function scrollToContact() {
  const performScroll = () => {
    const scrollRoot = document.scrollingElement ?? document.documentElement;
    const maxScrollTop = Math.max(0, scrollRoot.scrollHeight - window.innerHeight);

    window.scrollTo({
      top: maxScrollTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  // Wait for mobile overlays to close before starting the smooth scroll.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(performScroll);
  });
}
