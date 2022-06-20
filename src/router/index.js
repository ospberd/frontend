import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from '../views/Goods.vue'
import Loginpage from '../views/Loginpage.vue'
import Users from '../views/Users.vue'
import Payments from '../views/Payments.vue'
import Demands from '../views/Demands.vue'
import Demand from '../views/Demand.vue'
import Turnovers from '../views/Turnovers.vue'
import Turnover from '../views/Turnover.vue'
import ReportMoney from '../views/ReportMoney.vue'
import ReportGoods from '../views/ReportGoods.vue'


Vue.use(VueRouter)

const routes = [

  {
    path: '/goods',
    name: 'Goods',
    component: Goods
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/loginpage',
    name: 'Loginpage',
    component: Loginpage
  },
  {
    path: '/payments',
    name: 'Payments',
    component: Payments
  },  
  {
    path: '/payment/:id',
    name: 'Payment',
    component: Payments
  },  
  {
    path: '/demands',
    name: 'Demands',
    component: Demands
  },

  { path: '/demand/:id?', 
    name: 'Demand',
    component: Demand 
  },
  {
    path: '/turnovers',
    name: 'Turnovers',
    component: Turnovers
  },

  { path: '/turnover/:id?', 
    name: 'Turnover',
    component: Turnover 
  },

  { path: '/turndem/:id?', 
  name: 'TurnDem',
  component: Turnover 
},

  { path: '/reportmoney', 
    name: 'ReportMoney',
    component: ReportMoney 
  },
  { path: '/reportgoods', 
    name: 'ReportGoods',
    component: ReportGoods 
  },
  {
    path: '/about',
    alias: ['/'],
    name: 'About',
    
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router
