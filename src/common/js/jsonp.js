// 封装jsonp方法
import originJSONP from 'jsonp'

// 暴露该方法
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') === -1 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    // origin jsonp
    // get json data
    // callback返回数据
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// jsonp数据字符串拼接
// google.com search=aaa page=1 => google.com?search=aaa&page=1
function param(data) {
  let url = ''
  for (var k in data) {
    let val = data[k] === undefined ? '' : data[k]
    url += `&${k}=${encodeURIComponent(val)}`
  }
  return url ? url.substring(1) : ''
}
