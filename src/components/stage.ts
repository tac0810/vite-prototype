import Stage from "../three/Stage";

export default () => {
	const stage = new Stage();

	return {
		init() {
			stage.setup(this.$root);
			const ro = new ResizeObserver(() => {
				stage.resize();
			});
			ro.observe(this.$root);
			stage.start();
		},
	};
};
