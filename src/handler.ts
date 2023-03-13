interface Handler {
    [key: string]: any
}

const handler: Handler = {
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
