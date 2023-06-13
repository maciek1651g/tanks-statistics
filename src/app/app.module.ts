import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent, DashboardComponent],
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, NgxChartsModule, InputTextModule, ButtonModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
