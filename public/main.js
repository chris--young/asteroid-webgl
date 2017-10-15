'use strict'

loadAssets.then(function (assets) {

  const render = new Render(assets.shaders);
  const physics = new Physics(render.canvas.game);
  const audio = new Audio();

  let player = new Player(assets.wireframes.player);
  let alien = new Alien(assets.wireframes.alien);

  let bodies = [];
  let paused = false;
  let muted = false;
  let pitch = 0;

  bodies.push(player);

  setInterval(() => {
    if (paused)
      return;

    alien.dead ? alien.dead = false : bodies.push(alien);
  }, 10000)

  setInterval(() => muted || audio.beep(++pitch % 2 ? 440 : 220, 250), 2000);

  for (let x = 0; x < 8; x++)
    bodies.push(new Asteroid(assets.wireframes.asteroids, physics));

  function loop() {
    render.clear();

    if (!player.dead)
      physics.control(player);

    for (let index = 0; index < bodies.length; index++) {
      if (bodies[index] instanceof Bullet && Date.now() - bodies[index].epoch > BULLET_AGE)
        bodies[index].dead = true;

      for (let i = index + 1; i < bodies.length; i++) {
        if (!(bodies[index] instanceof Asteroid && bodies[i] instanceof Asteroid) && 
              Physics.collision(bodies[index], bodies[i])) {
          bodies[index].dead = true;
          bodies[i].dead = true;
        }
      }

      physics.update(bodies[index]);
      render.drawBody(bodies[index]);
    }

    if (!paused)
      requestAnimationFrame(loop);

    bodies.forEach((body, index) => body.dead && bodies.splice(index, 1));
  }

  loop();

  document.addEventListener('keydown', function (event) {
    if (event.which !== 32)
      return;

    event.preventDefault();

    if (!player.dead)
      bodies.push(player.shoot(assets.wireframes.bullet));
  });

  document.querySelector('#pause').addEventListener('click', function (event) {
    if (!paused) {
      paused = true;
      event.target.innerText = 'Resume';
    } else {
      paused = false;
      event.target.innerText = 'Pause';
      loop();
    }
  });

  document.querySelector('#mute').addEventListener('click', function (event) {
    if (!muted) {
      muted = true;
      event.target.innerText = 'Unmute';
    } else {
      muted = false;
      event.target.innerText = 'Mute';
    }
  });

});
