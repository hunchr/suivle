interface ServerConfig {
    host?: string;
    port?: number;
    server?: string;
    params?: RegExp;
    routes?: string[];
};

interface Routes {
    [key: string]: Route;
};

interface Route {
    path: string;
    params?: string[];
    methods?: string;
};

export { ServerConfig, Routes, Route };

