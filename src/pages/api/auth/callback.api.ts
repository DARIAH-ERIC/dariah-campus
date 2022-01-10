import type { NextApiRequest, NextApiResponse } from 'next'
// import dedent from 'strip-indent'

import { url as baseUrl } from '~/config/site.config'

/**
 * OAuth2 callback for GitHub auth code flow.
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const { code, state } = request.query

  if (
    code === undefined ||
    Array.isArray(code) ||
    state === undefined ||
    Array.isArray(state) ||
    process.env.GITHUB_ID === undefined ||
    process.env.GITHUB_SECRET === undefined
  ) {
    return renderErrorTemplate(response, 'Bad request.', 400)
  }

  const url = new URL('https://github.com/login/oauth/access_token')
  url.searchParams.set('client_id', process.env.GITHUB_ID)
  url.searchParams.set('client_secret', process.env.GITHUB_SECRET)
  url.searchParams.set('code', code)
  url.searchParams.set('state', state)

  const tokenResponse = await fetch(String(url), {
    method: 'POST',
    headers: { accept: 'application/json' },
  })

  const data = await tokenResponse.json()

  if (data.error !== undefined) {
    return renderErrorTemplate(
      response,
      `<a href="${data.error_uri}" rel="noopener noreferrer" target="_blank">
         ${data.error_description}
       </a>`,
    )
  }

  return renderSuccessTemplate(response, data)
}

/**
 * Renders error template.
 */
function renderErrorTemplate(
  response: NextApiResponse,
  message: string,
  statusCode = 200,
) {
  response.status(statusCode)
  response.setHeader('Content-Type', 'text/html; charset=UTF-8')

  return response.send(`
    <!doctype html>
    <html>
    <body>
      <main>
        <p>
          ${message}
        </p>
      </main>
    </body>
    </html>
  `)
}

/**
 * Renders success template.
 */
function renderSuccessTemplate(
  response: NextApiResponse,
  data: { access_token: string },
) {
  const provider = 'github'
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const allowedOrigin = new URL(baseUrl).host

  response.setHeader('Content-Type', 'text/html; charset=UTF-8')

  /**
   * @see https://api.netlify.com/auth/done
   */
  return response.send(`
    <!doctype html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          font-family: 'Roboto', system-ui, sans-serif;
        }
        main {
          min-height: 100vh;
          display: grid;
          place-items: center;
        }
        p {
          font-size: 1.25rem;
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <main>
        <p id="msg">Signing in...</p>
      </main>
      <script>
        (function() {
          function receiveMessage(e) {
            if (e.data == "authorizing:${provider}") {
              var match = e.origin.match(/https?:\\/\\/([^:]+)(:\\d+)?$/),
                  host  = match && match[1];

              if (host) {
                var domainParts = host.split("--");
                host = domainParts[domainParts.length - 1];

                if (host === "${allowedOrigin}" || host === "localhost") {
                  window.opener.postMessage(
                    'authorization:${provider}:success:{"token":"${data.access_token}","provider":"${provider}"}',
                    e.origin
                  );
                }
              }
            }
          }

          if (window.opener) {
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:${provider}", "*");
          } else {
            document.getElementById("msg").innerText = "Cannot find parent window, which opened this popup.";
          }
        })()
      </script>
    </body>
    </html>
  `)
}
