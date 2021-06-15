let env = {
    NODE_ENV: "development",
    production: require("./env.production"),
    development: require("./env.development"),
}

if(!process.env.NODE_ENV){
    process.env.NODE_ENV = env.NODE_ENV;
} else {
    env.NODE_ENV = process.env.NODE_ENV;
}

for (const envVar in env[env.NODE_ENV]) {
    if (env[env.NODE_ENV].hasOwnProperty(envVar)) {
        if (!process.env.hasOwnProperty(envVar)) {
            process.env[envVar] = env[env.NODE_ENV][envVar];
        }
    }
}