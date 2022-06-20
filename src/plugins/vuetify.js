import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import ru from 'vuetify/es5/locale/ru';
import ua from 'vuetify/es5/locale/uk';
import en from 'vuetify/es5/locale/en';

Vue.use(Vuetify);



export default new Vuetify({
  lang: {
    locales: { ru, ua, en },
    current: 'en'
  },

});
