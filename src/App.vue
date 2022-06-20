<template>
<!-- App.vue -->

<v-app >

  <v-navigation-drawer v-model="drawer" temporary app>
    <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{$t("message")}}
            </v-list-item-title>
            <v-list-item-subtitle>
             <p>{{currentuser.fullname}}<br>{{currentuser.email}}</p> 
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
<v-list nav dense >
          
          <v-list-item v-for="item in items" :key="item.title" router :to="item.link">
         

            <v-list-item-icon >
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content >
              <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
            </v-list-item-content>
         
          </v-list-item>



        </v-list>
 
  </v-navigation-drawer>

  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="logined"></v-app-bar-nav-icon>
        <v-toolbar-title> {{$t("message")}}</v-toolbar-title>
  
        <v-spacer></v-spacer>
    
     
        <v-switch   @change="setTheme()" v-model="$vuetify.theme.dark"  :messages='$t("msg.dark")' ></v-switch>
      
     
                        <v-btn small plain :outlined="this.$i18n.locale=='ua'" @click="setlocale('ua')">UA</v-btn>
                        <v-btn small  plain :outlined="this.$i18n.locale=='en'" @click="setlocale('en')">EN</v-btn>
                        <v-btn small plain :outlined="this.$i18n.locale=='ru'" @click="setlocale('ru')">RU</v-btn>

                        
   
        <v-btn  @click="logoutUser" v-if="logined">
          <v-icon>mdi-logout</v-icon>  {{(!isMobile)?$t('pages.signout'):'' }}
          
        </v-btn>
  
        <v-btn  @click="logoutUser" v-if="!logined">
          <v-icon>mdi-login</v-icon>{{ $t('pages.signin') }}
        </v-btn>
  
 
    <!-- -->
  </v-app-bar>
<v-col >  </v-col>
  <!-- Sizes your content based upon application components -->
  <v-main >

    <!-- Provides the application the proper gutter -->

    <v-container fluid style="100%;" v-resize="onResize"> 
      <!-- If using vue-router  include='ReportMoney,Demands,ReportGoods,Turnovers' -->
      <keep-alive exclude="Demand,Turnover,Payments"> 
  <router-view></router-view>
</keep-alive>
  
    </v-container>
   
  </v-main>


</v-app>
</template>

<script>
import conf from './config.js';
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: 'App',
  methods: {
    ...mapMutations(['SETCURRENTUSER']),
      setlocale(loca) {
          this.$i18n.locale = loca;
          this.$vuetify.lang.current = loca
          localStorage.loca = loca
      },
      setTheme(){
        localStorage.darken = this.$vuetify.theme.dark;

      },
      logoutUser(){
        
        let empitytoken = '{"id":"","fullname":"","phonenumber":"","email":"","deliveryaddress":"","role":"","createdAt":"","updatedAt":"","token":""}'
        localStorage.currentuser = JSON.stringify(empitytoken)
        this.SETCURRENTUSER(JSON.parse( empitytoken))
     
        if (this.$router.history.current.name != 'Loginpage'){this.$router.push('/loginpage') }
        
        
      },
     onResize () {
      
      this.isMobile = (window.innerWidth<700)
    },


  },
  data: () => ({
    
    drawer: false,
   isMobile:false,
    group: null,
    items: [   
        { title: 'pages.demands', icon: 'mdi-file-document-edit',link: '/demands' },
        { title: 'pages.turnovers', icon: 'mdi-text-box-check',link: '/turnovers' },
        { title: 'pages.goods', icon: 'mdi-food-variant',link: '/goods' },
        { title: 'pages.users', icon: 'mdi-account-group',link: '/users' },
        { title: 'pages.payments', icon: 'mdi-cash-multiple',link: '/payments' },
        { title: 'pages.reportmoney', icon: 'mdi-account-cash',link: '/reportmoney' },
        { title: 'pages.reportgoods', icon: 'mdi-clipboard-flow-outline',link: '/reportgoods' },
        { title: 'pages.about', icon: 'mdi-information-variant',link: '/about' },

      ],

  }),
    watch: {
    group () {
      this.drawer = false
    },
 

  



  },
  computed: {
        
       //  user: 'auth/user'
    //...mapState(['all.currentuser','all.logined']),
    ...mapGetters(['currentuser','logined']),
    
  },



async  created() {
       this.$vuetify.theme.dark = localStorage.darken == "true";
       let loca = localStorage.loca||'ua' ;
       this.$i18n.locale = loca;
       this.$vuetify.lang.current = loca


      let token =  JSON.parse(localStorage.currentuser|| '{"id": "", "token":""}') ;
      
      this.SETCURRENTUSER( token)

        
      const res = await fetch(conf.urlapi+'/api/users/chktoken', {method: 'GET', mode: 'cors', headers: {'Content-Type':'application/json', 'x-access-token': this.currentuser.token} })
      
      if (res.status!=200) {this.logoutUser()}
 
      this.onResize;
     
  }
};
</script>
