import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingResultsService {
  constructor(private http: HttpClient) { }

  static ngInjectableDef = undefined;

  GroupedList: Observable<any[]>;

  readonly baseURL = 'http://localhost:5000/api';

  /**
   * This functoin calls the GetResultsInRange function
   * from the ShippingResultsController in EPI_API
   * @param facility      current facility
   * @param startDate     start date
   * @param endDate       end date
   * */
  getResultsInRange(facility: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(this.baseURL + '/ShippingResults/GetByRange/' + facility + '/' + startDate + '/' + endDate);
  }

  download(facility: string, startDate: string, endDate: string) {
    console.log(this.baseURL + '/Download/' + facility + '/' + startDate + '/' + endDate);
    return this.http.get(this.baseURL + '/Download/' + facility + '/' + startDate + '/' + endDate, {});
  }

  delete() {
    return this.http.get(this.baseURL + '/ShippingResults/DeleteFile');
  }
}
