const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function createYouTubeEmbed(button) {
  const { youtubeId, youtubeTitle } = button.dataset;
  if (!VIDEO_ID_PATTERN.test(youtubeId)) return false;

  const iframe = button.ownerDocument.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`;
  iframe.title = youtubeTitle || 'YouTube video player';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  button.replaceWith(iframe);
  return true;
}

export function enableVideoEmbeds(root = document) {
  root.querySelectorAll('[data-youtube-id]').forEach((button) => {
    button.addEventListener('click', () => createYouTubeEmbed(button), {
      once: true,
    });
  });
}
