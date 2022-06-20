import conf from '../config.js'
export default {
    state: { 
        turnovers:[{
                    id: '',demandid: '',docdate: '',docnumber: '',userid: '',totalin: 0,totalout: 0 ,comment: '',delivered: 0, returned: 0,
                    fullname: '', phonenumber: '', email: '', deliveryaddress: '', balance: 0,
                    lines:[
                        { id: '', headid: '', goodsid: '', quantityin: 0, quantityout: 0, 	pricein: 0, 	priceout: 0, 	totalin: 0, 	totalout: 0,
                          goods: '', 	measure: '', remainder: 0, 	reserved: 0, 	currentprice: 0
                          }] 
                    }],

        activeturnoverlines:[{ id: '', headid: '', goodsid: '', quantityin: 0, quantityout: 0, 	pricein: 0, 	priceout: 0, 	totalin: 0, 	totalout: 0,
                               goods: '', 	measure: '', remainder: 0, 	reserved: 0, 	currentprice: 0}] ,
        },

    mutations: {
        TURNOVERSALL(state, payload) {state.turnovers = payload}, 
      
        TURNOVERDETAIL(state, payload) {
            let theTurnover = state.turnovers.find(turnover => turnover.id === payload[0].id)
            theTurnover = payload[0]     
            state.activeturnoverlines = theTurnover.lines
            },
        },

    actions: {
        async getTurnoversAll({ commit }) {
            const res = await fetch(conf.urlapi+'/api/turnovers', {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
            commit('TURNOVERSALL',  await res.json())    
            },   
          
        async getTurnoverByID({ commit }, payload) {
            const res = await fetch(conf.urlapi+'/api/turnovers/'+payload.id, {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
            commit('TURNOVERDETAIL',  await res.json())    
            },  
          
        async deleteTurnover({ dispatch }, payload) {
            const res = await fetch(conf.urlapi+'/api/turnovers/'+payload.id, {method: 'DELETE', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token}});
            dispatch('getTurnoversAll') ;  
            },
          
        async createTurnover({ dispatch }, payload) {
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

             
          
              const res = await fetch(conf.urlapi+'/api/turnovers', {method: 'POST', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                    body: JSON.stringify({  docdate: payload.docdate||'', 
                                            userid: payload.userid,
                                            docnumber: payload.docnumber,
                                            totalin: payload.totalDemand,
                                            totalout: payload.totalConfirm,
                                            delivered: payload.delivered ? 1 : 0,
                                            returned: payload.returned ? 1 : 0,
                                            comment: payload.comment,
                                            lines:  payload.lines
                                            })
                                 });
          
              dispatch('getTurnoversAll') ;  
              },
          
        async updateTurnover({ dispatch }, payload) {
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
          
                const res = await fetch(conf.urlapi+'/api/turnovers/'+payload.id, {method: 'PUT', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                                body: JSON.stringify({id: payload.id,
                                                      docdate: payload.docdate, 
                                                      userid: payload.userid,
                                                      docnumber: payload.docnumber,
                                                      totalin: payload.totalDemand,
                                                      totalout: payload.totalConfirm,
                                                      delivered: payload.delivered ? 1 : 0,
                                                      returned: payload.returned ? 1 : 0,
                                                      comment: payload.comment,
                                                      lines:  payload.lines
                                                      }) 
                                    });
                dispatch('getTurnoversAll') ;  
                },
      
        },

    getters:{
        turnovercommentlist: (state) =>  {return  [...new Set(state.turnovers.map(item => item.comment))] },   
        turnovers: (state) =>  { return state.turnovers},
        activeturnoverlines: (state) =>  { return state.activeturnoverlines},
        }

}