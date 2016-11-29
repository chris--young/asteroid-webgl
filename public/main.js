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

  for (let x = 0; x < 8; x++)
    bodies.push(new Asteroid(assets.wireframes.asteroids, physics));

  console.log(bodies);

  function loop() {
    render.clear();

    /* if (player.dead)
      player.dead = false; */

    if (!player.dead)
      physics.control(player);

    for (let index = 0; index < bodies.length; index++) {
      if (bodies[index].dead)
        continue;

      for (let i = index + 1; i < bodies.length; i++) {
        const collision = Physics.collision(bodies[index], bodies[i]);

        /* if (collision) {
          console.log({ b1: bodies[index], b2: bodies[i] });
          // bodies[index].dead = true;
          // bodies[i].dead = true;
        } */
      }

      physics.update(bodies[index]);
      render.drawBody(bodies[index]);
    }

    if (!paused)
      requestAnimationFrame(loop);
  }

  loop();

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

