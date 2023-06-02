const logger = (req, res, next) => {
  const {method, protocol, hostname,originalUrl } = req
  const port = process.env.PORT
  const timestamp = new Date().toISOString()
  console.log(`[${method}]: ${protocol}://${hostname}:${port}${originalUrl} ${timestamp}`)
  next()
}

module.exports = logger