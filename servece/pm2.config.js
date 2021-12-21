const isDev = process.env.NODE_ENV === "dev";
module.exports = {
  apps: [
      {
          name: "feixiongshop-serve",
          script: "index.js",
          watch: true,
          ignore_watch: [
              // 从监控目录中排除
              "node_modules",
              "static",
              "logs",
              "log-dev",
              "log-pro",
              "crash"
          ],
        // "log_date_format": "YYYY-MM-DD HH:mm",
        // "out_file": isDev ? "log-dev/out_file.log" : "log-pro/out_file.log",
        // "error_file": isDev ? "log-dev/error_file.log" : "log-pro/error_file.log",
        // combine_logs: true,
        instances: 'max',
        max_memory_restart: '500M'
      }
  ]
}
