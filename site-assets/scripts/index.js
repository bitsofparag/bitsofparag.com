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

  function showMessage(element, msg, isSuccessful = true) {
    if (!msg) return;
    let message = document.createElement('span');
    message.className = 'copied-message ' + (isSuccessful ? 'success-message' : 'error-message');
    message.textContent = msg;
    message.style.display = 'block';
    element.parentNode.classList.add('copied-message-container');
    element.parentNode.insertBefore(message, element);
    setTimeout(function() {
      message.classList.add('hide-message');
      setTimeout(function() {
        message.style.display = 'none';
        message.parentNode.removeChild(message);
        element.parentNode.classList.remove('copied-message-container');
      }, 500); // matches transition duration
    }, 2000); // display for 2 seconds
  }

  function copyToClipboard() {
    const codeContent = document.querySelectorAll('pre, code');

    codeContent.forEach(code => {
      code.addEventListener('click', (e) => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(e.target.textContent).then(function() {
            showMessage(e.target, 'Copied');
          }, function(err) {
            showMessage(e.target, 'Error copying', false);
            console.error('Could not copy text: ', err);
          });
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = e.target.innerText;
          document.body.appendChild(textArea);
          textArea.select();
          textArea.focus();
          try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'Copied!' : 'Error copying!';
            showMessage(e.target, msg, successful);
          } catch (err) {
            showMessage(e.target, 'Error copying!', false);
            console.error('Could not copy text: ', err);
          }
          document.body.removeChild(textArea);
        }
      });
    });
  }

  function revealEmailAddresses() {
    const emailCodes = [97, 100, 109, 105, 110, 64, 98, 105, 116, 115, 111, 102, 112, 97, 114, 97, 103, 46, 99, 111, 109];
    const email = String.fromCharCode(...emailCodes);

    document.querySelectorAll('.email-address').forEach((element) => {
      const link = document.createElement('a');
      link.href = `mailto:${email}`;
      link.textContent = email;
      element.replaceChildren(link);
    });
  }

  function getStoredTheme() {
    try {
      return window.localStorage.getItem('bitsofparag-theme');
    } catch {
      return null;
    }
  }

  function setTheme(theme, toggle) {
    const isDark = theme === 'dark';
    const root = document.documentElement;
    root.dataset.theme = isDark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
    toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    const themeColor = document.querySelector('#theme-color');
    if (themeColor) {
      themeColor.content = isDark ? 'rgb(30, 30, 30)' : '#dbd7d7';
    }
  }

  function enableThemeToggle() {
    const toggle = document.querySelector('#theme-toggle');
    if (!toggle) return;

    const initialTheme = getStoredTheme() === 'dark' ? 'dark' : 'light';
    setTheme(initialTheme, toggle);
    toggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark'
        ? 'light'
        : 'dark';
      setTheme(nextTheme, toggle);
      try {
        window.localStorage.setItem('bitsofparag-theme', nextTheme);
      } catch {
        return;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    enableScrollableHeader();
    revealEmailAddresses();
  });
  enableThemeToggle();
  window.addEventListener('load', () => {
    copyToClipboard();
  });

})();
