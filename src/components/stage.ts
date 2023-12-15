import Stage from "../three/Stage";

export default () => {
	const stage = new Stage();

	return {
		init() {
			stage.setup(this.$root);

			window.addEventListener("resize", () => {
				stage.resize();
			});

			stage.resize();
			stage.start();
		},
	};
};
