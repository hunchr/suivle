import { ServerConfig } from "./interfaces";
import { getRoutes } from "./routes";
import { existsSync } from "fs";

class Suivle {
    server: string | null;
    constructor() {
        this.server = null;
    };
    serve(conf?: ServerConfig): Suivle {
        const port = conf?.port ?? 4000,
              host = conf?.host ?? "localhost",
              paramRegExp = conf?.params ?? /(?<=\/\W)[a-z-]+|(?<=\/)\d+/g,

        routes = getRoutes(conf?.routes ?? [
            "./src/models",
            "./src/views"
        ]);

        this.server = `http://${host}:${port}`;
        const serverLen = this.server.length;

        Bun.serve({
            port: port,
            hostname: host,
            fetch(req: Request): Response {
                const path = req.url.substring(serverLen);

                // Serve static file
                if (existsSync("./src/public" + path)) {
                    return new Response(Bun.file("./src/public" + path));
                }

                const route: any = routes[path.replace(paramRegExp, "*")] || { // TODO: types
                    path: "/error"
                };

                if (route.params) {
                    const routeParams: any = {};

                    path.match(paramRegExp)?.forEach((param, i) => {
                        routeParams[route.params[i]] = param;
                    });

                    route.params = routeParams;
                }

                console.log(route);
                return new Response(path);
            }
        });

        return this;
    };
};

export { Suivle };
