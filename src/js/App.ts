import { Vue, Component } from 'vue-property-decorator';

@Component({
   name: 'App',
})
export default class App extends Vue {

   public created(): void {
      console.log('Hello from 27eat');
   }

}
