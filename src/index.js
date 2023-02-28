class Suiv {
    constructor() {
        this.test = true
    }
    listen(host, port) {
        this.server = `http://${host}:${port}`
    }
}

export { Suiv }
