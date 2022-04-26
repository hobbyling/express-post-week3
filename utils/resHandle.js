exports.successHandle = function (res, data = []) {
  res.status(200).json({
    status: "success",
    data: data
  })
}

exports.errorHandle = function (res, code, message = []) {
  res.status(code).json({
    status: "false",
    message: "欄位格式錯誤",
    error: message
  })
}