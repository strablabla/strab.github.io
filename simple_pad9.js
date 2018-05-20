
var camera, scene, renderer;
var effect, controls;
var element, container;
var bulbLight, bulbMat, floorMat, hemiLight
var dist = 500
var size_cube = 5
var size_house_piece = 50
var size_bulb = 5
var param_bulb = 0
var moving = false
var moving_side = false
var direct_side = 'right'
moving_front = false
direct_front = 'foreward'
var shoot = false
listballs = make_balls()
listtowers = make_towers()
listballs_speeds = []
ball_up = 100
ball_down = 10
for ( i=1; i < listballs.length; i++ ){
  listballs_speeds.push(Math.abs(Math.random()))
}
// list_expl = []
// list_expl_speed = []
speed_explo = 0.6
explo = false
var factgun = 2
count_attack = 0
list_attacks = []
count_bullet_attack = 0

var expl=function(obj){
    /*
    Shape for explosion
    */
    var geometry = new THREE.SphereGeometry( 2, 32, 32 );
    //var texture = new THREE.TextureLoader().load( "texture/azulejos_portugal.jpg" );
    var texture = new THREE.TextureLoader().load( "textures/hardwood2_diffuse.jpg" );
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    var balloon = new THREE.Mesh( geometry, material );
    balloon.position.set(obj.position.x, obj.position.y, obj.position.z)  // setting the position
    return balloon
}

window.onload = function(event) {

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

    function init() {    // Initialization of the scene

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
      hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1); // light for hemisphere
      scene.add( hemiLight );

      // var light = new THREE.PointLight( 0xffff00, 1000, 100 );
      // light.position.set( 100,100,100 );
      // scene.add( light );

      camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.01, 10000);
      camera.position.set(50, 50, 50);                // camera position at the beginning
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

    //   Bulb light
    bulbMat = new THREE.MeshStandardMaterial ( {
        emissive: 0xffffee,
        emissiveIntensity: 100,
        color: 0xffff00
       });

      var bulbGeometry = new THREE.SphereGeometry( 100, 32, 8 );
      bulbLight = new THREE.PointLight( 0xffee88, 100, 1, 0.1 ); // color : Integer, intensity : Float, distance : Number, decay : Float
      bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
      //bulbLight.material.color.setHex(0xffee88)
      //floorMesh.material.color.setHex(0xe6ffcc); // 0xfff2e6, 0xffff00
      bulbLight.castShadow = true;
      var posbulb = 500
      bulbLight.position.set( posbulb,posbulb,posbulb );
      scene.add( bulbLight );

      //------------------ Gun and bullet

      //------------------ Gun

      //var geom_gun = new THREE.CylinderGeometry( 1, 1, 3, 32 );
      var geom_gun = new THREE.BoxGeometry( 1, 1, 3 );
      var mat_gun = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      gun = new THREE.Mesh( geom_gun, mat_gun );
      gun.rotation.x = Math.PI/2

      scene.add( gun );

      //------------------ Bullet

      var bulletGeometry = new THREE.SphereGeometry( size_bulb/5, 16, 8 );
      bulletLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
      bulletLight.add( new THREE.Mesh( bulletGeometry, bulbMat ) );
      bulletLight.castShadow = true;
      scene.add( bulletLight );

      // -------------Sky

       var size_sphere = 1000
       make_sky(size_sphere)

      // Buildings

      // var nb_buildings = 100
      // var esp = 100
      // var dist_inter_build = 1500
      // building_with_brick(nb_buildings, esp, dist_inter_build)

      //----------------------------------

      //----- The four columns, pillars, grandes tours en porcelaine

      var column_tower_dic = {}

      var space_col = 40
      height_tow = 2
      var column_tower_base = column_torsed("texture/azulejos_portugal.jpg", 15, 0,0,0, height_tow) // door
      column_tower_base.castShadow = true;

      for (i=0;i<20; i++){
          column_tower_dic[2*i] = column_tower_base.clone()
          column_tower_dic[2*i].position.set(10 + Math.random()*10,10,80 + space_col*i)
          column_tower_dic[2*i+1] = column_tower_base.clone()
          column_tower_dic[2*i+1].position.set(100+ Math.random()*10,10,80 + space_col*i)
      }

      for (i=0; i < Object.keys(column_tower_dic).length + 1; i++){
        scene.add( column_tower_dic[i] )
      }

      //---------------------------------- The ground

      // var floorGeometry = new THREE.PlaneBufferGeometry( size_sphere*3, size_sphere*3 );
      // var floorMesh = new THREE.Mesh( floorGeometry ); // , floorMat
      // floorMesh.receiveShadow = true;
      // floorMesh.rotation.x = -Math.PI / 2.0;
      // floorMesh.material.color.setHex(0xe6ffcc); // 0xfff2e6, 0xffff00
      // scene.add( floorMesh );

      var planeGeometry = new THREE.PlaneBufferGeometry( size_sphere*3, size_sphere*3, 32, 32 );
      //var texture = new THREE.TextureLoader().load( "texture/azulejos_portugal.jpg" );
      var texture = new THREE.TextureLoader().load( "texture/mosaique_sol.jpg" )
      //var texture = new THREE.TextureLoader().load( "textures/hardwood2_diffuse.jpg" );
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.set( 40,40 );
      //texture.offset.set( 1, 1 );
      texture.needsUpdate = true;
      var material = new THREE.MeshBasicMaterial( { map: texture } );
      var plane = new THREE.Mesh( planeGeometry, material );
      plane.receiveShadow = true;
      plane.rotation.x = -Math.PI / 2.0;
      scene.add( plane );

      //Create a plane that receives shadows (but does not cast them)
      // var planeGeometry = new THREE.PlaneBufferGeometry( size_sphere*3, size_sphere*3, 32, 32 );
      // //var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
      // var plane = new THREE.Mesh( planeGeometry ); //, planeMaterial
      // plane.rotation.x = -Math.PI / 2.0;
      // plane.material.color.setHex(0xe6ffcc);
      // plane.receiveShadow = true;
      // scene.add( plane );

      //----------------------------------  Objects to shoot..

      for ( i=1; i < listballs.length + 1; i++ ){
        scene.add( listballs[i] )
      }
      for ( i=1; i < listtowers.length + 1; i++ ){
        scene.add( listtowers[i] )
      }

      //---------------------------------- Keys

      /*
      Mini manette:
      joystick
        z: down
        w: up
        a: left
        d: right
      buttons:
        j: up
        h: down
        y: left
        u: right
      */

      var forwardstep = 1                                            // speed for forward movement
      $(document).keydown(function(event){

            if (event.keyCode == "z".charCodeAt(0)-32){              // move backward
                    var direction = camera.getWorldDirection();
                    moving_front = !moving_front
                    direct_front = 'backward'
                    distance = -forwardstep;
                    direct = direction.multiplyScalar(distance)
                } // end if key code

            if (event.keyCode == "w".charCodeAt(0)-32){               // move foreward
                    var direction = camera.getWorldDirection();
                    moving_front = !moving_front
                    direct_front = 'foreward'
                    distance = forwardstep;
                    direct = direction.multiplyScalar(distance)
                } // end if key code

            if (event.keyCode == "d".charCodeAt(0)-32){               // move right
                    var direction = camera.getWorldDirection();
                    perp0 = new THREE.Vector3( -direction.z, 0, direction.x )
                    moving_side = !moving_side
                    direct_side = 'right'
                  } // end if key code

            if (event.keyCode == "a".charCodeAt(0)-32){               // move left
                    var direction = camera.getWorldDirection();
                    perp1 = new THREE.Vector3( direction.z,0 , -direction.x )
                    moving_side = !moving_side
                    direct_side = 'left'
                } // end if key code

            if (event.keyCode == "u".charCodeAt(0)-32){           // increase speed (button right)
                        if (moving_side){
                          perp0.multiplyScalar(2)
                          perp1.multiplyScalar(2)
                        }
                        if (moving_front){
                          direct.multiplyScalar(2)
                        }
                  } // end if key code
            if (event.keyCode == "y".charCodeAt(0)-32){            // decrease speed (button left)
                        if (moving_side){
                          perp0.multiplyScalar(0.5)
                          perp1.multiplyScalar(0.5)
                        }
                        if (moving_front){
                          direct.multiplyScalar(0.5)
                        }
                    } // end if key code

            if (event.keyCode == "j".charCodeAt(0)-32){             // shoot (button up)
                   direct_shoot = camera.getWorldDirection();
                   direct_shoot.multiplyScalar(10)
                   shoot = !shoot
                } // end if key code
        })

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);
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

    function render(dt) {                                    // Rendering

      if (moving_side){                                      // move on the side (right or left)
          if (direct_side == 'right'){
              camera.position.add( perp0 );
          }
          else{
             camera.position.add( perp1 );
          }
      }
      //
      if (moving_front){                                      // move backward of foreward
          if (direct_front == 'foreward'){                    // moving foreward
                  camera.position.add( direct );
              }
          else{                                               // moving backward
            camera.position.add( direct );
            }
      }

      var direction = camera.getWorldDirection();
      for ( i=1; i < listballs.length; i++ ){
              listballs[i].position.y += listballs_speeds[i];                                    // changing position vertically with speed
              if ( listballs[i].position.y > ball_up || listballs[i].position.y < ball_down){    // reached limit sup or inf
                    listballs_speeds[i] *=-1;                                                    // reversing the speed
                  }
      }
      // --------- Attacks from spheres

      if (count_attack == 100){
            numball = Math.floor(Math.random() * listballs.length) + 1;  // random number of a ball
            var newsize = 10
            //listballs[numball].scale.set(newsize, newsize, newsize)

            var att_dir = new THREE.Vector3(); // attack direction
            att_dir.subVectors( listballs[numball].position, camera.position )  // vector camera to ball
            //pos_att = listballs[numball].position.clone().add(att_dir)
            pos_att = camera.position.clone().add(att_dir.multiplyScalar(0.5))

            var geometry = new THREE.SphereGeometry( 2, 32, 32 );
            //var texture = new THREE.TextureLoader().load( "texture/azulejos_portugal.jpg" );
            var texture = new THREE.TextureLoader().load( "texture/mosaique_noire.jpg" )          // texture bullet
            //var texture = new THREE.TextureLoader().load( "textures/hardwood2_diffuse.jpg" );
            var material = new THREE.MeshBasicMaterial( { map: texture } );
            var balloon = new THREE.Mesh( geometry, material );    // bullet
            balloon.position.set(pos_att.x, pos_att.y, pos_att.z)  // setting the position
            scene.add(balloon)
            list_attacks.push([balloon, att_dir.normalize().multiplyScalar(-1)])  // bullet and direction

            count_attack = 0
      }
      else{
            count_attack += 1;
            for ( i=0; i < list_attacks.length; i++ ){
                 list_attacks[i][0].position.add(list_attacks[i][1])  // moving attack bullet
            }
      }

      if (count_bullet_attack == 300){                        // time of duration for attack bullet
              count_bullet_attack += 1;
              for ( i=0; i < list_attacks.length; i++ ){
                   scene.remove(list_attacks[i][0])           // removing attack bullet
              }
              list_attacks = []
              count_bullet_attack = 0
        }

      if (shoot){                                             // shooting case
         bulletLight.position.add(direct_shoot)               // bullet progression
         for ( i=1; i < listballs.length; i++ ){
               var point1 = bulletLight.position.clone();
               var point2 = listballs[i].position.clone();        // object to shoot
               var distance = point1.distanceTo( point2 );        // distance between bullet and objects to shoot
               if (distance < sizeball){                          // check if collision
                       // bullet touched
                       listballs[i].material.color.setHex(0x111111)   // if collision change the color
                       shoot = !shoot

                       scene.remove( listballs[i] );                  // remove the ball from the scene
                       listballs.splice(i, 1)

                       list_expl = []
                       list_expl_speed = []

                       ball = expl( listballs[i] )                     // make the ball for explosion effect..

                       for ( i=1; i < 7; i++ ){
                          var newball = ball.clone()                   // clone ball for explosion
                          list_expl.push(newball)                      // balls for explosion in a list
                          scene.add(newball)
                       }
                       explo = true              // triggering explo
                       explo_count = 0           //
              }
         }
      }
      else{
        direction.multiplyScalar(10)
        bulletLight.position.set( camera.position.x + direction.x,
                                  camera.position.y + direction.y,
                                  camera.position.z + direction.z )

        if (explo){                                          // Explosion
                explo_count += 1
                list_expl[0].position.y += speed_explo       // up
                list_expl[1].position.y += -speed_explo      // down
                list_expl[2].position.x += speed_explo       // laterally
                list_expl[3].position.x += -speed_explo      // laterally
                list_expl[4].position.z += speed_explo       // laterally
                list_expl[5].position.z += -speed_explo      // laterally
                if (explo_count == 50){
                            explo = false
                            for ( i=0; i < list_expl.length ; i++ ){
                                scene.remove( list_expl[i] );
                                }
                          explo_count = 0
                      } // end count
              }// end if explo
      } // end else

      //---------  Gun position and orientation

      gun.position.set( camera.position.x + direction.x/factgun, // factgun : correcting gun position
                        camera.position.y + direction.y/factgun,
                        camera.position.z + direction.z/factgun )
      gun.lookAt(camera.position);

      //---------

      renderer.toneMappingExposure = Math.pow( params.exposure, 5.0 ); // to allow for very bright scenes.
      // renderer.shadowMap.enabled = params.shadows;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default

      if( params.shadows !== previousShadowMap ) {
        //   material.needsUpdate = true;
          //floorMat.needsUpdate = true;
          previousShadowMap = params.shadows;
      }

      bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface
      hemiLight.intensity = hemiLuminousIrradiances[ params.hemiIrradiance ];
      effect.render(scene, camera);
    }

    function animate(t) {
        requestAnimationFrame(animate);
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

    init();
    animate();

}
