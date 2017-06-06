
var camera, scene, renderer;
var effect, controls;
var element, container;
var floorMat, hemiLight
var dist = 500
var size_cube = 5
var size_house_piece = 50
var moving = false
var list_col = [0xff0040, 0x0040ff, 0x80ff80, 0xffaa00, 0x00ffaa, 0xff1100]
var list_lights = []
var list_lights_initpos = []
var list_lights_speeds = []

window.onload = function(event) {

    var clock = new THREE.Clock();

    function init() {

      renderer = new THREE.WebGLRenderer();
      //----------------
      renderer.physicallyCorrectLights = true;
      renderer.gammaInput = true;
      renderer.gammaOutput = true;
      renderer.shadowMap.enabled = true;
      //-------------
      element = renderer.domElement;
      container = document.getElementById('container');
      container.appendChild(element);

      effect = new THREE.StereoEffect(renderer);

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
      hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
      scene.add( hemiLight );

      camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.01, 10000);
      //camera.position.set(-500, 400, -200);
      camera.position.set(dist/2, dist/2, dist/2);
      scene.add(camera);

      controls = new THREE.OrbitControls(camera, element);
      // controls.rotateUp(Math.PI / 4);
      controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
      );
      controls.noZoom = true;
      controls.noPan = true;

      function setOrientationControls(e) {
        if (!e.alpha) {
          return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
        element.addEventListener('click', fullscreen, false);
        window.removeEventListener('deviceorientation', setOrientationControls, true);

    } // end init


   window.addEventListener('deviceorientation', setOrientationControls, true);

    // Sky

     var size_sphere = 1000
     make_sky(size_sphere)

      // Buildings

      var nb_buildings = 100
      var esp = 100
      var dist_inter_build = 1500
      simple_colored_buildings(nb_buildings, esp, dist_inter_build)

      // plants

      list_tree = []
      var tree = make_simple_tree()
      tree.scale.set(0.1,0.1,0.1)

      for (i=0; i<100; i++){
          list_tree.push(tree.clone())
          list_tree[i].position.set(Math.random()*2000, 0, Math.random()*2000)
          //list_tree[i].green_bowl.material.color.setHex(0x660033)
          scene.add(list_tree[i])
      }

      // LIGHTS

      var intensity = 1000; //2.5;
      var distance = 100;
      var decay = 2.0;

      var sphere = new THREE.SphereGeometry( 30, 16, 8 );

      for (i=0; i < list_col.length; i++){
          var light = new THREE.PointLight( list_col[i], intensity, distance, decay );
          light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: list_col[i] } ) ) );
          scene.add( light );
          posx = Math.random()*1000;
          posy = 200-Math.random()*50;
          posz =  Math.random()*1000;
          light.position.set(posx, posy, posz)
          list_lights.push(light)
          list_lights_initpos.push([posx, posy, posz])
          list_lights_speeds.push(Math.random())
      }

      make_ground(3000)

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);

      window.addEventListener('touchstart', function() {
          moving = !moving
         }); // end touchstart
    }

    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      //renderer.setSize(width, height);
      effect.setSize(width, height);
    }

    function update(dt) {
      resize();
      camera.updateProjectionMatrix();
      controls.update(dt);
    }

    var previousShadowMap = false;

    function render(dt) {

      if (moving){
          var direction = camera.getWorldDirection();
          distance = 2;
          camera.position.add( direction.multiplyScalar(distance) );
      }


      effect.render(scene, camera);
    }

    pos_sphere = 0
    function animate(t) {
      requestAnimationFrame(animate);
      update(clock.getDelta());
      render(clock.getDelta());
      pos_sphere += clock.getDelta()
      for (i=0; i<list_lights.length; i++){
          pos_sphere_i = list_lights_speeds[i]*pos_sphere
          list_lights[i].position.x = list_lights_initpos[i][0] + 50*Math.cos(pos_sphere_i)
          list_lights[i].position.z = list_lights_initpos[i][2] + 50*Math.sin(pos_sphere_i)
          list_lights[i].position.y = list_lights_initpos[i][1] + 20*Math.sin(0.2*pos_sphere_i)
      }
  } // end animate

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }

    init();
    //animate_town_light();
    animate();

}
