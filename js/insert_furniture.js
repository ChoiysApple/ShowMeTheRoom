// global variances before window.load
var gl;
var furniture_path;

window.onload = function () {
	// global variables after window.load
	furniture_path = '';
	room_floor = './furniture/floorFull.obj'
	
	let light, gird, gridH, camera;
	let mouse;
	let loader; // OBJLoader 객체를 넣을 변수를 선언
	let cl, roomsize;
	let furniture_size = 3.35;//
	let objarr = new Array();
	let obj_num = 0;
	let mtlLoader; // MTLLoader 객체를 넣을 변수
	
	/** [Start] function to handle mouse click event for inserting furniture */
	let onMouseClick = function(e){
		if (cl==1) {
			// length of grid
			var wh = 360/4;
			console.log('wh=' + wh);
			// coordinate adjustment
			if(e.clientY <326){
				if(e.clientX < 796){
					mouse.x = (e.clientX - 680) / wh-1.2;
					mouse.y = (e.clientY - 300) / wh-0.9;
					mouse.z = 0;
				}
				else{
					mouse.x = (e.clientX - 680) / wh-0.3;
					mouse.y = (e.clientY - 300) / wh-0.9;
					mouse.z = 0;
				}
			}
			else{
				if(e.clientX < 796){
					mouse.x = (e.clientX - 680) / wh-1.2;
					mouse.y = (e.clientY - 300) / wh-0.1;
					mouse.z = 0;
				}
				else{
					mouse.x = (e.clientX - 680) / wh-0.3;
					mouse.y = (e.clientY - 300) / wh-0.1;
					mouse.z = 0;
				}
			}
			// inserted or not within an area
			if(mouse.x >= (roomsize/2) || mouse.y >= (roomsize/2) || mouse.x <= -(roomsize/2) || mouse.y <= -(roomsize/2)) {
				console.log("not in area");
			}
			else {
				loadMTLLoader(mouse, furniture_path, furniture_size, 1);
				console.log("in area")
			}
		}
	}
	/** [End] function to handle mouse click event for inserting furniture */
	
	/** [Start] control roomsize */
	roomsize = document.getElementById("roomsize").innerText;
	var btn_plus = document.getElementById("plus");
	var btn_minus = document.getElementById("minus");
	var inner = document.getElementById("roomsize").innerText;

	btn_plus.addEventListener("click", function(event) {
		if (Number(inner) < 20) {
			furniture_size = furniture_size*0.8;
			document.getElementById("roomsize").innerText = Number(inner)+2;
			roomsize = document.getElementById("roomsize").innerText;
			scene.remove(grid);
			var temp = objarr.length;
			for(var i=0; i<temp; i++){
				var value = objarr.pop();
				scene.remove(value);
			}
			addGridView();
			inner = document.getElementById("roomsize").innerText;
		}
	});

	btn_minus.addEventListener("click", function(event) {
		if (Number(inner) > 6) {
			furniture_size = furniture_size*1.2;
			document.getElementById("roomsize").innerText = Number(inner)-2;
			roomsize = document.getElementById("roomsize").innerText;
			scene.remove(grid);
			var temp = objarr.length;
			for(var i=0; i<temp; i++){
				var value = objarr.pop();
				scene.remove(value);
			}
			addGridView();
			inner = document.getElementById("roomsize").innerText;
		}
	});
	/** [End] control roomsize */

	/** List of furniture to put */
	var furniture = ["benchCushion", "bedBunk", "bookcaseClosedWide", "cardboardBoxOpen", "cabinetTelevision","cabinetTelevision",
	"chairModernCushion", "dryer", "kitchenBar", "kitchenFridge", "kitchenSink", "lampRoundFloor", "loungeChair",
	"loungeSofa", "televisionModern", "washer", "sideTable", "loungeSofaOttoman", "pottedPlant",
	"rugRound", "tableGlass", "toilet", "washerDryerStacked", "speaker", "kitchenStove"];

	/** [Start] furniture button listener */

	var div_list = document.getElementById("furniture_list");
	furniture.forEach(item => {
		var div = document.createElement("div");
		div.id = item;
		div.style = "margin: 10px 40px 10px 0px;  width: 150px;"
		div_list.appendChild(div);

		var img = document.createElement("img");
		img.src = "./furniture_image/"+item+".png";
		div.appendChild(img);

		var a = document.createElement("a");
		a.innerHTML = "<br>"+item;
		div.appendChild(a);

		var some_furniture = document.getElementById(item);
		some_furniture.addEventListener("click", function(event){
			furniture_path = './furniture/'+item+'.obj';
		});
	});

	/** [End] furniture button listener */
	
	/** [Start] mode: insert or view */
	// Insert Furniture Mode
	var InsertButton = document.getElementById("insert");
    InsertButton.addEventListener("click", function(event) {
		camera.position.x = 0;
		camera.position.y = 6;
		camera.position.z = 0;
		cl=1;
		document.getElementById("mode").innerText = '현재 모드: 가구 삽입'
	});

	// Change View Space Mode
	var ViewButton = document.getElementById("view");
	ViewButton.addEventListener("click", function(event) {
		cl=0;
		document.getElementById("mode").innerText = '현재 모드: view'
	});
	/** [End] mode: insert or view */

	// make the scene
	let scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );
	
	// 
	initThree();
	addLight();
	addGridView();

	/** [Start] function to add light */
	function addLight() {
		light = new THREE.DirectionalLight(0xffffff, 1.5);
		light.castShadow = false;
		light.position.x = -10;
		light.position.y = 15;
		light.position.z = -20;
		scene.add(light);
		
		var hemiLight = new THREE.HemisphereLight( 0xcccccc, 0x1B1B1B );
		hemiLight.position.set( 0, 0, 0 );
		scene.add(hemiLight);
	}
	/** [End] function to add light */

	/** [Start] function to add grid view */
	function addGridView() {
		var size = 8;
		grid = new THREE.Object3D();
		gridH = new THREE.GridHelper(size, roomsize, 0x0000ff, 0x808080);
		// set grid view position
		gridH.position.y = 0;
		gridH.position.x = 0;
		gridH.position.z = 0;
		// add grid view and add to scene
		grid.add(gridH);
		scene.add(grid);

		// floor settings
		mouse.x = 4;
		mouse.y = -4;
		mouse.z = -0.41;
		// load floor obj&mtl file
		loadMTLLoader(mouse, room_floor, 8, 0);
	}
	/** [End] function to add grid view */

	/** [Start] function to load mtl file */
	function loadMTLLoader(position, obj, size, flag) {
		mtlLoader = new THREE.MTLLoader();
		// set name for loading
		var name = "."+obj.split(".")[1]+".mtl";
		console.log("mtl name="+name);

		// load mtl file
		mtlLoader.load(name, function (materials) {
			// finish to load mtl file
			materials.preload();
			loadOBJLoader(position, obj, size, flag, materials);
			furniture_path = "";
			obj_num = obj_num + 1;
			}, function(xhr) {
				// functions invoked during loading
				console.log('OBJLoader: ', xhr.loaded / xhr.total * 100, '% loaded');
			}, function (error) {
				// function called when load fails
				console.error('MTLLoader 로드 중 오류가 발생하였습니다.', error);
			//});
			
		});
	}
	/** [End] function to load mtl file */
	
	/** [Start] function to load obj file */
	function loadOBJLoader(position, obj, size, flag, materials) {
		obj_loader = new THREE.OBJLoader();
		var name = "."+obj.split(".")[1]+".obj";
		console.log("mtl name="+name);
		obj_loader.setMaterials(materials);
		obj_loader.load(name, function (object) {
			// set object position and scale
			mesh = object.children[0];
			
			if (position.z == null) position.z = 0;
			mesh.position.set(position.x, position.z, position.y);
			mesh.scale.x = mesh.scale.y = mesh.scale.z = size;
			// add object to scene
			scene.add(mesh);
			// store the object to array
			if(flag == 1){ objarr.push(mesh); }
		}, function (xhr) {
			// functions invoked during loading
			console.log('OBJLoader: ', xhr.loaded / xhr.total * 100, '% loaded');
		}, function (error) {
			// function called when load fails
			alert('모델을 로드 중 오류가 발생하였습니다.');
		});
	}
	/** [Start] function to load mtl file */
	
	/** [Start] function to get the furniture name */
	//function getFilename(){
	//	var testFolder = './furniture';
	//	var fs = require('fs');
	//
	//	fs.readdir(testFolder, function(error, filelist){
	//		console.log(filelist);
	//	})
	//}
	/** [End] function to get the furniture name */

	/** [Start] function to initialize Three.js */
	function initThree() {
		let container;
		// set camera position
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.x = 0;
		camera.position.y = 6;
		camera.position.z = 0;
		
		// mouse vector
		mouse = new THREE.Vector2();
		mouse.x = mouse.y = -1;

		let renderer = new THREE.WebGLRenderer({ antialias: true });
		container = document.getElementById('main');
		renderer.setSize(1100, 550);
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		
		container.appendChild(renderer.domElement);
		container.addEventListener('click', onMouseClick, false);
		// view control using orbitcontrols
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;
		controls.minDistance = -50;
		controls.maxDistance = 10;
		
		/** [Start] object control using dragcontrols */
		object_controls = new THREE.DragControls( objarr, camera, renderer.domElement );
		object_controls.addEventListener( 'dragstart', dragStartCallback );
		object_controls.addEventListener( 'dragend', dragendCallback );

		function dragStartCallback(event) {
			// If the object has a mouse, prevent the change of time
			controls.enabled = false;
		}

		function dragendCallback(event) {
			// If finish to drag,allow the change of time
			controls.enabled = true;
		}
		/** [End] object control using dragcontrols */
		
		/** [Start] function to request animation **/
		function animate() {
			requestAnimationFrame(animate);
			// only if the inserting mode, allow to move object
			if (cl == 1) {
				camera.position.x = 0;
				camera.position.y = 6;
				camera.position.z = 0;
				object_controls.enabled = true;
			}
			else {object_controls.enabled = false;}
			renderer.render(scene, camera);
			controls.update();
		}
		/** [End] function to request animation **/
		animate();
	}
	/** [End] function to initialize Three.js */
}
