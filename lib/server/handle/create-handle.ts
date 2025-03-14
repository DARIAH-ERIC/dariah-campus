import { assert, createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { Agent, fetch } from "undici";
import { v7 as uuid } from "uuid";

import { env } from "@/config/env.config";

const baseUrl = env.HANDLE_PROVIDER;
const key = env.HANDLE_KEY;
const cert = env.HANDLE_CERT;
const prefix = env.HANDLE_PREFIX;
const resolver = env.HANDLE_RESOLVER;

/**
 * We have to use `undici` directly, instead of how it is exposed via `node`,
 * to be able to set a custom https agent for client certificates.
 *
 * @see https://github.com/nodejs/node/issues/43187
 * @see https://github.com/nodejs/node/issues/48977
 * @see https://github.com/nodejs/undici/issues/1489
 */
const agent = new Agent({
	connect: {
		key,
		cert,
		rejectUnauthorized: false,
	},
});

const headers = {
	Authorization: 'Handle clientCert="true"',
	"Content-Type": "application/json",
};

export async function createHandle(resource: URL, suffix = uuid()): Promise<URL> {
	assert(baseUrl, "Missing base url for handle service.");
	assert(key, "Missing key for handle service.");
	assert(cert, "Missing certificate for handle service.");
	assert(prefix, "Missing prefix for handle service.");
	assert(resolver, "Missing resolver for handle service.");

	const timestamp = new Date().toISOString();

	const data = [
		{
			index: 1, // FIXME:
			type: "URL",
			data: {
				format: "string",
				value: String(resource),
			},
			ttl: 86400,
			timestamp,
		},
		{
			index: 100,
			type: "HS_ADMIN",
			data: {
				format: "admin",
				value: {
					handle: `0.NA/${prefix}`,
					index: 200,
					permissions: "011111110011",
				},
			},
			ttl: 86400,
			timestamp,
		},
	];

	const response = (await fetch(
		createUrl({
			baseUrl,
			pathname: `/api/handles/${prefix}/${suffix}`,
			searchParams: createUrlSearchParams({
				overwrite: false,
			}),
		}),
		{
			dispatcher: agent,
			method: "PUT",
			headers,
			body: JSON.stringify(data),
		},
	).then((response) => {
		if (!response.ok) {
			throw new Error(`[${String(response.status)}] ${response.statusText}`);
		}

		return response.json();
	})) as { responseCode: 1; handle: string };

	const handle = createUrl({
		baseUrl: resolver,
		pathname: response.handle,
	});

	return handle;
}
