<template>
    <div v-resize="onResize">
        <v-data-table
            :headers= "headers"
            :hide-default-header="isMobile"
            :items="goods"
            :search="search"
            :item-class="itemRowBackground"
            group-by="groupname"
            sort-by="goods"
            :custom-filter="filterMob"
            :mobile-breakpoint="0"
            single-expand
            @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
            :show-expand="!isMobile">

            <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                <th :colspan="headers.length">
                    <v-icon @click="toggle">{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
                    {{ items[0].groupname }}
                </th>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="(headers.length-2)*!isMobile">
                    <div v-html='item.description'/>
                </td>
                <td :colspan=2 v-if="!isMobile"> 
                    <br> <v-img  max-height="250"  max-width="250"  :src='item.picture'  ></v-img> <br>
                </td>
            </template>

            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title >{{$t('pages.goods')}}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field clearable v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' single-line hide-details></v-text-field>
                          <v-spacer></v-spacer> 
                    <v-dialog v-model="dialog" max-width="1000px">
                          <template v-slot:activator="{ on, attrs }" v-if="['admin', 'manager'].includes(currentuser.role)">
                                <v-btn dark class="mb-2" @click="printReport" color="teal darken-3" outlined > <v-icon> mdi-printer </v-icon> </v-btn>
                                <v-btn dark class="mb-2" v-bind="attrs" v-on="on" color="green darken-3"> <v-icon> mdi-plus-thick </v-icon> </v-btn>
                          </template>

                          <v-card >
                              <v-card-title >
                                    <span class="text-h5">{{ $t(formTitle) }}</span>
                              </v-card-title>
                              <v-card-text v-if="isMobile">
                                  <table border=0  width="100%" cellspacing="0"   >
                                      <tr>
                                          <td colspan="3"> <v-combobox dense outlined clearable v-model="editedItem.groupname" :label='$t("goods.groupname")' :items="grouplist"></v-combobox></td>
                                      </tr>
                                      <tr>
                                          <td colspan="3"> <v-text-field dense outlined  clearable v-model="editedItem.goods" :label='$t("goods.goods")' ></v-text-field></td>
                                      </tr>
                                      <tr>
                                          <td> <v-combobox dense outlined  v-model="editedItem.measure" :label='$t("goods.measure")'  :items="measurelist"></v-combobox></td>
                                          <td> <v-text-field dense outlined  clearable type="number" v-model="editedItem.price" :label='$t("goods.price")' ></v-text-field></td>
                                          <td> <v-text-field dense outlined  clearable v-model="editedItem.barcode" :label='$t("goods.barcode")' ></v-text-field></td>
                                      </tr>
                                      <tr>
                                          <td colspan="3"> <v-text-field dense outlined  clearable v-model="editedItem.picture" :label='$t("goods.picture")' ></v-text-field> </td>
                                      </tr>
                                      <tr>
                                          <td colspan="3">  <v-textarea  dense outlined clearable  v-model="editedItem.description" :label='$t("goods.description")'   rows="2" ></v-textarea> </td>
                                      </tr>
                                  </table>
                              </v-card-text>

                              <v-card-text v-if="!isMobile">
                                  <v-container>
                                      <v-row>
                                          <v-col cols="12" sm="3" md="3">
                                              <v-combobox clearable v-model="editedItem.groupname" :label='$t("goods.groupname")' :items="grouplist"></v-combobox>
                                          </v-col>
                                          <v-col cols="12" sm="9" md="9">
                                              <v-text-field clearable v-model="editedItem.goods" :label='$t("goods.goods")' ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="2" md="2">
                                              <v-combobox v-model="editedItem.measure" :label='$t("goods.measure")'  :items="measurelist"></v-combobox>
                                          </v-col>
                                          <v-col cols="12" sm="2" md="2">
                                              <v-text-field clearable type="number" v-model="editedItem.price" :label='$t("goods.price")' ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="2" md="2">
                                              <v-text-field clearable v-model="editedItem.barcode" :label='$t("goods.barcode")' ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="6" md="6">
                                              <v-text-field clearable v-model="editedItem.picture" :label='$t("goods.picture")' ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="12" md="12">
                                              <v-textarea clearable  v-model="editedItem.description" :label='$t("goods.description")'   rows="2" ></v-textarea>
                                          </v-col>
                                      </v-row>
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

            <template v-slot:[`item.mobilecol`]="{ item }"> <!-- Template mobile view -->
                <template v-if="!isAdmin">   <!--  not admin role-->
                    <table border=1  width="100%" cellspacing="0"   >
                        <th colspan="3"  style="background-color:#7773" > {{item.goods}} </th>  
                        <tr><th>{{$t('goods.measure')}}</th><th>{{$t('goods.price') }}</th><th>{{$t('goods.barcode')}}</th></tr>
                        <tr>
                            <td align="right" >{{ item.measure }} </td><td align="right"> {{ item.price }} </td>
                            <td align="right"> {{ item.barcode }}</td> 
                        </tr>
                    </table>
                </template>
                <template v-if="isAdmin">  <!--   admin role-->    
                    <table border=1  width="100%" cellspacing="0"   >
                        <th colspan="3"  style="background-color:#7773" > {{item.goods}} </th>  
                        <th style="background-color:#7773">
                            <v-icon @click="editItem(item)" color="blue" > mdi-pencil </v-icon>    
                            <v-icon @click="deleteItem(item)" color="red" > mdi-delete </v-icon>
                        </th>
                        <tr><th>{{$t('goods.measure')}}</th><th>{{$t('goods.price') }}</th><th>{{$t('goods.remainder')}}</th><th>{{$t('goods.reserved')}}</th></tr>
                        <tr>
                            <td align="right" >{{ item.measure }} </td><td align="right"> {{ item.price }} </td>
                            <td align="right"> {{ item.remainder }}</td><td align="right"> {{ item.reserved }}</td>
                        </tr>
                    </table>
                </template>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1" >mdi-pencil</v-icon>
                <v-icon @click="deleteItem(item)" color="red darken-1" > mdi-delete </v-icon>
            </template>
        </v-data-table>

<div hidden> 
  <div id="goodslist" >  <!-- Template print pricelist-->
      <h2> Прайслист</h2>
      <table border="1" cellpadding="3" cellspacing="0" width="100%" >
        	<tbody>
            <tr>
              <th>{{this.$t('goods.groupname')}}</th>
              <th>{{this.$t('goods.goods')}}</th>		
              <th>{{this.$t('goods.measure')}}</th>		
              <th>{{this.$t('goods.barcode')}}</th>	
              <th>{{this.$t('goods.price') }}</th>		
          	</tr>
	          <tr v-for="item in goods" :key="item.id">
              <td>{{ item.groupname }}</td>
              <td align="left">{{ item.goods }}</td>
              <td align="center">{{ item.measure }}</td>
              <td align="center">{{ item.barcode }}</td>
              <td align="right">{{ item.price }}</td>
            </tr>
          </tbody>
      </table>
  </div> 
</div> 

</div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
export default {
    name: 'Goods',
    data: () => ({
          search: '',
          dialog: false,
          dialogDelete: false,
          isMobile: false,
          editedIndex: -1,

          editedItem: {id: '', groupname: '', goods: '', description: '', picture: '', measure: '', price: 0, barcode: '', remainder: 0, reserved: 0, },
          
          defaultItem: {id: '',groupname: '', goods: '', description: '', picture: '', measure: '', price: 0, barcode: '', remainder: 0, reserved: 0, },
          }),

    computed: {
          formTitle () {return this.editedIndex === -1 ? 'msg.insertrec' : 'msg.editrec' },    
          
          isAdmin () { return ( ["admin", "manager"].includes(this.currentuser.role))  },

          ...mapGetters(['grouplist','measurelist','goods', "currentuser"]),
          ...mapActions(['getGoodsAll','createGoods','updateGoods','deleteGoods']),

    headers() { 
          const a = [ {text:  this.$t('goods.groupname'), align: 'start', sortable: false, value: 'groupname'},
          { text: this.$t('goods.goods'), value: 'goods' },
          { text: this.$t('goods.measure'), value: 'measure' },
          { text: this.$t('goods.price'), value: 'price' },
          { text: this.$t('goods.barcode'), value: 'barcode' }
          ]
          const b = [
          { text: this.$t('goods.remainder'), value:  'remainder' , align: 'end' },
          { text: this.$t('goods.reserved'), value: 'reserved' , align: 'end' },
          { text: this.$t('msg.action'), value: 'actions', sortable: false,  align: 'end' }
          ]
          const m = [
          {text:  this.$t('goods.groupname'), align: 'start', sortable: false, value: 'groupname'},
          { text: 'mobilecol', value: 'mobilecol' },  
          ]

          if (this.isMobile) {return m}
          if (  ["admin", "manager"].includes(this.currentuser.role)) 
                { return a.concat(b); }
              else {return a }
          },
    },

  watch: {
          dialog (val) { val || this.close() },

          dialogDelete (val) { val || this.closeDelete() },
          },

  created () {this.initialize()},

  methods: {
          onResize () {this.isMobile = (window.innerWidth<700) },
      
          itemRowBackground(item){return (item.reserved*1 > item.remainder*1) ? "lowvalue" : ''  },

          filterMob (value, search, item) {      
              const forsearch = '-'+item.groupname+'-'+item.goods+'-'+item.measure+'-'+item.price+'-'
              return  search != null && typeof forsearch === 'string' &&
                      forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
          },
          
          printReport() {  
              let divToPrint=document.getElementById("goodslist");
              let newWin= window.open("");
              newWin.document.write(divToPrint.outerHTML);
              newWin.print();
              newWin.close();},

          initialize () {
              document.title = this.$t('pages.goods')
              this.$store.dispatch('getGoodsAll')
              },

          editItem (item) {
              this.editedIndex = this.goods.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialog = true
              },

          deleteItem (item) {
              this.editedIndex = this.goods.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialogDelete = true
              },

          deleteItemConfirm () {
              this.$store.dispatch('deleteGoods',this.editedItem )
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
              },

          save () {
              if (this.editedIndex > -1) {
                   this.$store.dispatch('updateGoods',this.editedItem )}         
                else { this.$store.dispatch('createGoods',this.editedItem )}
              this.close()
              },
          },
   
}
</script>

<style>
.lowvalue { background-color: rgba(192, 151, 0, 0.16)}
</style>