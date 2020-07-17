import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HikesListComponent } from './components/hikes-list/hikes-list.component';
import { TrailsLogComponent } from './components/trails-log/trails-log.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'hikes', component: HikesListComponent },
  { path: 'trails', component: TrailsLogComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
