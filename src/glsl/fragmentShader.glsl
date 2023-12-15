precision mediump float;
precision mediump int;

uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
	vec4 tx = texture2D(uTexture, vUv);
	gl_FragColor = vec4( tx.rgb, 1.0 - length(tx.rgb) * sin(uTime) );
}
