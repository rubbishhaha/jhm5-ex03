/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// Try to serve static files from public directory
		if (path !== '/') {
			try {
				// Remove leading slash and try to get the static asset
				const asset = await env.ASSETS.fetch(request);
				return asset;
			} catch {
				// If asset is not found, return 404
				return new Response('Not Found', { status: 404 });
			}
		}
		try {
			const indexHtml = await env.ASSETS.fetch(new Request('http://localhost/index.html'));
			return indexHtml;
		} catch {
			// Fallback to default response if index.html is not found
			return new Response('Hello World!');
		}
	},
} satisfies ExportedHandler<Env>;
