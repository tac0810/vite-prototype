import { PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer } from "three";
import GlobalUniforms from "./GlobalUniforms";
import { BaseStage as Stage } from "./@types";

export default class BaseStage implements Stage {
	static FOV = 60;
	static FOV_RAD = (BaseStage.FOV / 2) * (Math.PI / 180);

	protected requestId: number = null;
	protected stage!: HTMLDivElement;

	protected scene!: Scene;
	protected renderer!: WebGLRenderer;
	protected camera!: PerspectiveCamera;

	protected globalUniforms!: GlobalUniforms;

	protected loadModules({ globalUniforms }) {}
	protected updateModules(time: number, timestamp: number) {}
	protected resizeModules(width: number, height: number) {}
	protected disposeModules() {}

	protected startTime: number;

	protected render(timestamp: number) {
		if (!this.startTime) {
			this.startTime = timestamp;
		}

		const time = timestamp - this.startTime;

		this.globalUniforms.update(Math.floor(time % 360), time);

		this.updateModules(time % 360, time);

		this.renderer.render(this.scene, this.camera);

		const frameDuration = 1000 / 60;
		const nextFrameTime = this.startTime + Math.ceil(time / frameDuration) * frameDuration;
		setTimeout(() => {
			requestAnimationFrame(this.render.bind(this));
		}, nextFrameTime - timestamp);
	}

	public setup(stage: HTMLDivElement) {
		this.stage = stage;
		const { width, height } = this.stage.getBoundingClientRect();

		this.globalUniforms = new GlobalUniforms();

		this.scene = new Scene();

		this.camera = new PerspectiveCamera(BaseStage.FOV, width / height, 0.1, 5000);
		this.camera.position.z = height / 2 / Math.tan(BaseStage.FOV_RAD);
		this.camera.lookAt(0, 0, 0);

		this.renderer = new WebGLRenderer({
			antialias: true,
			alpha: true,
		});
		this.renderer.setClearColor(0x000000, 1.0);
		this.renderer.setSize(width, height);
		this.renderer.setPixelRatio(this.globalUniforms.guPixelRatio.value);
		this.renderer.outputColorSpace = SRGBColorSpace;

		this.loadModules({ globalUniforms: this.globalUniforms });

		this.stage.appendChild(this.renderer.domElement);
	}

	public resize() {
		if (!this.stage || !this.camera || !this.renderer || !this.globalUniforms) {
			return;
		}

		const { width, height } = this.stage.getBoundingClientRect();

		this.globalUniforms.resize(width, height);

		this.camera.position.z = height / 2 / Math.tan(BaseStage.FOV_RAD);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.resizeModules(width, height);

		this.renderer.setSize(width, height);
	}

	public start() {
		this.requestId = requestAnimationFrame(this.render.bind(this));
	}

	public stop() {
		if (this.requestId) cancelAnimationFrame(this.requestId);
	}

	public dispose() {
		this.renderer.dispose();
		this.disposeModules();
	}
}
