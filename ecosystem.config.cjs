// =============================================================================
// Port Configuration - All ports defined here as single source of truth
// =============================================================================
const PORTS = {
  API: 5570,    // Express API server
  UI: 5571       // Vite dev server (client)
};

module.exports = {
  PORTS, // Export for other configs to reference

  apps: [
    {
      name: 'openworld-server',
      script: 'server/index.js',
      cwd: __dirname,
      interpreter: 'node',
      env: {
        NODE_ENV: 'development',
        PORT: PORTS.API,
        HOST: '0.0.0.0'
      },
      watch: false
    },
    {
      name: 'openworld-ui',
      script: 'node_modules/.bin/vite',
      cwd: `${__dirname}/client`,
      args: `--host 0.0.0.0 --port ${PORTS.UI}`,
      env: {
        NODE_ENV: 'development',
        VITE_PORT: PORTS.UI
      },
      watch: false
    }
  ]
};
