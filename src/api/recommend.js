import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getPopularList() {
  // ajax
  const url = debug ? '/api/getPopularList' : 'http://www.kyr1e.top/kyr1e-music/api/getPopularList'
  const data = Object.assign({}, commonParam, {
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.error(e)
  })
}

export function getSongList(disstid) {
  const url = debug ? '/api/getCdInfo' : 'http://www.kyr1e.top/kyr1e-music/api/getCdInfo'
  const data = Object.assign({}, commonParam, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 222282923
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.error(e)
  })
}
