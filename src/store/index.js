import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sysconfig: {} // 系统参数
  },
  mutations: {
    setSysconfig(state, sysconfig) {
      state.sysconfig = sysconfig
    }
  },
  getters: {
    sysconfig: state => state.sysconfig
  },
  actions: {},
  modules: {}
})
