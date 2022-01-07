import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SetURLService } from './setURL.service';

@Injectable({
  providedIn: 'root'
})
export class SalesRequirementsService {
  constructor(private http: HttpClient,
              private service: SetURLService) { }

  SalesInfo$: Observable<any[]>;

  /**
   * This function calls the GetSalesInfo function in EDI_API.
   * @param facility
   */
  getSalesInfo(facility: string): Observable<any> {
    console.log(this.service.getURL());
    return this.http.get<any>(this.service.getURL() + '/SalesRequirements/GetSalesInfo/' + facility);
  }
}
