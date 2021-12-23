import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TrailsListComponent } from './components/trails-list/trails-list.component';
import { TrailsLogComponent } from './components/trails-log/trails-log.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'trails', component: TrailsListComponent },
  { path: 'log', component: TrailsLogComponent },
  // { path: 'trails/:id', component: TrailDetailsComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
