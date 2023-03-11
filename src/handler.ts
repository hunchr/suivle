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

        return handler._api ?
            [JSON.stringify(res), {
                headers: { 'Content-Type': 'application/json' },
                status: status
            }] :
            res
    },
    html: (res: number | string, errMsg?: string): object => {
        let status = 200
    
        if (errMsg) {
            status = res as number
            res = `ERROR_${errMsg}` // TODO: Include error file
        }
    
        return [res as string, {
            headers: {
                'Content-Type': 'text/html charset=utf-8', 
                'Content-Security-Policy': "default-src 'self'; connect-src 'self'; img-src 'self'" // TODO: CSP
            },
            status: status
        }]
    },
    getParam: (name: string) => {
        const params: { [key: string]: string } = {}

        if (!handler._parsedParams) {
            handler.path.match(handler.params)?.forEach((param: string, i: number) => {
                params[handler._route.params[i]] = param
            })

            handler.params = params
            handler._parsedParams = true
        }

        return handler.params[name]
    }
}

export {
    Handler,
    handler
}
