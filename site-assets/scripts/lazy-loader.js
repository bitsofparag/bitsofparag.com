(function() {

  function lazyLoad() {
    var lazyImages = [].slice.call(document.querySelectorAll(".lazy"));
    for (let i = 0; i < lazyImages.length; i++) {
      if (lazyImages[i].getBoundingClientRect().top <= window.innerHeight &&
        getComputedStyle(lazyImages[i]).display !== 'none') {
        let lazyImage = lazyImages[i];
        if (lazyImage.dataset.src) {
          lazyImage.src = lazyImage.dataset.src;
        }
        if (lazyImage.dataset.srcset) {
          lazyImage.srcset = lazyImage.dataset.srcset;
        }
        lazyImage.classList.remove("lazy");
        lazyImages.splice(i, 1);
        i--;
      }
    }

    if (lazyImages.length === 0) {
      document.removeEventListener('scroll', lazyLoad);
      window.removeEventListener('resize', lazyLoad);
      window.removeEventListener('orientationchange', lazyLoad);
    }
  };

  window.addEventListener('load', () => {
    if ("IntersectionObserver" in window) {
      let lazyImageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            if (lazyImage.dataset.src) {
              lazyImage.src = lazyImage.dataset.src;
            }
            if (lazyImage.dataset.srcset) {
              lazyImage.srcset = lazyImage.dataset.srcset;
            }
            lazyImage.classList.remove("lazy");
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });

      var lazyImages = [].slice.call(document.querySelectorAll(".lazy"));
      lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationchange', lazyLoad);
      // Call once at start in case some images are already in viewport
      lazyLoad();
    }
  });

})();
