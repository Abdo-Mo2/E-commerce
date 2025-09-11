import { Routes } from '@angular/router';
export const HOME_ROUTES: Routes =[

    {
     path: '',
     loadComponent:()=> import('./pages/user-home-page/user-home-page').then(m => m.UserHomePage)
    },
   

]