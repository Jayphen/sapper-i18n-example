<script>
	import { stores } from "@sapper/app";
	const { session } = stores();

	$: ({ lang } = $session);
</script>

lang from session is: {lang}
