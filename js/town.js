
var simple_colored_buildings = function(nb_buildings, esp, dist_inter_build){

	//Houses
	/*
	nb_buildings : number of buidlings
	esp : space inside each block of the building
	dist_inter_build : distance between each building
	*/

	for ( var j = 0; j < nb_buildings; j ++ ) {
		group = new THREE.Group();
		scene.add( group );

		// Cube

		var geometry = new THREE.BoxGeometry( 50,50,50 );

		for ( var i = 0; i < geometry.faces.length; i += 2 ) {

				var hex = Math.random() * 0xffffff;
				geometry.faces[ i ].color.setHex( hex );
				geometry.faces[ i + 1 ].color.setHex( hex );

		}

		var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );

		for ( var i = 0; i < 7; i ++ ) {

			var cube = new THREE.Mesh( geometry, material );
			cube.position.x = Math.random() * esp;
			cube.position.y = Math.random() * esp;
			cube.position.z = Math.random() * esp;
			cube.scale.multiplyScalar( Math.random() + 0.5 );
			group.add( cube );
			group.position.y = 50/2; //*Math.power(-1,i);
			group.position.z = Math.random()*dist_inter_build;
			group.position.x = Math.random()*dist_inter_build;

		} // end for
	}

}
