import {
	Mesh,
	PerspectiveCamera,
	PlaneGeometry,
	RawShaderMaterial,
	Scene,
	SRGBColorSpace,
	Uniform,
	Vector2,
	WebGLRenderer
} from "three"

export default () => {
	let requestId;
	let scene!: Scene;
	let renderer!: WebGLRenderer;
	let camera!: PerspectiveCamera;
	let material!: RawShaderMaterial;
	let geometry!: PlaneGeometry;
	let mesh!: Mesh;
	let startTime;

	const uniforms = {
		uPixelRatio: new Uniform(window.devicePixelRatio),
		uTime: new Uniform(0),
		uResolution: new Uniform(new Vector2(window.innerWidth, window.innerHeight)),
	};

	const FOV = 60;
	const FOV_RAD = (FOV / 2) * (Math.PI / 180);

	function initThree(stage) {
		scene = new Scene();
		renderer = new WebGLRenderer({
			antialias: true,
			alpha: true,
		});

		camera = new PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 5000);
		camera.position.z = window.innerHeight / 2 / Math.tan(FOV_RAD);
		camera.lookAt(0, 0, 0);

		renderer.setClearColor(0x000000, 1.0);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
		renderer.info.autoReset = false;
		renderer.outputColorSpace = SRGBColorSpace;

		// material = new RawShaderMaterial({
		//   vertexShader,
		//   fragmentShader,
		//   uniforms,
		//   transparent: true,
		// });

		// geometry = new PlaneGeometry(1, 1, 1, 1);
		//
		// mesh = new Mesh(geometry, material);
		// scene.add(mesh);


		stage.appendChild(renderer.domElement);


		const ro = new ResizeObserver(entries => {
			resize(window.innerWidth, window.innerHeight)
		})
		ro.observe(stage)
	}

	function resize(width, height) {
		if (!camera || !renderer || !mesh) {
			return;
		}

		renderer.setSize(width, height);

		camera.position.z = height / 2 / Math.tan(FOV_RAD);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		uniforms.uResolution.value = new Vector2(width, height);
	}

	function render(timestamp) {
		if (start === undefined) {
			startTime = timestamp;
		}
		uniforms.uTime.value = ((timestamp - startTime) * 0.05) % 360;

		renderer.render(scene, camera);
		if (requestId) cancelAnimationFrame(requestId);
		requestId = requestAnimationFrame(render);
	}

	function stop() {
		if (requestId) cancelAnimationFrame(requestId);
	}

	function start(){
		requestId = requestAnimationFrame(render);
	}

	return {
		init(){
			initThree(this.$root)
		}
	}
}
