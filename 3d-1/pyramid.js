// Vertex shader
var cubeVS = `
	attribute vec3 pos;
	attribute vec3 color;

	uniform mat4 mvp;

	// Pasar color a FS
	varying vec3 color2fs;

	void main()
	{
		color2fs = color;
		gl_Position = mvp * vec4(pos,1);
	}
`;
// Fragment shader
var cubeFS = `
	precision mediump float;

	varying vec3 color2fs;

	void main()
	{
		gl_FragColor = vec4(color2fs,1);
	}
`;


// Clase que dibuja la caja alrededor de la escena
class Pyramid {
	constructor()
	{
		// 1. Compilamos el programa de shaders
		this.prog = InitShaderProgram( cubeVS, cubeFS );
		
		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp_loc = gl.getUniformLocation( this.prog, 'mvp' );

		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.pos_loc = gl.getAttribLocation( this.prog, 'pos' );
		this.color_loc = gl.getAttribLocation( this.prog, 'color' );

		// 4.  Creamos el buffer para los vertices y subimos data
		// 4 caras pirámide
		let pos = [
			// Especificar posiciones de los vértices
			 0,  0,  1, // base
			-1,  0,  0,
			 1,  0,  0,

			 1,  0,  0,	// xz
			 0,  1,  0,
			 0,  0,  1,

			 0,  1,  0, // -xz
			-1,  0,  0,
			 0,  0,  1,

			 1,  0,  0, // xy
			-1,  0,  0,
			 0,  1,  0,
		];
		this.vertex_count  = pos.length / 3

		this.pos_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pos_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

		this.colorbuffer = gl.createBuffer();

		var color = [
			// Especificar colores
			 1,  0,  0,
			 1,  0,  0,
			 1,  0,  0,

			 1,  1,  0,
			 1,  1,  0,
			 1,  1,  0,

			 0,  1,  1,
			 0,  1,  1,
			 0,  1,  1,

			 1,  0,  1,
			 1,  0,  1,
			 1,  0,  1,
		];

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
	}

	// Esta función se llama para dibujar la caja
	draw( trans )
	{
		// 1. Seleccionamos el shader
		gl.useProgram( this.prog );

		// 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp, false, trans );

		// 3. Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.pos_buffer );

		// 4. Habilitamos el atributo
		gl.vertexAttribPointer( this.pos_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos_loc );

		// 4. Lo mismo pero para color
		gl.bindBuffer( gl.ARRAY_BUFFER, this.color_buffer );
		gl.vertexAttribPointer( this.color_loc, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.color_loc );

		// 5. Dibujamos
		gl.drawArrays( gl.TRIANGLES, 0, this.vertex_count);

	}
}
