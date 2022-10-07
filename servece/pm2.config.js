const isDev = process.env.NODE_ENV === "dev";
module.exports = {
  apps: [
      {
          name: "feixiongshop-serve",
          script: "index.js",
        instances: 'max',
        max_memory_restart: '150M'
      }
  ]
}
