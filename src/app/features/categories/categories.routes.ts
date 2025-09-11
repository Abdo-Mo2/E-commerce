import { Routes } from '@angular/router';
export const CATEGORIES_ROUTES: Routes =[

    {
     path: '',
     loadComponent:()=> import('./pages/categories-page/categories-page').then(m => m.CategoriesPage)
    },
    {
     path: ':id',
     loadComponent:()=> import('./pages/category-detail/category-detail').then(m => m.CategoryDetail)
    },

]