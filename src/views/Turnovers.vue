<template>
    <div v-resize="onResize">
        <v-data-table
            :headers="dynHeader"
            :hide-default-header="isMobile"
            :items="turnovers"
            :search="search"
            sort-by="docdate"
            :sort-desc = true
            :item-class="itemRowBackground"
            :show-expand="!isMobile"
            single-expand
            :custom-filter="filterMob"
            :mobile-breakpoint="0"
            @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
            @item-expanded="loadDetails" >

            <template v-slot:[`item.delivered`]="{ item }">
                 <v-switch v-model="item.delivered" disabled color="green"></v-switch>
            </template>

            <template v-slot:[`item.returned`]="{ item }">
                <v-switch  v-model="item.returned" disabled color="red"></v-switch>
            </template>

            <template v-slot:expanded-item="{ headers }">  <!-- expand turnover items of doc  -->
                <td :style="{background: '#4444' }" v-if="!isMobile"></td>
                <td :colspan="headers.length-2">
          
                <v-data-table
                    :headers="dynHeaderLines"
                    item-key="id"
                    :hide-default-header="isMobile"
                    :items="activeturnoverlines"
                    :items-per-page="-1"
                    class="elevation-1"
                    hide-default-footer
                    dense> 
            
                    <template v-slot:[`item.mobilecol`]="{ item }">  <!-- template turnover items of doc : mobile version -->
                     
                    <table border=0  width="100%" cellspacing="0">
                        <tr><th colspan="3"> {{(item.goods)}}  <v-icon class="mr-2" @click="snackbarlineitem = item;snackbarline = true" >mdi-information</v-icon> </th> <th> {{item.measure}} </th></tr>
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
                          {{snackbarlineitem.goods}} <v-btn  text  dark  @click="snackbarline = false" >  X </v-btn> <br>      
                          {{$t('turnovers.lines.measure')}}:  {{snackbarlineitem.measure}}  <br>              
                          {{$t('turnovers.lines.remainder')}}: {{snackbarlineitem.remainder}}  <br>              
                          {{$t('turnovers.lines.reserved')}}: {{snackbarlineitem.reserved}}  <br>   
                      </v-snackbar>

                    </table>
                    </template>
                </v-data-table>

                </td>
                <td :style="{background: '#4444' }" v-if="!isMobile"> <v-btn dark class="mb-2" @click="printReport" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn></td>

            </template>


            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>{{$t('pages.turnovers')}}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field clearable v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' single-line hide-details></v-text-field>
                          <v-spacer></v-spacer> 
                    <v-btn dark class="mb-2" @click="newItem" color="green darken-3" v-if="currentuser.role != 'client'"> <v-icon> mdi-plus-thick </v-icon> </v-btn>

                  <v-dialog v-model="dialogDelete" max-width="700px">
                  <v-card>
                      <v-card-title class="text-h5">{{$t('msg.confdel')}}</v-card-title>
                      <v-alert class="text-center"><b>{{editedItem.docnumber}}   {{formDateTime(editedItem.docdate)}} {{editedItem.fullname}} </b></v-alert>
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

            <template v-slot:[`item.mobilecol`]="{ item }"> <!-- show turnovers docs : mobile version -->
                  <table border=1  width="100%" cellspacing="0"   >
                      <tr style="background-color:#7773">    
                          <th> {{formDateTime(item.docdate)}} </th> <th> {{item.docnumber}} </th>  <th  > {{item.fullname}} <v-icon class="mr-2" @click="snackbaritem=item; snackbar = true" >mdi-information</v-icon></th>  
                          <th style="background-color:#7773">
                              <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1" v-show="isAdmin">mdi-pencil</v-icon>
                              <v-icon @click="deleteItem(item)" color="red darken-1" v-show="isAdmin"> mdi-delete </v-icon>
                          </th> 
                      </tr>
                      <tr> 
                          <th> {{$t('turnovers.totalIn')}} </th> <td align="center"> {{item.totalin}} </td>
                          <th> {{$t('turnovers.totalOut')}} </th> <td align="center"> {{item.totalout}} </td>  
                      </tr>
                      <tr>
                          <td align="center" colspan="3" rowspan="2" >{{ item.comment }} </td> 
                          <td align="center"> <div v-if="item.returned"> {{$t('turnovers.returned')}}</div> </td>
                      </tr>
                      <tr><td align="center"> <div v-if="item.delivered"> {{$t('turnovers.delivered')}}</div> </td></tr>
                  </table>

                  <v-snackbar centered v-model="snackbar">  <!-- show info about user : mobile version -->
                      {{snackbaritem.fullname}} <v-btn  text  dark  @click="snackbar = false" >  X </v-btn> <br>      
                      {{$t('turnovers.phonenumber')}}: {{snackbaritem.phonenumber}}  <br>              
                      {{$t('turnovers.email')}}: {{snackbaritem.email}}  <br>              
                      {{$t('turnovers.deliveryaddress')}}: {{snackbaritem.deliveryaddress}} <br>
                      {{$t('turnovers.balance')}}: {{snackbaritem.balance}} <br>
                  </v-snackbar>
           
            </template>



            <template v-slot:[`item.actions`]="{ item }">
                    <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1">mdi-pencil</v-icon>
                    <v-icon @click="deleteItem(item)" color="red darken-1"> mdi-delete </v-icon>
            </template>

            <template v-slot:[`item.docdate`]="{ item }">
                <td>{{ formDateTime(item.docdate) }}</td>
            </template>

        </v-data-table>

<div hidden> <!--  -->
  
  <div id="printIn" >    <!--  template for print document goods in  -->
       <h2> Накладна на отримання товару № {{this.currentline.docnumber}}  від  {{formDateTime(this.currentline.docdate)}} </h2>
       <h4> Постачальник: {{this.currentline.fullname}} тел. {{this.currentline.phonenumber}}  </h4>
       <h3> 
           <p v-if="currentline.returned"> [X]  Повернення товара</p>
           <p v-if="currentline.delivered"> [X] Товар доставлено</p>
       </h3>
       <h4> Коментар: {{this.currentline.comment}}  </h4>
       <br>
          <table border="1" cellpadding="3" cellspacing="0"  >
	        <tbody>
            <tr>
            		<th>{{this.$t('turnovers.lines.goods')}}</th>
		            <th>{{this.$t('turnovers.lines.measure')}}</th>		
                <th>{{this.$t('turnovers.lines.quantityIn')}}</th>		
                <th>{{this.$t('turnovers.lines.priceIn')}}</th>	
                <th>{{this.$t('turnovers.lines.totalIn') }}</th>		
	          </tr>
	          <tr v-for="item in activeturnoverlines" :key="item.id">
                <td>{{ item.goods }}</td>
                <td align="center">{{ item.measure }}</td>
                <td align="right">{{ item.quantityin }}</td>
                <td align="right">{{ item.pricein }}</td>
                <td align="right">{{ item.totalin }}</td>
            </tr>
            <tr>
                <td align="right" colspan="4"> <b>Разом: </b></td>
                <td align="right">{{ currentline.totalin }}</td>   
            </tr>     
          </tbody>  
          </table>
       <br>
       <h4> ___________________________ підпис ___________  </h4>
       <br>
  </div>

  <div id="printOut" >    <!--  template for print document goods out  -->
        <h2> Накладна на видачу товару № {{this.currentline.docnumber}}  від  {{formDateTime(this.currentline.docdate)}} </h2>
        <h4> Покупець: {{this.currentline.fullname}} тел. {{this.currentline.phonenumber}}  </h4>
        <h4> Адреса доставки: {{this.currentline.deliveryaddress}}  </h4>
        <h3> 
        <p v-if="currentline.returned"> [X]  Повернення товара</p>
        <p v-if="currentline.delivered"> [X] Товар доставлено</p>
        <p v-if="!currentline.delivered"> [__] Товар доставлено</p>
        </h3>
        <h4> Коментар: {{this.currentline.comment}}  </h4>
        <br>

        <table border="1" cellpadding="3" cellspacing="0"  >
	      <tbody>
            <tr>
          		<th>{{this.$t('turnovers.lines.goods')}}</th>
		          <th>{{this.$t('turnovers.lines.measure')}}</th>		
              <th>{{this.$t('turnovers.lines.quantityOut')}}</th>		
              <th>{{this.$t('turnovers.lines.priceOut')}}</th>	
              <th>{{this.$t('turnovers.lines.totalOut') }}</th>		
	          </tr>
	          <tr v-for="item in activeturnoverlines" :key="item.goods">
                <td>{{ item.goods }}</td>
                <td align="center">{{ item.measure }}</td>
                <td align="right">{{ item.quantityout }}</td>
                <td align="right">{{ item.priceout }}</td>
                <td align="right">{{ item.totalout }}</td>
            </tr>
            <tr>
                <td align="right" colspan="4"> <b>Разом: </b></td>
                <td align="right">{{ currentline.totalout }}</td>   
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
import { localeDateTime} from "../myfunc";

export default {
  name: 'Turnovers',
  
  data: () => ({
        search: '',
        isMobile: false,
        snackbar: false, snackbaritem: [], 
        snackbarline: false, snackbarlineitem: [],
        dialog: false,
        dialogDelete: false,
    
        currentline: {
              docdate: '', docnumber: '', totalin: 0, totalout: 0, delivered: 0, returned: 0, 
              comment: '', fullname: '', phonenumber: '', email: '', deliveryaddress: ''
              },
    
        editedIndex: -1,
        editedItem: {  id: '',demandid: '',docdate: '',docnumber: '',userid: '',totalin: 0,totalout: 0 ,comment: '',delivered: 0, returned: 0,
                fullname: '', phonenumber: '', email: '', deliveryaddress: '', balance: 0, lines:[]
                },
        defaultItem: { id: '',demandid: '',docdate: '',docnumber: '',userid: '',totalin: 0,totalout: 0 ,comment: '',delivered: 0, returned: 0,
                fullname: '', phonenumber: '', email: '', deliveryaddress: '', balance: 0, lines:[]
                },
        }),

  computed: {
   
        ...mapGetters(['turnovercommentlist','turnovers','activeturnoverlines','currentuser']),
        ...mapActions(['getTurnoversAll', 'deleteTurnover']),

        formTitle () {return this.editedIndex === -1 ? 'msg.insertrec' : 'msg.editrec' },

        isAdmin () { return ( ["admin", "manager"].includes(this.currentuser.role))  },

        dynHeader () { return (this.isMobile)? this.headersmob:this.headers },

        dynHeaderLines () { return (this.isMobile)? this.headerslinesmob:this.headerslines },


        headersmob()  {return [{ text: 'mobilecol', value: 'mobilecol' }, ]},

        headerslinesmob()  {return [{ text: 'mobilecol', value: 'mobilecol' }, ]},


        headers() {const a = [
                { text:  this.$t('turnovers.docdate'), align: 'start', sortable: true, value: 'docdate' },
                { text: this.$t('turnovers.docnumber'), value: 'docnumber' },  
                { text: this.$t('turnovers.fullname'), value: 'fullname' },  
                { text: this.$t('turnovers.totalIn'), value: 'totalin' },
                { text: this.$t('turnovers.totalOut'), value: 'totalout' },
                { text: this.$t('turnovers.comment'), value: 'comment' },
                { text: this.$t('turnovers.delivered'), value: 'delivered' },
                { text: this.$t('turnovers.returned'), value: 'returned' },
                { text: this.$t('turnovers.balance'), value: 'balance' }
                ]
                const b = [
                { text: this.$t('msg.action'), value: 'actions', sortable: false } ]
      
                if (this.currentuser.role != "client") 
                      { return a.concat(b); }
                      else {return a }
                }, 

        headerslines() { const a = [  
                { text: this.$t('turnovers.lines.goods'), value: 'goods' , align: 'start', sortable: true},
                { text: this.$t('turnovers.lines.measure'), value: 'measure' },  
                { text: this.$t('turnovers.lines.quantityIn'), value: 'quantityin' },
                { text: this.$t('turnovers.lines.priceIn'), value: 'pricein' },
                { text: this.$t('turnovers.lines.totalIn'), value: 'totalin', align: 'end' },
                { text: this.$t('turnovers.lines.quantityOut'), value: 'quantityout' },  
                { text: this.$t('turnovers.lines.priceOut'), value: 'priceout' },  
                { text: this.$t('turnovers.lines.totalOut'), value: 'totalout' }
                ]
                const b=[
                { text: this.$t('turnovers.lines.remainder'), value: 'remainder' },  
                { text: this.$t('demands.lines.reserved'), value: 'reserved' }  ]

                if (this.currentuser.role != "client") 
                       { return a.concat(b); }
                  else {return a }
                }, 

        },
  

  watch: {
        dialog (val) { val || this.close()},

        dialogDelete (val) { val || this.closeDelete() },
        },

  created () { this.initialize() },

  methods: {
        initialize () {
              document.title = this.$t('pages.turnovers')
              this.$store.dispatch('getTurnoversAll')
              },  

        onResize () {this.isMobile = (window.innerWidth<700) },

        filterMob (value, search, item) {
              const forsearch = '-'+item.fullname+'-'+localeDateTime(item.docdate)+'-'+item.docnumber+'-'+item.phonenumber+'-'
                            +item.email+'-'+item.deliveryaddress+'-'+item.totalin+'-'+item.totalout+'-'
                            +item.comment+'-'
              return search != null && typeof forsearch === 'string' &&
                            forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
              },


        itemRowBackground(item){ return (item.totalin*1 > item.totalout*1) ? 'in' : '' },

        formDateTime(val) { return  localeDateTime(val) }, //  imported function localeDateTime is not available in  template
    
        printReport() {  
              let divToPrint = {};
              if (this.currentline.totalin > 0) {  divToPrint=document.getElementById("printIn") } ;
              if (this.currentline.totalout > 0) {  divToPrint=document.getElementById("printOut") } ;
              let newWin= window.open("");
              newWin.document.write(divToPrint.outerHTML);
              newWin.print();
              newWin.close();
              },

        newItem() { this.$router.push({name: 'Turnover' }); },

        editItem(item) {
              this.editedIndex = this.turnovers.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.$router.push({name: 'Turnover', params: { id: this.editedItem.id }});
              },

    
        loadDetails({item}) {
              this.currentline.docdate = item.docdate;
              this.currentline.docnumber = item.docnumber;
              this.currentline.totalin = item.totalin;
              this.currentline.totalout = item.totalout;
              this.currentline.comment = item.comment;
              this.currentline.delivered = item.delivered;
              this.currentline.returned = item.returned;
              this.currentline.fullname = item.fullname;
              this.currentline.phonenumber = item.phonenumber;
              this.currentline.email = item.email;
              this.currentline.deliveryaddress = item.deliveryaddress;

              this.editedIndex = this.turnovers.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.$store.dispatch('getTurnoverByID',this.editedItem );
              },
  

        deleteItem (item) {
              this.editedIndex = this.turnovers.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialogDelete = true
              },

        deleteItemConfirm () {
              this.$store.dispatch('deleteTurnover',this.editedItem )
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
.in  { background-color: rgba(0, 192, 61, 0.089)}
</style>