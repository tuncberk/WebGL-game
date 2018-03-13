class GameObject {
    constructor(mesh) {
        this.speedX = 0.0;
        this.speedY = -0.01;
        this.displacement = [0.0, 0.0, 0.0];
        this.xRadius = 0.5;
        this.yRadius = 0.15;
        this.zRadius = 1.5;

       


        var program = initShaders(gl, 'vertex-shader-object', 'fragment-shader-object');
        program.model = gl.getUniformLocation(program, "model");
        program.viewprojection = gl.getUniformLocation(program, "view_projection");
        program.lightPos = gl.getUniformLocation(program, "lightPos");
        program.cameraPos = gl.getUniformLocation(program, "cameraPos");
        program.screenSize = gl.getUniformLocation(program, "screenSize");
        program.texture = gl.getUniformLocation(program, "uTexture");

        program.vpos_attr = gl.getAttribLocation(program, 'vPosition');
        gl.enableVertexAttribArray(program.vpos_attr);

        program.vnor_attr = gl.getAttribLocation(program, "vNormal");
        gl.enableVertexAttribArray(program.vnor_attr);

        program.vuv_attr = gl.getAttribLocation(program, "vUVMap");
        gl.enableVertexAttribArray(program.vuv_attr);

        //gl.vertexAttribPointer(program.vuv_attr, 2, gl.FLOAT, false, 0, 0);

        this.program = program;
        this.mesh = mesh;
        this.model = mat4();

        
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        // gl.vertexAttribPointer(this.program.vuv_attr, this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // var texture = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, texture);

        // var image = new Image();
        // image.src = "box.png";
        // image.addEventListener('load', function() {
        //   // Now that the image has loaded make copy it to the texture.
          
        //   gl.activeTexture(gl.TEXTURE0);
        //   gl.bindTexture(gl.TEXTURE_2D, texture);
        //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

        //   gl.generateMipmap(gl.TEXTURE_2D);
        // });



        //this.texture = gl.createTexture();
        //var image = new ImageElement();
        // gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //2nin katı
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

        // let img = document.getElementById('create-image');

        // img.onload = function() {

        //     gl.bindTexture(gl.TEXTURE_2D, this.texture);
        //     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
        // };

        // gl.generateMipmap(gl.TEXTURE_2D);
    }
    update() {
        this.displacement[0] += this.speedX;
        this.displacement[1] += this.speedY;

        // console.log(this.displacement[0]);
        //console.log(this.displacement[1]);
    }
    accelerate(up) {
        if (up) {
            if (this.speedX < 0.07)
                this.speedX += 0.02;
        }
        else {
            if (this.speedX > -0.07)
                this.speedX -= 0.02;
        }

    }

    decelerate() {
        this.speedX *= 0.8;
    }
    draw(cameraPos, lightPos, viewProjection, model) {
        model = model || mat4();
        model = mult(this.model, model);
        viewProjection = viewProjection || mat4();

        gl.useProgram(this.program);

        gl.uniformMatrix4fv(this.program.model, false, flatten(model));
        gl.uniformMatrix4fv(this.program.viewprojection, false, flatten(viewProjection));
        gl.uniform3f(this.program.lightPos, lightPos[0], lightPos[1], lightPos[2]);

        gl.uniform3f(this.program.cameraPos, cameraPos[0], cameraPos[1], cameraPos[2]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.vertexAttribPointer(this.program.vpos_attr, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
        gl.vertexAttribPointer(this.program.vnor_attr, this.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


    }
    rotate(rotation) {
        this.model = mult(rotation, this.model);
    }

}
