var gl;
var furniture_path;

window.onload = function () {
  furniture_path = './furniture/bathroomCabinet.obj'
   let scene = new THREE.Scene();
   let light, gird, gridH, camera;
   let mouse;
   let loader; // OBJLoader 객체를 넣을 변수를 선언
   let cl, roomsize;
   let objarr = new Array();
   // testing~ start
   // mouse click event function
   let onMouseClick = function(e){
      if (cl==1) {
         // grid 변의 길이
		var wh = 360/(roomsize/2);
		console.log('wh=');
		console.log(wh);
		mouse.x = Math.round((e.clientX - 460) / wh);
		mouse.y = Math.round((e.clientY - 300) / wh);
		console.log(e.clientX, e.clientY);
		console.log(mouse.x, mouse.y);
        loadObjLoader(mouse, furniture_path);
	}

}
   // testing~ end

   roomsize = document.getElementById("roomsize").innerText;

	var btn_plus = document.getElementById("plus");
	var btn_minus = document.getElementById("minus");
	var inner = document.getElementById("roomsize").innerText;
  var btn_bathroomMirror = document.getElementById("bathroomMirror");

	btn_plus.addEventListener("click", function(event) {
		if (Number(inner) < 20) {
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

  btn_bathroomMirror.addEventListener("click", function(event){
    furniture_path = './furniture/bathroomMirror.obj';
    console.log("furniture path ="+'./furniture/bathroomCabinet.obj')
  });

   initThree();
   addDirectionalLight();
   addGridView();

   // button event
   /** *************Insert Furniture Mode********************** */
	var InsertButton = document.getElementById("insert");
    InsertButton.addEventListener("click", function(event) {
		camera.position.x = 0;
		camera.position.y = 6;
		camera.position.z = 0;
		cl=1;
	});

   /** *************Change View Space Mode********************** */
    var ViewButton = document.getElementById("view");
    ViewButton.addEventListener("click", function(event) {
        cl=0;
   });

   /*
   // click event for inserting furniture
    window.addEventListener("click", function(event){
      if(cl==1&&event.clientY>50){
        // check log
      console.log('clcik event listener');
      console.log(event.clientX, event.clientY);
      // load OBJ file
      loadObjLoader(position, './furniture/bathroomCabinet.obj');
      // console.log(loader.position);
        }
    } );
*/
   /** DirectionalLight를 추가하는 함수 */
   function addDirectionalLight() {
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.castShadow = true;
      light.position.x = 5;
      light.position.y = 5;
      light.position.z = 5;
      scene.add(light);
   }

   /** GridHelper를 추가하는 함수 */
   function addGridView() {
      // add grid
	  // size 고정
      var size = 8;
      var size = 8;
      grid = new THREE.Object3D();
      gridH = new THREE.GridHelper(size, roomsize, 0x0000ff, 0x808080);
      gridH.position.y = 0;
      gridH.position.x = 0;
      gridH.position.z = 0;
      grid.add(gridH);
      scene.add(grid);
   }

   /** .obj 파일의 모델을 로드하는 함수 */
   function loadObjLoader(position, obj) {
      loader = new THREE.OBJLoader();
      loader.load(obj, function (object) {
         // set position of object
         object.position.set(position.x, 0, position.y);
		 object.scale.x = object.scale.y = object.scale.z = 3;
         //object.position.set(1, 0, 1);
         // add object
		 objarr.push(object);
         scene.add(object);
      }, function (xhr) {
         // loading model
         console.log(xhr.loaded / xhr.total * 100, '% loaded');
      }, function (error) {
         // fail to load model
         alert('모델을 로드 중 오류가 발생하였습니다.');
      });
   }

   //furnitre 이름 목록 불러오
   function getFilename(){
      var testFolder = './furniture';
      var fs = require('fs');

      fs.readdir(testFolder, function(error, filelist){
       console.log(filelist);
      })
   }

   /** Threejs 초기화 함수 */
   function initThree() {
      let container;
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      // set camera position
      camera.position.x = 0;
      camera.position.y = 6;
      camera.position.z = 0;

      //testing~ start
      rayCast = new THREE.Raycaster();
      mouse = new THREE.Vector2();
      mouse.x = mouse.y = -1;

      //testing~ end

      let renderer = new THREE.WebGLRenderer({
         antialias: true
      });
      container = document.getElementById('main');
      //renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(1100, 550);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      container.addEventListener('click', onMouseClick, false);

      // x,y,z lines
      /*
       * let axes = new THREE.AxesHelper(5); scene.add(axes);
       */

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 0.8;
      controls.minDistance = -50;
      controls.maxDistance = 10;

      function animate() {
         requestAnimationFrame(animate);
         if (cl == 1) {
            // console.log('mode of inserting furniture!')
            camera.position.x = 0;
            camera.position.y = 6;
            camera.position.z = 0;
         }
         else {
         }
         renderer.render(scene, camera);
         controls.update();
      }

      animate();
   }
}
