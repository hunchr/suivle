import { Suivle } from './index'
import { handler } from './handler'

const server = (app: Suivle) => {
    return {
        port: app.port,
        hostname: app.host,
        fetch: async (req: Request) => {
            handler.path = '/' + req.url.replace(/(.*?\/){3}|\?.*/g, '')
            handler.tmp = {
                req: req,
                api: handler.path.slice(0, 5) === '/api/'
            }
            handler.tmp.route = app.routes[
                (handler.tmp.api ? req.method : '') + handler.path.replace(handler.params, '#')
            ]

            // Static files (Blob)
            if (handler.tmp.route?.static) {
                return new Response(Bun.file('./src/public' + handler.path))
            }

            let res = await handler.tmp.route?.handler(handler) ?? (
                handler.tmp.api ? 404 : [404]
            )

            // Models (JSON)
            if (handler.tmp.api) {
                const [status, response] = typeof res === 'number' ?
                    [res, { status: res }] :
                    [200, res]

                return new Response(JSON.stringify(response), {
                    headers: { 'Content-Type': 'application/json' },
                    status: status
                })
            }
            // Views (HTML)
            else {
                const [status, response] = typeof res === 'object' ?
                    [res[0], await require('../../../src/modules/error').handle(res)] :
                    [200, res]

                return new Response(response, {
                    headers: handler.headers,
                    status: status
                })
            }
        }
    }
}

export { server }
