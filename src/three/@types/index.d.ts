export interface BaseStage {
	resize(width: number, height: number);
	dispose();
}

export interface BaseMesh extends BaseStage {
	update(time: number, timestamp: number);
}
