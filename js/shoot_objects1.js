
var make_balls = function(){
	/*

	*/
  listballs = []
	sizeball = 10
	for ( i=1; i < 5; i++ ){

				var geometry = new THREE.SphereGeometry( sizeball, 32, 32 );
				//var texture = new THREE.TextureLoader().load( "texture/azulejos_portugal.jpg" );
        var texture = new THREE.TextureLoader().load( "textures/hardwood2_diffuse.jpg" );
				var material = new THREE.MeshBasicMaterial( { map: texture } );
				var balloon = new THREE.Mesh( geometry, material );
				//----------------
				var posball = 10*i
				balloon.position.set(Math.random()*posball, posball, 10*posball)
				listballs.push(balloon)
			}
	return listballs
	}

  var make_explosion = function(){
  	/*

  	*/
    var listballs = []
  	var sizeball = 100
  	for ( i=1; i < 4; i++ ){

  				var geometry = new THREE.SphereGeometry( sizeball, 32, 32 );
  				//var texture = new THREE.TextureLoader().load( "texture/azulejos_portugal.jpg" );
          var texture = new THREE.TextureLoader().load( "textures/hardwood2_diffuse.jpg" );
  				var material = new THREE.MeshBasicMaterial( { map: texture } );
  				var balloon = new THREE.Mesh( geometry, material );
  				//----------------
          var posball = 30*i
          balloon.position.set(posball, posball, posball)
  				listballs.push(balloon)
  			}

  	return listballs
  	}
