<template>
    <div v-resize="onResize">
          <v-data-table
              :headers="dynHeader"
              :hide-default-header="isMobile"
              :custom-filter="filterMob"
              :mobile-breakpoint="0"
              :items="payments"
              :search="search"
              :item-class="itemRowBackground"
              sort-by="docdate"
              :sort-desc = "true"  >

              <template v-slot:top>
                  <v-toolbar flat >
                      <v-toolbar-title>{{$t('pages.payments')}}</v-toolbar-title>
                          <v-divider class="mx-4" inset vertical></v-divider>
                      <v-text-field clearable v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' single-line hide-details></v-text-field>
                          <v-spacer></v-spacer> 

                      <v-dialog v-model="dialog" max-width="1000px">
                          <template v-slot:activator="{ on, attrs }" v-if="currentuser.role != 'client'">
                                <v-btn dark class="mb-2" v-bind="attrs" v-on="on" color="green darken-3"> <v-icon> mdi-plus-thick </v-icon> </v-btn>
                          </template>
                          <v-card>
                              <v-card-title>
                                  <span class="text-h5">{{ $t(formTitle) }}</span>
                              </v-card-title>
  
                              <v-card-text>
                                  <v-container v-if="!isMobile">  <!-- Desktop template insert and edit payment item-->
                                      <v-row> 
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field clearable type="datetime-local"  v-model="editedItem.docdate" :label='$t("payments.docdate")' ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="9" md="9">
                                              <v-autocomplete clearable v-model="editedItem.userid" :items="users" :label='$t("payments.fullname")' item-text="fullname" item-value="id"></v-autocomplete>
                                          </v-col>
                                      </v-row>
                                      <v-row> 
                                          <v-col cols="12" sm="6" md="6">
                                              <v-combobox v-model="editedItem.comment" :label='$t("payments.comment")'  :items="commentlist"></v-combobox>
                                          </v-col>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field type="number" clearable v-model="editedItem.inpay" :label='$t("payments.inpay")' ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-text-field type="number" clearable v-model="editedItem.outpay" :label='$t("payments.outpay")' ></v-text-field>
                                          </v-col>
                                      </v-row>
                                  </v-container>
                                  <v-container v-if="isMobile"> <!-- Mobile template insert and edit payment item-->
                                      <v-text-field dense outlined clearable type="datetime-local"  v-model="editedItem.docdate" :label='$t("payments.docdate")' ></v-text-field>
                                      <v-autocomplete dense outlined  clearable v-model="editedItem.userid" :items="users" :label='$t("payments.fullname")' item-text="fullname" item-value="id" ></v-autocomplete>
                                      <v-combobox dense outlined  v-model="editedItem.comment" :label='$t("payments.comment")'  :items="commentlist"></v-combobox>
                                      <tr> 
                                          <td><v-text-field dense outlined  type="number" clearable v-model="editedItem.inpay" :label='$t("payments.inpay")' ></v-text-field></td>
                                          <td><v-text-field dense outlined  type="number" clearable v-model="editedItem.outpay" :label='$t("payments.outpay")' ></v-text-field></td>
                                      </tr>
                                  </v-container>
                              </v-card-text>
                              <v-card-actions>
                                      <v-spacer></v-spacer>
                                  <v-btn text ><v-checkbox  v-model="saveCopy" :label='$t("btn.ascopy")'></v-checkbox> </v-btn> 
                                  <v-btn  text @click="close" > {{$t('btn.cancel')}} </v-btn>
                                  <v-btn color="blue darken-1" text @click="save" > {{$t('btn.save')}}</v-btn>
                              </v-card-actions>
                          </v-card>
                      </v-dialog>

                      <v-dialog v-model="dialogDelete" max-width="700px">
                          <v-card>
                              <v-card-title class="text-h5">{{$t('msg.confdel')}}</v-card-title>
                              <v-alert class="text-center"><b> {{formDateTime(editedItem.docdate)}} {{editedItem.fullname}}</b></v-alert>
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

              <template v-slot:[`item.mobilecol`]="{ item }"><!-- mobile template table of payments -->
                  <table border=1  width="100%" cellspacing="0"   >
                      <tr style="background-color:#7773">    
                          <th> {{formDateTime(item.docdate)}} </th>  <th  colspan="2"> {{item.fullname}} </th>  
                          <th>         
                              <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1" v-show="isAdmin||item.opened&&(item.totalConfirm==0)">mdi-pencil</v-icon>
                              <v-icon @click="deleteItem(item)" color="red darken-1" v-show="isAdmin||item.opened&&(item.totalConfirm==0)"> mdi-delete </v-icon>
                          </th> 
                      </tr>
                      <tr> 
                          <th> {{$t('payments.inpay')}} </th> <td align="center"> {{item.inpay}} </td>
                          <th> {{$t('payments.outpay')}} </th> <td align="center"> {{item.outpay}} </td>  
                      </tr>
                      <tr><td align="center" colspan="4"  >{{ item.comment }} </td> </tr>
                  </table>
              </template>
  
              <template v-slot:[`item.actions`]="{ item }">
                  <v-icon @click="printReport(item)" color="teal darken-3"> mdi-printer </v-icon>
                  <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1">mdi-pencil</v-icon>
                  <v-icon @click="deleteItem(item)" color="red darken-1"> mdi-delete </v-icon>
              </template>

              <template v-slot:[`item.docdate`]="{ item }">
                  <td>{{ formDateTime(item.docdate) }}</td>
              </template>

        </v-data-table>

  <div hidden>
      <div id="printTable" >  <!-- Template print payment doc-->
          <h2> {{$t('pages.payments')}}</h2>
          <h5>Почтачальник/Покупець: {{printedItem.fullname}}</h5>
          <h5>Дата оплати: {{formDateTime(printedItem.docdate)}}</h5>
          <h5>Одержано від покупця: {{printedItem.inpay}}</h5>
          <h5>Виплачено постачальнику: {{printedItem.outpay}}</h5>
          <h5>Коментар до платежу: {{printedItem.comment}}</h5>
      </div>
    </div>

  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { localeDateTime, uuidv4} from "../myfunc";

export default {
  name: 'Payments',
  data: () => ({
      search: '',
      dialog: false,
      dialogDelete: false,
      isMobile: false,
      editedIndex: -1,
      saveCopy: false,   
      editedItem: { id: '', docdate: '', userid: '',fullname: '', inpay: 0, outpay: 0, comment: '' },
      printedItem: { id: '', docdate: '', userid: '', fullname: '', inpay: 0,  outpay: 0,  comment: '' },
      defaultItem: { id: '', docdate: '', userid: '', fullname: '', inpay: 0,  outpay: 0,  comment: '' },
      }),

  computed: {

      ...mapGetters(['commentlist','payments', 'users','currentuser']),
      ...mapActions(['getPaymentsAll','getUsersAll','createPayment','updatePayment','deletePayment']),

      formTitle () {return this.editedIndex === -1 ? 'msg.insertrec' : 'msg.editrec'},

      isAdmin () { return ( ["admin", "manager"].includes(this.currentuser.role))  },

      dynHeader () { return (this.isMobile)? this.headersmob:this.headers },

      headers() {const a = [
          { text:  this.$t('payments.docdate'), align: 'start',sortable: true, value: 'docdate', },
          { text: this.$t('payments.fullname'), value: 'fullname' },  //  payments: [{ id: '', docdate: '',  userid: '', 	fullname: '',  inpay: 0, outpay: 0, comment: ''}]
          { text: this.$t('payments.inpay'), value: 'inpay' },
          { text: this.$t('payments.outpay'), value: 'outpay' },
          { text: this.$t('payments.comment'), value: 'comment' }
          ]
          const b = [{ text: this.$t('msg.action'), value: 'actions', sortable: false },
          ]
          if (this.currentuser.role != "client") 
             { return a.concat(b); }
               else {return a }
          },

      headersmob() {return [{ text: 'mobilecol', value: 'mobilecol' },  ]},
      },
  

  watch: {
      dialog (val) { val || this.close() },
      
      dialogDelete (val) {val || this.closeDelete() },
      },

  created () {
      document.title = this.$t('pages.payments')
      this.initialize()
      },

  methods: {
        onResize () {this.isMobile = (window.innerWidth<700)},

        filterMob (value, search, item) {
            const forsearch = '-'+item.fullname+'-'+localeDateTime(item.docdate)+'-'+item.phonenumber+'-'
                            +item.email+'-'+item.deliveryaddress+'-'+item.inpay+'-'+item.outpay+'-'
                            +item.comment+'-'
            return  search != null && typeof forsearch === 'string' &&
                            forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
            },

        async printReport(item) {  
            
            this.printedItem = Object.assign({}, item);
            this.printedItem = await Object.assign({}, item);
            
            let divToPrint= document.getElementById("printTable");
            let newWin= window.open("");
            newWin.document.write(divToPrint.outerHTML);
            newWin.print();
            newWin.close();
            },

        async initialize () {
            await  this.$store.dispatch('getPaymentsAll')
            await  this.$store.dispatch('getUsersAll')
            if (this.$route.params.id != null  ) {  // open payment record by id
                this.editItem(this.payments.find(element => element.id === this.$route.params.id) )
                document.title = this.$t('pages.payments')+' - '+ this.$t('msg.editrec')+' - '+localeDateTime(this.editedItem.docdate) + 
                                ' - '+ this.editedItem.fullname;
                history.pushState(this.$route.params.id,'',this.$router.path);            
                }
            },  

        formDateTime(val) {return  localeDateTime(val) },

        itemRowBackground(item){ return (item.outpay *1 > item.inpay*1) ? 'turnout' : '' },

        editItem (item) {
            this.editedIndex = this.payments.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            },

        deleteItem (item) {
            this.editedIndex = this.payments.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            },

        deleteItemConfirm () {
            this.$store.dispatch('deletePayment',this.editedItem )
            this.closeDelete()
            },

        close () {      
            this.dialog = false
            if (this.$route.params.id != null  ) {  this.$router.go(-1);}
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1})
            },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1 })
            },

        save () {
            if ((this.editedIndex > -1)  && !this.saveCopy) {
                this.$store.dispatch('updatePayment',this.editedItem ) } 
              else {
                this.editedItem.id = uuidv4(); 
                this.$store.dispatch('createPayment',this.editedItem ) }
            this.close()
            },
  },

   
}
</script>


<style>
.turnout   { background-color: rgba(0, 192, 61, 0.089)}

</style>