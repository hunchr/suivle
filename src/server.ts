import { Suivle } from './index'
import { handler } from './handler'

const server = (app: Suivle) => {
    return {
        port: app.port,
        hostname: app.host,
        fetch: (req: Request) => {
            handler.path = req.url.replace(/(.*?\/){3}|\?.*/g, '')
            handler._api = handler.path.slice(0, 4) === 'api/'
            handler._route = app.routes[
                `${handler._api ? req.method : ''}/${handler.path.replace(handler.params, '#')}`
            ]

            return new Response(
                ...handler._route ? (
                    handler._route.static ?
                        [Bun.file('./src/public/' + handler.path)] :
                        handler._route.handler(handler)
                ) :
                handler._api ?
                    handler.json(404) :
                    handler.html(404, 'NOT_FOUND') // TODO: ErrMsg
            )
        }
    }
}

export { server }
