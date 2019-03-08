import _ from 'underscore';
import { Vue, Component } from 'vue-property-decorator';
import AuthManager from '../../lib/AuthManager';
import template from './login.html';

declare global {
   interface Window {
      onAmazonLoginReady: () => void;
      amazon: any | undefined;
   }
}

const CLIENT_ID = process.env.LWA_CLIENT_ID, // eslint-disable-line no-process-env
      authManager = new AuthManager();

@Component({
   name: 'Login',
   template: template,
})
export default class Login extends Vue {

   public mounted(): void {
      this._setupLoginWithAmazonScript();
   }

   public loginWithAmazonClicked(evt: Event): void {
      evt.preventDefault();
      window.amazon.Login.authorize(
         { scope: 'profile', 'response_type': 'code' },
         (response: { error?: any; code?: string }): void => {
            if (response.error) {
               throw new Error('OAuth error: ' + response.error);
            }

            if (response.code) {
               authManager.login(response.code)
                  .then(() => {
                     const target = _.isArray(this.$route.query.redirect)
                        ? _.first(this.$route.query.redirect)
                        : this.$route.query.redirect;

                     this.$router.replace(target || '/')
                  });
            } else {
               throw new Error('No code was given in the OAuth response');
            }
         }
      );
   }

   private _setupLoginWithAmazonScript(): void {
      window.onAmazonLoginReady = function() {
         window.amazon.Login.setClientId(CLIENT_ID);
      };

      const amazonContainer = document.getElementById('amazon-root'),
            lwaScriptElem = document.createElement('script');

      if (!amazonContainer) {
         throw new Error('Could not find element with ID "#amazon-root"');
      }

      lwaScriptElem.id = 'amazon-login-sdk';
      lwaScriptElem.type = 'text/javascript';
      lwaScriptElem.async = true;
      lwaScriptElem.src = 'https://assets.loginwithamazon.com/sdk/na/login1.js';

      amazonContainer.appendChild(lwaScriptElem);
   }

}
