import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "./components/layouts/DefaultLayout.vue";
import GuestLayout from "./components/layouts/GuestLayout.vue";
import PhotoUpload from "./components/photos/PhotoUpload.vue";

import Home from "./pages/Home.vue";

import Login from "./pages/Login.vue";
import SignUp from "./pages/SignUp.vue";
import ForgotPassword from "./pages/ForgotPassword.vue";
import PasswordReset from "./pages/PasswordReset.vue";

import Explore from "./pages/Explore.vue";
import Swipes from "./pages/Swipes.vue"
import Messages from "./pages/Messages.vue";
import Matches from "./pages/Matches.vue";
import Profile from "./pages/Profile.vue";

import UserProfile from "./components/profile/UserProfile.vue";
import PublicProfileSettings from "./components/profile/PublicProfileSettings.vue";
import BlockedUsers from "./components/profile/BlockedUsers.vue";

import NotFound from "./pages/NotFound.vue";

import useUserStore from "./store/user";


// Icons 
import { GlobeAltIcon, FireIcon, ChatBubbleLeftIcon, HeartIcon, UserIcon } from '@heroicons/vue/24/outline'


// Icons 
export const routes = [
  {
    path: '/', 
    name: 'Home',
    component: Home 
    
  },
  {
    path: '/',
    component: GuestLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'signUp',
        name: 'SignUp',
        component: SignUp
      },
      {
        path: 'forgotPassword',
        name: 'ForgotPassword',
        component: ForgotPassword
      },
      {
        path: 'password-reset/:token',
        name: 'PasswordReset',
        component: PasswordReset
      },
    ]
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true},
    children: [
          { 
            path: 'explore', 
            name: 'Explore', 
            component: Explore,
            meta: { showInBottomNav: true, icon: GlobeAltIcon }
          },
          { 
            path:'swipes', 
            name: 'Swipes', 
            component: Swipes,
            meta: { showInBottomNav: true, icon: FireIcon }
          },
          {
            path:'messages',
            name: 'Messages',
            component: Messages,
            meta: { showInBottomNav: true, icon: ChatBubbleLeftIcon }
          },
          {
            path: 'matches',
            name: 'Matches',
            component: Matches,
            meta: { showInBottomNav: true, icon: HeartIcon }
          },
          {
            path: 'profile',
            redirect: '/profile/userProfile',
            name: 'Profile',
            component: Profile,
            meta: { showInBottomNav: true, icon: UserIcon },
            children: [
              {
                path: 'photoUpload',
                name: 'PhotoUpload',
                component: PhotoUpload,
              },
              {
                path: 'publicProfileSettings',
                name: 'PublicProfileSettings',
                component: PublicProfileSettings,
              },
              {
                path: 'userProfile',
                name: 'UserProfile',
                component: UserProfile
              },
              {
                path: 'blockedUsers',
                name: 'BlockedUsers',
                component: BlockedUsers
              }
            ]
          },
        
        ]
      },
  
  
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound,
  },
];


const router = createRouter({
  history: createWebHistory(), 
  routes
});

router.beforeEach(async (to, from, next) => {
  const needAuth = to.matched.some(record => record.meta.requiresAuth === true)

  if(needAuth){
    try {
      const userStore = useUserStore();
      await userStore.fetchUser();
      next();
    } catch (error){
      next({name: 'Login'})
    }
  }else{
    next()
  }
})

export default router;
