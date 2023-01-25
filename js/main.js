let app = document.getElementById('typewriter');
 
let typewriter = new Typewriter(app, {
  loop: true,
  delay: 100,
});
 
typewriter
  .pauseFor(500)
  .typeString('Hi! 👋 I\'m Guillermo.')  
  .pauseFor(200)
  .deleteChars(10)
  .start();
