import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'products/:id', renderMode: RenderMode.Client },
  { path: 'categories/:id', renderMode: RenderMode.Client },
  { path: 'brands/product/:id', renderMode: RenderMode.Client },
  { path: 'brands/:id/:name', renderMode: RenderMode.Client },
  {
    path: '**',
    
    renderMode: RenderMode.Prerender
  }
];
