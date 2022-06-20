<template>
  <div v-resize="onResize">
 
      <v-data-table
          :headers="dynHeader"
          :items="demands"
          :search="search"
          :hide-default-header="isMobile"
          sort-by="docdate"
          :sort-desc = true
          :item-class="itemRowBackground"
          single-expand
          :show-expand="!isMobile"
          :custom-filter="filterMob"
          :mobile-breakpoint="0"
          @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
          @item-expanded="loadDetails">
          
          <template v-slot:[`item.opened`]="{ item }">
            <v-switch v-model="item.opened" disabled color="warning "></v-switch>
          </template>

          <template v-slot:expanded-item="{ headers }" :style="{background: '#4444' }"> <!-- expand detail lines of demand -->
              <td :style="{background: '#4444' }" v-if="!isMobile"></td>
                  <td :colspan="headers.length-2">
                      <v-data-table
                          :headers="dynHeaderLines"
                          item-key="id"
                          :hide-default-header="isMobile"
                          :items="activelines"
                          :items-per-page="-1"
                          class="elevation-1"
                          hide-default-footer
                          dense>
                          
                          <template v-slot:[`item.mobilecol`]="{ item }">  <!-- Template mobile view lines of selected demand-->
                              <table border=0  width="100%" cellspacing="0"   >
                                  <tr>    
                                      <th colspan="3"> {{(item.goods)}}  <v-icon class="mr-2" @click="snackbarlineitem = item;snackbarline = true" >mdi-information</v-icon> </th> <th> {{item.measure}} </th> 
                                  </tr>
                                  <tr> 
                                      <th> {{$t('demands.lines.quantityDemand')}} </th> <td align="center"> {{item.quantityDemand*1}} </td>
                                      <th> {{$t('demands.lines.quantityConfirm')}} </th> <td align="center"> {{item.quantityConfirm*1}} </td>  
                                  </tr>
                                  <tr> 
                                      <th> {{$t('demands.lines.priceDemand')}} </th> <td align="center"> {{item.priceDemand*1}} </td>
                                      <th> {{$t('demands.lines.priceConfirm')}} </th> <td align="center"> {{item.priceConfirm*1}} </td>  
                                  </tr>
                                  <tr> 
                                      <th> {{$t('demands.lines.totalDemand')}} </th> <td align="center"> {{item.totalDemand*1}} </td>
                                      <th> {{$t('demands.lines.totalConfirm')}} </th> <td align="center"> {{item.totalConfirm*1}} </td>  
                                  </tr>

                                  <v-snackbar centered v-model="snackbarline"> <!-- info about goods for mobile template-->
                                      {{snackbarlineitem.goods}} <v-btn  text  dark  @click="snackbarline = false" >  X </v-btn> <br>      
                                      {{$t('demands.lines.measure')}}:  {{snackbarlineitem.measure}}  <br>              
                                      {{$t('demands.lines.remainder')}}: {{snackbarlineitem.remainder}}  <br>              
                                      {{$t('demands.lines.reserved')}}: {{snackbarlineitem.reserved}}  <br>   
                                  </v-snackbar>
                              </table>
                          </template>
                      </v-data-table>
                  </td>
                  <td :style="{background: '#4444' }" v-if="!isMobile"> <v-btn dark class="mb-2" @click="printDoc" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn></td>
          </template>

          <template v-slot:[`item.docdate`]="{ item }">
              <td>{{ formDateTime(item.docdate) }}</td>
          </template>

          <template v-slot:top>
              <v-toolbar flat >
                  <v-toolbar-title>{{$t('pages.demands')}}</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                  <v-text-field clearable v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' single-line hide-details></v-text-field>
                        <v-spacer></v-spacer> 
                  <v-btn dark class="mb-2" @click="newItem" color="green darken-3"> <v-icon> mdi-plus-thick </v-icon> </v-btn>

                  <v-dialog v-model="dialogDelete" max-width="700px">
                      <v-card>
                          <v-card-title class="text-h5">{{$t('msg.confdel')}}</v-card-title>
                          <v-alert class="text-center"><b>{{editedItem.docnumber}}  {{formDateTime(editedItem.docdate)}} {{editedItem.fullname}} </b></v-alert>
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


           <template v-slot:[`item.mobilecol`]="{ item }">  <!-- Template mobile view head of demand-->
              <table border=1  width="100%" cellspacing="0"   >
                  <tr style="background-color:#7773">    
                      <th> {{formDateTime(item.docdate)}} </th> <th> {{item.docnumber}} </th>  <th  > {{item.fullname}} <v-icon class="mr-2" @click="snackbaritem=item; snackbar = true" >mdi-information</v-icon></th>  
                      <th>
                          <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1" v-show="isAdmin||item.opened&&(item.totalConfirm==0)">mdi-pencil</v-icon>
                          <v-icon @click="deleteItem(item)" color="red darken-1" v-show="isAdmin||item.opened&&(item.totalConfirm==0)"> mdi-delete </v-icon>
                          <v-icon @click="createTurnover(item)" color="green"  v-show="isAdmin&&(item.totalConfirm>0)"> mdi-sticker-plus-outline </v-icon>
                      </th> 
                  </tr>
                  <tr> 
                      <th> {{$t('demands.totalDemand')}} </th> <td align="center"> {{item.totalDemand}} </td>
                      <th> {{$t('demands.totalConfirm')}} </th> <td align="center"> {{item.totalConfirm}} </td>  
                  </tr>
                  <tr>
                      <td align="center" colspan="3"  >{{ item.comment }} </td> 
                      <td align="center"> <div v-if="item.opened"> {{$t('demands.opened')}}</div> </td></tr>
              </table>

              <v-snackbar centered  v-model="snackbar">  <!-- info about user for mobile template-->
                   {{snackbaritem.fullname}} <v-btn  text  dark  @click="snackbar = false" >  X </v-btn> <br>      
                  {{$t('demands.phonenumber')}}: {{snackbaritem.phonenumber}}  <br>              
                  {{$t('demands.email')}}: {{snackbaritem.email}}  <br>              
                  {{$t('demands.deliveryaddress')}}: {{snackbaritem.deliveryaddress}} <br>
                  {{$t('demands.balance')}}: {{snackbaritem.balance}} <br>
              </v-snackbar>
           </template>

          <template v-slot:[`item.actions`]="{ item }">
              <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1" v-show="isAdmin||item.opened&&(item.totalConfirm==0)">mdi-pencil</v-icon>
              <v-icon @click="deleteItem(item)" color="red darken-1" v-show="isAdmin||item.opened&&(item.totalConfirm==0)"> mdi-delete </v-icon>
              <v-icon @click="createTurnover(item)" color="green"  v-show="isAdmin&&(item.totalConfirm>0)"> mdi-sticker-plus-outline </v-icon>
          </template>

    </v-data-table>

  <div hidden>
 
  <div id="printDoc" >   <!-- Template print demand doc -->

        <h2> Замовлення № {{this.currentline.docnumber}}  від  {{formDateTime(this.currentline.docdate)}} </h2>
        <h4> Замовник : {{this.currentline.fullname}} тел. {{this.currentline.phonenumber}}  </h4>
        <h4> Адреса доставки : {{this.currentline.deliveryaddress}}  </h4>
        <h3> 
             <p v-if="!currentline.opened"> <u> Замовлення неактивне !!! </u></p>
        </h3>
        <h4> Коментар: {{this.currentline.comment}}  </h4>
        <br>
        <table border="1" cellpadding="3" cellspacing="0"  >
	          <tbody>
              <tr>
                  <th>{{this.$t('demands.lines.goods')}}</th>
                  <th>{{this.$t('demands.lines.measure')}}</th>		
                  <th>{{this.$t('demands.lines.quantityDemand')}}</th>		
                  <th>{{this.$t('demands.lines.priceDemand')}}</th>	
                  <th>{{this.$t('demands.lines.totalDemand') }}</th>		
                  <th>{{this.$t('demands.lines.quantityConfirm')}}</th>		
                  <th>{{this.$t('demands.lines.priceConfirm')}}</th>	
                  <th>{{this.$t('demands.lines.totalConfirm') }}</th>	
	            </tr>
	            <tr v-for="item in activelines" :key="item.id">
                  <td>{{ item.goods }}</td>
                  <td align="center">{{ item.measure }}</td>
                  <td align="right">{{ item.quantityDemand }}</td>
                  <td align="right">{{ item.priceDemand }}</td>
                  <td align="right">{{ item.totalDemand }}</td>
                  <td align="right">{{ item.quantityConfirm }}</td>
                  <td align="right">{{ item.priceConfirm }}</td>
                  <td align="right">{{ item.totalConfirm }}</td>
              </tr>
              <tr>
                  <td align="right" colspan="4"> <b>Разом замовлено: </b></td>
                  <td align="right">{{ currentline.totalDemand }}</td>   
                  <td align="right" colspan="2"> <b>Разом підтверджено: </b></td>
                  <td align="right">{{ currentline.totalConfirm }}</td>  
              </tr>     
            </tbody>  
        </table>
        <br>
          <h4> ___________________________ підпис ___________  </h4>
        <br>
  </div>
 </div>

 </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { localeDateTime } from "../myfunc";

export default {
  name: 'Demands',
  
  data: () => ({
        search: '',
        isMobile: false,
        snackbar: false, snackbaritem: [], 
        snackbarline: false, snackbarlineitem: [],
        dialog: false,
        dialogDelete: false,

        currentline: { docdate: '', docnumber: '', 	fullname: '',	phonenumber: '', 	email: '', 	deliveryaddress: '', 
                       totalDemand: 0, totalConfirm: 0,   comment: '', opened: true  },
    
        editedIndex: -1,

        editedItem: {  id: '', docdate: '', docnumber: '',  userid: '', 	fullname: '', 	phonenumber: '', 	email: '', 	deliveryaddress: '', 
                       totalDemand: 0, totalConfirm: 0, balance: 0,  comment: '', opened: true, lines:[]},
                  
        defaultItem: { id: '', docdate: '', docnumber: '',  userid: '', 	fullname: '', 	phonenumber: '', 	email: '', 	deliveryaddress: '', 
                        totalDemand: 0, totalConfirm: 0, balance: 0,  comment: '', opened: true, lines:[]},
        }),

  computed: {

        isAdmin () { return ( ["admin", "manager"].includes(this.currentuser.role))  },

        dynHeader () { return (this.isMobile)? this.headersmob:this.headers },

        dynHeaderLines () { return (this.isMobile)? this.headerslinesmob:this.headerslines },

        formTitle () { return this.editedIndex === -1 ? 'msg.insertrec' : 'msg.editrec' },

        ...mapGetters(['demandcommentlist','demands','activelines','currentuser']),
        ...mapActions(['getDemandsAll', 'deleteDemand']),

        headers() {return [
            { text:  this.$t('demands.docdate'), align: 'start', sortable: true, value: 'docdate',},
            { text: this.$t('demands.docnumber'), value: 'docnumber' },  
            { text: this.$t('demands.fullname'), value: 'fullname', align: 'd-none', },  
            { text: this.$t('demands.totalDemand'), value: 'totalDemand' },
            { text: this.$t('demands.totalConfirm'), value: 'totalConfirm' },
            { text: this.$t('demands.comment'), value: 'comment' },
            { text: this.$t('demands.opened'), value: 'opened',  },
            { text: this.$t('demands.balance'), value: 'balance' },
            { text: this.$t('msg.action'), value: 'actions', sortable: false },
            ]},

        headersmob() {return [{ text: 'mobilecol', value: 'mobilecol' }, ]},

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
            ]}, 

        headerslinesmob()    {return [{ text: 'mobilecol', value: 'mobilecol' }, ]},

        },
  
  watch: {
        dialog (val) { val || this.close() },    
        
        dialogDelete (val) {val || this.closeDelete()},
        },

  created () {this.initialize()},
  

  methods: {

        onResize () {this.isMobile = (window.innerWidth<700)},

        initialize () {      
            document.title = this.$t('pages.demands')
            this.$store.dispatch('getDemandsAll')
            },  

        filterMob (value, search, item) {
            const forsearch = '-'+item.fullname+'-'+localeDateTime(item.docdate)+'-'+item.docnumber+'-'+item.phonenumber+'-'
                            +item.email+'-'+item.deliveryaddress+'-'+item.totalDemand+'-'+item.totalConfirm+'-'
                            +item.comment+'-'
            return search != null && typeof forsearch === 'string' &&
                          forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
            },

        itemRowBackground(item){ return (item.balance*1 < 0) ? "lowvalue" : '' },

        formDateTime(val) {return  localeDateTime(val)},  //  imported function localeDateTime is not available in  template
 
        printDoc() {  
            let divToPrint = document.getElementById("printDoc") 
            let newWin= window.open("");
            newWin.document.write(divToPrint.outerHTML);
            newWin.print();
            newWin.close();
            },
    
        newItem() { this.$router.push({name: 'Demand' }); },

        editItem(item) {
            this.editedIndex = this.demands.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.$router.push({name: 'Demand', params: { id: this.editedItem.id }});
            },

        createTurnover(item) { this.$router.push({ name: 'TurnDem', params: { id: item.id }}); },
    
        loadDetails({item}) {

            this.currentline.docdate = item.docdate;
            this.currentline.docnumber = item.docnumber;
            this.currentline.fullname = item.fullname;
            this.currentline.phonenumber = item.phonenumber;
            this.currentline.email = item.email;
            this.currentline.deliveryaddress = item.deliveryaddress;
            this.currentline.totalDemand = item.totalDemand;
            this.currentline.totalConfirm = item.totalConfirm;
            this.currentline.comment = item.comment;
            this.currentline.opened = item.opened;
            
            this.editedIndex = this.demands.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.$store.dispatch('getDemandByID',this.editedItem );
            },
      

        deleteItem (item) {
            this.editedIndex = this.demands.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            },

        deleteItemConfirm () {
            this.$store.dispatch('deleteDemand',this.editedItem )
            this.closeDelete()
            },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1 })
            },

        },
  
}
</script>

<style>
.lowvalue {  background-color: rgba(192, 151, 0, 0.319)}
</style>