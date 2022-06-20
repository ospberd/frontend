<template>
  <div v-resize="onResize">
      <v-container >
          <v-row v-if="!isMobile"> <!-- Template edit head of demand : desktop version-->
              <v-col cols="12" sm="3" md="3">
                  <v-text-field clearable type="datetime-local"  v-model="headDemand.docdate" :label='$t("demands.docdate")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                  <v-text-field type="number" clearable v-model="headDemand.docnumber" :label='$t("demands.docnumber")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="5" md="5">  
                  <v-autocomplete  clearable v-model="headDemand.userid" :items="users" :label='$t("demands.fullname")' 
                                       @change="changeUser"  item-text="fullname" item-value="id"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="1" md="1">
                  <v-switch v-model="headDemand.opened" :messages='$t("demands.opened")'  color="warning"></v-switch>
              </v-col>
              <v-col cols="12" sm="5" md="6">
                  <v-text-field disabled v-model="headDemand.deliveryaddress" :label='$t("users.deliveryaddress")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="5" md="3">
                  <v-text-field disabled v-model="headDemand.email" :label='$t("users.email")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="5" md="3">
                  <v-text-field disabled v-model="headDemand.phonenumber" :label='$t("users.phonenumber")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                  <v-combobox v-model="headDemand.comment" :label='$t("demands.comment")'  :items="demandcommentlist"></v-combobox>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                  <v-text-field disabled type="number" v-model="headDemand.totalDemand" :label='$t("demands.totalDemand")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                  <v-text-field disabled type="number" v-model="headDemand.totalConfirm" :label='$t("demands.totalConfirm")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                  <v-text-field disabled type="number" v-model="headDemand.balance" :label='$t("demands.balance")' ></v-text-field>
              </v-col>
          </v-row>
          <v-row v-if="isMobile">  <!-- Template edit head of demand : mobile version-->
              <table>
                  <tr>
                      <td colspan="3"><v-text-field dense outlined clearable type="datetime-local"  v-model="headDemand.docdate" :label='$t("demands.docdate")' ></v-text-field></td>       
                      <td colspan="2"><v-text-field dense outlined type="number" clearable v-model="headDemand.docnumber" :label='$t("demands.docnumber")' ></v-text-field></td>    
                  </tr>
                  <tr> 
                      <td colspan="5"><v-autocomplete dense outlined clearable v-model="headDemand.userid" :items="users" :label='$t("demands.fullname")' 
                                       @change="changeUser"  item-text="fullname" item-value="id" append-outer-icon="mdi-information"
                                        @click:append-outer="snackbaritem=headDemand; snackbar = true"></v-autocomplete> 
                      </td> 
                  </tr>
                  <tr> 
                      <td colspan="5"><v-combobox dense outlined v-model="headDemand.comment" :label='$t("demands.comment")'  :items="demandcommentlist"></v-combobox></td> 
                  </tr>
                  <tr> 
                      <td><v-switch dense v-model="headDemand.opened" :label='$t("demands.opened")'  color="warning"></v-switch> </td>
                      <td colspan="2"><v-text-field disabled type="number" v-model="headDemand.totalDemand" :label='$t("demands.totalDemand")' ></v-text-field></td>
                      <td colspan="2"><v-text-field disabled type="number" v-model="headDemand.totalConfirm" :label='$t("demands.totalConfirm")' ></v-text-field></td> 
                  </tr>
              </table>
              <v-snackbar centered  v-model="snackbar">
                  <td>  
                      {{snackbaritem.fullname}} <br>     <!-- show detail about user--> 
                      {{$t('demands.phonenumber')}}: {{snackbaritem.phonenumber}}  <br>              
                      {{$t('demands.email')}}: {{snackbaritem.email}}  <br>              
                      {{$t('demands.deliveryaddress')}}: {{snackbaritem.deliveryaddress}} <br>
                      {{$t('demands.balance')}}: {{snackbaritem.balance}} <br>
                  </td>
                  <td><v-btn  text  dark  @click="snackbar = false" >  X </v-btn> </td>
              </v-snackbar>
          </v-row>

          <v-data-table
              :headers="dynHeaderLines"
              :hide-default-header="isMobile"
              :custom-filter="filterMob"
              :items="theDocLines"
              :search="search"
              mobile-breakpoint="0"
              sort-by="goods">

              <template v-slot:top>
                  <v-toolbar flat >
                      <v-toolbar-title>{{$t('pages.goods')}}</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                      <v-text-field clearable v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' single-line hide-details></v-text-field>
                            <v-spacer></v-spacer> 
                      
                      <v-dialog v-model="dialog" max-width="1000px"> <!--- dialog insert and edit line of document-->
                          <template v-slot:activator="{ on, attrs }">
                              <v-btn dark class="mb-2" v-bind="attrs" v-on="on" color="green darken-3"> <v-icon> mdi-plus-thick </v-icon> </v-btn>
                          </template>
                          <v-card>
                              <v-card-title><span class="text-h5">{{ $t(formTitle) }}</span></v-card-title>
                              <v-card-text>
                                  <v-container v-if="!isMobile"> <!-- desktp version  -->
                                      <v-row>
                                          <v-col cols="12" sm="4" md="4">
                                              <v-autocomplete clearable v-model="editedItem.goodsid" :items="goods" :label='$t("demands.lines.goods")'
                                                              item-text="goods" item-value="id" @change="changeGoods" ></v-autocomplete>
                                          </v-col>
                                          <v-col cols="12" sm="2" md="2"> 
                                              <v-text-field readonly v-model="editedItem.measure" :label='$t("demands.lines.measure")'></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="2" md="2"> 
                                              <v-text-field disabled type="number" v-model="editedItem.remainder" :label='$t("demands.lines.remainder")'></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="2" md="2"> 
                                              <v-text-field disabled type="number" v-model="editedItem.reserved" :label='$t("demands.lines.reserved")'></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="2" md="2"> 
                                              <v-text-field disabled type="number" v-model="editedItem.currentprice" :label='$t("demands.lines.currentprice")'></v-text-field>
                                          </v-col>
                                      </v-row>
                                      <v-row>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field clearable type="number" v-model="editedItem.quantityDemand" :label='$t("demands.lines.quantityDemand")'  @change="changeDemandQuantity"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field readonly type="number" v-model="editedItem.priceDemand" :label='$t("demands.lines.priceDemand")' ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field readonly type="number" v-model="editedItem.totalDemand" :label='$t("demands.lines.totalDemand")' ></v-text-field>
                                          </v-col>
                                      </v-row>
                                      <v-row>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field clearable type="number" v-model="editedItem.quantityConfirm" :label='$t("demands.lines.quantityConfirm")' @change="changeConfirmQuantity" :disabled="!isAdmin"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field clearable type="number" v-model="editedItem.priceConfirm" :label='$t("demands.lines.priceConfirm")' @change="changeConfirmQuantity" :disabled="!isAdmin"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field clearable type="number" v-model="editedItem.totalConfirm" :label='$t("demands.lines.totalConfirm")' @change="changeConfirmTotal" :disabled="!isAdmin"></v-text-field>
                                          </v-col>
                                          <v-col>
                                              <v-icon @click="confirmDemand(editedItem)" dark x-large color="green darken-1" v-show="isAdmin"> mdi-checkbox-marked-circle </v-icon> 
                                          </v-col>
                                      </v-row>
                                  </v-container>
                                  
                                  <v-container v-if="isMobile"> <!-- mobile version-->
                                        <v-autocomplete dense outlined clearable v-model="editedItem.goodsid" :items="goods" :label='$t("demands.lines.goods")'
                                                        item-text="goods" item-value="id" @change="changeGoods" append-outer-icon="mdi-information"
                                                        @click:append-outer="snackbarlineitem = editedItem;snackbarline = true" ></v-autocomplete>
                                        <table>
                                            <tr>
                                                <td><v-text-field outlined dense clearable type="number" v-model="editedItem.quantityDemand" :label='$t("demands.lines.quantityDemand")'  @change="changeDemandQuantity"></v-text-field> </td>
                                                <td><v-text-field outlined dense  clearable type="number" v-model="editedItem.quantityConfirm" :label='$t("demands.lines.quantityConfirm")' @change="changeConfirmQuantity" :disabled="!isAdmin"></v-text-field> </td>
                                            </tr>  
                                            <tr>
                                                <td><v-text-field outlined dense readonly type="number" v-model="editedItem.priceDemand" :label='$t("demands.lines.priceDemand")' ></v-text-field> </td>
                                                <td><v-text-field outlined dense  clearable type="number" v-model="editedItem.priceConfirm" :label='$t("demands.lines.priceConfirm")' @change="changeConfirmQuantity" :disabled="!isAdmin"></v-text-field>  </td>         
                                            </tr>
                                            <tr>
                                                <td><v-text-field outlined dense readonly type="number" v-model="editedItem.totalDemand" :label='$t("demands.lines.totalDemand")' ></v-text-field> </td>
                                                <td><v-text-field outlined dense  clearable type="number" v-model="editedItem.totalConfirm" :label='$t("demands.lines.totalConfirm")' @change="changeConfirmTotal" :disabled="!isAdmin"></v-text-field> </td>
                                            </tr>
                                        </table>       
                                        <v-icon @click="confirmDemand(editedItem)" dark x-large color="green darken-1" v-show="isAdmin"> mdi-checkbox-marked-circle </v-icon> 
                                  </v-container>
                              </v-card-text>
  
                              <v-card-actions>
                                      <v-spacer></v-spacer>
                                  <v-btn  text @click="close" > {{$t('btn.cancel')}} </v-btn>
                                  <v-btn color="blue darken-1" text @click="save" > {{$t('btn.save')}}</v-btn>
                              </v-card-actions>
                          </v-card>
                      </v-dialog>

                      <v-dialog v-model="dialogDelete" max-width="700px">
                          <v-card>
                              <v-card-title class="text-h5">{{$t('msg.confdel')}}</v-card-title>
                              <v-alert class="text-center"><b>{{editedItem.goods}}</b></v-alert>
                            <v-card-actions>
                                  <v-spacer></v-spacer>
                              <v-btn  text @click="closeDelete">{{$t('btn.cancel')}}</v-btn>
                              <v-btn color="red darken-1" text @click="deleteItemConfirm">{{$t('btn.delete')}}</v-btn>
                                  <v-spacer></v-spacer>
                            </v-card-actions>
                          </v-card>
                      </v-dialog>

                  </v-toolbar>
              </template>

      
              <template v-slot:[`item.actions`]="{ item }">
                    <v-icon @click="confirmDemand(item)" color="green darken-1" v-show="isAdmin"> mdi-checkbox-marked-circle </v-icon>
                    <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1">mdi-pencil</v-icon>
                    <v-icon @click="deleteItem(item)" color="red darken-1"> mdi-delete </v-icon>
        
              </template>

              <template v-slot:[`item.mobilecol`]="{ item }"> <!--- mobile template show lines selected demand-->
                  <table border=1  width="100%" cellspacing="0"   >
                      <tr>    
                          <th colspan="3"> {{(item.goods)}}  <v-icon class="mr-2" @click="snackbarlineitem = item;snackbarline = true" >mdi-information</v-icon> </th> <th> {{item.measure}} </th> 
                          <th rowspan="4">
                              <v-icon @click="confirmDemand(item)" color="green darken-1" v-show="isAdmin"> mdi-checkbox-marked-circle </v-icon>
                              <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1">mdi-pencil</v-icon>
                              <v-icon @click="deleteItem(item)" color="red darken-1"> mdi-delete </v-icon></th>
                      </tr>
                      <tr> 
                          <th> {{$t('demands.lines.quantityDemand')}} </th> <td align="center"> {{item.quantityDemand*1}} </td>
                          <th> {{$t('demands.lines.quantityConfirm')}} </th> <td align="center"> {{item.quantityConfirm*1}} </td>  </tr>
                      <tr> 
                          <th> {{$t('demands.lines.priceDemand')}} </th> <td align="center"> {{item.priceDemand*1}} </td>
                          <th> {{$t('demands.lines.priceConfirm')}} </th> <td align="center"> {{item.priceConfirm*1}} </td>  </tr>
                      <tr> 
                          <th> {{$t('demands.lines.totalDemand')}} </th> <td align="center"> {{item.totalDemand*1}} </td>
                          <th> {{$t('demands.lines.totalConfirm')}} </th> <td align="center"> {{item.totalConfirm*1}} </td>  
                      </tr>

                      <v-snackbar centered v-model="snackbarline"> 
                          <td>
                              {{snackbarlineitem.goods}}<br>  <!--- show info about goods-->    
                              {{$t('demands.lines.measure')}}:  {{snackbarlineitem.measure}}  <br>  
                              {{$t('demands.lines.currentprice')}}:  {{snackbarlineitem.currentprice}}  <br>              
                              {{$t('demands.lines.remainder')}}: {{snackbarlineitem.remainder}}  <br>              
                              {{$t('demands.lines.reserved')}}: {{snackbarlineitem.reserved}}  <br>   
                          </td>
                          <td> <v-btn  text  dark  @click="snackbarline = false" >  X </v-btn> </td>
                      </v-snackbar>
                  </table>
              </template>

              </v-data-table>
                  <v-row class="justify-end">
                      <span>
                              <v-spacer></v-spacer>
                          <v-btn text ><v-checkbox  v-model="saveCopy" :label='this.$t("btn.ascopy")'></v-checkbox> </v-btn>
                          <v-btn  text @click="cancelHead" > {{$t('btn.cancel')}} </v-btn>
                          <v-btn color="blue darken-1" text @click="saveDoc" > {{$t('btn.save')}}</v-btn>
                      </span>
                  </v-row>
      </v-container>
  </div>

</template>


<script>

import { mapGetters, mapActions } from "vuex";
import {uuidv4, localeDateTime} from "../myfunc";


export default {
    name: 'Demand',

    data: () => ({
        isMobile: false,
        snackbar: false, snackbaritem: [], 
        snackbarline: false, snackbarlineitem: [],
        search: '',
        dialog: false,
        dialogDelete: false,
        saveCopy: false,
        
        theDocLines: [],
        
        editedIndex: -1,
        
        headDemand: {  
                    id: '', docdate: '', docnumber: '',  userid: '', 	fullname: '', 	phonenumber: '', 	email: '', 	deliveryaddress: '', 
                    totalDemand: 0, totalConfirm: 0, balance: 0,  comment: '', opened: true, lines:[]
                    },
        editedItem: {
                    id: '', headid: '', goodsid: '',  goods: '', 	measure: '', 	quantityDemand: 0, 	priceDemand: 0, 	totalDemand: 0,  
                    quantityConfirm: 0, 	priceConfirm: 0, 	totalConfirm: 0,  remainder: 0, 	reserved: 0, 	currentprice: 0 
                    },
        defaultItem: {
                      id: '', headid: '', goodsid: '',  goods: '', 	measure: '', 	quantityDemand: 0, 	priceDemand: 0, 	totalDemand: 0,  
                      quantityConfirm: 0, 	priceConfirm: 0, 	totalConfirm: 0,  remainder: 0, 	reserved: 0, 	currentprice: 0 
                     },
        }),

    computed: {
        ...mapGetters(['demandcommentlist','demands','activelines','goods','users','currentuser']),
        ...mapActions(['getGoodsAll','getDemandsAll','getUsersAll', 'getDemandByID']),

        isAdmin () { return ( ["admin", "manager"].includes(this.currentuser.role))  },

        dynHeaderLines () { return (this.isMobile)? this.headerslinesmob:this.headerslines },

        formTitle () {return this.editedIndex === -1 ? 'msg.insertrec' : 'msg.editrec' },

        headerslines() {return [
              { text: this.$t('demands.lines.goods'), value: 'goods' , align: 'start', sortable: true},
              { text: this.$t('demands.lines.measure'), value: 'measure' },  
              { text: this.$t('demands.lines.quantityDemand'), value: 'quantityDemand' },
              { text: this.$t('demands.lines.priceDemand'), value: 'priceDemand' },
              { text: this.$t('demands.lines.totalDemand'), value: 'totalDemand', align: 'end' },
              { text: this.$t('demands.lines.quantityConfirm'), value: 'quantityConfirm' },  
              { text: this.$t('demands.lines.priceConfirm'), value: 'priceConfirm' },  
              { text: this.$t('demands.lines.totalConfirm'), value: 'totalConfirm' },  
              { text: this.$t('demands.lines.remainder'), value: 'remainder' },  
              { text: this.$t('demands.lines.reserved'), value: 'reserved' },  
              { text: this.$t('msg.action'), value: 'actions', sortable: false },
              ]},

        headerslinesmob() {return [{ text: 'mobilecol', value: 'mobilecol' }, ]},
        },
  

    watch: {
        dialog (val) { val || this.close() },
        
        dialogDelete (val) {val || this.closeDelete()},
        },

        created () {this.initialize()},

    methods: {
        async initialize () {
            this.theDocLines = []
            await this.$store.dispatch('getDemandsAll')
            await this.$store.dispatch('getUsersAll')
            await this.$store.dispatch('getGoodsAll')

            document.title = this.$t('pages.demands')+' - '+ this.$t('msg.insertrec')

            if (this.$route.params.id != null  ) { // open document by id
                  await  this.$store.dispatch('getDemandByID',this.$route.params);
                  this.headDemand =   this.demands.find(element => element.id === this.$route.params.id) 
                  document.title = this.$t('pages.demands')+' - '+ this.$t('msg.editrec')+' - '+localeDateTime(this.headDemand.docdate) + 
                                  ' №'+ this.headDemand.docnumber + ' - '+ this.headDemand.fullname;
                  this.theDocLines =  this.activelines; 
                  }
            },

        onResize () {this.isMobile = (window.innerWidth<700)},

        filterMob (value, search, item) {
            const forsearch = '-'+item.measure+'-'+item.goods+'-'+item.quantityDemand+'-'+item.priceDemand+'-'
                             +item.totalDemand+'-'+item.quantityConfirm+'-'+item.priceConfirm+'-'+item.totalConfirm+'-'
            return  search != null &&  typeof forsearch === 'string' &&
                              forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
            },

        changeDemandQuantity(){this.editedItem.totalDemand = this.editedItem.quantityDemand * this.editedItem.priceDemand },

        changeConfirmQuantity(){this.editedItem.totalConfirm = this.editedItem.quantityConfirm * this.editedItem.priceConfirm },

        changeConfirmTotal(){this.editedItem.priceConfirm =  this.editedItem.totalConfirm / this.editedItem.quantityConfirm },

        changeGoods() { 
            let chnGoods =  this.goods.find(element => element.id === this.editedItem.goodsid) 
            this.editedItem.goods = (chnGoods == null) ?  '' : chnGoods.goods;
            this.editedItem.measure = (chnGoods == null) ?  '' : chnGoods.measure;
            this.editedItem.remainder = (chnGoods == null) ?  0 : chnGoods.remainder 
            this.editedItem.reserved =  (chnGoods == null) ?  0 : chnGoods.reserved
            this.editedItem.priceDemand = (chnGoods == null) ?  0 :  chnGoods.price
            this.editedItem.currentprice = (chnGoods == null) ?  0 : chnGoods.price 
            this.changeDemandQuantity()
            },

        confirmDemand(item) {       
            item.quantityConfirm = item.quantityDemand 
            item.priceConfirm = item.priceDemand
            item.totalConfirm = item.totalDemand 
            this.sumDoc()
            },


        changeUser() { 
            let chnUser =  this.users.find(element => element.id === this.headDemand.userid) 
            this.headDemand.phonenumber = (chnUser == null) ?  '' : chnUser.phonenumber;
            this.headDemand.email = (chnUser == null) ?  '' : chnUser.email 
            this.headDemand.deliveryaddress =  (chnUser == null) ?  '' : chnUser.deliveryaddress
            this.headDemand.balance = (chnUser == null) ?  0 :  chnUser.balance
            },

        editItem (item) {
            this.editedIndex = this.activelines.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            },

        deleteItem (item) {
            this.editedIndex = this.activelines.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            },

        deleteItemConfirm () {
            this.activelines.splice(this.editedIndex, 1)
            this.closeDelete()
            },

        close () {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1 })
            },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1 })
            this.sumDoc()
            },

        cancelHead() {this.$router.go(-1);},

        save () {
            if (this.editedIndex > -1) {
              Object.assign(this.theDocLines[this.editedIndex], this.editedItem)
              } 
              else {
                  this.editedItem.id = uuidv4()
                  this.theDocLines.push(this.editedItem) }

            this.sumDoc()
            this.close()
            },

        sumDoc() {
            this.headDemand.totalDemand = 0;
            this.headDemand.totalConfirm = 0;
            this.theDocLines.forEach(element => {
                this.headDemand.totalDemand = this.headDemand.totalDemand*1 + element.totalDemand*1;
                this.headDemand.totalConfirm = this.headDemand.totalConfirm*1 + element.totalConfirm*1; 
                });  
            },

        async saveDoc () {
            this.headDemand.lines = this.theDocLines
            if (this.$route.params.id != null  && !this.saveCopy ) 
                { console.log('update demand'); await this.$store.dispatch('updateDemand',this.headDemand)} 
                else {
                        this.headDemand.id = uuidv4();
                        this.headDemand.lines.forEach(element => element.id = uuidv4() );
                        console.log('create demand')
                        await this.$store.dispatch('createDemand',this.headDemand)}
            this.$router.go(-1);
            },

  },

   
}
</script>