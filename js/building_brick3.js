
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

function persians(txt, size,  x, y, z, angle){
    //------  board
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
      var geom_cube = new THREE.CubeGeometry( 2*size, 0.3, size )
      var material_cube = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(txt) })
      var cube = new THREE.Mesh( geom_cube, material_cube )
      cube.position.set(x, y, z)
      cube.rotation.set(0, Math.PI/180*angle, 0)
      return cube

}

function column_torsed(txt, size,  x, y, z, nbcubes){
      var group_column = new THREE.Group();
      scene.add( group_column );
      var geom_cube = new THREE.CubeGeometry( size, size, size )
      var material_cube = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(txt) })
      //var material_cube = new THREE.MeshBasicMaterial({ color: 0xffff00})
      //var material_cube = new THREE.MeshBasicMaterial({ color: 0xffffff})
      cube = new THREE.Mesh( geom_cube, material_cube )
      cube.position.set(x, y, z)

      for (i=0;i<nbcubes;i++){
        newcube = cube.clone()
        newcube.rotation.set(0, Math.PI/10*i, 0)
        newcube.position.y = y+i*size
        group_column.add(newcube)
        //scene.add(newcube)
      }
      return group_column
}

function some_cube(txt, size,  x, z, y, roty){
    // on créé un  plan pour lequel on définit un matériau puis on l’ajoute à la scène
    var geom = new THREE.PlaneGeometry( size, size, size);
    var texture = new THREE.TextureLoader().load( txt );
    var mat= new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );
    var cube = new THREE.Mesh( geom, mat); // , new THREE.SphericalReflectionMapping()

    cube.position.x = +x;
    cube.position.z = +z;
    cube.rotation.y += roty;
    cube.position.y = y; //hauteur
    return cube
}

function tableau(txt, size,  x, z, y, roty){
    // on créé un  plan pour lequel on définit un matériau puis on l’ajoute à la scène
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

var scale = function(rot, posx, posy, posz, heighty, nbscales){
	//Scale
	/*

	*/

	hstep = 5
	lstep = 10
	wstep = 40
	sx = 0
	sz = 0
	sy = heighty+hstep
	group_scale = new THREE.Group();
	scene.add( group_scale );
	var geom_step = new THREE.CubeGeometry( wstep, hstep, lstep )
	var material_step = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/brick_diffuse.jpg") })
	step0 = new THREE.Mesh( geom_step, material_step )

	step0.position.set(sx,sy,sz);
	for ( i=0;i<nbscales;i++){
		step = step0.clone()
		step.position.set(sx,sy+hstep*i,sz+lstep*i);
		group_scale.add( step );
	}
	group_scale.rotation.y = rot; // 3*Math.PI / 2;
	group_scale.position.set(posx, posy, posz); //420,0,0

}

var building3 = function(){

	//Houses
	/*

	*/

		group = new THREE.Group();
		scene.add( group );

		//------- Scale

		scale(3*Math.PI / 2, 420,0,0, 0, 15)
		scale(3*Math.PI / 2, 420,0,-120, 0, 15)
        scale(Math.PI / 2, -150,0,0, 0, 15)
        scale(Math.PI / 2, -150,0,-120, 0, 15)

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

		//------ Floor wood
		var geom_floor = new THREE.CubeGeometry( 50, 7, 50 )
		var material_floor = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("textures/hardwood2_diffuse.jpg") })
		floor_wood0 = new THREE.Mesh( geom_floor, material_floor )

    //------ cube
    scube = 10
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

      // Other floors
        level_floor_inside = 20
        dict_floors = {}
        for (i=0; i<4; i++){
            for (j=0; j<3; j++){
              dict_floors[j+3*i] = floor_wood0.clone()
              dict_floors[j+3*i].position.set(100+50*i, level_floor_inside, -50*j)
            }
        }
        for (i=0; i<Object.keys(dict_floors).length+1; i++){
          group.add( dict_floors[i] )
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

        //----- Columns
        column_dic = {}
        column_dic[0] = column_torsed("texture/adesivo-de-parede-azulejos-05-cozinha.jpg", 5, 45,0,29, 16) // door
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

        // Tableaux à l'intérieur
        dict_tabl_inside = {}
        dict_tabl_inside[1] = tableau("paintings/Botero/Athenaeum.jpeg",50, 140,-115,50, 0)
        dict_tabl_inside[2] = tableau("paintings/Botero/Fernando-Botero-painter.jpg",50, 110,-70,50, Math.PI/2)
        dict_tabl_inside[3] = tableau("paintings/Botero/picnic.jpg",50, 265,-90,50, 3*Math.PI/2)
        //dict_tabl_inside[4] = tableau("paintings/Botero/allant_au_lit.jpg",50, 265,-50,50, 3*Math.PI/2)
        dict_tabl_inside[4] = tableau("paintings/Botero/family-scene.jpg",50, 265,-30,50, 3*Math.PI/2)
        //dict_tabl_inside[5] = tableau("paintings/Botero/allant_au_lit.jpg",25, 110,-25,50, Math.PI/2)
        dict_tabl_inside[5] = tableau("paintings/Botero/flamenco_rouge.jpg",25, 110,-20,50, Math.PI/2)
        dict_tabl_inside[6] = tableau("paintings/Botero/orch.jpg",30, 240,15,50, Math.PI)
        dict_tabl_inside[7] = tableau("paintings/Botero/in_street.jpg",30, 200,15,50, Math.PI)
        dict_tabl_inside[8] = tableau("paintings/Botero/allant_au_lit.jpg",20, 115,15,50, Math.PI)
        dict_tabl_inside[9] = tableau("paintings/Botero/circus_flower-Fernando-Botero.jpg",30, 240,-115,50, 0)
        dict_tabl_inside[10] = tableau("paintings/Botero/self-portrait-with-sofia.jpg",20, 180,-115,50, 0)

        //family-scene-ii-fernando-botero-canvas-paintings
        for (i=1; i<Object.keys(dict_tabl_inside).length+1; i++){
             scene.add( dict_tabl_inside[i] )
        }



} // end group building
