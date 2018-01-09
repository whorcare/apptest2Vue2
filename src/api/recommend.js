import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getRecommend() { // 获取首页轮播图数据
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, { // Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
