import { gsap } from "gsap";
import setup from "../three/setup";
import particle from "../three/modules/particles";
import background from "../three/modules/background";
import cards from "../three/modules/cards";
import mouseStalker from "../libs/mouse-stalker";
import { sleep } from "../libs/_utils";

export default ({ assetsPath, data }) => {
	const CHANGE_INTERVAL = 7000;
	const INSTANCES = 120;
	const SIZE = 40;

	let three = null;
	let ms = null;

	return {
		hover: false,
		focus: false,
		action: false,
		index: 1,
		total: 1,
		init() {
			const root = this.$root;
			const indicator = this.$refs.indicator;

			this.total = data.length;

			ms = mouseStalker({
				stage: root,
				dampingFactor: 0.05,
				onUpdate: (data) => {
					root.style.setProperty("--delta-x", data.dx);
					root.style.setProperty("--delta-y", data.dy);
				},
				onEnter: () => {
					if (!this.action) {
						return;
					}
					this.active = true;
				},
				onLeave: () => {
					if (!this.action) {
						return;
					}
					this.active = false;
				},
				updatePointManually: true,
			});

			three = setup({
				assetsPath,
				stage: this.$refs.stage,
				root,
				modules: [
					background(),
					particle({
						instances: INSTANCES,
						size: SIZE,
					}),
					cards({
						data,
						changeInterval: CHANGE_INTERVAL,
						renderCallback: (intersects) => {
							this.hover = Boolean(intersects.length);
							if (this.focus) {
								ms.updateMouseMoving(
									this.$root.scrollWidth * 0.75,
									this.$root.scrollHeight * 0.5 - window.scrollY
								);
							}
						},
					}),
				],
			});

			let tween = null;

			function stopTimer() {
				if (tween) tween.kill();
			}
			function startTimer() {
				if (tween) tween.kill();
				const proxy = {
					t: 0,
				};
				tween = gsap.to(proxy, {
					t: 1,
					duration: CHANGE_INTERVAL / 1000,
					overwrite: true,
					ease: "none",
					onUpdate() {
						indicator.style.setProperty("--indicator-progress", proxy.t);
					},
				});
			}

			root.addEventListener("cards:init", () => {
				this.$dispatch("webgl:init");
			});
			root.addEventListener("card:focus", ({ detail }) => {
				const { data, currentIndex } = detail;
				this.focus = true;
				this.$refs.stalker.setAttribute("href", data.href);
				this.$refs.button.setAttribute("href", data.href);
				ms.updateMouseMoving(Math.min(1440, root.scrollWidth) * 0.75, root.scrollHeight * 0.5);
				startTimer();

				this.index = currentIndex + 1;
			});
			root.addEventListener("card:blur", () => {
				this.focus = false;
				this.$refs.stalker.removeAttribute("href");
				this.$refs.button.removeAttribute("href");
				stopTimer();
			});

			root.addEventListener("card:change", ({ detail }) => {
				const { nextIndex } = detail;

				this.index = nextIndex + 1;

				stopTimer();
				startTimer();
			});

			three.mount();

			ms.mount();
		},

		active: false,
		onMouseMove(e) {
			if (!this.focus) {
				ms.updateMouseMoving(e.x, e.y);
			}
		},
		onClick(e) {
			three && three.click(e);
		},

		async onAction() {
			three.action();
			await sleep(2900);
			this.action = true;
			this.active = true;
		},
	};
};
