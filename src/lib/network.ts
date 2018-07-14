const ASSETS = ["shaders/fragment.glsl", "shaders/vertex.glsl", "wireframes.json"];

export const loadAssets = Promise.all(ASSETS.map(get)).then((assets) => ({
	shaders: {
		fragment: assets[0],
		vertex: assets[1]
	},
	wireframes: assets[2]
}));

async function get(url: string) {
	const res = await fetch(url);

	if (res.status !== 200)
		throw new Error(`${url} responded with ${res.status}`);

	if (/application\/json/.test(res.headers.get("Content-Type")))
		return res.json();
	else
		return res.text();
}
