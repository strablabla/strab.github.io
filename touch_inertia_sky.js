window.onload = function(event) {

    var camera, scene, renderer;
    var effect, controls;
    var element, container;
    var bulbLight, bulbMat, floorMat, hemiLight
    var dist = 500
    var size_cube = 5
    var size_house_piece = 50
    var size_bulb = 20
    var param_bulb = 0
    var moving = false

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
      scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

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
        emissiveIntensity: 1,
        color: 0x000000
    });
    for (i=0; i<2; i++){
          var bulbGeometry = new THREE.SphereGeometry( size_bulb, 16, 8 );
          bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
          bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
          bulbLight.castShadow = true;
          bulbLight.position.set( Math.random()*300, Math.random()*300, Math.random()*300 );
          list_bulbs.push(bulbLight)
          scene.add( bulbLight );
    }

        // LIGHTS

        hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 500, 0 );
        scene.add( hemiLight );
    //   hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6 );
    //   scene.add( hemiLight );

    // SKYDOME

    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
        topColor:    { value: new THREE.Color( 0x0077ff ) },
        bottomColor: { value: new THREE.Color( 0xffffff ) },
        offset:      { value: 33 },
        exponent:    { value: 0.6 }
    };
    uniforms.topColor.value.copy( hemiLight.color );

    scene.fog.color.copy( uniforms.bottomColor.value );

    var skyGeo = new THREE.SphereGeometry( 1200, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );

      // Floor

      floorMat = new THREE.MeshStandardMaterial ( {
          roughness: 0.8,
          color: 0xffffff,
          metalness: 0.2,
          bumpScale: 0.005
      });
      var textureLoader = new THREE.TextureLoader();
      textureLoader.load( "textures/hardwood2_diffuse.jpg", function( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          map.anisotropy = 4;
          map.repeat.set( 5,10 );
          floorMat.map = map;
          floorMat.needsUpdate = true;
      } );
      textureLoader.load( "textures/hardwood2_bump.jpg", function( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          map.anisotropy = 4;
          map.repeat.set( 5,10  );
          floorMat.bumpMap = map;
          floorMat.needsUpdate = true;
      } );
      textureLoader.load( "textures/hardwood2_roughness.jpg", function( map ) {
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          map.anisotropy = 4;
          map.repeat.set( 5,10  );
          floorMat.roughnessMap = map;
          floorMat.needsUpdate = true;
      } );
      var size_floor = 5000
      var floorGeometry = new THREE.PlaneBufferGeometry( size_floor,size_floor );
      var floorMesh = new THREE.Mesh( floorGeometry, floorMat );
      floorMesh.receiveShadow = true;
      floorMesh.rotation.x = -Math.PI / 2.0;
      scene.add( floorMesh );

      list_cubes = []

      for (i=0; i<100; i++){

          cube = new THREE.Mesh( new THREE.CubeGeometry( size_cube, size_cube, size_cube ), new THREE.MeshNormalMaterial() );
          //alert(Math.random())
          cube.position.y = Math.random()*dist; //*Math.power(-1,i);
          cube.position.z = Math.random()*dist;
          cube.position.x = Math.random()*dist;

          list_cubes.push(cube)
          scene.add(cube);
      }

      list_house_pieces = []

      for (i=0; i<50; i++){
          var geom_house_piece = new THREE.CubeGeometry( size_house_piece, size_house_piece, size_house_piece )
          var material_house_piece = new THREE.MeshBasicMaterial({ color: 0xffffff })
          house_piece = new THREE.Mesh( geom_house_piece, material_house_piece );
        //   house_piece.setColor( 0xffffff );
          //alert(Math.random())
          house_piece.position.y = 0; //*Math.power(-1,i);
          house_piece.position.z = Math.random()*dist;
          house_piece.position.x = Math.random()*dist;

          list_house_pieces.push(house_piece)
          scene.add(house_piece);
      }

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
      for (i in list_cubes){
          var cube = list_cubes[i]
          cube.rotation.x += 0.2* Math.random();
          cube.rotation.y += 0.225* Math.random();
          cube.rotation.z += 0.175* Math.random();
      }

      if (moving){
          var direction = camera.getWorldDirection();
          distance = 2;
          camera.position.add( direction.multiplyScalar(distance) );
      }

      param_bulb += 0.02
      for (i in list_bulbs){
          var bulb = list_bulbs[i]
          bulb.castShadow = params.shadows;
          bulb.power = bulbLuminousPowers[ params.bulbPower ];
          bulb.position.y = 200 *(Math.cos( param_bulb ) * 0.75 + 0.75);
      }

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
      for (i in list_cubes){
          var cube = list_cubes[i]
          cube.rotation.x += 0.005;
          cube.rotation.y += 0.01;
      }

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
