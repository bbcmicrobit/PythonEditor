var $builtinmodule = function(name) {
	var mod = {};
	
	var scene, camera, renderer;
	var geometry, material, mesh;

	init();
	animate();

	function init() {
		var c = document.getElementById('consoleOut');
		var width = $('#consoleOut').width() - 50;
		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 75, 16/9, 1, 10000 );
		camera.position.z = 1000;

		geometry = new THREE.BoxGeometry( 200, 200, 200 );
		material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( width, width * 9 / 16 );

		
		var c = document.getElementById('consoleOut');
		c.appendChild( renderer.domElement );


	}
	
	function animate() {

		requestAnimationFrame( animate );

		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.02;

		renderer.render( scene, camera );

	}
	
	return mod;
};