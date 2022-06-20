import Vue from 'vue'
import Vuex from 'vuex'

import goods from './goods'
import users from './users'
import payments from './payments'
import demands from './demands'
import turnovers from './turnovers'
import reportgoods from './reportgoods'
import reportmoney from './reportmoney'

Vue.use(Vuex)

export default new Vuex.Store({
  
    modules: {
      goods,  users, payments, demands, turnovers, reportgoods, reportmoney
    
    }
})
