interface ServerConfig {
    host?: string
    port?: number
    server?: string
    params?: RegExp
    functions?: {
        [key: string]: Function
    }
}

interface Routes {
    [key: string]: Route
}

interface Route {
    path: string
    params?: string[]
    methods?: string
}

interface Handler {
    req?: Request,
    path: string,
    params: StrObj,
    json: Function,
    render: Function
}

interface StrObj {
    [key: string]: string
}

export {
    ServerConfig,
    Routes,
    Route,
    Handler,
    StrObj
}
