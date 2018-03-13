var sphere;
var screenSize;

var playerPressedL = false;
var playerPressedR = false;

var models = {};

var lightPos = vec3(0, 3, 3);

var ball;
var mvp;
var posx = 0;
var posy = 3.0;
var posz = 7;

var up = [0, 1, 0];
var at = vec3(0, 0, 0);
var eye = vec3(posx, posy, posz);
var toCam = subtract(eye, at);

var proj;
var view;

var tiles;

function modelLoad(meshes) {
    models.meshes = meshes;
    OBJ.initMeshBuffers(gl, models.meshes.sphere);
    sphere = new Ball(models.meshes.sphere);

    OBJ.initMeshBuffers(gl, models.meshes.tile);
    tile0 = new GameObject(models.meshes.tile);
    tile1 = new GameObject(models.meshes.tile);
    tile2 = new GameObject(models.meshes.tile);
    tile3 = new GameObject(models.meshes.tile);
    tile4 = new GameObject(models.meshes.tile);



    tile0.displacement = [1.5, -2.0, -3.0]
    tile1.displacement = [-1.5, -2.0, -6.0]
    tile2.displacement = [0.5, -2.0, -9.0]
    tile3.displacement = [-0.5, -2.0, -12.0]
    tile4.displacement = [-1.5, -2.0, -15.0]

    tiles = [tile0, tile1, tile2, tile3, tile4];

    gameLoop();
}

window.onload = function () {
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("yo");
    }

    screenSize = [canvas.width, canvas.height];

    gl.viewport(0, 0, screenSize[0], screenSize[1]);
    //gl.clearColor(1, 1.0, 0, 1);

    OBJ.downloadMeshes({
        'sphere': 'http://localhost:5500/sphereTex.obj',
        'tile': 'http://localhost:5500/tileTex.obj',
      
    }, modelLoad);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    initBkgnd();
    gl.enable(gl.DEPTH_TEST);

}

var a = 0;
var gameEnded = false;
var camToLeft = true;
const gameLoop = function () {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var view = lookAt(add(at, toCam), at, up); //eye, at, up
    var proj = perspective(45, screenSize[0] / screenSize[1], 0.1, 30);

        at = sphere.displacement;       //look at the ball

    //
    // if (camToLeft) {
    //     if (up[0] < 0.5) {
    //         up[0] += 0.01;
    //         //sphere.speedX -= 0.005;
    //     }
    //     else
    //         camToLeft = false;

    // }
    // else {
    //     if (up[0] > -0.5) {
    //         up[0] -= 0.01;
    //         //sphere.speedX += 0.005;
    //     }
    //     else
    //         camToLeft = true;
    // }



    mvp = mult(proj, view);
    if (!gameEnded) {

        if (!playerPressedL && !playerPressedR)
            sphere.decelerate();
        else
            sphere.accelerate(playerPressedR);

        // view = lookAt(add(at, toCam), at, [0, 1, 0]);
        // proj = perspective(45, screenSize[0] / screenSize[1], 0.1, 10);

       
        sphere.update();
        sphere.keepInField();
        //collision detection for each element in tiles array.
        tiles.forEach(element => {
            sphere.collideWith(element);
        });
       

        sphere.draw(eye, lightPos, mult(proj, view), translate(sphere.displacement[0], sphere.displacement[1], sphere.displacement[2]));
        
        //ceiling.draw(eye, lightPos, mult(proj, view), translate(ceiling.displacement[0], ceiling.displacement[1], ceiling.displacement[2]));
        tile0.draw(eye, lightPos, mult(proj, view), translate(tile0.displacement[0], tile0.displacement[1], tile0.displacement[2]));
        //console.log(tile0.displacement[0]);
        tile1.draw(eye, lightPos, mult(proj, view), translate(tile1.displacement[0], tile1.displacement[1], tile1.displacement[2]));
        tile2.draw(eye, lightPos, mult(proj, view), translate(tile2.displacement[0], tile2.displacement[1], tile2.displacement[2]));
        tile3.draw(eye, lightPos, mult(proj, view), translate(tile3.displacement[0], tile3.displacement[1], tile3.displacement[2]));
        tile4.draw(eye, lightPos, mult(proj, view), translate(tile4.displacement[0], tile4.displacement[1], tile4.displacement[2]));
       
        // sphere.rotate(rotate(1, [0.0,sphere.displacement[1],0.0]));
        

        tiles.forEach(element => {
            element.displacement[2] += 0.09;
            if (element.displacement[2] > 4.9) {
                element.displacement[2] = -10.0;
            }
        });

        //window.requestAnimationFrame(gameLoop);
        animate(); //in order to limit frame rate to 60fps
    }
    else {
        window.cancelAnimationFrame(gameLoop);
    }

    document.onkeydown = function (e) {
        //console.log(e.keyCode);
        if (e.keyCode == 37) {
            playerPressedL = true;
        }
        if (e.keyCode == 39) {
            playerPressedR = true;
        }
    }
    document.onkeyup = function (e) {
        if (e.keyCode == 37) {
            playerPressedL = false;
        }
        if (e.keyCode == 39) {
            playerPressedR = false;
        }
       
    }
}
//frame rate restiriction
function animate() {

    setTimeout( function() {

        window.requestAnimationFrame(gameLoop);

    }, 1000 / 60 );
}

function initBkgnd() {
    backTex = gl.createTexture();
    backTex.Img = new Image();
    backTex.Img.onload = function () {
        handleBkTex(backTex);
    }
    backTex.Img.src = "space1.png";
}

function handleBkTex(tex) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.Img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}