import { readdirSync, statSync } from 'fs'

interface Routes {
    [key: string]: Route
}

interface Route {
    handler?: Function
    params?: string[]
    static?: boolean
}

const routes: Routes = {},
      methodRe = /(?<=\.)(get|post|put|delete)(?=\.)/,
      routeRe = new RegExp(
        `^.*?(models|views|public)|\\.?(${methodRe.toString().slice(1, -1)})?\\.[a-z]+$`, 'g'
      ),

getFiles = (dirs: string[], files: string[] = []) => {
    dirs.forEach(dir => {
        readdirSync(dir).forEach(file => {
            statSync(file = dir + '/' + file).isDirectory() ?
                files = getFiles([file], files) :
                files.push(file)
        })
    })
    
    return files
}

getFiles(['models', 'views', 'public'].map(dir => './src/' + dir)).forEach(file => {
    const route: Route = {}

    // Public
    if (file[6] === 'p') {
        route.static = true
        file = file.replace(/^.*?public/, '')
    }
    else {
        const params = file.match(/(?<=\[).*?(?=\])/g)
        route.handler = require(`../../.${file}`).handle
        file = (file[6] === 'm' ? file.match(methodRe)?.[0].toUpperCase() + '/api' : '') +
            file.replace(routeRe, '').replace(/\[.*?\]/g, '#') // Replace params

        if (params) {
            route.params = params
        }
    }

    routes[file] = route
})

export {
    Routes,
    routes
}
