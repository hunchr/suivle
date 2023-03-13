interface Handler {
    [key: string]: any
}

const handler: Handler = {
    json: (res: number | object): [string, object] | object => {
        let status = 200

        if (typeof res === 'number') {
            status = res
            res = { status: res }
        }

        return handler.tmp.api ?
            [JSON.stringify(res), {
                headers: { 'Content-Type': 'application/json' },
                status: status
            }] :
            res
    },
    html: (res: number | string, errMsg?: string): object => {
        let status = 200
    
        if (typeof res === 'number') {
            status = res as number
            res = require('../../../src/modules/error').handle(errMsg)
        }
    
        return [res as string, {
            headers: handler.headers,
            status: status
        }]
    },
    getHeader: (name: string) => (
        handler.tmp.req.headers.get(name)
    ),
    getParam: (name: string) => {
        if (!handler.tmp.params) {
            handler.tmp.params = {}

            handler.path.match(handler.params)?.forEach((param: string, i: number) => {
                handler.tmp.params[handler.tmp.route.params[i]] = param
            })
        }

        return handler.tmp.params[name]
    },
    getSearchParam: (name: string) => {
        if (!handler.tmp.searchParams) {
            handler.tmp.searchParams = {}

            new URL(handler.tmp.req.url).searchParams?.forEach((value, name) => {
                handler.tmp.searchParams[name] = value
            })
        }

        return handler.tmp.searchParams[name]
    },
    getCookie: (name: string) => {
        if (!handler.tmp.cookies) {
            handler.tmp.cookies = {}

            handler.getHeader("cookie")?.split('; ').forEach((cookie: string) => {
                const i = cookie.indexOf('=')
                handler.tmp.cookies[cookie.slice(0, i)] = cookie.slice(i + 1)
            })
        }
    
        return handler.tmp.cookies[name]
    }
}

export {
    Handler,
    handler
}
