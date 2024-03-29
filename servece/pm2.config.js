const isDev = process.env.NODE_ENV === "dev";
module.exports = {
  apps: [
      {
        name: "feixiongshop-serve",
        script: "index.js",
        instances: '1',
        watch: false,
        ignore_watch: [
            // 从监控目录中排除
            "node_modules",
            "public",
            "static",
            "logs",
            "log-dev",
            "log-pro",
            "mock-data",
            "log",
            "crash"
        ],
        max_memory_restart: '300M'
      }
  ]
}
