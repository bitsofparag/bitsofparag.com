"use strict";

function enableMobileMenu() {}

function prepareDOM() {
  document.querySelectorAll('.gallery-item:nth-child(1)').forEach(function (item) {
    return item.closest('p').classList.add('gallery');
  });
}

function animateLogo() {
  anime.timeline({
    loop: false
  }).add({
    targets: '.logo .circle-dark',
    scale: [0, 1],
    duration: 1100,
    easing: "easeOutExpo",
    offset: '-=600'
  }).add({
    targets: '.logo .letters-left',
    scale: [0, 1],
    duration: 450,
    offset: '+=550'
  }).add({
    targets: '.logo .letters-right',
    scale: [0, 1],
    duration: 500,
    offset: '-=10'
  }).add({
    targets: '.logo',
    opacity: 1,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1400
  });
  anime({
    targets: '.logo .circle-dark-dashed',
    rotateZ: 360,
    duration: 8000,
    easing: "linear",
    loop: true
  });
}

function init() {
  prepareDOM();
  animateLogo();
  enableMobileMenu();
}

document.addEventListener('DOMContentLoaded', init);

//# sourceMappingURL=index.js.map