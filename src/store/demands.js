import conf from '../config.js'
export default {
    state: { 
        demands: [{ 
                    id: '', docdate: '', docnumber: '',  userid: '', 	fullname: '', 	phonenumber: '', 	email: '', 	deliveryaddress: '', 
                    totalDemand: 0, totalConfirm: 0, balance: 0,  comment: '', opened: true,
                    lines: [{  
                              id: '', headid: '', goodsid: '',  goods: '', 	measure: '', 	quantityDemand: 0, 	priceDemand: 0, 	totalDemand: 0,  
                              quantityConfirm: 0, 	priceConfirm: 0, 	totalConfirm: 0,  remainder: 0, 	reserved: 0, 	currentprice: 0 
                            }]  
                    }],

        activelines: [{  
                        id: '', headid: '', goodsid: '',  goods: '', 	measure: '', 	quantityDemand: 0, 	priceDemand: 0, 	totalDemand: 0,  
                        quantityConfirm: 0, 	priceConfirm: 0, 	totalConfirm: 0,  remainder: 0, 	reserved: 0, 	currentprice: 0 
                        }],

        },

    mutations: {
        DEMANDSALL(state, payload) { state.demands = payload   },  
            
        DEMANDETAIL(state, payload) {
            let theDemand = state.demands.find(demand => demand.id === payload[0].id)
            theDemand = payload[0]     
            state.activelines = theDemand.lines
            },

        },

    actions: {
        async getDemandsAll({ commit }) {
            const res = await fetch(conf.urlapi+'/api/demands', {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
            commit('DEMANDSALL',  await res.json())    
            },   
          
        async getDemandByID({ commit }, payload) {
            const res = await fetch(conf.urlapi+'/api/demands/'+payload.id, {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
            commit('DEMANDETAIL',  await res.json())    
            },  
          
        async deleteDemand({ dispatch }, payload) {
            const res = await fetch(conf.urlapi+'/api/demands/'+payload.id, {method: 'DELETE', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token}});
            dispatch('getDemandsAll') ;  
            },
          
        async createDemand({ dispatch }, payload) {
            payload.lines.forEach(element => {
                element.createdAt = ''; delete element.createdAt
                element.updatedAt = ''; delete element.updatedAt
                element.goods = ''; delete element.goods
                element.measure = ''; delete element.measure
                element.remainder = 0; delete element.remainder
                element.reserved = 0; delete element.reserved
                element.currentprice = 0; delete element.currentprice
                });

            payload.fullname = ''; delete payload.fullname
            payload.phonenumber = ''; delete payload.phonenumber
            payload.email = ''; delete payload.email
            payload.deliveryaddress = ''; delete payload.deliveryaddress
            payload.balance = 0; delete payload.balance

            
          
            const res = await fetch(conf.urlapi+'/api/demands', {method: 'POST', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                   body: JSON.stringify({ docdate: payload.docdate||'',  
                                          userid: payload.userid,
                                          docnumber: payload.docnumber,
                                          totalDemand: payload.totalDemand,
                                          totalConfirm: payload.totalConfirm,
                                          opened: payload.opened ? 1 : 0,
                                          comment: payload.comment,
                                          lines:  payload.lines
                                          }) 
                                });
            dispatch('getDemandsAll') ;  
            },
          
        async updateDemand({ dispatch }, payload) {
                  payload.lines.forEach(element => {
                      element.createdAt = ''; delete element.createdAt
                      element.updatedAt = ''; delete element.updatedAt
                      element.goods = ''; delete element.goods
                      element.measure = ''; delete element.measure
                      element.remainder = 0; delete element.remainder
                      element.reserved = 0; delete element.reserved
                      element.currentprice = 0; delete element.currentprice
                      });
                  payload.fullname = ''; delete payload.fullname
                  payload.phonenumber = ''; delete payload.phonenumber
                  payload.email = ''; delete payload.email
                  payload.deliveryaddress = ''; delete payload.deliveryaddress
                  payload.balance = 0; delete payload.balance
          
                  const res = await fetch(conf.urlapi+'/api/demands/'+payload.id, {method: 'PUT', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                                         body: JSON.stringify({ id: payload.id,
                                                                docdate: payload.docdate, 
                                                                userid: payload.userid,
                                                                docnumber: payload.docnumber,
                                                                totalDemand: payload.totalDemand,
                                                                totalConfirm: payload.totalConfirm,
                                                                opened: payload.opened ? 1 : 0,
                                                                comment: payload.comment,
                                                                lines:  payload.lines}) 
                                      });
                dispatch('getDemandsAll') ;  
                },
        },

    getters:{

        demandcommentlist: (state) =>  { return  [...new Set(state.demands.map(dem => dem.comment))] },  
        
        demands: (state) =>  { return state.demands},
        
        activelines: (state) =>  { return state.activelines},
        }

}