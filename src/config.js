/* eslint no-process-env: false */

// one day https://github.com/indexzero/nconf

const config = {}

config.port = process.env.PORT || 8090

config.ip = process.env.IP || '0.0.0.0'

config.env = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production'

export default config
