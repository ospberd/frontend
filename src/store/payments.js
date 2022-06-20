import conf from '../config.js'
export default {
    state: { 
            payments: [{ id: '', docdate: '',  userid: '', 	fullname: '',  inpay: 0, outpay: 0, comment: ''}],
            },

    mutations: {
        PAYMENTSALL(state, payload) {state.payments = payload },
        },

    actions: {
        async getPaymentsAll({ commit }) {
            const res = await fetch(conf.urlapi+'/api/payments', {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
            commit('PAYMENTSALL',  await res.json())    
            },
          
        async createPayment({ dispatch }, payload) {
            
            const res = await fetch(conf.urlapi+'/api/payments', {method: 'POST', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                body: JSON.stringify({  docdate: payload.docdate||'', 
                                        userid: payload.userid,
                                        email: payload.email,
                                        inpay: payload.inpay,
                                        outpay: payload.outpay,
                                        comment: payload.comment
                                        }) 
                              });
            dispatch('getPaymentsAll') ;  
            },
          
        async updatePayment({ dispatch }, payload) {
            const res = await fetch(conf.urlapi+'/api/payments/'+payload.id, {method: 'PUT', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                        body: JSON.stringify({  docdate: payload.docdate,  
                                                userid: payload.userid,  
                                                email: payload.email,  
                                                inpay: payload.inpay,  
                                                outpay: payload.outpay,  
                                                comment: payload.comment
                                                }) 
                            });
            dispatch('getPaymentsAll') ;  
            },
          
        async deletePayment({ dispatch }, payload) {
            const res = await fetch(conf.urlapi+'/api/payments/'+payload.id, {method: 'DELETE', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token}});
            dispatch('getPaymentsAll') ;  
            },
      
        },

    getters:{
        
        commentlist: (state) =>  { return  [...new Set(state.payments.map(item => item.comment))]},     

        payments: (state) =>  { return state.payments}

        }

}