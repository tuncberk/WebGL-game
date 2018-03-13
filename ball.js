class Ball {
    
    constructor(mesh){
        this.speedX = 0.0;
        this.speedY = -0.099;
        this.displacement = [0.0,3.0,0.0];

        this.radius = 0.6;

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

        this.program = program;
        this.mesh = mesh;
        this.model = mat4();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
        gl.vertexAttribPointer(this.program.vuv_attr, this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);


        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
       
       // gl.uniform1i(this.program.texture, 0);
         
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                      new Uint8Array([0, 0, 255, 255]));
         
                      
        var images = [];
        // Asynchronously load an image
        var image = new Image();
        image.src = "box.png";
        image.addEventListener('load', function() {
          // Now that the image has loaded make copy it to the texture.
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_2D);
        });
       
        
    }
        update(){
            this.displacement[0] += this.speedX;
            this.displacement[1] += this.speedY;
           
           // console.log(this.displacement[0]);
            //console.log(this.displacement[1]);
        }
        accelerate(up){
            if(up){
                if(this.speedX <0.07 )
                    this.speedX += 0.02;
            }
            else{
                if(this.speedX > -0.07)
                this.speedX -= 0.02;
            } 
            
        }
    
        decelerate(){
            this.speedX *= 0.8;
        }
    
        draw(cameraPos, lightPos, viewProjection, model){
            model = model || mat4();
            model = mult(this.model, model);
            viewProjection = viewProjection || mat4();
    
            gl.useProgram(this.program);
    
            
            gl.uniformMatrix4fv(this.program.model, false, flatten( model));
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
        keepInField(){
    
            if(this.displacement[0] + this.radius > 3.05){
                this.displacement[0] = 3.05 - this.radius;  
                this.speedX = 0.0;    
               // console.log(this.model[0][0]);
            }
            
            if(this.displacement[0] -this.radius < -3.05){
                this.displacement[0] = -3.05 + this.radius;  
                this.speedX = 0.0;    
            }
        }
        collideWithAxisY(min1, max1, min2, max2) {
            if (max2 > min1)
                return true;
            return false;
        }
        collideWithAxisX(min1, max1, min2, max2) {
            if (max1 > min2 || max2 > min1)
                return true;
            return false;
        }
        
        collideWith(obj){
            var ballxMin =  this.displacement[0] - this.radius;
            var ballxMax =  this.displacement[0] + this.radius ;
            var ballyMin =  this.displacement[1] - this.radius;
            var ballyMax =  this.displacement[1] + this.radius ;
            var ballzMin =  this.displacement[2] - this.radius;
            var ballzMax =  this.displacement[2] + this.radius ;
    
            var playerxMin =  obj.displacement[0] - obj.xRadius;
            var playerxMax =  obj.displacement[0] + obj.xRadius;
            var playeryMin =  obj.displacement[1] - obj.yRadius;
            var playeryMax =  obj.displacement[1] + obj.yRadius;
            var playerzMin =  obj.displacement[2] - obj.zRadius;
            var playerzMax =  obj.displacement[2] + obj.zRadius;
    
            if (this.displacement[1] > 2.6){
                this.speedY *= -1.0;
                this.displacement[1] = 2.6;
            }


            if ((ballxMin < playerxMax && ballxMax > playerxMin) &&
                (ballyMin < playeryMax && ballyMin > playeryMin) && 
                (ballzMin < playerzMax && ballzMax > playerzMin)){
                    // if(this.displacement[0] - this.radius/2 < playerxMax || this.displacement[0] + this.radius/2 > playerxMin){
                    //     this.speedX *= -1.0;
                    // }
                    this.speedY *= -1.0;
                    this.displacement[1] = -1.2;
                }


            // if (this.collideWithAxisX(ballxMin, ballxMax, playerxMin, playerxMax) &&
            //     this.collideWithAxisY(ballyMin, ballyMax, playeryMin, playeryMax) &&
            //    // ballyMin < -2.0 
            //     this.collideWithAxisX(ballzMin, ballzMax, playerzMin, playerzMax)
            // ) { 
                
            //     this.speedY *= -1.0;
            //     this.displacement[1] = -0.5;
              
            //     console.log(this.displacement[1]);
               
            // }
        }
        rotate(rotation){
            this.model = mult( this.model,rotation);
        }
    }
    function loadTexture(){

        
    }
    