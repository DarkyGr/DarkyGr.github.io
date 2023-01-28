let app = document.getElementById('typewriter');
let app2 = document.getElementById('typewriter2');
let app3 = document.getElementById('typewriter3');

let typewriter = new Typewriter(app, {
  loop: true,
  delay: 100,
});

let typewriter2 = new Typewriter(app2, {
  loop: true,
  delay: 100,
});

let typewriter3 = new Typewriter(app3, {
  loop: true,
  delay: 100,
});

typewriter
  .pauseFor(500)
  .typeString('Hi! 👋 I\'m Guillermo.')
  .pauseFor(500)
  .deleteChars(10)
  .start();

typewriter2
  .pauseFor(500)
  .typeString('Education & Experience')
  .pauseFor(2000)
  .deleteChars(10)
  .start();

typewriter3
  .pauseFor(500)
  .typeString('Social Networking Sites')
  .pauseFor(2000)
  .deleteChars(10)
  .start();