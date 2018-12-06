import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'
import axios from 'axios'

export function getHotkey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    needNewCode: 1,
    g_tk: 1908488964
  })
  return jsonp(url, data, options)
}

export function searchMusic(query, page, zhida, perpage) {
  const url = '/api/search'
  // 坑: 因format:'jsonp',返回jsonp字符串callback:"{...}",现改为json返回json数据
  const data = Object.assign({}, commonParam, {
    g_tk: 1031425934,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}
