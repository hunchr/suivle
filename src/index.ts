import { server } from './server'
import { Routes, routes } from './router'
import { Handler, StrObj, handler } from './handler'

interface ServerConfig {
    port?: number
    host?: string
    params?: RegExp
    headers?: StrObj,
    globals?: { [key: string]: any }
}

class Suivle {
    port: number
    host: string
    routes: Routes
    constructor(conf: ServerConfig = {}) {
        this.port = conf.port ?? 4000
        this.host = conf.host ?? 'localhost'
        this.routes = routes
        handler.params = conf.params ?? /(?<=\/\W)[a-z-]+|(?<=\/)\d+/g
        handler.headers = conf.headers ?? {
            'Content-Type': 'text/html charset=utf-8', 
            'Content-Security-Policy': "default-src 'none'; base-uri 'self'; connect-src 'self'; manifest-src 'self'; img-src 'self'; font-src 'self'; style-src 'self'; script-src 'nonce-0123456789' 'strict-dynamic'; require-trusted-types-for 'script'", // TODO: Nonce
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block'
        }

        Object.keys(conf.globals ?? {}).forEach((key) => {
            handler[key] = conf.globals?.[key]
        })

        Bun.serve(server(this))
    }
}

export { Suivle, Handler }
