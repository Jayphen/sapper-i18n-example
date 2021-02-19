<script>
	import { stores } from "@sapper/app";
	const { page } = stores();

	$: ({
		params: { lang },
	} = $page);
</script>

hello {lang}
