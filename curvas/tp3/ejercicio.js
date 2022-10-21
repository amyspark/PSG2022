// Completar la implementación de esta clase y el correspondiente vertex shader. 
// En principio no es necesario modificar el fragment shader, salvo que quieren modificar el color de la curva
class CurveDrawer 
{
	// Inicialización de los shaders y buffers
	constructor()
	{
		// Creamos el programa webgl con los shaders para los segmentos de recta
		this.prog   = InitShaderProgram( curvesVS, curvesFS );

		// Muestreo del parámetro t: Genero una secuencia de 100 valores reales entre 0 y 1
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}

		gl.useProgram(this.prog);

		// Obtenemos la ubicación de las varibles uniformes en los shaders,
		// en este caso, la matriz de transformación 'mvp'
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		
		// [Completar] Creacion del vertex buffer y seteo de contenido
		// Binding del buffer de posiciones
		this.t = gl.getUniformLocation( this.prog, 't' );
		this.tBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer );
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
		gl.enableVertexAttribArray( this.t );

		// [Completar] Incialización y obtención de las ubicaciones de los atributos y variables uniformes de los shaders	
		this.uniforms = [
			gl.getUniformLocation(this.prog, 'p0'),
			gl.getUniformLocation(this.prog, 'p1'),
			gl.getUniformLocation(this.prog, 'p2'),
			gl.getUniformLocation(this.prog, 'p3'),
		];	
	}

	// Actualización del viewport (se llama al inicializar la web o al cambiar el tamaño de la pantalla)
	setViewport( width, height )
	{
		const pixelRatio = window.devicePixelRatio || 1;
		canvas.width     = pixelRatio * canvas.clientWidth;
		canvas.height    = pixelRatio * canvas.clientHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		// Calculamos la matriz de proyección.
		// Como nos vamos a manejar únicamente en 2D, no tiene sentido utilizar perspectiva. 
		// Simplemente inicializamos la matriz para que escale los elementos de la escena
		// al ancho y alto del canvas, invirtiendo la coordeanda y. La matriz está en formato 
		// column-major.
		this.trans = [ 2/width,0,0,0,  0,-2/height,0,0, 0,0,1,0, -1,1,0,1 ];

		// Seteamos la matriz en la variable unforme del shader
		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, this.trans );
	}

	updatePoints( pt )
	{
		// [Completar] Actualización de las variables uniformes para los puntos de control
		// [Completar] No se olviden de hacer el binding del programa antes de setear las variables 
		// [Completar] Pueden acceder a las coordenadas de los puntos de control consultando el arreglo pt[]:

		// Seleccionamos el shader
		gl.useProgram( this.prog );

		// var p = [];

		for (var i = 0; i < pt.length; i++){
			var x = pt[i].getAttribute("cx");
			var y = pt[i].getAttribute("cy");
			gl.uniform2f(this.uniforms[i], x, y);
		}
	}

	draw()
	{
		// [Completar] Dibujamos la curva como una LINE_STRIP
		// [Completar] No se olviden de hacer el binding del programa y de habilitar los atributos de los vértices
		// [Completar] Setear los valores uniformes del Vertex shader.

		// Seleccionamos el shader
		gl.useProgram( this.prog );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer );
		gl.vertexAttribPointer( this.t, 1, gl.FLOAT, false, 0, 0 );

		// Dibujamos lineas utilizando primitivas gl.LINE_STRIP 
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
		gl.drawArrays( gl.LINE_STRIP, 0, this.steps);
	}
}

// Vertex Shader
//[Completar] El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `
	attribute float t;

	uniform mat4 mvp;
	
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;

	void main()
	{ 
		float a = pow(1.0-t, 3.0);
		float b = 3.0 * t * pow(1.0 - t, 2.0);
		float c = 3.0 * pow(t, 2.0) * (1.0 - t);
		float d =  pow(t, 3.0);
		vec2 pu = a * p0 + b * p1 + c * p2 + d * p3;
		gl_Position = mvp * vec4(pu, 0, 1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;

	void main()
	{
		gl_FragColor = vec4(0,0,1,1);
	}
`;
