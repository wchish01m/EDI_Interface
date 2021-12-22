import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ShippingResultsComponent } from './Shipping/shipping-results/shipping-results.component';
import { ShippingResultsService } from './Shared/shipping-results.service';
import { ShippingResultDetailsComponent } from './Shipping/shipping-result-details/shipping-result-details.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { FacilityMenuComponent } from './facility-menu/facility-menu.component';
import { SalesRequirementsComponent } from './Sales/sales-requirements/sales-requirements.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    SalesRequirementsComponent,
    ShippingResultsComponent,
    ShippingResultDetailsComponent,
    SearchFilterPipe,
    FacilityMenuComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: FacilityMenuComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'shipping-results', component: ShippingResultsComponent },
      { path: 'shipping-result-details', component: ShippingResultDetailsComponent },
      { path: 'sales-requirements', component: SalesRequirementsComponent },
    ])
  ],
  providers: [ShippingResultsService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
