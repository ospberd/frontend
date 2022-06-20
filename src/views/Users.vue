<template>
  <div v-resize="onResize">
 
    <v-data-table
          :headers= "dynHeader"
          :hide-default-header="isMobile"
          :custom-filter="filterMob"
          :mobile-breakpoint="0"
          :items="users"
          :search="search"
          sort-by="fullname"
          :item-class="itemRowBackground"
          @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
          single-expand
          :show-expand="!isMobile">


      <template v-slot:expanded-item="{  item }"> <!--  block show user login and edit password -->
            <td v-if="!isMobile"></td> 
            <span v-if="!isMobile">
                <td :colspan="3">
                    <span> {{ $t('users.login') }}:  {{item.login}} </span>
                </td>
                <td :colspan=2>
                    <v-icon @click="setPassword(item)" color="teal darken-1" large> mdi-lock-reset </v-icon>
                </td>
            </span>

            <span v-if="isMobile">
                <th align="center">
                - -  {{ $t('users.login') }}:  {{item.login}}  <v-icon @click="setPassword(item)" color="teal darken-1" large> mdi-lock-reset </v-icon>
                </th>  
            </span>  
      </template>



      <template v-slot:top>
            <v-toolbar flat >
                <v-toolbar-title>{{$t('pages.users')}}</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-text-field clearable v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' single-line hide-details></v-text-field>
                      <v-spacer></v-spacer> 

                <v-dialog v-model="dialog" max-width="1000px"> <!-- Dialog insert new and edit record-->
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn dark class="mb-2" v-bind="attrs" v-on="on" color="green darken-3" v-if="currentuser.role != 'client'"> <v-icon> mdi-plus-thick </v-icon> </v-btn>
                    </template>
                
                  <v-card> <!-- Form insert and edit record -->
                    <v-card-title>
                        <span class="text-h5">{{ $t(formTitle) }}</span>
                    </v-card-title>
  
                    <v-card-text>
                          <v-container v-if="!isMobile"> 
                              <v-row>
                                  <v-col cols="12" sm="3" md="3"> 
                                      <v-select v-model="editedItem.role" :label='$t("users.role")' :items="roles" v-if="currentuser.role != 'client'"></v-select>
                                  </v-col> 
                      
                                  <v-col cols="12" sm="9" md="9">
                                      <v-text-field clearable v-model="editedItem.fullname" :label='$t("users.fullname")' ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="2" md="2">
                                      <v-text-field clearable v-model="editedItem.phonenumber" :label='$t("users.phonenumber")'  ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="2" md="2">
                                      <v-text-field clearable v-model="editedItem.email" :label='$t("users.email")' ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="2" md="2">
                                      <v-text-field clearable v-model="editedItem.login" :label='$t("users.login")' ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                      <v-text-field clearable v-model="editedItem.password" v-if="editedIndex==-1" :label='$t("users.password")' ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="12">
                                      <v-textarea clearable  v-model="editedItem.deliveryaddress" :label='$t("users.deliveryaddress")'   rows="2" ></v-textarea>
                                  </v-col>
                              </v-row>
                          </v-container>

                          <v-container v-if="isMobile">
                                <v-select dense outlined v-model="editedItem.role" :label='$t("users.role")' :items="roles" v-if="currentuser.role != 'client'"></v-select>
                                <v-text-field  dense outlined clearable v-model="editedItem.fullname" :label='$t("users.fullname")' ></v-text-field>
                                <v-text-field  dense outlined clearable v-model="editedItem.phonenumber" :label='$t("users.phonenumber")'  ></v-text-field>
                                <v-text-field  dense outlined clearable v-model="editedItem.email" :label='$t("users.email")' ></v-text-field>
                                <v-text-field  dense outlined clearable v-model="editedItem.login" :label='$t("users.login")' ></v-text-field>
                                <v-text-field  dense outlined clearable v-model="editedItem.password" v-if="editedIndex==-1" :label='$t("users.password")' ></v-text-field>
                                <v-textarea  dense outlined clearable  v-model="editedItem.deliveryaddress" :label='$t("users.deliveryaddress")'   rows="2" ></v-textarea>
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
                      <v-alert class="text-center"><b>{{editedItem.fullname}}</b></v-alert>
                      <v-card-actions>
                            <v-spacer></v-spacer>
                        <v-btn  text @click="closeDelete">{{$t('btn.cancel')}}</v-btn>
                        <v-btn color="red darken-1" text @click="deleteItemConfirm" >{{$t('btn.delete')}}</v-btn>
                            <v-spacer></v-spacer>
                       </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-dialog v-model="dialogPassword" max-width="400px">
                      <v-card>
                        <v-card-title class="text-h5"> <p> {{$t("msg.newpass")}} </p></v-card-title>
                        <v-alert class="text-center"><b>{{editedItem.fullname}}</b></v-alert>
                        <v-alert class="text-center">{{$t("users.login")}} : {{editedItem.login}}</v-alert>
                        <v-col >
                           <v-text-field clearable v-model="editedItem.password" :label='$t("users.password")' ></v-text-field>
                        </v-col>
                        <v-card-actions>
                                <v-spacer></v-spacer>
                            <v-btn  text @click="closePassword" > {{$t('btn.cancel')}} </v-btn>
                            <v-btn color="blue darken-1" text @click="savePassword" > {{$t('btn.save')}}</v-btn>
                                <v-spacer></v-spacer>
                        </v-card-actions>
                      </v-card>
                </v-dialog>

            </v-toolbar>
      </template>


      <template v-slot:[`item.mobilecol`]="{ item }"> <!--  block show table : mobile template -->
          <table border=1  width="100%" cellspacing="0"   >
                  <th colspan="3"  style="background-color:#7773" > {{item.fullname}}   ({{item.balance}}) </th>  
                  <th style="background-color:#7773">
                        <v-icon @click="editItem(item)" color="blue" > mdi-pencil </v-icon>    
                        <v-icon @click="deleteItem(item)" color="red" v-if="isAdmin"> mdi-delete </v-icon>
                  </th>
                  <tr><th colspan="2">{{$t('users.phonenumber')}}</th> <td align="center" colspan="2">{{ item.phonenumber }}  </td> </tr>
                  <tr> 
                      <th>{{$t('users.email')}}</th> <td align="center" >{{ item.email }}  </td> 
                      <th>{{$t('users.role')}}</th> <td align="center" >{{ item.role }}  </td> 
                  </tr>
                  <tr> <th >{{$t('users.deliveryaddress')}}</th> <td align="center" colspan="3">{{ item.deliveryaddress }}  </td> </tr>
          </table>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
           <v-icon class="mr-2" @click="editItem(item)" color="blue darken-1">mdi-pencil</v-icon>
           <v-icon @click="deleteItem(item)" color="red darken-1" v-if="currentuser.role != 'client'"> mdi-delete </v-icon>
      </template>

    </v-data-table>

  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: 'Users',
      data: () => ({
          search: '',
          dialog: false,
          dialogDelete: false,
          dialogPassword: false,
          roles: ['admin', 'manager', 'client'],
          isMobile: false,
    
          editedIndex: -1,
          editedItem: {
              id: '', fullname: '', phonenumber: '', email: '', deliveryaddress: '',
              role: '', login: '',  password: '',  balance: 0,
              },
          defaultItem: {
              id: '',  fullname: '', phonenumber: '', email: '', deliveryaddress: '',
              role: '', login: '', password: '', balance: 0,
              },
          }),

      computed: {
          formTitle () {return this.editedIndex === -1 ? 'msg.insertrec' : 'msg.editrec'},
          
          isAdmin () {return ( ["admin", "manager"].includes(this.currentuser.role))  },

          ...mapActions(['getUsersAll','createUser','updateUser','deleteUser','setNewPassword']),
          ...mapGetters(['users','currentuser']),

          dynHeader () { return (this.isMobile)? this.headersmob:this.headers },

          headers() {return [
              { text:  this.$t('users.fullname'), align: 'start', sortable: true, value: 'fullname',},
              { text: this.$t('users.phonenumber'), value: 'phonenumber' },
              { text: this.$t('users.email'), value: 'email' },
              { text: this.$t('users.deliveryaddress'), value: 'deliveryaddress' },
              { text: this.$t('users.role'), value: 'role' , hiden:true},
              { text: this.$t('users.balance'), value: 'balance' },
              { text: this.$t('msg.action'), value: 'actions', sortable: false },
              ]},
          headersmob()    {return [ { text: 'mobilecol', value: 'mobilecol' }, ]},
          },
  

      watch: {
          dialog (val) { val || this.close() },
          dialogDelete (val) {val || this.closeDelete()},
          },

      created () {this.initialize()},

      methods: {
          initialize () {
              document.title = this.$t('pages.users')
              this.$store.dispatch('getUsersAll')
              },

          onResize () {this.isMobile = (window.innerWidth<700)},

          filterMob (value, search, item) {
              const forsearch = '-'+item.fullname+'-'+item.phonenumber+'-'+item.deliveryaddress+'-'+item.role+'-'
              return search != null && typeof forsearch === 'string' &&
                      forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
              },

          itemRowBackground(item){ return (item.balance*1 < 0) ? "lowvalue" : '' },

          editItem (item) {
              this.editedIndex = this.users.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialog = true
              },

          deleteItem (item) {
              this.editedIndex = this.users.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialogDelete = true
              },

          deleteItemConfirm () {
              this.$store.dispatch('deleteUser',this.editedItem )
              this.closeDelete()
              },

          setPassword (item) {
              this.editedIndex = this.users.indexOf(item)
              this.editedItem = Object.assign({}, item)
              this.dialogPassword = true
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

          closePassword () {
              this.dialogPassword = false
              this.$nextTick(() => {
              this.editedItem = Object.assign({}, this.defaultItem)
              this.editedIndex = -1 })
              },

          save () {
              if (this.editedIndex > -1) {
                      this.$store.dispatch('updateUser',this.editedItem )
                  } else {
                      this.$store.dispatch('createUser',this.editedItem )
                  }
              this.close()
              },

          savePassword () {
              this.$store.dispatch('setNewPassword',this.editedItem )
              this.closePassword()
              },
      },
}

</script>

<style>
    .lowvalue { background-color: rgba(192, 151, 0, 0.319)}
</style>