import BaseStage from "./BaseStage";
import MyMesh from "./Modules/MyMesh";

export default class Stage extends BaseStage {
	private myMesh!: MyMesh;

	protected loadModules({ globalUniforms }) {
		this.myMesh = new MyMesh({ globalUniforms });
		this.scene.add(this.myMesh);
	}

	protected updateModules(time: number, timestamp: number) {
		this.myMesh.update(time, timestamp);
	}

	protected resizeModules(width: number, height: number) {
		this.myMesh.resize(width, height);
	}

	protected disposeModules() {
		this.myMesh.dispose();
	}
}
