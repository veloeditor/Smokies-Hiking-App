import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { TrailsLogComponent } from './components/trails-log/trails-log.component';
import { TrailsListComponent } from './components/trails-list/trails-list.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HikeFormComponent } from './components/hike-form/hike-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TrailsLogComponent,
    TrailsListComponent,
    HeaderComponent,
    SnackbarComponent,
    ConfirmDialogComponent,
    HikeFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    MatAutocompleteModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    NgCircleProgressModule.forRoot({
      backgroundGradient: false,
      backgroundColor: 'lightgrey',
      backgroundPadding: -10,
      radius: 60,
      maxPercent: 100,
      outerStrokeWidth: 10,
      outerStrokeColor: '#61A9DC',
      innerStrokeWidth: 9,
      innerStrokeColor: '#1b5e20',
      subtitleColor: '#444444',
      titleFontSize: '62',
      unitsFontSize: '17',
      subtitleFontSize: '13',
      showInnerStroke: true,
      startFromZero: false}),
  ],
  providers: [],
  entryComponents: [ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
