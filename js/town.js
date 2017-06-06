
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

function make_trunk(){
    //alert("make racket")
    var geometry = new THREE.CubeGeometry( 20, 80, 20 );

        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x000000 } ) );
        object.material.ambient = object.material.color;
        //----------------
        object.position.x = 0;
        object.position.y = 130 ;
        object.position.z = 0;
        //----------------
        object.castShadow = true;
        object.receiveShadow = true;
        var hex = Math.random() * 0xffffff;
        object.material.color.setHex( hex );
        return object

} // end function

function make_green_bowl(){
    //alert("make_head")
    var geometry = new THREE.SphereGeometry( 70, 32, 32 );
        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x33cc33 } ) );
        object.material.ambient = object.material.color;
        //----------------
        object.position.x = 0;
        object.position.y = 200 ;
        object.position.z = 0;
        //----------------
        object.castShadow = true;
        object.receiveShadow = true;
        return object
} // end function


function make_simple_tree(){
    group_tree = new THREE.Object3D();//create an empty container
    //-------------------------------
    var green_bowl = make_green_bowl()
    var trunk = make_trunk()
    group_tree.add( green_bowl );
    group_tree.add( trunk );
    scene.add( group_tree );//when done, add the group to the scene
    return group_tree
} // end function
