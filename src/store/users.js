
import conf from '../config.js'
export default {
    state: {
        logined : false,
        currentuser:[{ id: '', fullname: '', phonenumber:'', email:'', deliveryaddress:'', role:'', login:'', token:'', balance:0 }],
        users: [{ id: '', fullname: '', phonenumber: '', email: '', deliveryaddress: '', role: '', login: '', password: '', balance: 0 }],
        },

    mutations: {
        SETCURRENTUSER(state, payload){
            state.currentuser = payload   
            state.logined =  !payload.token=='' || null
            },

        USERSALL(state, payload) {state.users = payload },
        },


    actions: {
    async getUsersAll({ commit }) {
              const res = await fetch(conf.urlapi+'/api/users', {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token} })
              commit('USERSALL',  await res.json())    
              },
  
    async createUser({ dispatch }, payload) {
              const res = await fetch(conf.urlapi+'/api/users', {method: 'POST', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                        body: JSON.stringify({fullname: payload.fullname, 
                                              phonenumber: payload.phonenumber,
                                              email: payload.email,
                                              deliveryaddress: payload.deliveryaddress,
                                              role: payload.role,
                                              password: payload.password,
                                              login: payload.login
                                              }) 
                                  });
              dispatch('getUsersAll') ;  
              },
  
    async updateUser({ dispatch }, payload) {
              const res = await fetch(conf.urlapi+'/api/users/'+payload.id, {method: 'PUT', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                        body: JSON.stringify({  fullname: payload.fullname, 
                                                phonenumber: payload.phonenumber,
                                                email: payload.email,
                                                deliveryaddress: payload.deliveryaddress,
                                                role: payload.role,
                                                login: payload.login
                                                }) 
                                  });
              dispatch('getUsersAll') ;  
              },
  
    async deleteUser({ dispatch }, payload) {
              const res = await fetch(conf.urlapi+'/api/users/'+payload.id, {method: 'DELETE', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token}});
              dispatch('getUsersAll') ;  
              },
  
    async setNewPassword({ dispatch }, payload) {
              const res = await fetch(conf.urlapi+'/api/users/password/'+payload.id, {method: 'PUT', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.state.users.currentuser.token},
                    body: JSON.stringify({ password: payload.password}) });
      
              dispatch('getUsersAll') ;  
              },
  },

  getters: {
              logined : (state) =>  {return state.logined},
              currentuser: (state) =>  {return state.currentuser},
              users: (state) =>  {return state.users},
  }
  



}