import conf from '../config.js'
export default {
    state: { 
        moneysumperiod:[{ userid: '', fullname: '', beforemoney: 0, totalin: 0, totalout: 0, inpay: 0, outpay: 0, endmoney: 0  }],
    
        moneyperiod:[{docdate: '', docnumber: 0, userid: '', totalin: 0, totalout: 0, inpay: 0, outpay: 0, fullname: '' }],       
        },

    mutations: {
          MONEYALLREPORT(state, payload) { state.moneysumperiod = payload },
      
          MONEYIDREPORT(state, payload) { state.moneyperiod = payload },
          },

    actions: {
        async getMoneyAllReport({ commit }, payload) {
              let beginperiod = payload.beginperiod || '2000-01-01'
              let endperiod = payload.endperiod || '2300-01-01'
              const res = await fetch(conf.urlapi+'/api/reports/moneyall/'+beginperiod+'/'+endperiod, {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
              commit('MONEYALLREPORT',  await res.json())    
              }, 
        
        async getMoneyIDReport({ commit }, payload) {
              let beginperiod = payload.beginperiod || '2000-01-01'
              let endperiod = payload.endperiod || '2300-01-01'
              const res = await fetch(conf.urlapi+'/api/reports/moneyid/'+payload.id+'/'+beginperiod+'/'+endperiod, {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
              commit('MONEYIDREPORT',  await res.json())    
              }, 
        },
    
    getters:{
        moneysumperiod: (state) =>  { return state.moneysumperiod},
        moneyperiod: (state) =>  { return state.moneyperiod},
        }

    }