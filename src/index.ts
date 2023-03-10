import { server } from './server'
import { Routes, routes } from './router'
import { Handler, handler } from './handler'

class ServerConfig {
    port?: number
    host?: string
    params?: RegExp
    globals?: Handler
}

class Suivle {
    port: number
    host: string
    params: RegExp
    routes: Routes
    constructor(conf: ServerConfig) {
        this.port = conf.port ?? 4000
        this.host = conf.host ?? 'localhost'
        this.params = conf.params ?? /(?<=\/\W)[a-z-]+|(?<=\/)\d+/g
        this.routes = routes

        Object.keys(conf.globals ?? {}).forEach(key => {
            handler[key] = conf.globals?.[key]
        })

        Bun.serve(server(this))
    }
}

export { Suivle }
