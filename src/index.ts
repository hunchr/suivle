import { ServerConfig, Handler } from "./interfaces";
import { CRUD, getRoutes } from "./routes";
import { existsSync } from "fs";

class Suivle {
    host: string;
    port: number;
    constructor(conf: ServerConfig = {}) {
        this.port = conf.port ?? 4000,
        this.host = conf.host ?? "localhost";

        const serverLen = `http://${this.host}:${this.port}`.length,
              paramRegExp = conf.params ?? /(?<=\/\W)[a-z-]+|(?<=\/)\d+/g,
              routes = getRoutes(["./src/models", "./src/views"]),
        
        handler: Handler = {...conf.functions ?? {}, ...{
            path: "",
            params: {},
            json: (res: number | object): [object, object] => (
                typeof res === "number" ? [{status: res}, {status: res}] : [res, {status: 200}]
            ),
            render: (res: number | string, errMsg?: string): Response => {
                let status = 200;

                if (errMsg) {
                    status = res as number;
                    res = `ERROR_${errMsg}`; // TODO: Include error file
                }

                return new Response(res as string, {
                    headers: {
                        "Content-Type": "text/html; charset=utf-8" // TODO: CSP
                    },
                    status: status
                });
            }
        }};

        Bun.serve({
            port: this.port,
            hostname: this.host,
            fetch(req) {
                const path = handler.path = req.url.substring(serverLen);

                // Serve static file
                if (existsSync("./src/public" + path)) {
                    return new Response(Bun.file("./src/public" + path));
                }

                const route = routes[path.replace(paramRegExp, "*")];
                
                // Respond with error page
                if (!route) {
                    return path.slice(0, 5) === "/api/" ?
                        Response.json(...handler.json(404)) :
                        handler.render(404, "NOT_FOUND");
                }
                // Parse parameters
                if (route.params) {
                    handler.params = {};

                    path.match(paramRegExp)?.forEach((param, i) => {
                        handler.params[route.params?.[i] as string] = param;
                    });
                }
                // Models: Respond with JSON
                if (route.methods) {
                    const method = CRUD[req.method];

                    return Response.json(
                        ...route.methods.includes(method) ?
                            require(`../../../src/models${route.path}.${method}`).handle(handler) :
                            handler.json(405)
                    );
                }

                return require(`../../../src/views${route.path}`).handle(handler);
            }
        });

        return this;
    };
};

export { Suivle };
