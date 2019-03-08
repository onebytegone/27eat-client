const API_BASE_URL = process.env.API_BASE_URL; // eslint-disable-line no-process-env

export default class AuthStore {

   public isLoggedIn(): boolean {
      return !!this.getToken();
   }

   public login(oauthCode: string): Promise<void> {
      const opts = {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
         },
         body: JSON.stringify({
            code: oauthCode,
         }),
      };

      return fetch(API_BASE_URL + 'login', opts)
         .then((resp) => resp.json())
         .then((json) => {
            this._saveToken(json.token);
         });
   }

   public logout(): void {
      delete localStorage.token;
   }

   public getToken(): string {
      return localStorage.token;
   }

   private _saveToken(token: string): void {
      localStorage.token = token;
   }

}
