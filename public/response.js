const success = (res, code, options) => {
  const { data, message } = options
  return res.status(code || 200).json({
    status: 'success',
    code,
    data,
    message
  })
}

const failure = (res, code, options) => {
  const { message } = options
  return res.status(code || 500).json({
    status: 'failure',
    code,
    message
  })
}

module.exports = { success, failure }
