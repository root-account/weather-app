import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { FeatherModule } from 'angular-feather';
// import { allIcons } from 'angular-feather/icons';
import { AppComponent } from './app.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // FeatherModule.pick(allIcons)
  ],
  exports: [
    // FeatherModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
