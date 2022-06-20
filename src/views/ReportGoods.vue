<template>
  <div class="reportgoods" v-resize="onResize">

      <v-card>
        <v-card-title v-if="!isMobile">               <!-- Template block  params of report : desktop version-->
            {{$t('pages.reportgoods')}}
                  <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")'></v-text-field>
                  <v-spacer></v-spacer>
            <v-text-field clearable type="datetime-local"  v-model="beginperiod" :label='$t("reports.beginperiod")' ></v-text-field>
            <v-text-field clearable type="datetime-local"  v-model="endperiod" :label='$t("reports.endperiod")' ></v-text-field>
            <v-btn dark class="mb-2" @click="updateReport" color="blue darken-3" > <v-icon> mdi-reload </v-icon> </v-btn>
                  <v-spacer></v-spacer>
            <v-btn dark class="mb-2" @click="printReport" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn>
        </v-card-title>

        <v-card-title v-if="isMobile">                <!-- Template block params of report : mobile version-->
            <table border=0  width="100%" cellspacing="0"   >
                <tr><td> {{$t('pages.reportgoods')}} </td> </tr>
                <tr>
                      <td><v-text-field v-model="search" dense append-icon="mdi-magnify" :label='$t("msg.search")'></v-text-field> </td>
                      <td><v-btn dark class="mb-2" @click="printReport" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn> </td>
                </tr> 
                <tr>  <td><v-text-field dense outlined clearable type="datetime-local"  v-model="beginperiod" :label='$t("reports.beginperiod")' ></v-text-field> </td></tr>
                <tr>  <td><v-text-field dense outlined clearable type="datetime-local"  v-model="endperiod" :label='$t("reports.endperiod")' ></v-text-field> </td>
                      <td><v-btn dark class="mb-2" @click="updateReport" color="blue darken-3" > <v-icon> mdi-reload </v-icon> </v-btn> </td> 
                </tr>        
            </table>     
        </v-card-title>
        
        <v-data-table
            :headers="dynHeader"
            :hide-default-header="isMobile"
            :custom-filter="filterMob"
            mobile-breakpoint="0"
            :items="turnoverssumperiod"
            :search="search"
            item-key="goodsid"
            group-by="groupname"
            sort-by="goods"
            @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
            @item-expanded="loadDetails"
            :show-expand="!isMobile"
            single-expand>

          <template v-slot:[`group.header`]="{items, isOpen, toggle}">
                <th :colspan="headers.length">
                    <v-icon @click="toggle">{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
                    {{ items[0].groupname }}
                </th>
          </template>

          <template v-slot:expanded-item="{ headers }"> <!--  block show detail lines -->
            <td v-if="!isMobile"></td>
            <td :colspan="(headers.length-2)*!isMobile">
            <v-data-table
                  :headers="dynHeaderLines"
                  :items="turnoversperiod"
                  :hide-default-header="isMobile"
                  mobile-breakpoint="0"
                  :items-per-page="-1"
                  class="elevation-1"
                  hide-default-footer
                  dense>
            
                  <template v-slot:[`item.docdate`]="{ item }">
                        <td>{{formDateTime(item.docdate) }}</td>
                  </template>

                  <template v-slot:[`item.mobilecol`]="{ item }"> <!--  block show table detail lines mobile template -->
                        <table border=0  width="100%" cellspacing="0">
                            <thead> 
                                <tr>
                                  <th> {{formDateTime(item.docdate)}} </th> <th>  {{item.docnumber*1}} </th> <th colspan="2"> {{(item.fullname)}} </th> 
                                  <th rowspan="3"><v-icon class="mr-2" @click="todoc(item)" color="blue darken-1" >mdi-pencil</v-icon></th>
                                </tr>
                                <tr> 
                                  <td> {{$t('reports.quantityin')}} </td> <td align="center"> {{item.quantityin*1}} </td>
                                  <td> {{$t('reports.quantityout')}} </td> <td align="center"> {{item.quantityout*1}} </td> 
                                </tr>
                                <tr>
                                  <td> {{$t('reports.totalin')}} </td> <td align="center"> {{item.totalin*1}}</td> 
                                  <td> {{$t('reports.totalout')}} </td> <td align="center"> {{item.totalout*1}} </td>  
                                </tr>
                            </thead> 
                        </table>
                  </template>

                  <template v-slot:[`item.actions`]="{ item }" >
                        <v-icon class="mr-2" @click="todoc(item)" color="blue darken-1" >mdi-pencil</v-icon>
                  </template>
            </v-data-table>
            </td>
            <td v-if="!isMobile"> <v-btn dark class="mb-2" @click="printReportDetail" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn></td>
   
          </template>


          <template v-slot:[`item.mobilecol`]="{ item }"> <!--  block show headers lines for mobile template -->
              <table border=1  width="100%" cellspacing="0"   >
                  <tr><th colspan="4" style="background-color:#7773"> {{(item.goods)}}</th></tr>
                  <tr> <th> {{$t('reports.beginquantity')}}</th> <td align="center"> {{item.beginquantity*1}} </td><th colspan="2"></th></tr>
                  <tr> <th> {{$t('reports.quantityin')}} </th> <td align="center"> {{item.quantityin*1}} </td>
                       <th> {{$t('reports.totalin')}} </th> <td align="center"> {{item.totalin*1}} </td>
                  </tr>
                  <tr> <th> {{$t('reports.quantityout')}} </th> <td align="center"> {{item.quantityout*1}} </td>
                       <th> {{$t('reports.totalout')}} </th> <td align="center"> {{item.totalout*1}} </td>  
                  </tr>
                  <tr> <th> {{$t('reports.endquantity')}} </th> <td align="center"> {{item.endquantity*1}} </td><th colspan="2"></th>  </tr>
              </table>
          </template>
        </v-data-table>
      </v-card>

  <div hidden>  <!--  print template -->
  <div id="printTable" >  <!--  report for all goods  -->
      <h2> {{$t('pages.reportgoods')}}</h2>
      <h5>Період з: {{formDateTime(beginperiod)}}</h5>
      <h5>Період по: {{formDateTime(endperiod)}}</h5>
      <table border="1" cellpadding="3" cellspacing="0"  >
	    <tbody>
          <tr>
              <th>{{this.$t('reports.groupname')}}</th>
		          <th>{{this.$t('reports.goods')}}</th>		
              <th>{{this.$t('reports.beginquantity')}}</th>		
              <th>{{this.$t('reports.quantityin')}}</th>	
              <th>{{this.$t('reports.totalin') }}</th>		
              <th>{{this.$t('reports.quantityout')}}</th>		
		          <th>{{this.$t('reports.totalout')}}</th>
              <th>{{this.$t('reports.endquantity')}}</th>
	        </tr>
	        <tr v-for="item in turnoverssumperiod" :key="item.goodsid">
              <td>{{ item.groupname }}</td>
              <td align="left">{{ item.goods }}</td>
              <td align="right">{{ item.beginquantity }}</td>
              <td align="right">{{ item.quantityin }}</td>
              <td align="right">{{ item.totalin }}</td>
              <td align="right">{{ item.quantityout }}</td>
              <td align="right">{{ item.totalout }}</td>
              <td align="right">{{ item.endquantity }}</td>
          </tr>
      </tbody>
      </table>
  </div> 
  <div id="printTableDetail" >   <!--  report for print selected item goods  -->
      <h2> {{$t('pages.reportgoods')}} : {{ currentline.goods }}</h2>
      <h5>Період з: {{formDateTime(beginperiod)}}</h5>
      <h5>Період по: {{formDateTime(endperiod)}}</h5>
      <table border="1" cellpadding="3" cellspacing="0"  >
	    <tbody>
          <tr>
		          <th>{{this.$t('reports.groupname')}}</th>
		          <th>{{this.$t('reports.goods')}}</th>		
              <th>{{this.$t('reports.beginquantity')}}</th>		
              <th>{{this.$t('reports.quantityin')}}</th>	
              <th>{{this.$t('reports.totalin') }}</th>		
              <th>{{this.$t('reports.quantityout')}}</th>		
		          <th>{{this.$t('reports.totalout')}}</th>
              <th>{{this.$t('reports.endquantity')}}</th>
	        </tr>
	        <tr>
              <td>{{ currentline.groupname }}</td>
              <td align="left">{{ currentline.goods }}</td>
              <td align="right">{{ currentline.beginquantity }}</td>
              <td align="right">{{ currentline.quantityin }}</td>
              <td align="right">{{ currentline.totalin }}</td>
              <td align="right">{{ currentline.quantityout }}</td>
              <td align="right">{{ currentline.totalout }}</td>
              <td align="right">{{ currentline.endquantity }}</td>
          </tr>
      </tbody>
      </table>
      <br> 
      <table border="1" cellpadding="3" cellspacing="0"  >
	    <tbody>
          <tr>
              <th>{{this.$t('reports.docdate')}}</th>
		          <th>{{this.$t('reports.docnumber')}}</th>		
              <th>{{this.$t('reports.fullname')}}</th>	
              <th>{{this.$t('reports.quantityin')}}</th>	
              <th>{{this.$t('reports.totalin')}}</th>	
              <th>{{this.$t('reports.quantityout') }}</th>		
              <th>{{this.$t('reports.totalout')}}</th>		
	        </tr>
	        <tr v-for="item in turnoversperiod" :key="item.docdate">
              <td align="center">{{ formDateTime(item.docdate) }}</td>
              <td align="center">{{ item.docnumber }}</td>
              <td align="right">{{ item.fullname }}</td>  
              <td align="right">{{ item.quantityin }}</td>
              <td align="right">{{ item.totalin }}</td>
              <td align="right">{{ item.quantityout }}</td>
              <td align="right">{{ item.totalout }}</td>
          </tr> 
      </tbody>
      </table> 
  </div> 
  </div>

  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import { localeDateTime} from "../myfunc";
export default {
  name: 'Reportgoods',
      data () {
          return {
          expanded: [], 
          isMobile: false,
          search: '',
          beginperiod: '',
          endperiod: '',
          currentline:{goodsid: '', groupname: '', beginquantity: 0, quantityin: 0, totalin: 0, quantityout: 0, totalout: 0, endquantity: 0, goods: ''},
          }
      },
      computed: {

          ...mapGetters(['turnoverssumperiod','turnoversperiod','currentuser']),
          ...mapActions(['getGoodsAllReport', 'getGoodsIDReport']),

          headers() {return [
              {text:  this.$t('reports.groupname'), align: 'start', sortable: true, value: 'groupname', },
              { text: this.$t('reports.goods'), value: 'goods' },  
              { text: this.$t('reports.beginquantity'), value: 'beginquantity' , align: 'end'},  
              { text: this.$t('reports.quantityin'), value: 'quantityin' , align: 'end'},
              { text: this.$t('reports.totalin'), value: 'totalin' , align: 'end'},
              { text: this.$t('reports.quantityout'), value: 'quantityout', align: 'end' },
              { text: this.$t('reports.totalout'), value: 'totalout', align: 'end' },
              { text: this.$t('reports.endquantity'), value: 'endquantity', align: 'end' },
              ]}, 

          detaillines() {return [
              { text: this.$t('reports.docdate'), value: 'docdate' , align: 'start', sortable: true},
              { text: this.$t('reports.docnumber'), value: 'docnumber' },  
              { text: this.$t('reports.fullname'), value: 'fullname' },
              { text: this.$t('reports.quantityin'), value: 'quantityin' , align: 'end'},
              { text: this.$t('reports.totalin'), value: 'totalin', align: 'end' },
              { text: this.$t('reports.quantityout'), value: 'quantityout', align: 'end' },  
              { text: this.$t('reports.totalout'), value: 'totalout' , align: 'end'},  
              { text: this.$t('msg.action'), value: 'actions', sortable: false },
              ]},  

          dynHeader () { return (this.isMobile)? this.headersmob:this.headers},

          dynHeaderLines () { return (this.isMobile)? this.headerslinesmob:this.detaillines },

          headersmob() {return [
              {text:  this.$t('goods.groupname'), align: 'start', sortable: false, value: 'groupname'},
              { text: 'mobilecol', value: 'mobilecol' },
              ]},

          headerslinesmob() 
              {return [{ text: 'mobilecol', value: 'mobilecol' }
              ]},
    
          },

      created () {this.initialize()},

      methods: {
          initialize () {
              document.title = this.$t('pages.reportgoods')
              this.$store.dispatch('getDemandsAll')
              },  

          onResize () {this.isMobile = (window.innerWidth<700)},

          filterMob (value, search, item) {
                const forsearch = '-'+item.groupname+'-'+item.goods+'-'+item.measure+'-'+item.beginquantity+'-'
                          + '-'+item.quantityin+'-'+item.totalin+'-'+item.quantityout+'-'+item.totalout+'-'+item.endquantity+'-'
                return  search != null && typeof forsearch === 'string' &&
                            forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
                },

          formDateTime(val) { return  localeDateTime(val) }, //  imported function localeDateTime is not available in  template

          updateReport () {
              let paramsReport = {};
              paramsReport.beginperiod = this.beginperiod;
              paramsReport.endperiod = this.endperiod;
              this.$store.dispatch('getGoodsAllReport',paramsReport )
              },

          todoc(item) { this.$router.push({name: 'Turnover', params: {  id: item.headid }}); },

          printReport() {  
              let divToPrint=document.getElementById("printTable");
              let newWin= window.open("");
              newWin.document.write(divToPrint.outerHTML);
              newWin.print();
              newWin.close();
              },

          printReportDetail() {  
              let divToPrint=document.getElementById("printTableDetail");
              let newWin= window.open("");
              newWin.document.write(divToPrint.outerHTML);
              newWin.print();
              newWin.close();
              },


          loadDetails({item}) {
              let paramsReportDetail = {};
              paramsReportDetail.beginperiod = this.beginperiod;
              paramsReportDetail.endperiod = this.endperiod;
              paramsReportDetail.id = item.goodsid;
              this.currentline.goodsid = item.goodsid;
              this.currentline.groupname = item.groupname;
              this.currentline.beginquantity = item.beginquantity;
              this.currentline.quantityin = item.quantityin;
              this.currentline.totalin = item.totalin;
              this.currentline.quantityout = item.quantityout;
              this.currentline.totalout = item.totalout;
              this.currentline.endquantity = item.endquantity;
              this.currentline.goods = item.goods;
              this.$store.dispatch('getGoodsIDReport', paramsReportDetail );
              },

          }
  }
</script>