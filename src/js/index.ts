import { Vue } from 'vue-property-decorator';
import VueRouter, { NavigationGuard } from 'vue-router';
import App from './App';
import AuthManager from './lib/AuthManager';
import Settings from './components/settings/Settings';
import Login from './components/login/Login';

Vue.use(VueRouter);

const authManager = new AuthManager();

const requireAuth: NavigationGuard = (to, _from, next): void => {
   if (authManager.isLoggedIn()) {
      return next();
   }

   return next({
      path: '/login',
      query: { redirect: to.fullPath },
   });
};

const router = new VueRouter({
   mode: 'hash',
   routes: [
      { path: '/settings', component: Settings, beforeEnter: requireAuth },
      {
         path: '/login',
         component: Login,
         beforeEnter: (_to, _from, next): void => {
            if (authManager.isLoggedIn()) {
               return next({
                  path: '/',
               });
            }

            return next();
         },
      },
      {
         path: '/logout',
         beforeEnter: (_to, _from, next) => {
            authManager.logout();
            next('/');
         },
      },
   ],
});

new App({ // eslint-disable-line no-new
   el: '#app',
   router: router,
});
