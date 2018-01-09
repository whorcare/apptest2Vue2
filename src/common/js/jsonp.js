import originJSONP from 'jsonp' // 引入了第三方jsonp库

export default function jsonp(url, data, optipon) { // 用Promise封装一个jsonp 方法对外暴露
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => { // Promise向后端发送请求
    originJSONP(url, optipon, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) { // 拼接URL地址
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
