<script context="module">
	export const preload = async function ({ params }) {
		if (!["en", "de"].includes(params.lang)) {
			this.error(404, "Language not found");
		}
	};
</script>

<slot />
