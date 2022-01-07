import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetURLService {
  constructor(private router: Router) { }
  baseURL: string;
  siteURL: string = window.location.href;

  /**
   * This function is called in the service classes.
   * It is used to determine if a test environement is
   * being used or if the program is live. It will assign
   * the proper URL for API calls.
   * */
  getURL(): string {
    console.log(this.siteURL);

    if (this.siteURL.includes("edi")) {
      this.baseURL = 'http://edi_api/api';
    }
    else {
      this.baseURL = 'http://localhost:5000/api';
    }
    return this.baseURL;
  }
}
