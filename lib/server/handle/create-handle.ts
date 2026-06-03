import { constants } from "node:crypto";

import { assert, createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { Agent, fetch } from "undici";
import { v7 as uuid } from "uuid";

import { env } from "@/config/env.config";

const baseUrl = env.HANDLE_PROVIDER;
const key = env.HANDLE_KEY;
const cert = env.HANDLE_CERT;
const prefix = env.HANDLE_PREFIX;
const resolver = env.HANDLE_RESOLVER;

const agent = new Agent({
	connect: {
		key,
		cert,
		rejectUnauthorized: false,
		/**
		 * The server resumes the TLS session during renegotiation (using the ticket from the
		 * initial handshake), which causes an abbreviated handshake with no CertificateRequest.
		 * Without CertificateRequest the client never sends its cert and the server returns 401.
		 * SSL_OP_NO_TICKET disables session tickets so renegotiation always does a full
		 * handshake with CertificateRequest, allowing the client cert to be sent.
		 */
		secureOptions: constants.SSL_OP_NO_TICKET,
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
			index: 1,
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
