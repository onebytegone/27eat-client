import { Vue, Component } from 'vue-property-decorator';
import AuthManager from './lib/AuthManager';

const authManager = new AuthManager();

@Component({
   name: 'App',
})
export default class App extends Vue {

   public get isLoggedIn(): boolean {
      return authManager.isLoggedIn();
   }

}
