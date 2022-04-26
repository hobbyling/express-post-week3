exports.checkIdFormat = function (param) {
  return param.match(/^[0-9a-fA-F]{24}$/) === null
    ? false
    : true
}