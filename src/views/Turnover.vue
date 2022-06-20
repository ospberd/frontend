<template>
   <div v-resize="onResize">
      <v-container >
          <v-row v-if="!isMobile"> 
              <v-col cols="12" sm="3" md="3">
                  <v-text-field clearable type="datetime-local"  v-model="headTurnover.docdate" :label='$t("turnovers.docdate")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                  <v-text-field type="number" clearable v-model="headTurnover.docnumber" :label='$t("turnovers.docnumber")' ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">  
                  <v-autocomplete clearable v-model="headTurnover.userid" :items="users" :label='$t("turnovers.fullname")' 
                                        @change="changeUser"  item-text="fullname" item-value="id"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="1" md="1">
                  <v-switch v-model="headTurnover.delivered" :messages='$t("turnovers.delivered")'  color="green"></v-switch>
              </v-col>
              <v-col cols="12" sm="5" md="5">
                  <v-text-field disabled v-model="headTurnover.deliveryaddress" :label='$t("users.deliveryaddress")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                  <v-text-field disabled v-model="headTurnover.email" :label='$t("users.email")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                  <v-text-field disabled v-model="headTurnover.phonenumber" :label='$t("users.phonenumber")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="1" md="1">
                  <v-switch v-model="headTurnover.returned" :messages='$t("turnovers.returned")'  color="red"></v-switch>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                  <v-combobox v-model="headTurnover.comment" :label='$t("turnovers.comment")'  :items="turnovercommentlist"></v-combobox>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                  <v-text-field disabled type="number" v-model="headTurnover.totalin" :label='$t("turnovers.totalIn")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                  <v-text-field disabled type="number" v-model="headTurnover.totalout" :label='$t("turnovers.totalOut")' ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                  <v-text-field disabled type="number" v-model="headTurnover.balance" :label='$t("turnovers.balance")' ></v-text-field>
              </v-col>
          </v-row>
          <v-row v-if="isMobile"> 
              <table>
                  <tr>
                      <td colspan="3"><v-text-field dense outlined clearable type="datetime-local"  v-model="headTurnover.docdate" :label='$t("turnovers.docdate")' ></v-text-field></td>       
                  </tr>
                  <tr>       
                      <td colspan="2"><v-text-field dense outlined type="number" clearable v-model="headTurnover.docnumber" :label='$t("turnovers.docnumber")' ></v-text-field></td>    
                  </tr>
                  <tr> 
                      <td colspan="5"><v-autocomplete dense outlined clearable v-model="headTurnover.userid" :items="users" :label='$t("turnovers.fullname")' 
                                       @change="changeUser"  item-text="fullname" item-value="id" append-outer-icon="mdi-information"
                                        @click:append-outer="snackbaritem=headTurnover; snackbar = true"></v-autocomplete> </td> 
                  </tr>
                  <tr> 
                      <td colspan="5"><v-combobox dense outlined v-model="headTurnover.comment" :label='$t("turnovers.comment")'  :items="turnovercommentlist"></v-combobox></td> 
                  </tr>
                  <tr> 
                      <td colspan="2"><v-switch dense v-model="headTurnover.delivered" :label='$t("turnovers.delivered")'  color="green"></v-switch> </td>
                      <td colspan="2"><v-switch dense v-model="headTurnover.returned" :label='$t("turnovers.returned")'  color="red"></v-switch> </td> 
                  </tr>
                  <tr>  
                      <td colspan="2"><v-text-field disabled type="number" v-model="headTurnover.totalin" :label='$t("turnovers.totalIn")' ></v-text-field> </td>
                      <td colspan="2"><v-text-field disabled type="number" v-model="headTurnover.totalout" :label='$t("turnovers.totalOut")' ></v-text-field></td> 
                  </tr>
              </table>
              <v-snackbar centered v-model="snackbar">
                  <td>  
                      {{snackbaritem.fullname}} <br>      
                      {{$t('turnovers.phonenumber')}}: {{snackbaritem.phonenumber}}  <br>              
                      {{$t('turnovers.email')}}: {{snackbaritem.email}}  <br>              
                      {{$t('turnovers.deliveryaddress')}}: {{snackbaritem.deliveryaddress}} <br>
                      {{$t('turnovers.balance')}}: {{snackbaritem.balance}} <br>
                  </td>
                  <td><v-btn  text  dark  @click="snackbar = false" >  X </v-btn> </td>
              </v-snackbar>
          </v-row>
              <v-data-table
                  :headers="dynHeaderLines"
                  :hide-default-header="isMobile"
                  :custom-filter="filterMob"
                  mobile-breakpoint="0"
                  :items="theDocLines"
                  :search="search"
                  sort-by="goods">

                  <template v-slot:top>
                      <v-toolbar flat >
                          <v-toolbar-title> {{$t('pages.goods')}}</v-toolbar-title>
                              <v-divider class="mx-4" inset vertical></v-divider>
                          <v-text-field clearable v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' single-line hide-details></v-text-field>
                              <v-spacer></v-spacer> 
                          <v-dialog v-model="dialog" max-width="1000px"> <!-- Insert and Edit table item -->
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn dark class="mb-2" v-bind="attrs" v-on="on" color="green darken-3"> <v-icon> mdi-plus-thick </v-icon> </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="text-h5">{{ $t(formTitle) }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                          <v-container v-if="!isMobile"> <!--  Template insert & edit : desktop version -->
                                              <v-row>
                                                  <v-col cols="12" sm="4" md="4">
                                                        <v-autocomplete clearable v-model="editedItem.goodsid" :items="goods" :label='$t("turnovers.lines.goods")'
                                                                        item-text="goods" item-value="id" @change="changeGoods" ></v-autocomplete>
                                                  </v-col>
                                                  <v-col cols="12" sm="2" md="2"> 
                                                        <v-text-field readonly v-model="editedItem.measure" :label='$t("turnovers.lines.measure")'></v-text-field>
                                                  </v-col>
                                                  <v-col cols="12" sm="2" md="2"> 
                                                        <v-text-field disabled type="number" v-model="editedItem.remainder" :label='$t("turnovers.lines.remainder")'></v-text-field>
                                                  </v-col>
                                                  <v-col cols="12" sm="2" md="2"> 
                                                        <v-text-field disabled type="number" v-model="editedItem.reserved" :label='$t("turnovers.lines.reserved")'></v-text-field>
                                                  </v-col>
                                                  <v-col cols="12" sm="2" md="2"> 
                                                        <v-text-field disabled type="number" v-model="editedItem.currentprice" :label='$t("turnovers.lines.currentprice")'></v-text-field>
                                                  </v-col>
                                              </v-row>
                                              <v-row>
                                                  <v-col cols="12" sm="3" md="3">
                                                        <v-text-field clearable type="number" v-model="editedItem.quantityin" :label='$t("turnovers.lines.quantityIn")'  @change="changeInQuantity"></v-text-field>
                                                  </v-col>
                                                  <v-col cols="12" sm="3" md="3">
                                                        <v-text-field clearable type="number" v-model="editedItem.pricein" :label='$t("turnovers.lines.priceIn")'  @change="changeInQuantity" ></v-text-field>
                                                  </v-col>
                                                  <v-col cols="12" sm="3" md="3">
                                                        <v-text-field clearable type="number" v-model="editedItem.totalin" :label='$t("turnovers.lines.totalIn")'  @change="changeInTotal"></v-text-field>
                                                  </v-col>
                                              </v-row>
                                              <v-row>
                                                  <v-col cols="12" sm="3" md="3">
                                                      <v-text-field clearable type="number" v-model="editedItem.quantityout" :label='$t("turnovers.lines.quantityOut")' @change="changeOutQuantity"></v-text-field>
                                                  </v-col>
                                                  <v-col cols="12" sm="3" md="3">
                                                      <v-text-field clearable type="number" v-model="editedItem.priceout" :label='$t("turnovers.lines.priceOut")' @change="changeOutQuantity"></v-text-field>
                                                  </v-col>
                                                  <v-col cols="12" sm="3" md="3">
                                                      <v-text-field clearable type="number" v-model="editedItem.totalout" :label='$t("turnovers.lines.totalOut")' @change="changeOutTotal"></v-text-field>
                                                  </v-col>
                                              </v-row>
                                          </v-container>
                                          <v-container v-if="isMobile"> <!--  Template insert & edit : mobile version -->
                                              <v-autocomplete dense outlined clearable v-model="editedItem.goodsid" :items="goods" :label='$t("demands.lines.goods")'
                                                              item-text="goods" item-value="id" @change="changeGoods" append-outer-icon="mdi-information"
                                                              @click:append-outer="snackbarlineitem = editedItem;snackbarline = true" ></v-autocomplete>
                                              <table>
                                                  <tr>
                                                      <td><v-text-field outlined dense clearable type="number" v-model="editedItem.quantityin" :label='$t("turnovers.lines.quantityIn")'  @change="changeInQuantity"></v-text-field> </td>                 <td>           <v-text-field outlined dense  clearable type="number" v-model="editedItem.quantityout" :label='$t("turnovers.lines.quantityOut")' @change="changeOutQuantity"
                                                                        :disabled="!isAdmin"></v-text-field> </td>
                                                  </tr>  
                                                  <tr>
                                                      <td><v-text-field outlined dense  type="number" v-model="editedItem.pricein" :label='$t("turnovers.lines.priceIn")' @change="changeInQuantity"></v-text-field> </td>
                                                      <td><v-text-field outlined dense  clearable type="number" v-model="editedItem.priceout" :label='$t("turnovers.lines.priceOut")' @change="changeOutQuantity" :disabled="!isAdmin"></v-text-field>  </td>         
                                                  </tr>
                                                  <tr>
                                                      <td><v-text-field outlined dense  type="number" v-model="editedItem.totalin" :label='$t("turnovers.lines.totalIn")' @change="changeInTotal" ></v-text-field> </td>
                                                      <td><v-text-field outlined dense  clearable type="number" v-model="editedItem.totalout" :label='$t("turnovers.lines.totalOut")' @change="changeOutTotal" :disabled="!isAdmin"></v-text-field> </td>
                                                  </tr>
                                              </table>       
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

                  <template v-slot:[`item.mobilecol`]="{ item }"> <!--  Table show items of document : mobile version -->
                      <table border=1  width="100%" cellspacing="0"   >
                         <tr>    
                            <th colspan="3"> {{(item.goods)}}  <v-icon class="mr-2" @click="snackbarlineitem = item;snackbarline = true" >mdi-information</v-icon> </th> <th> {{item.measure}} </th> 
                                  <th rowspan="4">       
                                      <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1" v-if="isAdmin">mdi-pencil</v-icon>
                                      <v-icon @click="deleteItem(item)" color="red darken-1"  v-if="isAdmin"> mdi-delete </v-icon>
                                  </th>
                          </tr>
                          <tr> 
                              <th> {{$t('turnovers.lines.quantityIn')}} </th> <td align="center"> {{item.quantityin*1}} </td>
                              <th> {{$t('turnovers.lines.quantityOut')}} </th> <td align="center"> {{item.quantityout*1}} </td>  
                          </tr>
                          <tr> 
                              <th> {{$t('turnovers.lines.priceIn')}} </th> <td align="center"> {{item.pricein*1}} </td>
                              <th> {{$t('turnovers.lines.priceOut')}} </th> <td align="center"> {{item.priceout*1}} </td>  
                          </tr>
                          <tr> 
                              <th> {{$t('turnovers.lines.totalIn')}} </th> <td align="center"> {{item.totalin*1}} </td>
                              <th> {{$t('turnovers.lines.totalOut')}} </th> <td align="center"> {{item.totalout*1}} </td>  
                          </tr>
                          <v-snackbar centered v-model="snackbarline">     
                              <td>
                                  {{snackbarlineitem.goods}}<br>      
                                  {{$t('turnovers.lines.measure')}}:  {{snackbarlineitem.measure}}  <br>  
                                  {{$t('turnovers.lines.currentprice')}}:  {{snackbarlineitem.currentprice}}  <br>              
                                  {{$t('turnovers.lines.remainder')}}: {{snackbarlineitem.remainder}}  <br>              
                                  {{$t('turnovers.lines.reserved')}}: {{snackbarlineitem.reserved}}  <br>   
                              </td>
                              <td> <v-btn  text  dark  @click="snackbarline = false" >  X </v-btn> </td>
                          </v-snackbar>
                      </table>
                  </template>

      
                  <template v-slot:[`item.actions`]="{ item }">
                      <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1">mdi-pencil</v-icon>
                      <v-icon @click="deleteItem(item)" color="red darken-1"> mdi-delete </v-icon>
                  </template>

              </v-data-table>

           <v-row class="justify-end">
             <span>
                        <v-spacer></v-spacer>
                <br>
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
    name: 'Turnover',
    data: () => ({
        search: '',
        isMobile: false,
        snackbar: false, snackbaritem: [], 
        snackbarline: false, snackbarlineitem: [],
        dialog: false,
        dialogDelete: false,
        saveCopy: false, 
        
        theDocLines: [],
        
        editedIndex: -1,
        headTurnover: {  
                id: '', docdate: '', docnumber: '',  userid: '', 	fullname: '', 	phonenumber: '', 	email: '', 	deliveryaddress: '', 
                totalin: 0, totalout: 0, balance: 0,  comment: '', delivered: false, returned: false, lines:[]
                },
        editedItem: {
                id: '', headid: '', goodsid: '',  goods: '', 	measure: '', 	quantityin: 0, 	pricein: 0, 	totalin: 0,  
                quantityout: 0, 	priceout: 0, 	totalout: 0,  remainder: 0, 	reserved: 0, 	currentprice: 0 
                },
        defaultItem: {
                id: '', headid: '', goodsid: '',  goods: '', 	measure: '', 	quantityin: 0, 	pricein: 0, 	totalin: 0,  
                quantityout: 0, 	priceout: 0, 	totalout: 0,  remainder: 0, 	reserved: 0, 	currentprice: 0 
                },
        }),

    computed: {
        ...mapGetters(['turnovercommentlist','turnovers','demands','activeturnoverlines','currentuser','activelines','goods','users']),
        ...mapActions(['getGoodsAll','getTurnoversAll','getUsersAll', 'getTurnoverByID', 'getDemandsAll', 'getDemandByID']),

        formTitle () {return this.editedIndex === -1 ? 'msg.insertrec' : 'msg.editrec' },

        isAdmin () { return ( ["admin", "manager"].includes(this.currentuser.role))  },

        dynHeaderLines () { return (this.isMobile)? this.headerslinesmob:this.headerslines },

        headerslines() {return [
                { text: this.$t('turnovers.lines.goods'), value: 'goods' , align: 'start', sortable: true},
                { text: this.$t('turnovers.lines.measure'), value: 'measure' },  
                { text: this.$t('turnovers.lines.quantityIn'), value: 'quantityin' },
                { text: this.$t('turnovers.lines.priceIn'), value: 'pricein' },
                { text: this.$t('turnovers.lines.totalIn'), value: 'totalin', align: 'end' },
                { text: this.$t('turnovers.lines.quantityOut'), value: 'quantityout' },  
                { text: this.$t('turnovers.lines.priceOut'), value: 'priceout' },  
                { text: this.$t('turnovers.lines.totalOut'), value: 'totalout' },  
                { text: this.$t('turnovers.lines.remainder'), value: 'remainder' },  
                { text: this.$t('turnovers.lines.reserved'), value: 'reserved' },  
                { text: this.$t('msg.action'), value: 'actions', sortable: false },
                ]}, 
        headerslinesmob() {return [{ text: 'mobilecol', value: 'mobilecol' },  ]},
        },

    watch: {
        dialog (val) {val || this.close()},    

        dialogDelete (val) {val || this.closeDelete() },
        },

    created () {this.initialize() },

    methods: {    
        async initialize () {
            document.title = this.$t('pages.turnovers')+' - '+ this.$t('msg.insertrec')
            this.theDocLines = []
            await this.$store.dispatch('getTurnoversAll')
            await this.$store.dispatch('getUsersAll')
            await this.$store.dispatch('getGoodsAll')
            await this.$store.dispatch('getDemandsAll')
        
            if (this.$route.path.indexOf('turndem') != -1) { // create new turnover doc from demand 
                await  this.$store.dispatch('getDemandByID',this.$route.params);
                let demand = this.demands.find(element => element.id === this.$route.params.id) 
                document.title = this.$t('pages.turnovers')+' <== '+ this.$t('pages.demands')
                this.headTurnover.comment = demand.comment;
                this.headTurnover.userid = demand.userid;
                this.changeUser();
                this.activelines.forEach(element => {
                      this.editedItem = Object.assign({}, this.defaultItem)
                      this.editedIndex = -1
                      this.editedItem.goodsid =  element.goodsid;
                      this.changeGoods();
                      this.editedItem.quantityout = element.quantityConfirm;
                      this.editedItem.priceout = element.priceConfirm;
                      this.editedItem.totalout = element.totalConfirm; 
                      this.save();       
                      });
                };

            if (this.$route.params.id != null &&  (this.$route.path.indexOf('turnover') != -1)  ) {  // open turover doc 
                await  this.$store.dispatch('getTurnoverByID',this.$route.params);
                this.headTurnover =   this.turnovers.find(element => element.id === this.$route.params.id) 
                this.theDocLines =  this.activeturnoverlines; 
                document.title = this.$t('pages.turnovers')+' - '+ this.$t('msg.editrec')+' - '+localeDateTime(this.headTurnover.docdate) + 
                            ' №'+ this.headTurnover.docnumber + ' - '+ this.headTurnover.fullname;
                }
            },

        onResize () {this.isMobile = (window.innerWidth<700)},

        filterMob (value, search, item) {
                const forsearch = '-'+item.measure+'-'+item.goods+'-'+item.quantityin+'-'+item.pricein+'-'
                            +item.totalin+'-'+item.quantityout+'-'+item.priceout+'-'+item.totalout+'-'
                return  search != null && typeof forsearch === 'string' &&
                      forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
                },

        changeInQuantity(){this.editedItem.totalin = this.editedItem.quantityin * this.editedItem.pricein},

        changeInTotal(){this.editedItem.pricein =  (this.editedItem.quantityin > 0) ? this.editedItem.totalin / this.editedItem.quantityin : 0 },

        changeOutQuantity(){
                this.editedItem.totalout = this.editedItem.quantityout * this.editedItem.priceout
                },

        changeOutTotal(){
                this.editedItem.priceout =  (this.editedItem.quantityout > 0) ? this.editedItem.totalout / this.editedItem.quantityout : 0
                },

        changeGoods() { 
                let chnGoods =  this.goods.find(element => element.id === this.editedItem.goodsid) 
                this.editedItem.goods = (chnGoods == null) ?  '' : chnGoods.goods;
                this.editedItem.measure = (chnGoods == null) ?  '' : chnGoods.measure;
                this.editedItem.remainder = (chnGoods == null) ?  0 : chnGoods.remainder 
                this.editedItem.reserved =  (chnGoods == null) ?  0 : chnGoods.reserved
                this.editedItem.priceout = (chnGoods == null) ?  0 :  chnGoods.price
                this.editedItem.currentprice = (chnGoods == null) ?  0 : chnGoods.price 
                this.changeInQuantity()
                },

        changeUser() { 
                let chnUser =  this.users.find(element => element.id === this.headTurnover.userid) 
                this.headTurnover.phonenumber = (chnUser == null) ?  '' : chnUser.phonenumber;
                this.headTurnover.email = (chnUser == null) ?  '' : chnUser.email 
                this.headTurnover.deliveryaddress =  (chnUser == null) ?  '' : chnUser.deliveryaddress
                this.headTurnover.balance = (chnUser == null) ?  0 :  chnUser.balance
                },

        editItem (item) {
                this.editedIndex = this.theDocLines.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
                },

        deleteItem (item) {
                this.editedIndex = this.theDocLines.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
                },

        deleteItemConfirm () {
                this.theDocLines.splice(this.editedIndex, 1)
                this.closeDelete()
                },

        close () { 
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1})
                },

        closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1})
                this.sumDoc()
                },

        cancelHead() {this.$router.go(-1);}, 

        save () {
                if (this.editedIndex > -1) {
                    Object.assign(this.theDocLines[this.editedIndex], this.editedItem)
                } else {
                    this.editedItem.id = uuidv4()
                  this.theDocLines.push(this.editedItem)
                  }
                this.sumDoc()
                this.close()
                },

        sumDoc() {
                this.headTurnover.totalin = 0;
                this.headTurnover.totalout = 0;
                this.theDocLines.forEach(element => {
                     this.headTurnover.totalin = this.headTurnover.totalin*1 + element.totalin*1;
                     this.headTurnover.totalout = this.headTurnover.totalout*1 + element.totalout*1; 
                     });  
                },

        saveDoc () {
                this.headTurnover.lines = this.theDocLines
                if ((this.$route.params.id != null   && (this.$route.path.indexOf('turndem') == -1) ) && !this.saveCopy)
                { this.$store.dispatch('updateTurnover',this.headTurnover); console.log('update turnover', this.saveCopy)} 
                    else {
                          this.headTurnover.id = uuidv4();
                          this.headTurnover.lines.forEach(element => element.id = uuidv4() );
                        this.$store.dispatch('createTurnover',this.headTurnover)}
                this.$router.go(-1);
                },

        },
}
</script>