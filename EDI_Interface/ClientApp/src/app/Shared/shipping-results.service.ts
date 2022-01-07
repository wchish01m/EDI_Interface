import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SetURLService } from './setURL.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingResultsService {
  constructor(private http: HttpClient,
              private router: Router,
              private service: SetURLService) { }

  static ngInjectableDef = undefined;
  GroupedList: Observable<any[]>;

  /**
   * This functoin calls the GetResultsInRange function
   * from the ShippingResultsController in EPI_API
   * @param facility      current facility
   * @param startDate     start date
   * @param endDate       end date
   * */
  getResultsInRange(facility: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(this.service.getURL() + '/ShippingResults/GetByRange/' + facility + '/' + startDate + '/' + endDate);
  }

  /**
   * This function calls the Download function
   * in the ShippingResultsController in EDI_API
   * @param facility
   * @param startDate
   * @param endDate
   */
  buildFile(facility: string, startDate: string, endDate: string) {
    return this.http.get(this.service.getURL() + '/ShippingResults/BuildFile/' + facility + '/' + startDate + '/' + endDate, { responseType: 'text' });
  }

  download(filePath: string) {
    return this.http.get(this.service.getURL() + '/ShippingResults/Download/' + filePath, {});
  }
}
