# WebGl-game
Computer Graphics course project with WebGL and JavaScript

This was a game project for the CS405 Computer Graphics course given in fall 2017-2018. 
The purpose of this project was to implement 3D graphics concepts and principles.

There were some required functionalities:

* 3D viewing and objects (models imported from Blender)
* User input
* Lighting and smooth shading
* Texture mapping

In addition to that I used 
* Phong Shading and 
* Collusion detection.

In the game I designed, there is a flow of platforms. User has to bounce on these by using left and right arrow keys and avoid falling.

Since this was my first encounter with WebGL and JavaScript, I had some hard times developing the game. 
Debugging the game was also not so easy when some unintended situations occured(usually did).

Here are some helpful resources I found and followed while learning WebGL:

* [Slides](https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/PPT/) - Some lecture slides used
* [Tutorials](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) - Mozilla's Developer tutorials used

### Some screenshots from the game

![screenshot](Screenshot1.png)
![screenshot](Screenshot2.png)


At the end, this game is not in the state I wanted it to be. In the future I want to add/fix:

* Texture Mapping
* Main menu and score board
* Randomized platforms
* Spinning ball
* More challenging map

### To Use

1. The folder that contains all the files for the project must be located in the localhost(most browsers don't allow cross-origin request due security reasons).
2. In [light-obj.js](light-obj.js) in the segment:

```
OBJ.downloadMeshes({
        'sphere': 'http://localhost:5500/sphereTex.obj',
        'tile': 'http://localhost:5500/tileTex.obj',
    }, modelLoad);
```

where the meshes are loaded, paths should be re-arranged according to the location of the objects sphere and tile.
