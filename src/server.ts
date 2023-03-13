import { Suivle } from './index'
import { handler } from './handler'

const server = (app: Suivle) => {
    return {
        port: app.port,
        hostname: app.host,
        fetch: async (req: Request) => {
            handler.path = req.url.replace(/(.*?\/){3}|\?.*/g, '')
            handler.tmp = {
                req: req,
                api: handler.path.slice(0, 4) === 'api/'
            }
            handler.tmp.route = app.routes[
                `${handler.tmp.api ? req.method : ''}/${handler.path.replace(handler.params, '#')}`
            ]

            return new Response(
                ...handler.tmp.route ? (
                    handler.tmp.route.static ?
                        [Bun.file('./src/public/' + handler.path)] :
                        handler.tmp.route.handler(handler)
                ) :
                handler.tmp.api ?
                    handler.json(404) :
                    handler.html(404)
            )
        }
    }
}

export { server }
