<template>
    <div>
 
        <v-card elevation="12" class="mx-auto"  max-width="600"  > 
            <v-banner color="primary" dark elevation="4">{{$t('msg.signin')}} </v-banner>
            <v-row>
                <v-col class="ma-4"  >
                    <v-text-field :label='$t("msg.login")' :placeholder='$t("msg.loginph")' outlined v-model="login" ></v-text-field>
                    <v-text-field :label='$t("msg.password")' :placeholder='$t("msg.passwordph")' outlined v-model="password" type="password"></v-text-field> 
                    <v-col class="d-flex justify-space-between" >
                          <v-btn> {{$t('btn.remindPass')}} </v-btn>
                          <v-btn color="primary" @click="signIn" >{{$t('btn.signin')}}</v-btn>
                    </v-col>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>


<script>
import conf from '../config.js'
import { mapGetters, mapMutations } from "vuex";
export default {
  name: 'Loginpage',

  methods: { 
      ...mapMutations(['SETCURRENTUSER']),
      
      async signIn() {
          document.title = this.$t('msg.signin')
          const res = await fetch( conf.urlapi+'/api/users/login', {
                      method: 'POST', mode: 'cors', headers: {'Content-Type':'application/json'},
                      body: JSON.stringify({ login: this.login, password: this.password  })      
                      })
          const resp = res.status;
          if (resp == 200 ) {
              const token = await res.json();
              localStorage.currentuser = JSON.stringify(token)  ;
              this.SETCURRENTUSER( token)
              this.$router.go(-1);
              }
            else { console.log('Wrong PASS') }
          }
      },
   
  data: () => ({
      login: "",
      password: "",
      }),
  
  computed: {
    ...mapGetters(['currentuser']),
    }
   
}
</script>