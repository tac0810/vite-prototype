import { MathUtils, Uniform, Vector2 } from "three";
import { BaseMesh, BaseStage } from "./@types";

export default class GlobalUniforms implements BaseMesh {
	private count = 0;

	guPixelRatio = new Uniform(Math.min(window.devicePixelRatio, 1.75));
	guRadian = new Uniform(0);
	guResolution = new Uniform(new Vector2(window.innerWidth, window.innerHeight));

	public update(time: number, timestamp: number) {
		this.count++;
		this.count %= 360;

		this.guRadian.value = MathUtils.degToRad(this.count);
	}

	public resize(width: number, height: number) {
		this.guResolution.value = new Vector2(width, height);
	}

	public dispose() {}
}
