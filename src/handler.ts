interface Handler {
    path: string,
    params: RegExp,
    headers: StrObj
    tmp: { [key: string]: any }
    getHeader(name: string): string,
    getParam(name: string): string,
    getSearchParam(name: string): string,
    getCookie(name: string): string,
    [key: string]: any
}

interface StrObj {
    [key: string]: string
}

const handler: Handler = {
    path: '',
    params: /./,
    headers: {},
    tmp: {},
    getHeader: (name) => (
        handler.tmp.req.headers.get(name)
    ),
    getParam: (name) => {
        if (!handler.tmp.params) {
            handler.tmp.params = {}

            handler.path.match(handler.params)?.forEach((param: string, i: number) => {
                handler.tmp.params[handler.tmp.route.params[i]] = param
            })
        }

        return handler.tmp.params[name]
    },
    getSearchParam: (name) => {
        if (!handler.tmp.searchParams) {
            handler.tmp.searchParams = {}

            new URL(handler.tmp.req.url).searchParams?.forEach((value, name) => {
                handler.tmp.searchParams[name] = value
            })
        }

        return handler.tmp.searchParams[name]
    },
    getCookie: (name) => {
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
    StrObj,
    handler
}
