import { file } from 'bun'
import { Suivle } from 'suivle'
import { handler } from './handler'

const server = (app: Suivle) => {
    return {
        port: app.port,
        hostname: app.host,
        fetch: (req: Request) => {
            handler.path = req.url.replace(/(.*?\/){3}|\?.*/g, ''),
            handler._api = handler.path.slice(0, 4) === 'api/',
            handler._route = app.routes[
                `${handler._api ? req.method : ''}/${handler.path.replace(/\[.*?\]/g, '#')}`
            ]

            return new Response(
                ...handler._route ? (
                    handler._route.static ?
                        [file('./src/public/' + handler.path)] :
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
