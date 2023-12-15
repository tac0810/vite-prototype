precision mediump float;
precision mediump int;

uniform float guRadian;
uniform sampler2D luTexture;

varying vec2 vUv;

void main() {
	vec4 tx = texture2D(luTexture, vUv);
	gl_FragColor = tx * vec4( 1.0, sin(guRadian), 0.0, 1.0 );
}