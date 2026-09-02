/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const ALLOW_REGEX = /(jpg|jpeg|png|gif|webp|avif|svg)$/;

export default {
  async fetch(request, env) {
    const { hostname, protocol, pathname } = new URL(request.url);


    // In the case of a Basic authentication, the exchange
    // MUST happen over an HTTPS (TLS) connection to be secure.
    if (
      'https:' !== protocol ||
      'https' !== request.headers.get('x-forwarded-proto')
    ) {
      throw new BadRequestException('Please use a HTTPS connection.');
    }

    // Is allowed to access "pathname"?
    if (!authorizedRequest(request, env, pathname)) {
      return new Response('Forbidden', { status: 403 });
    }

    const key = pathname.replace('/static/images', 'images');
    switch (request.method) {
      case 'PUT':
      case 'DELETE':
        await env.STATIC_BUCKET[request.method.toLowerCase()](
          key,
          request.body
        );

        return new Response(`${request.method} ${key} successfully!`, {
          status: 200,
        });

      case 'GET':
        const object = await env.STATIC_BUCKET.get(key)

        if (!object) {
          return new Response('Object Not Found', { status: 404 });
        }

        const res = new Response(object.body);
        res.headers.set('Content-Type', object.httpMetadata.contentType);
        if (pathname.includes('microblog')) {
          res.headers.set('Cache-Control', 'max-age=1814400');
          return res;
        }
        res.headers.set('Cache-Control', 'max-age=604800');
        return res;

      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  },
};

/**
 * Check if request is authorized or allowed.
 * @param {Request} request
 * @param {Object} env
 * @param {string} pathName
 * @returns {boolean}
 */
function authorizedRequest(request, env, pathName) {
  switch (request.method) {
    case 'PUT':
    case 'DELETE':
      if (request.headers.has('Authorization')) {
        // Throws exception when authorization fails.
        const { user, pass } = basicAuthentication(request);
        verifyCredentials(user, pass, env);
      }

      return hasValidHeader(request, env);
    case 'GET':
      return ALLOW_REGEX.test(pathName);
    default:
      return false;
  }
}

/**
 * Check requests for a pre-shared secret
 * @param {Request} request
 * @returns {boolean}
 */
const hasValidHeader = (request, env) => {
  return request.headers.get('X-Custom-Auth-Key') === env.AUTH_KEY_SECRET;
};

/**
 * Throws exception on verification failure.
 * @param {string} user
 * @param {string} pass
 * @throws {UnauthorizedException}
 */
function verifyCredentials(user, pass, env) {
  if (env.CF_USER !== user) {
    throw new UnauthorizedException('Invalid username.');
  }

  if (env.CF_PASS !== pass) {
    throw new UnauthorizedException('Invalid password.');
  }
}

/**
 * Parse HTTP Basic Authorization value.
 * @param {Request} request
 * @throws {BadRequestException}
 * @returns {{ user: string, pass: string }}
 */
function basicAuthentication(request) {
  const Authorization = request.headers.get('Authorization');
  const [scheme, encoded] = Authorization.split(' ');

  // The Authorization header must start with Basic, followed by a space.
  if (!encoded || scheme !== 'Basic') {
    throw new BadRequestException('Malformed authorization header.');
  }

  // Decodes the base64 value and performs unicode normalization.
  // @see https://datatracker.ietf.org/doc/html/rfc7613#section-3.3.2 (and #section-4.2.2)
  // @see https://dev.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  const buffer = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0)
  );
  const decoded = new TextDecoder().decode(buffer).normalize();

  // The username & password are split by the first colon.
  //=> example: "username:password"
  const index = decoded.indexOf(':');

  // The user & password are split by the first colon and MUST NOT contain control characters.
  // @see https://tools.ietf.org/html/rfc5234#appendix-B.1 (=> "CTL = %x00-1F / %x7F")
  if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
    throw new BadRequestException('Invalid authorization value.');
  }

  return {
    user: decoded.substring(0, index),
    pass: decoded.substring(index + 1),
  };
}

function UnauthorizedException(reason) {
  this.status = 401;
  this.statusText = 'Unauthorized';
  this.reason = reason;
}

function BadRequestException(reason) {
  this.status = 400;
  this.statusText = 'Bad Request';
  this.reason = reason;
}
