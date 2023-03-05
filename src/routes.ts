import { Routes, Route } from "./interfaces";
import { readdirSync, statSync } from "fs";

const getFiles = (dirs: string[], files: string[] = []) => {
    dirs.forEach(dir => {
        readdirSync(dir).forEach(file => {
            statSync(file = dir + "/" + file).isDirectory() ?
                files = getFiles([file], files) :
                files.push(file);
        });
    });
    
    return files;
},

getRoutes = (dirs: string[]) => {
    const routes: Routes = {};

    getFiles(dirs).forEach(file => {
        let url: string = file.replace(/^\.\/src\/[a-z]+|(\.[crud])?\.[a-z]+$/g, "") // Remove file extension
        const params = file.match(/(?<=\[).*?(?=\])/g), // Match params
              method = file.match(/(?<=\.)[crud](?=\.)/)?.[0],
              route: Route = { path: url };

        url = url.replace(/\[.*?\]/g, "*"); // Remove params

        if (params) {
            route.params = params;
        }
        if (method) {
            if (routes[url = "/api" + url]) {
                return routes[url].methods += method;
            }

            route.methods = method;
        }

        routes[url] = route;
    });

    return routes;
};

export { getRoutes };
