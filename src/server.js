import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser'
import express from 'express'
import qs from 'qs'

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';

const locales = ["en", "de"]
const defaultLang = 'en'

express()
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
					// Also set the lang in the sapper session
					lang: req.lang
				}
			}
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});


/*
 * Get the preferred lang either from a cookie or from acceptsLanguages
 * If the lang is not de, use en (default)
 */
function getPreferredLanguage(req) {
	// lang could be stored in a cookie when the user manually sets it via a lang switcher
	if (req.cookies.preferredLang) {
		return req.cookies.preferredLang;
	}

	const [acceptsLang] = req.acceptsLanguages();

	if (acceptsLang.match(/^de/)) {
		return "de";
	} else {
		return defaultLang
	}
}

/*
 * Extract the language from the url and set it on the req object
 * If the url isn't a supported one, fall back to checking the user's
 * preferred lang (from acceptsLanguages)
*/
function getLanguageFromReq(req, _, next) {
	const regex = new RegExp(`\/(?<lang>${locales.join("|")})(?:\/|$)`)
	const match = req.url
		.match(regex);

	const lang = match ? match.groups.lang : getPreferredLanguage(req);

	req.lang = lang;
	next();
}

