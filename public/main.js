'use strict'

loadAssets.then(function (assets) {

  const render = new Render(assets.shaders);
  const physics = new Physics(render.canvas.game);

  let player = new Player(assets.wireframes.player);
  let alien = new Alien(assets.wireframes.alien);

  let bodies = [];
  let paused = false;

  bodies.push(player);
  bodies.push(alien);

  // for (let x = 0; x < 8; x++)
    // bodies.push(new Asteroid(assets.wireframes.asteroids, physics));

  function loop() {
    render.clear();

    if (!player.dead)
      physics.control(player);

    for (let index = 0; index < bodies.length; index++) {
      if (bodies[index] instanceof Bullet && Date.now() - bodies[index].epoch > BULLET_AGE)
        bodies[index].dead = true;

      for (let i = index + 1; i < bodies.length; i++) {
        if (Physics.collision(bodies[index], bodies[i])) {
          bodies[index].dead = false; // true;
          bodies[i].dead = false; // true;
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

});
