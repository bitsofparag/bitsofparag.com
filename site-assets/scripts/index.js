(function() {
  const body = document.body;

  function enableScrollableHeader() {
    const scrollUp = 'scroll-up';
    const scrollDown = 'scroll-down';
    let lastScroll = 0;

    window.onscroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll <= 0) {
        body.classList.remove(scrollUp);
        return;
      }

      if (
        // going down (or scrolling up on Mac)
        currentScroll > lastScroll &&
        !body.classList.contains(scrollDown) &&
        currentScroll > 50
      ) {
        body.classList.remove(scrollUp);
        body.classList.add(scrollDown);
      } else if (
        // going up (or scrolling down on Mac)
        currentScroll < lastScroll &&
        body.classList.contains(scrollDown)
      ) {
        body.classList.remove(scrollDown);
        body.classList.add(scrollUp);
      }
      lastScroll = currentScroll;
    };
  } /* enableScrollableHeader */

  function init() {
    enableScrollableHeader();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
