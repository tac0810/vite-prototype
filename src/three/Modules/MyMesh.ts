import {
	BufferGeometry,
	Mesh,
	PlaneGeometry,
	RawShaderMaterial,
	TextureLoader,
	Uniform,
} from "three";
import { BaseMesh } from "../@types";

import vertexShader from "../GLSL/MyMesh/vertex.glsl";
import fragmentShader from "../GLSL/MyMesh/fragment.glsl";

export default class MyMesh extends Mesh<BufferGeometry, RawShaderMaterial> implements BaseMesh {
	constructor({ globalUniforms }) {
		const material = new RawShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				...globalUniforms,
				luTime: new Uniform(0),
				luTexture: new Uniform(new TextureLoader().load("https://source.unsplash.com/random")),
			},
			transparent: true,
		});

		const geometry = new PlaneGeometry(100, 100, 1, 1);

		super(geometry, material);
	}

	public update(time: number, timestamp: number) {}

	public resize(width: number, height: number) {}

	public dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}
}
