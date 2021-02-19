<script context="module">
	export function preload({ params: { lang } }) {
		return this.fetch(`/${lang}/blog.json`)
			.then((r) => r.json())
			.then((posts) => {
				return { posts };
			});
	}
</script>

<script>
	export let posts;
	import { stores } from "@sapper/app";
	const { page } = stores();
	$: ({
		params: { lang },
	} = $page);
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<h1>Recent posts</h1>

<ul>
	{#each posts as post}
		<!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
		<li>
			<a rel="prefetch" href={`/${lang}/blog/${post.slug}`}>{post.title}</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>
