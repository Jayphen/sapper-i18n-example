import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser'
import express from 'express'
import qs from 'qs'

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';

const locales = ["en", "de"]

express() // You can also use Express
	.use(cookieParser())
	.get("/", (req, res) => {
		const query = qs.stringify(req.query, {addQueryPrefix: true});

		// if the user hits the root of the app, determine lang from acceptsLanguages
		const lang = getPreferredLanguage(req);

		req.lang = lang;

		res.redirect(`/${lang}/${query}`);
	})
	.use(getLanguageFromReq)
	.use(
		compression({threshold: 0}),
		sirv('static', {dev}),
		sapper.middleware({
			session: (req) => {
				return {
					lang: req.lang
				}
			}
		})
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

function getLanguageFromReq(req, _, next) {
	const regex = new RegExp(`\/(?<lang>${locales.join("|")})(?:\/|$)`)
	const match = req.url
		.match(regex);

	const lang = match ? match.groups.lang : getPreferredLanguage(req);

	req.lang = lang;
	next();
}

