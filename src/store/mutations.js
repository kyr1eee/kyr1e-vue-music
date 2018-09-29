import * as types from './mutations-types'

const mutations = {
  [types.SET_SINGER]: function(state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING]: function(state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN]: function(state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST]: function(state, flag) {
    state.playList = flag
  },
  [types.SET_SEQUENCE_LIST]: function(state, flag) {
    state.sequenceList = flag
  },
  [types.SET_MODE]: function(state, flag) {
    state.mode = flag
  },
  [types.SET_CURRENT_INDEX]: function(state, flag) {
    state.currentIndex = flag
  }
}

export default mutations
