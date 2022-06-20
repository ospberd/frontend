import conf from '../config.js'
export default {
    state: {
        turnoverssumperiod: [{goodsid: '', groupname: '', beginquantity: 0, quantityin: 0, totalin: 0, quantityout: 0, totalout: 0, endquantity: 0, goods: ''}],
    
        turnoversperiod: [{ headid: '', goodsid: '', userid: '', goods: '', groupname: '', docdate: '', docnumber: 0, fullname: '', quantityin: 0,totalin: 0, quantityout: 0, totalout: 0   }],
        },

    mutations: {
          GOODSALLREPORT(state, payload) { state.turnoverssumperiod = payload },
      
          GOODSIDREPORT(state, payload) { state.turnoversperiod = payload },
          },


    actions: {
        async getGoodsAllReport({ commit }, payload) {
            let beginperiod = payload.beginperiod || '2000-01-01'
            let endperiod = payload.endperiod || '2300-01-01'
            const res = await fetch(conf.urlapi+'/api/reports/goodsall/'+beginperiod+'/'+endperiod, {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
            commit('GOODSALLREPORT',  await res.json())    
            }, 
     
        async getGoodsIDReport({ commit }, payload) {
            let beginperiod = payload.beginperiod || '2000-01-01'
            let endperiod = payload.endperiod || '2300-01-01'
            const res = await fetch(conf.urlapi+'/api/reports/goodsid/'+payload.id+'/'+beginperiod+'/'+endperiod, {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
            commit('GOODSIDREPORT',  await res.json())    
            }, 
 
        },

    getters: {
        turnoverssumperiod : (state) =>  {return state.turnoverssumperiod},
        turnoversperiod: (state) =>  {return state.turnoversperiod},
        }
  



}