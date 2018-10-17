import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    needNewCode: 1,
    g_tk: 1685728446
  })
  return jsonp(url, data, options)
}
