
import conf from '../config.js'
export default {
  
    
    state: {
        goods: [{ id: '', groupname: '', goods: '', description: '', picture: '', measure: '', price: 0, barcode: '', remainder: 0, reserved: 0, }],        
        },

    mutations: {
        GOODSALL(state, payload) { state.goods = payload},
        },
    
    actions: {
        async getGoodsAll({ commit }) {
              const res = await fetch(conf.urlapi+'/api/goods', {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json'} })
              commit('GOODSALL',  await res.json())    
              },
    
        async createGoods({ dispatch }, payload) {
              const res = await fetch(conf.urlapi+'/api/goods', {method: 'POST', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                    body: JSON.stringify({  groupname: payload.groupname, 
                                            goods: payload.goods,
                                            description: payload.description,
                                            picture: payload.picture,
                                            measure: payload.measure,
                                            price: payload.price,
                                            barcode: payload.barcode 
                                          }) 
                                });
              dispatch('getGoodsAll') ;  
              },
    
        async updateGoods({ dispatch }, payload) {
              const res = await fetch(conf.urlapi+'/api/goods/'+payload.id, {method: 'PUT', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                      body: JSON.stringify({id: payload.id,
                                            groupname: payload.groupname, 
                                            goods: payload.goods,
                                            description: payload.description,
                                            picture: payload.picture,
                                            measure: payload.measure,
                                            price: payload.price,
                                            barcode: payload.barcode 
                                            }) 
                            });
              dispatch('getGoodsAll') ;  
              },

        async deleteGoods({ dispatch }, payload) {
              const res = await fetch(conf.urlapi+'/api/goods/'+payload.id, {method: 'DELETE', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token}});
              dispatch('getGoodsAll') ;  
              },
    
        },

    getters: {

        goods: (state) => { return state.goods },

        grouplist: (state) => { return  [...new Set(state.goods.map(item => item.groupname))] },

        measurelist: (state) =>  { return  [...new Set(state.goods.map(bill => bill.measure))] },
        
        }

}