import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from "./auth/auth.module";
import { MatButtonModule } from "@angular/material/button";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BaseUrlInterceptor } from "./interceptors/base-url.interceptor";
import { ToastrModule } from "ngx-toastr";
import { DashboardModule } from "./dashboard/dashboard.module";
import { AuthErrorInterceptor } from "./interceptors/auth-error.interceptor";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    DashboardModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-left',
      preventDuplicates: true,
      iconClasses: {
        error: 'mdi mdi-24px mdi-alert',
        info: 'mdi mdi-24px mdi-alert-circle-outline',
        success: 'mdi mdi-24px mdi-check-circle',
        warning: 'mdi mdi-24px mdi-shield-alert-outline',
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
