'use strict'

loadAssets.then(function (assets) {

  const render = new Render('#game', assets.shaders.vertex, assets.shaders.fragment);
  const physics = new Physics(render.canvas);
  const audio = new Audio();

  let paused = false;

  let player = {
    rotation: Math.PI / 2,
    model: translate(0, -0.5),
    velocity: LA.Matrix(Array)(3)(LA.IDENTITY),
    wireframe: assets.wireframes.player
  };

  let alien = {
    model: translate(0, 0.5),
    velocity: LA.Matrix(Array)(3)(LA.IDENTITY),
    wireframe: assets.wireframes.alien
  };

  let bodies = [player, alien];

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
          // paused = true;
          // bodies[index].dead = true;
          // bodies[i].dead = true;
        } */
      }

      physics.update(bodies[index]);
      render.drawBody(bodies[index]);
      render.polygon(bodies[index].wireframe.bounds, 8, bodies[index].model, [0, 1, 0, 1]);
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

  document.querySelector('#fullscreen').addEventListener('click', render.fullscreen.bind(render));

});

