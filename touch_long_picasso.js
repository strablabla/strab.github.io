window.onload = function(event) {

    var camera, scene, renderer;
    var effect, controls;
    var element, container;
    var bulbLight, bulbMat, floorMat, hemiLight
    var dist = 500
    var size_cube = 5
    var size_bulb = 20
    var param_bulb = 0
    var moving = false
    var moving_speed = 10;
    var dir_moving = 1

    // ref for lumens: http://www.power-sure.com/lumens.htm
    var bulbLuminousPowers = {
        "110000 lm (1000W)": 110000,
        "3500 lm (300W)": 3500,
        "1700 lm (100W)": 1700,
        "800 lm (60W)": 800,
        "400 lm (40W)": 400,
        "180 lm (25W)": 180,
        "20 lm (4W)": 20,
        "Off": 0
    };

    // ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
    var hemiLuminousIrradiances = {
        "0.0001 lx (Moonless Night)": 0.0001,
        "0.002 lx (Night Airglow)": 0.002,
        "0.5 lx (Full Moon)": 0.5,
        "3.4 lx (City Twilight)": 3.4,
        "50 lx (Living Room)": 50,
        "100 lx (Very Overcast)": 100,
        "350 lx (Office Room)": 350,
        "400 lx (Sunrise/Sunset)": 400,
        "1000 lx (Overcast)": 1000,
        "18000 lx (Daylight)": 18000,
        "50000 lx (Direct Sun)": 50000
    };

    var params = {
        shadows: true,
        exposure: 0.68,
        bulbPower: Object.keys( bulbLuminousPowers )[ 0 ],
        hemiIrradiance: Object.keys( hemiLuminousIrradiances )[0]
    };

    var clock = new THREE.Clock();

    init();
    animate();

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
      scene.fog = new THREE.Fog( 0xffffff, 0, 4000 );

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
      }
      window.addEventListener('deviceorientation', setOrientationControls, true);

    //   Bulb light
    list_bulbs = []
    bulbMat = new THREE.MeshStandardMaterial ( {
        emissive: 0xffffee,
        emissiveIntensity: 10000,
        color: 0x000000
    });
    for (i=0; i<2; i++){
          var bulbGeometry = new THREE.SphereGeometry( size_bulb, 16, 8 );
          bulbLight = new THREE.PointLight( 0xffee88, 100, 2000); //, 500
          bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
          bulbLight.castShadow = true;
          bulbLight.position.set( -400, 150, 300*Math.pow(-1,i) );
          list_bulbs.push(bulbLight)
          scene.add( bulbLight );
    }

    var hc = hollow_cube_sphere(50, 'white')
    hc.position.set(0,0,0)
    scene.add(hc);
    hc.castShadow = true;
    hc.receiveShadow = false;

    size_tab = 500;
    var sep_tab = 500;
    list_tabl = ['chapeau_bleu', 'madone', 'jacqueline', 'rêve', 'beret_rouge', 'sofa', 'étude', 'dessin']
    all_tabl = []
    for (i=0; i<list_tabl.length; i++){
        all_tabl.push(tableau('paintings/Picasso/' + list_tabl[i] + '.jpg', size_tab, 500 , -600*i, 250, -Math.PI/2.0));
        scene.add(all_tabl[i])
    }

      hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6 );
      scene.add( hemiLight );

      // Floor

      floorMat = new THREE.MeshStandardMaterial ( {
          roughness: 0.8,
          color: 0xffffff,
          metalness: 0.2,
          bumpScale: 0.005
      });
      var repeaty = 100;
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load( "textures/hardwood2_diffuse.jpg", function( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          map.anisotropy = 4;
          map.repeat.set( 5,repeaty );
          floorMat.map = map;
          floorMat.needsUpdate = true;
      } );
      textureLoader.load( "textures/hardwood2_bump.jpg", function( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          map.anisotropy = 4;
          map.repeat.set( 5,repeaty  );
          floorMat.bumpMap = map;
          floorMat.needsUpdate = true;
      } );
      textureLoader.load( "textures/hardwood2_roughness.jpg", function( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          map.anisotropy = 4;
          map.repeat.set( 5,repeaty  );
          floorMat.roughnessMap = map;
          floorMat.needsUpdate = true;
      } );

      var floorGeometry = new THREE.PlaneBufferGeometry( 1000,10000 );
      var floorMesh = new THREE.Mesh( floorGeometry, floorMat );
      floorMesh.receiveShadow = true;
      floorMesh.rotation.x = -Math.PI / 2.0;
      scene.add( floorMesh );
      //object3d.receiveShadow = false;

    //   var texture = THREE.ImageUtils.loadTexture(
    //     'texture/checker.png'
    //   );
    //   texture.wrapS = THREE.RepeatWrapping;
    //   texture.wrapT = THREE.RepeatWrapping;
    //   texture.repeat = new THREE.Vector2(50, 50);
    //   texture.anisotropy = renderer.getMaxAnisotropy();
      //
    //   var material = new THREE.MeshPhongMaterial({
    //     color: 0xffffff,
    //     specular: 0xffffff,
    //     shininess: 20,
    //     shading: THREE.FlatShading,
    //     map: texture
    //   });
      //

      var ceiling = new THREE.Mesh(new THREE.PlaneBufferGeometry(300, 300), new THREE.MeshPhongMaterial({specular: '#fff',fog: false, opacity: 0.3, color: '#ff9a00',shininess: 10 }));

      ceiling.rotation.x = Math.PI/2
      ceiling.position.set(0,400,0)
      ceiling.material.color.setHex( 0xffffff );

      scene.add(ceiling);

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);

      window.addEventListener('touchstart', function() {
          moving = !moving
          if (!moving){dir_moving = -dir_moving}
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

    //   for (i in list_cubes){
    //       var cube = list_cubes[i]
    //       cube.rotation.x += 0.2* Math.random();
    //       cube.rotation.y += 0.225* Math.random();
    //       cube.rotation.z += 0.175* Math.random();
    //   }

      if (moving){
          //var direction = camera.getWorldDirection();
          //distance = moving_speed;
          //camera.position.add( direction.multiplyScalar(distance) );
          camera.position.z += dir_moving*moving_speed*2.5 ;
      }

    //   param_bulb += 0.02
    //   for (i in list_bulbs){
    //       var bulb = list_bulbs[i]
    //       bulb.castShadow = params.shadows;
    //       bulb.power = bulbLuminousPowers[ params.bulbPower ];
    //       bulb.position.y = 200 *(Math.cos( param_bulb ) * 0.75 + 0.75);
    //   }

      renderer.toneMappingExposure = Math.pow( params.exposure, 5.0 ); // to allow for very bright scenes.
      renderer.shadowMap.enabled = params.shadows;

      if( params.shadows !== previousShadowMap ) {
        //   material.needsUpdate = true;
          floorMat.needsUpdate = true;
          previousShadowMap = params.shadows;
      }

      bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface
      hemiLight.intensity = hemiLuminousIrradiances[ params.hemiIrradiance ];
      effect.render(scene, camera);
    }

    function animate(t) {
      requestAnimationFrame(animate);
    //   for (i in list_cubes){
    //       var cube = list_cubes[i]
    //       cube.rotation.x += 0.005;
    //       cube.rotation.y += 0.01;
    //   }

      update(clock.getDelta());
      render(clock.getDelta());
    }

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

}
