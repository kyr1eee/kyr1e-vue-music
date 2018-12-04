import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'

export function getHotkey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    needNewCode: 1,
    g_tk: 1908488964
  })
  return jsonp(url, data, options)
}
