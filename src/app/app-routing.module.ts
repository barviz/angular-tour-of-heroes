import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; //me da la funcionalidad de enrutamiento
import { HeroesComponent } from './heroes/heroes.component'; //le da al enrutador un lugar adonde ir
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

//configuracion de las rutas
//las Rutas le indican al enrutador qué vista mostrar cuando un usuario hace clic en un enlace
//o pega una url en la barra de direcciones del navegador
const routes: Routes = [
  { path: 'heroes', //cadena que coincide con la url en la barra de direcciones del navegador
  component: HeroesComponent }, //componente que el enrutador debe crear al navegar a esa ruta
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, //esta ruta redirige una url que coincide completamente con la ruta vacía a la ruta cuya ruta es '/dashboard'
  { path: 'detail/:id', component: HeroDetailComponent }
];

//los metadatos @NgModule inicializan el enrutador y lo hacen escuchar los cambios de ubicación del navegador
@NgModule({
  imports: [RouterModule.forRoot(routes)], //*
  exports: [RouterModule] //se exporta para que esté disponible en toda la aplicación
})
export class AppRoutingModule { }

//* configura el enrutador en el nivel raíz de la aplicación
//el método forRoot() proporciona los proveedores de servicios y las directivas necesarias para el enrutamiento,
//y realiza la navegación inicial basada en la url del navegador actual