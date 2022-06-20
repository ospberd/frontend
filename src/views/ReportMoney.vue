<template>
  <div class="reportmoney" v-resize="onResize">
    
      <v-card>
        <v-card-title v-if="!isMobile">  <!-- Template block  params of report : desktop version-->
            {{$t('pages.reportmoney')}}
                  <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")'></v-text-field>
                  <v-spacer></v-spacer>
            <v-text-field clearable type="datetime-local"  v-model="beginperiod" :label='$t("reports.beginperiod")' ></v-text-field>
            <v-text-field clearable type="datetime-local"  v-model="endperiod" :label='$t("reports.endperiod")' ></v-text-field>
            <v-btn dark class="mb-2" @click="updateReport" color="blue darken-3" > <v-icon> mdi-reload </v-icon> </v-btn>
                  <v-spacer></v-spacer>
            <v-btn dark class="mb-2" @click="printReport" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn>
        </v-card-title>

        <v-card-title v-if="isMobile">  <!-- Template block params of report : mobile version-->
          <table border=0  width="100%" cellspacing="0"   >
              <tr>  <td> {{$t('pages.reportmoney')}} </td></tr>
              <tr>
                    <td> <v-text-field  v-model="search" append-icon="mdi-magnify" :label='$t("msg.search")' ></v-text-field> </td>
                    <td><v-btn dark class="mb-2" @click="printReport" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn></td>
              </tr>
              <tr>  <td><v-text-field dense outlined clearable type="datetime-local"  v-model="beginperiod" :label='$t("reports.beginperiod")' ></v-text-field></td></tr>
              <tr>  <td><v-text-field dense outlined  clearable type="datetime-local"  v-model="endperiod" :label='$t("reports.endperiod")' ></v-text-field></td>
                    <td> <v-btn dark class="mb-2" @click="updateReport" color="blue darken-3" > <v-icon> mdi-reload </v-icon> </v-btn></td>
              </tr>  
          </table>  
        </v-card-title>

        <v-data-table
          :headers="dynHeader"
          :hide-default-header="isMobile"
          :custom-filter="filterMob"
          mobile-breakpoint="0"
          :items="moneysumperiod"
          :search="search"
          item-key="userid"
          sort-by="fullname"
          @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
          @item-expanded="loadDetails"
          :show-expand="!isMobile"
          single-expand>

            <template v-slot:expanded-item="{ headers }"> <!--  block show detail lines -->
            <td :style="{background: '#4444' }"  v-if="!isMobile"></td>
            <td :colspan="(headers.length-2)*!isMobile">
            <v-data-table
                  :headers="dynHeaderLines"
                  :hide-default-header="isMobile"
                  mobile-breakpoint="0"
                  :items="moneyperiod"
                  :items-per-page="-1"
                  class="elevation-1"
                  hide-default-footer
                  dense>
            
              <template v-slot:[`item.docdate`]="{ item }">
                    <td>{{ formDateTime(item.docdate) }}</td>
              </template>

              <template v-slot:[`item.mobilecol`]="{ item }"> <!--  block show table detail lines mobile template -->
                    <table border=0  width="100%" cellspacing="0"   >
                        <thead> 
                            <tr>    
                              <th > {{formDateTime(item.docdate)}} </th> <th>  {{item.docnumber*1}} </th> <th colspan="2">  </th> 
                              <th rowspan="3">  <v-icon class="mr-2" @click="todoc(item)" color="blue darken-1" >mdi-pencil</v-icon></th>
                            </tr>
                            <tr> 
                              <td> {{$t('reports.totalin')}} </td> <td align="center"> {{item.totalin*1}} </td>
                              <td> {{$t('reports.totalout')}} </td> <td align="center"> {{item.totalout*1}} </td> 
                            </tr>
                            <tr> 
                              <td> {{$t('reports.inpay')}} </td> <td align="center"> {{item.inpay*1}} </td> 
                              <td> {{$t('reports.outpay')}} </td> <td align="center"> {{item.outpay*1}} </td>  </tr>
                        </thead>
                    </table>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                    <v-icon class="mr-2" @click="todoc(item)" color="blue darken-1" >mdi-pencil</v-icon>
              </template>
            </v-data-table>
            </td>

            <td :style="{background: '#4444' }" v-if="!isMobile"> <v-btn dark class="mb-2" @click="printReportDetail" color="teal darken-3" > <v-icon> mdi-printer </v-icon> </v-btn></td>
   
            </template>


          <template v-slot:[`item.mobilecol`]="{ item }"> <!--  block show headers lines for mobile template -->
              <table border=1  width="100%" cellspacing="0"   >
                  <tr> <th colspan="4"  style="background-color:#7773"> {{(item.fullname)}}  </th></tr>
                  <tr> <th> {{$t('reports.beforemoney')}} </th> <td align="center"> {{item.beforemoney*1}} </td><th colspan="2"></th></tr>
                  <tr> <th> {{$t('reports.totalin')}} </th> <td align="center"> {{item.totalin*1}} </td>
                       <th> {{$t('reports.totalout')}} </th> <td align="center"> {{item.totalout*1}} </td>  
                  </tr>
                  <tr> <th> {{$t('reports.inpay')}} </th> <td align="center"> {{item.inpay*1}} </td>
                       <th> {{$t('reports.outpay')}} </th> <td align="center"> {{item.outpay*1}} </td>  
                  </tr>
                  <tr> <th> {{$t('reports.endmoney')}} </th> <td align="center"> {{item.endmoney*1}} </td><th colspan="2"></th></tr>
              </table>
          </template>
        </v-data-table>
      </v-card>


  <div hidden>    <!--  print template -->
  <div id="printTable" >  <!--  report for all users  -->
      <h2> {{$t('pages.reportmoney')}}</h2>
      <h5>Період з: {{formDateTime(beginperiod)}}</h5>
      <h5>Період по :{{formDateTime(endperiod)}}</h5>
      <table border="1" cellpadding="3" cellspacing="0"  >
	    <tbody>
          <tr>
		          <th>{{this.$t('reports.fullname')}}</th>
		          <th>{{this.$t('reports.beforemoney')}}</th>		
              <th>{{this.$t('reports.totalin')}}</th>		
              <th>{{this.$t('reports.totalout')}}</th>	
              <th>{{this.$t('reports.inpay') }}</th>		
              <th>{{this.$t('reports.outpay')}}</th>		
		          <th>{{this.$t('reports.endmoney')}}</th>
	        </tr>
	        <tr v-for="item in moneysumperiod" :key="item.fullname">
              <td>{{ item.fullname }}</td>
              <td align="right">{{ item.beforemoney }}</td>
              <td align="right">{{ item.totalin }}</td>
              <td align="right">{{ item.totalout }}</td>
              <td align="right">{{ item.inpay }}</td>
              <td align="right">{{ item.outpay }}</td>
              <td align="right">{{ item.endmoney }}</td>
          </tr>
      </tbody>
      </table>
  </div>
  <div id="printTableDetail" >  <!--  report for print selected user  -->
      <h2> {{$t('pages.reportmoney')}} : {{ currentline.fullname }}</h2>
      <h5>Період з: {{formDateTime(beginperiod)}}</h5>
      <h5>Період по :{{formDateTime(endperiod)}}</h5>
      <table border="1" cellpadding="3" cellspacing="0"  >
	    <tbody>
          <tr>
		          <th>{{this.$t('reports.fullname')}}</th>
		          <th>{{this.$t('reports.beforemoney')}}</th>		
              <th>{{this.$t('reports.totalin')}}</th>		
              <th>{{this.$t('reports.totalout')}}</th>	
              <th>{{this.$t('reports.inpay') }}</th>		
              <th>{{this.$t('reports.outpay')}}</th>		
		          <th>{{this.$t('reports.endmoney')}}</th>
	        </tr>
	        <tr>
              <td>{{ currentline.fullname }}</td>
              <td align="right">{{ currentline.beforemoney }}</td>
              <td align="right">{{ currentline.totalin }}</td>
              <td align="right">{{ currentline.totalout }}</td>
              <td align="right">{{ currentline.inpay }}</td>
              <td align="right">{{ currentline.outpay }}</td>
              <td align="right">{{ currentline.endmoney }}</td>
          </tr>
      </tbody>
      </table>
      <br>
      <table border="1" cellpadding="3" cellspacing="0"  >
	    <tbody>
          <tr>
		          <th>{{this.$t('reports.docdate')}}</th>
		          <th>{{this.$t('reports.docnumber')}}</th>		
              <th>{{this.$t('reports.totalin')}}</th>	
              <th>{{this.$t('reports.totalout')}}</th>	
              <th>{{this.$t('reports.inpay') }}</th>		
              <th>{{this.$t('reports.outpay')}}</th>		
	        </tr>
	        <tr v-for="item in moneyperiod" :key="item.docdate">
              <td align="center">{{ formDateTime(item.docdate) }}</td>
              <td align="center">{{ item.docnumber }}</td>
              <td align="right">{{ item.totalin }}</td>
              <td align="right">{{ item.totalout }}</td>
              <td align="right">{{ item.inpay }}</td>
              <td align="right">{{ item.outpay }}</td>
          </tr>
      </tbody>
      </table>
 </div>
 </div>

 </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { localeDateTime} from "../myfunc";
export default {
  name: 'Reportmoney',
      data () {
          return {
          expanded: [],
          isMobile: false,
          search: '',
          beginperiod: '',
          endperiod: '',
          currentline:{ userid: '', fullname: '', beforemoney: 0, totalin: 0, totalout: 0, inpay: 0, outpay: 0, endmoney: 0  },
          }
      },
      computed: {

            ...mapGetters(['moneysumperiod','moneyperiod','currentuser']),
            ...mapActions(['getMoneyAllReport', 'getMoneyIDReport']),
      
            headers() {return [
                {text:  this.$t('reports.fullname'), align: 'start', sortable: true, value: 'fullname',},
                { text: this.$t('reports.beforemoney'), value: 'beforemoney' , align: 'end'},  
                { text: this.$t('reports.totalin'), value: 'totalin' , align: 'end'},
                { text: this.$t('reports.totalout'), value: 'totalout', align: 'end' },
                { text: this.$t('reports.inpay'), value: 'inpay' , align: 'end'},
                { text: this.$t('reports.outpay'), value: 'outpay', align: 'end' },
                { text: this.$t('reports.endmoney'), value: 'endmoney', align: 'end' },
                ]}, 

            detaillines() {return [
                { text: this.$t('reports.docdate'), value: 'docdate' , align: 'start', sortable: true},
                { text: this.$t('reports.docnumber'), value: 'docnumber' },  
                { text: this.$t('reports.totalin'), value: 'totalin', align: 'end' },
                { text: this.$t('reports.totalout'), value: 'totalout' , align: 'end'},  
                { text: this.$t('reports.inpay'), value: 'inpay' , align: 'end'},
                { text: this.$t('reports.outpay'), value: 'outpay', align: 'end' },    
                { text: this.$t('msg.action'), value: 'actions', sortable: false },
                ]},

            dynHeader () { return (this.isMobile)? this.headersmob:this.headers },

            dynHeaderLines () { return (this.isMobile)? this.headerslinesmob:this.detaillines },

            headersmob()    {return [ { text: 'mobilecol', value: 'mobilecol' }, ]},

            headerslinesmob() {return [{ text: 'mobilecol', value: 'mobilecol' },]},
        
            },

      created () {this.initialize()},

      methods: {
          initialize () {
              document.title = this.$t('pages.reportmoney')
              this.$store.dispatch('getDemandsAll')
              },

          onResize () {this.isMobile = (window.innerWidth<700)},

          filterMob (value, search, item) {
                const forsearch = '-'+item.fullname+'-'+item.beforemoney+'-'+item.totalin+'-'+item.totalout+'-'
                          + '-'+item.inpay+'-'+item.outpay+'-'+item.endmoney+'-'
                return  search != null && typeof forsearch === 'string' &&
                            forsearch.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
                },
    
          formDateTime(val) { return  localeDateTime(val) }, //  imported function localeDateTime is not available in  template

          updateReport () {
              let paramsReport = {};
              paramsReport.beginperiod = this.beginperiod;
              paramsReport.endperiod = this.endperiod;
              this.$store.dispatch('getMoneyAllReport',paramsReport )
              },

          todoc(item) {       
                let rn = item.doctype[0].toUpperCase() + item.doctype.slice(1);
                const route =   this.$router.push({name: rn, params: { id: item.docid }});
                },

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
                paramsReportDetail.id = item.userid;
                this.currentline.userid = item.userid;
                this.currentline.fullname = item.fullname;
                this.currentline.beforemoney = item.beforemoney;
                this.currentline.totalin = item.totalin;
                this.currentline.totalout = item.totalout;
                this.currentline.inpay = item.inpay;
                this.currentline.outpay = item.outpay;
                this.currentline.endmoney = item.endmoney;
                this.$store.dispatch('getMoneyIDReport', paramsReportDetail );
                },

          }
  }
</script>