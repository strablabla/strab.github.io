
function import_collada(addr, scale, position, rotation){ // import collada files
    loader = new THREE.ColladaLoader();
    loader.load(addr, function(collada) {
      collada.scene.scale.set(scale[0],scale[1],scale[2]);
      collada.scene.position.x = position[0];
      collada.scene.position.y = position[1];
      collada.scene.position.z = position[2];
      collada.scene.rotation.x = rotation[0];
      scene.add(collada.scene)
    })
}// end import_collada

function ceiling_white(sizex, sizey, posx, posy, posz){
  /*
  ceiling
  */

  var geom_ceiling = new THREE.CubeGeometry( sizex, 1, sizey )
  var mat_ceiling = new THREE.MeshBasicMaterial({ color: 0xffffff }) // "texture/latte0.jpg"
  var ceiling = new THREE.Mesh( geom_ceiling, mat_ceiling );
  ceiling.position.set(posx, posy, posz)
  return ceiling

}

function ball(txt, size, posx, posy, posz){
      /*
      ball
      */
      var geometry = new THREE.SphereGeometry( size, 32, 32 );
      var material = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture(txt)} );
      var ball = new THREE.Mesh( geometry, material );
      ball.position.set(posx, posy, posz)
      return ball
}

function do_floor(txt, size_pav, level_pav, scale_pav, sizez, sizex, posx, posz){
          pav_elem = pavage(txt, size_pav,  0,0,0, 0)
          dict_pav = {}
          for (i=0; i<sizex; i++){
              for (j=0; j<sizez; j++){
                dict_pav[j + sizez*i] = pav_elem.clone()
                dict_pav[j + sizez*i].scale.set(scale_pav, scale_pav, scale_pav)
                dict_pav[j + sizez*i].position.set(posx+size_pav*i*scale_pav, level_pav, posz-size_pav*j*scale_pav)
              }
          }
          for (i=0; i<Object.keys(dict_pav).length+1; i++){
                 group.add( dict_pav[i] )
          }
    }


var make_bulb = function(posx, posy, posz){
    /*
    Lamps
    */
    var group_bulb = new THREE.Group();
    var geom_ring = new THREE.TorusGeometry( 10, 3, 16, 100 );
    var mat_ring = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var mesh_ring = new THREE.Mesh( geom_ring, mat_ring );
    mesh_ring.position.set(  posx, posy, posz  );
    mesh_ring.rotation.set(  Math.PI/2,0, 0  );
    var scale_ring = 0.1
    for (i=0;i<5;i++){
      ring_bulb = mesh_ring.clone()
      ring_bulb.scale.set(scale_ring, scale_ring, scale_ring)
      ring_bulb.position.y = 5+posz+1.5*i;
      group_bulb.add(ring_bulb)
    }

    var bulbGeometry = new THREE.SphereGeometry( size_bulb, 16, 8 );
    bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
    bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
    bulbLight.castShadow = true;
    bulbLight.position.set(  posx, posy, posz  ); // 60, 50, -60
    group_bulb.add(bulbLight)

    return group_bulb
}

localPlane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 200 );
// var globalPlane = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 1 );
// renderer.clippingPlanes = [ globalPlane ];
// renderer.localClippingEnabled = true;
// var material = new THREE.MeshPhongMaterial( {
//     clippingPlanes: [ localPlane ],
//     clipShadows: true
// } );

function treillis(txt, size,  x, y, z, angle){
    /*
    Treillis
    */
    var group_treillis = new THREE.Group();
    var geom_treillis = new THREE.CubeGeometry( 50, 7, 3 )
    var material_treillis = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(txt),
                        clippingPlanes: [ localPlane ]
                       }) // "texture/latte0.jpg"
    simple_board0 = new THREE.Mesh( geom_treillis, material_treillis )
    dic_treillis = {}
    scale_treillis = size
    dic_treillis[0] = simple_board0.clone()
    dic_treillis[1] = simple_board0.clone()
    //dic_treillis[0].rotation.set(Math.PI/2,angle,Math.PI/3)
    dic_treillis[0].rotation.set(0,0,Math.PI/3)
    dic_treillis[0].position.set(x, y, z)  // 180,180,-10
    dic_treillis[0].scale.set(scale_treillis,scale_treillis*0.1,scale_treillis*0.1)
    dic_treillis[1].rotation.set(0,0,-Math.PI/3)
    dic_treillis[1].position.set(x, y, z)  // 180,180,-10
    dic_treillis[1].scale.set(scale_treillis,scale_treillis*0.1,scale_treillis*0.1)
    fact_treill = 30
    for (i=1; i<20; i++){
          dic_treillis[2*i] = dic_treillis[0].clone()
          dic_treillis[2*i].position.y = dic_treillis[0].position.y-2*i
          dic_treillis[2*i+1] = dic_treillis[1].clone()
          dic_treillis[2*i+1].position.y = dic_treillis[1].position.y-2*i
          if (i<10){
                dim0 = scale_treillis+(i-10)/fact_treill
                dic_treillis[2*i+1].scale.set(dim0,dim0*0.1,scale_treillis*0.1)
                dic_treillis[2*i].scale.set(dim0,dim0*0.1,scale_treillis*0.1)
          }
          group_treillis.add( dic_treillis[2*i] )
          group_treillis.add( dic_treillis[2*i+1] )
    }
    return group_treillis
}

function persians(txt, size,  x, y, z, angle){
    /*
    Persians
    */
    var group_persian = new THREE.Group();
    var geom_board = new THREE.CubeGeometry( 50, 7, 3 )
    var material_board = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(txt) }) // "texture/latte0.jpg"
    simple_board0 = new THREE.Mesh( geom_board, material_board )
    dic_board = {}
    scale_board = size
    dic_board[0] = simple_board0.clone()
    dic_board[0].rotation.set(-Math.PI/3,angle,0)
    dic_board[0].position.set(x, y, z)  // 180,180,-10
    dic_board[0].scale.set(scale_board,scale_board*0.1,scale_board)
    for (i=1; i<20; i++){
      dic_board[i] = dic_board[0].clone()
      dic_board[i].position.y = dic_board[0].position.y-2*i
      group_persian.add( dic_board[i] )
    }
    return group_persian
}

function tapestry(txt, size,  x, y, z, angle){
      /*
      Tapestry
      */
      var geom_cube = new THREE.CubeGeometry( 2*size, 0.3, size )
      var material_cube = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(txt) })
      var cube = new THREE.Mesh( geom_cube, material_cube )
      cube.position.set(x, y, z)
      cube.rotation.set(0, Math.PI/180*angle, 0)
      return cube
}

function column_torsed(txt, size,  x, y, z, nbcubes){
      /*
      Torsed column
      */
      var group_column = new THREE.Group();
      //scene.add( group_column );
      var geom_cube = new THREE.CubeGeometry( size, size, size )
      var material_cube = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(txt) })
      cube = new THREE.Mesh( geom_cube, material_cube )
      cube.position.set(x, y, z)

      for (i=0;i<nbcubes;i++){
        newcube = cube.clone()
        newcube.rotation.set(0, Math.PI/10*i, 0)
        newcube.position.y = y+i*size
        group_column.add(newcube)
      }
      return group_column
}

function tableau(txt, size,  x, z, y, roty){
      /*
      Tableau
      */
      var geom = new THREE.PlaneGeometry( size, size, 5);
      var texture = new THREE.TextureLoader().load( txt );
      var mat= new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );
      var tabl = new THREE.Mesh( geom, mat); // , new THREE.SphericalReflectionMapping()

      tabl.position.x = +x;
      tabl.position.z = +z;
      tabl.rotation.y += roty;
      tabl.position.y = y; //hauteur
      return tabl
}

function pavage(txt, size,  x, z, y, roty){
      /*
      Pavage
      */
      // var geom = new THREE.PlaneGeometry( size, size, size);
      // var texture = new THREE.TextureLoader().load( txt );
      // var mat= new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );
      // var pav = new THREE.Mesh( geom, mat); // , new THREE.SphericalReflectionMapping()

      var texture = new THREE.TextureLoader().load( txt );
      var geom_pav = new THREE.CubeGeometry( size, size, 3 )
      var material_pav = new THREE.MeshBasicMaterial({ map: texture, overdraw: true })
      pav = new THREE.Mesh( geom_pav, material_pav )

      pav.rotation.x += Math.PI/2;
      pav.position.x = x;
      pav.position.z = z;
      pav.rotation.y += roty;
      pav.position.y = y; //hauteur
      return pav
}

var bulblight = function(x,y,z){
	//   Bulb light
	bulbMat = new THREE.MeshStandardMaterial ( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	   });

	  var bulbGeometry = new THREE.SphereGeometry( size_bulb, 16, 8 );
	  bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
	  bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
	  bulbLight.castShadow = true;
	  bulbLight.position.set( x,y,z  ); // 60, 50, -60

	  return bulbLight
}

function scale(txt, rot, posx, posy, posz, heighty, nbscales){
    	/*
      Scale
    	*/
    	hstep = 5
    	lstep = 10
    	wstep = 40
    	sx = 0
    	sz = 0
    	sy = heighty + hstep
    	group_scale = new THREE.Group();
    	scene.add( group_scale );
    	var geom_step = new THREE.CubeGeometry( wstep, hstep, lstep )
    	var material_step = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(txt) })
    	step0 = new THREE.Mesh( geom_step, material_step )
    	step0.position.set(sx,sy,sz);
    	for ( i=0; i<nbscales; i++){
      		step = step0.clone()
      		step.position.set(sx, sy+hstep*i, sz+lstep*i);
      		group_scale.add( step );
    	}
    	group_scale.rotation.y = rot; // 3*Math.PI / 2;
    	group_scale.position.set(posx, posy, posz); //420,0,0
}

var building3 = function(){

  	/*
    Building
  	*/

		group = new THREE.Group();
		scene.add( group );

		//------- Scale

    var text_scale = "textures/brick_diffuse.jpg"
		scale(text_scale, 3*Math.PI / 2, 420,0,0, 0, 15)
		scale(text_scale, 3*Math.PI / 2, 420,0,-120, 0, 15)
    scale(text_scale, Math.PI / 2, -150,0,0, 0, 15)
    scale(text_scale, Math.PI / 2, -150,0,-120, 0, 15)

		//------- Building

		sx = 10;
		sy = 50;
		sz = 50;
		cy = 70;
		var geom_wall = new THREE.CubeGeometry( sx, sy, sz )
		var material_wall = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/brick_diffuse.jpg") })
		wall0 = new THREE.Mesh( geom_wall, material_wall )

		//------ Ceiling

		var geom_ceiling = new THREE.CubeGeometry( 100, 7, 100 )
		var material_ceiling = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/brick_diffuse.jpg") })
		ceil0 = new THREE.Mesh( geom_ceiling, material_ceiling )

		//------ Floor wood, parquet

		var geom_floor = new THREE.CubeGeometry( 50, 7, 50 )
		var material_floor = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/hardwood2_diffuse.jpg") })
		floor_wood0 = new THREE.Mesh( geom_floor, material_floor )

    //------ cube

    scube = 10 // size cube
    var geom_cube = new THREE.CubeGeometry( scube, scube, scube )
		var material_cube = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/roughness_map.jpg") })
		cube0 = new THREE.Mesh( geom_cube, material_cube )

		//------ Ceil first stage

		ceil0.position.set(25,cy,-25);
		ceil1 = ceil0.clone()
		ceil1.position.set(125,cy,-25);
		ceil2 = ceil0.clone()
		ceil2.position.set(225,cy,-25);
		ceil3 = ceil0.clone()
		ceil3.position.set(25,cy,-125);
		ceil4 = ceil0.clone()
		ceil4.position.set(125,cy,-125);
		ceil5 = ceil0.clone()
		ceil5.position.set(225,cy,-125);

		//------ Wall first stage

		wall0.position.set(0,sy,0);
		wall1 = wall0.clone()
		wall1.position.set(sz/2,sy,sz/2);
		wall1.rotation.y = Math.PI / 2;
		wall2 = wall1.clone()
		wall2.position.set(2*sz,sy,sz/2);
		wall3 = wall0.clone()
		wall3.position.set(2*sz,sy,0);
		wall4 = wall0.clone()
		wall4.position.set(2*sz,sy,-sz);
		wall5 = wall0.clone()
		wall5.position.set(0,sy,-sz);
		wall6 = wall1.clone()
		wall6.position.set(sz/2,sy,-3*sz/2);
		wall7 = wall0.clone()
		wall7.position.set(sz,sy,-2*sz);
		wall8 = wall0.clone()
		wall8.position.set(2*sz,sy,-2*sz);
		wall9 = wall1.clone()
		wall9.position.set(5*sz/2,sy,-5*sz/2);
		wall10 = wall1.clone()
		wall10.position.set(7*sz/2,sy,-5*sz/2);
		wall11 = wall1.clone()
		wall11.position.set(5*sz,sy,-5*sz/2);
		wall12 = wall0.clone()
		wall12.position.set(11*sz/2,sy,-2*sz);
		wall13 = wall0.clone()
		wall13.position.set(11*sz/2,sy,-sz);
		wall14 = wall0.clone()
		wall14.position.set(11*sz/2,sy,-0);
		wall15 = wall1.clone()
		wall15.position.set(5*sz,sy,sz/2);
		wall16 = wall1.clone()
		wall16.position.set(4*sz,sy,sz/2);

		//----- Ceil first stage

		group.add( ceil0 );
		group.add( ceil1 );
		group.add( ceil2 );
		group.add( ceil3 );
		group.add( ceil4 );
		group.add( ceil5 );

		//-----
		group.add( wall0 );
		group.add( wall1 );
		group.add( wall2 );
		group.add( wall3 );
		group.add( wall4 );
		group.add( wall5 );
		group.add( wall6 );
		group.add( wall7 );
		group.add( wall8 );
		group.add( wall9 );
		group.add( wall10 );
		group.add( wall11 );
		group.add( wall12 );
		group.add( wall13 );
		group.add( wall14 );
		group.add( wall15 );
		group.add( wall16 );

		//------ second stage

		wall17 = wall0.clone()
		wall17.position.set(sz, 2*sz , -sz/2);
		wall18 = wall0.clone()
		wall18.position.set(sz, 2*sz , -3*sz/2);
		wall19 = wall1.clone()
		wall19.position.set(sz/2, 2*sz , -2*sz);
		wall20 = wall0.clone()
		wall20.position.set(2*sz, 2*sz , -sz/2);
		wall21 = wall0.clone()
		wall21.position.set(2*sz, 2*sz , -3*sz/2);
		wall22 = wall1.clone()
		wall22.position.set(5*sz/2, 2*sz , -2*sz);
		wall23 = wall1.clone()
		wall23.position.set(7*sz/2, 2*sz , -2*sz);
		wall24 = wall1.clone()
		wall24.position.set(5*sz/2, 2*sz , -3*sz);
		wall25 = wall1.clone()
		wall25.position.set(7*sz/2, 2*sz , -3*sz);
		group.add( wall17 );
		group.add( wall18 )
		group.add( wall19 )
		group.add( wall20 )
		group.add( wall21 )
		group.add( wall22 )
		group.add( wall23 )
		group.add( wall24 )
		group.add( wall25 )

		//------ Ceil second stage

		c2y = 130;
		ceil6 = ceil0.clone()
		ceil6.position.set(50,c2y,-50);
		ceil7 = ceil0.clone()
		ceil7.position.set(150,c2y,-50);
		ceil8 = ceil0.clone()
		ceil8.position.set(50,c2y,-150);
		ceil9 = ceil0.clone()
		ceil9.position.set(150,c2y,-150);

		//----- Ceil second stage

		group.add( ceil6 );
		group.add( ceil7 );
		group.add( ceil8 );
		group.add( ceil9 );

		//----- Wall 2nd

		wall26 = wall0.clone()
		wall26.position.set(sz, 3*sz , -sz);
		wall27 = wall1.clone()
		wall27.position.set(3*sz/2, 3*sz , -sz/2);
		wall28 = wall0.clone()
		wall28.position.set(2*sz, 3*sz , -sz/2);
		wall29 = wall0.clone()
		wall29.position.set(3*sz, 3*sz , -sz/2);
		wall30 = wall1.clone()
		wall30.position.set(7*sz/2, 3*sz , -sz);
		wall31 = wall1.clone()
		wall31.position.set(7*sz/2, 3*sz , -2*sz);
		wall32 = wall1.clone()
		wall32.position.set(3*sz/2, 3*sz , -2*sz);
		group.add( wall26 );
		group.add( wall27 );
		group.add( wall28 );
		group.add( wall29 );
		group.add( wall30 );
		group.add( wall31 );
		group.add( wall32 );

		//------ Ceil third stage

		c3y = 180;
		ceil10 = ceil0.clone()
		ceil10.position.set(50,c3y,-50);
		ceil11 = ceil0.clone()
		ceil11.position.set(150,c3y,-50);
		ceil12 = ceil0.clone()
		ceil12.position.set(50,c3y,-150);
		ceil13 = ceil0.clone()
		ceil13.position.set(150,c3y,-150);

		//----- Ceil third stage

		group.add( ceil10 );
		group.add( ceil11 );
		group.add( ceil12 );
		group.add( ceil13 );

		size_tab = 20;
		var sep_tab = 50;
    // liste des tableaux
		list_tabl = [0, 1, 2 , 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
		all_tabl = []

    // floor impressionists, parquet

    level_floor = 20
    for (i=0; i<40;i++){
  			wall_corr0 = wall0.clone()
  			wall_corr1 = wall0.clone()
  			floor_corr0 = floor_wood0.clone()
  			floor_corr1 = floor_wood0.clone()
  			wall_corr0.position.set(sz, sz/2 , -3*sz-i*sz);
  			wall_corr1.position.set(2*sz, sz , -3*sz-i*sz);
  			floor_corr0.position.set(3*sz/2, level_floor , -3*sz-i*sz);
  			floor_corr1.position.set(5*sz/2, level_floor , -3*sz-i*sz);
  			group.add( wall_corr0 );
  			group.add( wall_corr1 );
  			group.add( floor_corr0 );
		}

    // Tableaux impressionistes

	    for (i=0; i<list_tabl.length; i++){
	        all_tabl.push(tableau('paintings/impressionnistes/' + list_tabl[i] + '.jpg', size_tab, 2*sz-10 , -3*sz-i*sz, 50, -Math.PI/2.0));
	        scene.add(all_tabl[i])
	    }

      // Other floors, floor Botero, parquet

        level_floor_inside0 = 25
        dict_floors0 = {}
        scale_floor0 = 0.25
        var repi = 15
        for (i=0; i<15; i++){
            for (j=0; j<repi; j++){
              dict_floors0[j+repi*i] = floor_wood0.clone()
              dict_floors0[j+repi*i].scale.set(scale_floor0,scale_floor0,scale_floor0)
              dict_floors0[j+repi*i].position.set(100+50*i*scale_floor0, level_floor_inside0, 30-50*j*scale_floor0)
            }
        }
        for (i=0; i<Object.keys(dict_floors0).length+1; i++){
               group.add( dict_floors0[i] )
        }


      // Other floors

        level_floor_inside1 = 25
        dict_floors1 = {}
        scale_floor1 = 0.25
        var repi = 15
        for (i=0; i<8; i++){
            for (j=0; j<repi; j++){
              dict_floors1[j+repi*i] = floor_wood0.clone()
              dict_floors1[j+repi*i].scale.set(scale_floor1,scale_floor1,scale_floor1)
              dict_floors1[j+repi*i].position.set(10+50*i*scale_floor1, level_floor_inside1, 30-50*j*scale_floor1)
            }
        }
        for (i=0; i<Object.keys(dict_floors1).length+1; i++){
               group.add( dict_floors1[i] )
        }

        //----- Cubes

        dict_cubes = {}
        dict_cubes[1] = cube0.clone()
        dict_cubes[1].position.set(0,80,-150);
        dict_cubes[2] = cube0.clone()
        dict_cubes[2].position.set(50,140,-150);
        dict_cubes[3] = cube0.clone()
        dict_cubes[3].position.set(100,140,-170);
        dict_cubes[4] = cube0.clone()
        dict_cubes[4].position.set(20,140,-50);
        for (i=1; i<Object.keys(dict_cubes).length+1; i++){
          group.add( dict_cubes[i] )
        }

        //----- Columns, pillars

        column_dic = {}
        column_dic[0] = column_torsed("texture/adesivo-de-parede-azulejos-05-cozinha.jpg", 5, 45,27,29, 10) // door
        column_dic[1] = column_dic[0].clone()
        column_dic[1].position.set(30,0,0)
        column_dic[2] = column_dic[0].clone()
        column_dic[2].position.set(75,0,0)
        column_dic[3] = column_dic[0].clone()
        column_dic[3].position.set(130,0,0)
        column_dic[4] = column_torsed("texture/adesivo-de-parede-azulejos-05-cozinha.jpg", 5, 10,70,-170, 12)
        column_dic[5] = column_dic[4].clone()
        column_dic[5].position.set(130,0,0)
        column_dic[6] = column_dic[4].clone()
        column_dic[6].position.set(30,60,-10)
        column_dic[7] = column_dic[4].clone()
        column_dic[7].position.set(120,60,-10)
        column_dic[8] = column_dic[4].clone()
        column_dic[8].position.set(170,60,150)
        column_dic[9] = column_dic[4].clone()
        column_dic[9].position.set(30,0,150)
        column_dic[10] = column_dic[4].clone()
        column_dic[10].position.set(150,0,130)
        //---
        column_dic[11] = column_dic[4].clone()
        column_dic[11].position.set(20,60,150)
        column_dic[12] = column_dic[4].clone()
        column_dic[12].position.set(50,60,80)
        for (i=0; i<Object.keys(column_dic).length+1; i++){
          group.add( column_dic[i] )
        }

        //-------------- Persians

        dict_pers = {}
        pers0 = persians("texture/latte0.jpg", 0.5, 0,0,0, 0)
        dict_pers[1] = pers0.clone()
        dict_pers[1].position.set(170,180,0)
        dict_pers[2] = pers0.clone()
        dict_pers[2].rotation.set(0,Math.PI/2,0)
        dict_pers[2].position.set(200,180,-30)
        dict_pers[3] = pers0.clone()
        dict_pers[3].rotation.set(0,Math.PI/2,0)
        dict_pers[3].position.set(200,130,-50)
        for (i=1; i<Object.keys(dict_pers).length+1; i++){
             scene.add( dict_pers[i] )
        }

        //-------------- Treillis

        // dict_treill = {}
        // treill0 = treillis("texture/latte0.jpg", 0.5, 0,0,0, 0)
        // dict_treill[1] = treill0.clone()
        // dict_treill[1].position.set(170,60,50)
        // for (i=1; i<Object.keys(dict_treill).length+1; i++){
        //      scene.add( dict_treill[i] )
        // }

        //-------------- Tapestries

        dict_taps = {}
        tap0 = tapestry("texture/tapis.jpg", 20,  0,0,0, 0)
        dict_taps[1] = tap0.clone()
        dict_taps[1].position.set(50,75,-150)
        dict_taps[2] = tap0.clone()
        dict_taps[2].position.set(120,140,-140)
        for (i=1; i<Object.keys(dict_taps).length+1; i++){
             scene.add( dict_taps[i] )
        }

        // Tableaux à l'intérieur, botero

        dict_tabl_inside = {}
        big_tabl_size = 35
        dict_tabl_inside[1] = tableau("paintings/Botero/Athenaeum.jpeg",big_tabl_size, 140,-115,50, 0)
        dict_tabl_inside[2] = tableau("paintings/Botero/Fernando-Botero-painter.jpg",big_tabl_size, 110,-70,50, Math.PI/2)
        dict_tabl_inside[3] = tableau("paintings/Botero/picnic.jpg",big_tabl_size, 265,-90,50, 3*Math.PI/2)
        //dict_tabl_inside[4] = tableau("paintings/Botero/allant_au_lit.jpg",50, 265,-50,50, 3*Math.PI/2)
        dict_tabl_inside[4] = tableau("paintings/Botero/family-scene.jpg",big_tabl_size, 265,-30,50, 3*Math.PI/2)
        //dict_tabl_inside[5] = tableau("paintings/Botero/allant_au_lit.jpg",25, 110,-25,50, Math.PI/2)
        dict_tabl_inside[5] = tableau("paintings/Botero/flamenco_rouge.jpg",25, 110,-20,50, Math.PI/2)
        dict_tabl_inside[6] = tableau("paintings/Botero/orch.jpg",30, 240,15,50, Math.PI)
        dict_tabl_inside[7] = tableau("paintings/Botero/in_street.jpg",30, 200,15,50, Math.PI)
        //dict_tabl_inside[8] = tableau("paintings/Botero/allant_au_lit.jpg",20, 115,15,50, Math.PI)
        dict_tabl_inside[8] = tableau("paintings/Botero/tango-dancers.jpg",20, 115,15,50, Math.PI)
        dict_tabl_inside[9] = tableau("paintings/Botero/circus_flower-Fernando-Botero.jpg",30, 240,-115,50, 0)
        dict_tabl_inside[10] = tableau("paintings/Botero/self-portrait-with-sofia.jpg",20, 180,-115,50, 0)

        //family-scene-ii-fernando-botero-canvas-paintings
        for (i=1; i<Object.keys(dict_tabl_inside).length+1; i++){
             scene.add( dict_tabl_inside[i] )
        }

        //   Bulb light

        bulbMat = new THREE.MeshStandardMaterial ( {
            emissive: 0xffffee,
            emissiveIntensity: 1,
            color: 0x000000
           });

        dict_bulb = {}
        bulb0 = make_bulb(0,0,0)
        dict_bulb[1] = bulb0.clone()
        dict_bulb[1].position.set(60, 50, -60)
        dict_bulb[2] = bulb0.clone()
        dict_bulb[2].position.set(200, 50, -60)
        dict_bulb[3] = bulb0.clone()
        dict_bulb[3].position.set(130, 120, -60)
        dict_bulb[4] = bulb0.clone()
        dict_bulb[4].position.set(80, 120, -60)
        dict_bulb[5] = bulb0.clone()
        dict_bulb[5].position.set(80, 120, -120)
        dict_bulb[6] = bulb0.clone()
        dict_bulb[6].position.set(130, 170, -60)
        dict_bulb[7] = bulb0.clone()
        dict_bulb[7].position.set(130, 170, -120)
        dict_bulb[8] = bulb0.clone()
        dict_bulb[8].position.set(130, 50, -150)
        for (i=1; i<Object.keys(dict_bulb).length+1; i++){
              scene.add( dict_bulb[i] )
        }

        // Other floors, floor outside with checkers, outside Botero

        do_floor("texture/166280_2322900.jpg", 50, 25, 0.5, 20, 7, 110, -140)
        do_floor("texture/166280_2322900.jpg", 75, 135, 0.5, 2,1, 125, -20)  // second floor
        do_floor("texture/489842808.jpg", 40, 75, 0.5, 5,2, 65, -10) // first floor

        // Tableaux rez de chaussée

        dict_tabl_ff = {}
        big_tabl_size_ff = 8
        level0_ff = 55
        level1_ff = 45
        // dict_tabl_ff[1] = tableau("images/Shadok/bien_mal.jpg",big_tabl_size_ff, 10,0,  level0_ff, Math.PI/2)                  //
        // dict_tabl_ff[2] = tableau("images/Shadok/cerveau_fatigue.jpg",big_tabl_size_ff, 10,-15, level0_ff, Math.PI/2)           //
        // dict_tabl_ff[3] = tableau("images/Shadok/faut_y_aller.jpg",big_tabl_size_ff, 10,-30, level0_ff, Math.PI/2)  //
        // dict_tabl_ff[4] = tableau("images/Shadok/solutions.jpg",big_tabl_size_ff, 10,-45, level0_ff, Math.PI/2)  //
        // dict_tabl_ff[5] = tableau("images/Shadok/passoire.jpg",big_tabl_size_ff, 10,-60, level0_ff, Math.PI/2)  //
        // //-----------
        //dict_tabl_ff[6] = tableau("images/Shadok/connerie_intelligence.jpg",big_tabl_size_ff, 10,0,  level1_ff, Math.PI/2)    //

        //dict_tabl_ff[7] = tableau("images/Shadok/trop_intelligent.jpg",big_tabl_size_ff, 10,-15, level1_ff, Math.PI/2)
        //dict_tabl_ff[7] = tableau("images/Shadok/trop_intelligent.jpg",50, 10,-15, 50, Math.PI/2)           //
        // dict_tabl_ff[8] = tableau("images/Shadok/intérieur.jpg",big_tabl_size_ff, 10,-30, level1_ff, Math.PI/2)  //
        // dict_tabl_ff[9] = tableau("images/Shadok/précaution.jpg",big_tabl_size_ff, 10,-45, level1_ff, Math.PI/2)  //
        // dict_tabl_ff[10] = tableau("images/Shadok/réessayer.jpg",big_tabl_size_ff, 10,-60, level1_ff, Math.PI/2)  //
        //----------
        dict_tabl_ff[1] = tableau("images/Shadok/connerie_intelligence.jpg",40, 7,-30, level1_ff, Math.PI/2)
        dict_tabl_ff[2] = tableau("images/Shadok/solutions.jpg",40, 90,-30, level1_ff, 3*Math.PI/2)
        dict_tabl_ff[3] = tableau("images/Shadok/bien_mal.jpg",30, 30,-65, level1_ff, 0)
        dict_tabl_ff[4] = tableau("images/Shadok/précaution.jpg",35, 25,10, 50, Math.PI)


        for (i=1; i<Object.keys(dict_tabl_ff).length+1; i++){
             scene.add( dict_tabl_ff[i] )
        }
        //----- The four columns, pillars

        var column_tower_dic = {}

        var space_col = 20
        height_tow = 20
        var column_tower_base = column_torsed("texture/azulejos_portugal.jpg", 15, 0,0,0, height_tow) // door
        for (i=0;i<4; i++){
          column_tower_dic[2*i] = column_tower_base.clone()
          column_tower_dic[2*i].position.set(45,10,80+space_col*i)
          column_tower_dic[2*i+1] = column_tower_base.clone()
          column_tower_dic[2*i+1].position.set(80,10,80+space_col*i)
        }

        for (i=0; i<Object.keys(column_tower_dic).length+1; i++){
          group.add( column_tower_dic[i] )
        }

        //--------- ball
        posz_ball = -10
        size_ball = 2
        ball_dic = {}
        ball_dic[0] = ball("texture/verre-souffle-bariole-bar014.jpg", size_ball, 50,30, posz_ball-5)
        ball_dic[1] = ball("texture/bariolé_clair.jpeg", size_ball, 40,30, posz_ball+5)
        ball_dic[2] = ball("texture/verre-souffle-bariole-bar233.jpg", size_ball, 30,30, posz_ball-3)
        for (i=0; i<Object.keys(ball_dic).length+1; i++){
          group.add( ball_dic[i] )
        }

        //---------------
        ceil = ceiling_white(90,90, 50,66.5,-20)
        group.add( ceil )



} // end group building
