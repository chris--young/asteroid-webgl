export async function fetch_shaders() {
	const sources = await Promise.all([get("shaders/fragment.glsl"), get("shaders/vertex.glsl")]);

	return {
		fragment: sources[0],
		vertex: sources[1]
	};
}

async function get(url: string) {
	const res = await fetch(url);

	if (res.status !== 200)
		throw new Error(`${url} responded with ${res.status}`);

	if (/application\/json/.test(res.headers.get("Content-Type")))
		return res.json();
	else
		return res.text();
}
