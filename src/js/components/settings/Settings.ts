import { Vue, Component } from 'vue-property-decorator';
import template from './settings.html';

@Component({
   name: 'Settings',
   template: template,
})
export default class Settings extends Vue {}
