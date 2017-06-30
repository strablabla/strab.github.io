
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
      // simple_colored_buildings(nb_buildings, esp, dist_inter_build)


      size_hollow_cube = 200
      size_sphere_cube = 120

          var cube_geometry = new THREE.CubeGeometry( size_hollow_cube, size_hollow_cube, size_hollow_cube );
          var cube_mesh = new THREE.Mesh( cube_geometry );
          cube_mesh.position.x = -7;
          var cube_bsp = new ThreeBSP( cube_mesh );
          var sphere_geometry = new THREE.SphereGeometry( size_sphere_cube, 32, 32 );
          var sphere_mesh = new THREE.Mesh( sphere_geometry );
          sphere_mesh.position.x = -7;
          var sphere_bsp = new ThreeBSP( sphere_mesh );

          var subtract_bsp = cube_bsp.subtract( sphere_bsp );
          var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({
              shading: THREE.SmoothShading,
              //map: new THREE.TextureLoader().load('texture.png')
          }));

          result.geometry.computeVertexNormals();
          scene.add( result );


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

      //make_ground(3000)

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
    animate();

}
