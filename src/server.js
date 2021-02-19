import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser'
import express from 'express'
import qs from 'qs'

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';


express() // You can also use Express
	.use(cookieParser())
  .get("/", (req, res) => {
    const query = qs.stringify(req.query, { addQueryPrefix: true });

    res.redirect(`/${getPreferredLanguage(req)}/${query}`);
  })
	.use(
		compression({threshold: 0}),
		sirv('static', {dev}),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});


function getPreferredLanguage(req) {
	// lang could be stored in a cookie
	if (req.cookies.preferredLang) {
		return req.cookies.preferredLang.toLowerCase();
	}

	const [acceptsLang] = req.acceptsLanguages();

	if (acceptsLang.match(/^de/)) {
		return "de";
	} else {
		return "en";
	}
}

