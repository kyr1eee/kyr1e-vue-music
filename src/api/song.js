import { commonParam, ERR_OK } from './config'
import { getUid } from 'common/js/uid'
import axios from 'axios'

// const debug = process.env.NODE_ENV !== 'production'

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParam, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    g_tk: '789399457',
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongsUrl(songs) {
  // https://y.qq.com/portal/player.html -> network -> musicu.fcg?callback=getplaysongvkey24214148511192346
  // response -> 'dl.stream.qqmusic.qq.com/' + req_0.data.midurlinfo.purl
  const url = '/api/getPurlUrl'
  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, commonParam, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    function request() {
      return axios.post(url, {
        comm: data,
        url_mid: urlMid
      }).then((response) => {
        const res = response.data
        if (res.code === ERR_OK) {
          let urlMid = res.url_mid
          if (urlMid && urlMid.code === ERR_OK) {
            const info = urlMid.data.midurlinfo[0]
            if (info && info.purl) {
              resolve(res)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry() {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}
// data: {"req":
//          {
//            "module":"CDN.SrfCdnDispatchServer",
//            "method":"GetCdnDispatch",
//            "param":{"guid":"8442417480","calltype":0,"userip":""}
//          },
//        "req_0":
//          {
//            "module":"vkey.GetVkeyServer",
//            "method":"CgiGetVkey",
//            "param":{"guid":"8442417480","songmid":["003jjoM94WLiTf"],"songtype":[0],"uin":"","loginflag":1,"platform":"20"}},
//            "comm":{"uin":"","format":"json","ct":20,"cv":0}
//          }

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
