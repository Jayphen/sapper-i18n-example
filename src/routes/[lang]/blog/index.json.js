import posts from './_posts.js';

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	const contents = JSON.stringify(posts.map(post => {
		return {
			title: post.title + ` is totally in ${req.lang}`,
			slug: post.slug
		};
	}));

	res.end(contents);
}
