'use strict'

let start_blink = null;

loadAssets.then(function (assets) {

  const render = new Render(assets.shaders);
  const physics = new Physics(render.canvas.game);
  const audio = new Audio();

  let player = new Player(assets.wireframes.player);
  // let alien = new Alien(assets.wireframes.alien);

  let bodies = [];
  let paused = false;
  let muted = false;
  let pitch = 0;
  let blink = 0;

  bodies.push(player);

  // get rid of all these intervals
  /* setInterval(() => {
    if (paused || !player.started || player.dead)
      return;

    alien.dead ? alien.dead = false : bodies.push(alien);
  }, 10000); */

  setInterval(() => muted || paused || audio.beep(++pitch % 2 ? 440 : 220, 250), 2000);

  start_blink = setInterval(() => blink = !blink, 1000);

  for (let x = 0; x < 8; x++)
    bodies.push(new Asteroid(assets.wireframes.asteroids, physics));

  function loop() {
    render.clear();

    if (!player.started) {
      render._text(-0.4, 0, 'ASTEROIDS', '#eee', 'bold 80px Hyperspace');

      if (blink)
        render._text(-0.34, -0.1, 'press space to start', '#eee', 'bold 30px Hyperspace');
    }

    if (!player.dead)
      physics.control(player);

    for (let index = 0; index < bodies.length; index++) {
      if (bodies[index].dead)
        continue;

      if (bodies[index] instanceof Bullet && Date.now() - bodies[index].epoch > BULLET_AGE)
        bodies[index].dead = true;

      for (let i = index + 1; i < bodies.length; i++) {
        if (bodies[i].dead)
          continue;

        // gross
        if (((bodies[index] instanceof Asteroid && bodies[i] instanceof Player) ||
            (bodies[index] instanceof Player && bodies[i] instanceof Asteroid) ||
            (bodies[index] instanceof Asteroid && bodies[i] instanceof Bullet) ||
            (bodies[index] instanceof Bullet && bodies[i] instanceof Asteroid) ||
            (bodies[index] instanceof Alien && bodies[i] instanceof Bullet) ||
            (bodies[index] instanceof Bullet && bodies[i] instanceof Alien)) &&
            Physics.collision(bodies[index], bodies[i])) {

            if (render.debug && (bodies[index] instanceof Player || bodies[i] instanceof Player))
              continue;

            bodies[index].dead = true;
            bodies[i].dead = true;
        }
      }

      if (!bodies[index].dead) {
        physics.update(bodies[index]);
        render.drawBody(bodies[index]);
      } else if (bodies[index] instanceof Asteroid) {
        // explode
        bodies.splice(index, 1);
      } else if (bodies[index] instanceof Bullet) {
        bodies.splice(index, 1);
      }
    }

    if (!paused)
      requestAnimationFrame(loop);
  }

  loop();

  document.addEventListener('keydown', function (event) {
    if (event.which === 192)
      return render.debug = !render.debug;
    else if (event.which !== 32)
      return;

    event.preventDefault();

    const bullet = player.shoot(assets.wireframes.bullet);

    if (bullet)
      bodies.push(bullet);
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
