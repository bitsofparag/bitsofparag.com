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

    // Add event listener to each copy code button
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

  document.addEventListener('DOMContentLoaded', () => {
    enableScrollableHeader();
  });
  window.addEventListener('load', () => {
    copyToClipboard();
  });

})();
