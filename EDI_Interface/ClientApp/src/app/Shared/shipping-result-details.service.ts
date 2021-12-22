import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingResultDetails } from './shipping-result-details.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingResultDetailsService {
  constructor(private http: HttpClient) { }

  static ngInjectableDef = undefined;

  ResultsList: Observable<any[]>;

  SearchFields: ShippingResultDetails = new ShippingResultDetails();

  readonly baseURL = 'http://localhost:5000/api'

  /**
   * This function calls the GetDetailsBySearch function from EDI_API.
   * It allows the user to get specific results according to the search
   * parameters they enter.
   * @param facility        current facility
   * @param partNum         part number
   * @param tpCode          trading partner code
   * @param shipperNum      shipping number
   * @param referenceNum    reference number
   * @param custSerial      custom serial number
   * @param topSerial       topre's serial number
   * @param startDate       start date
   * @param endDate         end date
   */
  getDetailsBySearch(facility?: string, partNum?: string, tpCode?: string, shipperNum?: string, referenceNum?: string, custSerial?: string,
    topSerial?: string, startDate?: string, endDate?: string): Observable<any> {
    return this.http.get<any>(this.baseURL + '/ShippingResultDetails/GetDetailsBySearch?facility=' + facility + "&partNum=" + partNum + "&tpCode=" + tpCode + "&shipperNum=" + shipperNum
      + "&referenceNum=" + referenceNum + "&custSerial=" + custSerial + "&topSerial=" + topSerial + "&startDate=" + startDate + "&endDate=" + endDate);
  }
}
