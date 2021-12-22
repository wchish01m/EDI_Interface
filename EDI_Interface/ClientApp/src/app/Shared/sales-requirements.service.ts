import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesRequirementsService {
  constructor(private http: HttpClient) { }

  SalesInfo$: Observable<any[]>;

  readonly baseURL = 'http://localhost:5000/api'

  /**
   * This function calls the GetSalesInfo function in EDI_API.
   * @param facility
   */
  getSalesInfo(facility: string): Observable<any> {
    return this.http.get<any>(this.baseURL + '/SalesRequirements/GetSalesInfo/' + facility);
  }
}
