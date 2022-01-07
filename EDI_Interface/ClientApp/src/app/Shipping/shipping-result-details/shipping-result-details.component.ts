import { AfterViewChecked, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShippingResultDetailsService } from '../../Shared/shipping-result-details.service';

@Component({
  selector: 'app-shipping-result-details',
  templateUrl: './shipping-result-details.component.html',
  styleUrls: ['./shipping-result-details.component.css']
})
/** shipping-result-details component*/
export class ShippingResultDetailsComponent implements OnInit, OnDestroy {
  selectedDate: string;
  paramStartDate: string;
  paramEndDate: string;
  yesterday: string;
  tomorrow: string;
  facility: string;
  isLoaded: boolean = false;
  searchTopSerial: string;
  subscriptions: Subscription[] = [];

  /** shipping-results ctor */
  constructor(
    private service: ShippingResultDetailsService,
    private route: ActivatedRoute) { }

  ResultsList: any = [];

  assignVal() {
    alert("ASSIGNING...")
    this.searchTopSerial = (document.getElementById('searchTopSerial') as HTMLInputElement).value;
  }

  highlighSelection(myVar) {
    var table = document.getElementById('shippingResultDetails');
    var rows = table.getElementsByTagName('tr');

    for (var x = 1; x < rows.length; x++) {
      var cell = rows[x].getElementsByTagName('td');
      if (cell[8].innerHTML.toUpperCase() === myVar.toUpperCase()) {
        rows[x].style.backgroundColor = 'yellow';
      }
    }
  }

  /**
   * This is called when the page is initially loaded in.
   * */
  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.facility = params.facility;
        console.log(this.facility);
      });
    this.checkUrl();
  }

  /**
   * This function checks to see if the value of the hideFacility HTML Element
   * id equal to this.facility. If it isn't it will set it equal to this.facility
   * and call the refreshButton function to reaload the table with the
   * appropriate data.
   * */
  checkUrl() {
    this.route.queryParams
      .subscribe(params => {
        if ((document.getElementById('hideFacility') as HTMLInputElement).value != this.facility && this.isLoaded != false) {
          (document.getElementById('hideFacility') as HTMLInputElement).value = this.facility;
          this.newFacilitySearch();
        }
      });
  }

  /**
   * This function will be called when the facility URL variable changes.
   * */
  newFacilitySearch() {
    var searchPn = (document.getElementById('searchPartNum') as HTMLInputElement).value;
    var searchTpCode = (document.getElementById('searchTpCode') as HTMLInputElement).value;
    var searchShipperNum = (document.getElementById('shipperNum') as HTMLInputElement).value;
    var searchReferenceNum = (document.getElementById('referenceNum') as HTMLInputElement).value;
    var searchCustSerial = (document.getElementById('shipSerial') as HTMLInputElement).value;
    var searchTopSerial = (document.getElementById('searchTopSerial') as HTMLInputElement).value;
    var newStart = (document.getElementById('startDate') as HTMLInputElement).value;
    var newEnd = (document.getElementById('endDate') as HTMLInputElement).value;

    this.showLoader();
    var sub$ = this.service.getDetailsBySearch(this.facility, searchPn, searchTpCode, searchShipperNum, searchReferenceNum, searchCustSerial, searchTopSerial, newStart, newEnd)
      .subscribe((data: any) => {
        this.ResultsList = data;
        this.hideLoader();
      });
    this.subscriptions.push(sub$);
  }

  /**
   * This function formats a date so it can be accepted as
   * a parameter in the getVisitorsInRange function.
   * @param date
   */
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [month, day, year].join('/');
  }

  /**
   * Calls the getDetailsByShipperNum function in the service class.
   * */
  search() {
    // Input fields
    var searchPn = (document.getElementById('searchPartNum') as HTMLInputElement).value;
    var searchTpCode = (document.getElementById('tpCode') as HTMLInputElement).value;
    var searchShipperNum = (document.getElementById('shipperNum') as HTMLInputElement).value;
    var searchReferenceNum = (document.getElementById('referenceNum') as HTMLInputElement).value;
    var searchCustSerial = (document.getElementById('shipSerial') as HTMLInputElement).value;
    var searchTopSerial = (document.getElementById('serialNumber') as HTMLInputElement).value;
    var newStart = (document.getElementById('startDate') as HTMLInputElement).value;
    var newEnd = (document.getElementById('endDate') as HTMLInputElement).value;

    // Message to display if not search fields are entered
    var msg = "Please enter at least one search field. You may search by production and/or shipping information.";

    // If not search fields have a value display modal message
    // Otherwise send a call the service class with proper variables.
    if (searchPn === "" && searchTpCode === "" && searchShipperNum === "" && searchReferenceNum === "" && searchCustSerial === "" && searchTopSerial === "" && newStart === "" && newEnd === "") {
      this.showModal(msg);
    }
    else {
      this.showLoader();
      var sub$ = this.service.getDetailsBySearch(this.facility, searchPn, searchTpCode, searchShipperNum, searchReferenceNum, searchCustSerial, searchTopSerial, newStart, newEnd)
        .subscribe((data: any) => {
          this.ResultsList = data;
          this.hideLoader();
        });
      this.subscriptions.push(sub$);
    }

    // Set isLoaded to true
    this.isLoaded = true;
  }

  /**
   * Checks the value of the input field called from.
   * If it is not blank or undefined it calls the search function.
   * Otherwise it does nothing.
   * @param searchVal
   */
  callSearch(searchVal: any) {
    if (searchVal.value !== '' && searchVal.value !== undefined) {
      alert(searchVal.value);
      this.search();
    }
  }

  /**
   * This function ensures that the date does not go out of bounds
   * for the possible number of days in any month.
   * */
  checkDate() {
    var date = new Date();
    var month = date.getMonth() + 2;
    var year = date.getFullYear();
    var ldpm = new Date();
    ldpm.setDate(1);
    ldpm.setHours(-1);
    var lastMonth = ldpm.getMonth() + 1;
    var lastDay = ldpm.getDate();
    var dateArrayStart = this.paramStartDate.split("-");
    var dateArrayEnd = this.paramEndDate.split("-");

    if (parseInt(dateArrayStart[2]) < 1) {
      if (parseInt(dateArrayStart[1]) < 10) {
        this.paramStartDate = this.paramStartDate.replace(this.paramStartDate, year + "-" + "0" + lastMonth + "-" + lastDay);
        (document.getElementById('startDate') as HTMLInputElement).value = this.paramStartDate;
      }
      else {
        this.paramStartDate = this.paramStartDate.replace(this.paramStartDate, year + "-" + lastMonth + "-" + lastDay);
        (document.getElementById('startDate') as HTMLInputElement).value = this.paramStartDate;
      }
    }
    if (parseInt(dateArrayEnd[2]) > 31) {
      if (parseInt(dateArrayEnd[1]) < 10) {
        this.paramEndDate = this.paramEndDate.replace(this.paramEndDate, year + "-" + "0" + month + "-" + "01");
        (document.getElementById('endDate') as HTMLInputElement).value = this.paramEndDate;
      }
      else {
        this.paramEndDate = this.paramEndDate.replace(this.paramEndDate, year + "-" + month + "-" + "01");
        (document.getElementById('endDate') as HTMLInputElement).value = this.paramEndDate;
      }
    }
  }

  /**
   * Sets display of loader element to none after subscribe.
   * */
  hideLoader() {
    let l = document.querySelector("#loader");
    let i = document.querySelector("#loaderImg");
    let b = document.querySelector('#backDrop1');

    l.classList.add("hideModal");
    i.classList.add("hideModal");
    b.classList.add("hideModal");
  }

  /**
   * Sets display of loader element to inline-block before subscribe.
   * */
  showLoader() {
    let l = document.querySelector("#loader");
    let i = document.querySelector("#loaderImg");
    let b = document.querySelector('#backDrop1');

    l.classList.remove("hideModal");
    i.classList.remove("hideModal");
    b.classList.remove("hideModal");

    document.getElementById("loader").style.display = "flex";
    document.getElementById("loaderImg").style.display = "flex";
    document.getElementById("backDrop1").style.display = "flex";
  }

  /**
   * This function adds the hideModal class to the modalWindow
   * and backDrop when the user exits the modal.
   * */
  exitModal() {
    let m = document.querySelector('#modalWindow');
    let b = document.querySelector('#backDrop2');

    m.classList.add("hideModal");
    b.classList.add("hideModal");
  }

  /**
   * This functoin will remove the hideModal class from
   * the modalWindow and backDrop and set the display from
   * none to flex.
   * */
  showModal(message) {
    let m = document.querySelector('#modalWindow');
    let b = document.querySelector('#backDrop2');
    let msg = (document.getElementById('msg') as HTMLInputElement).textContent = message;

    m.classList.remove("hideModal");
    b.classList.remove("hideModal");

    document.getElementById("backDrop2").style.display = "flex";
    document.getElementById("modalWindow").style.display = "flex";
  }

  /**
   * This function enables the seach fields based off of
   * the checkboxes to allow users to search by production and/or
   * shipping info.
   * */
  enableTextInput() {
    // Checkboxes
    var prodInput = document.getElementById('production') as HTMLInputElement;
    var shipInput = document.getElementById('shipping') as HTMLInputElement;
    // Production search fields
    var searchTopSerial = document.getElementById('serialNumber') as HTMLInputElement;
    var searchStartDated = document.getElementById('startDate') as HTMLInputElement;
    var searchEndDate = document.getElementById('endDate') as HTMLInputElement;
    // Shipping search fields
    var searchTpCode = document.getElementById('tpCode') as HTMLInputElement;
    var searchShipperNum = document.getElementById('shipperNum') as HTMLInputElement;
    var searchReferenceNum = document.getElementById('referenceNum') as HTMLInputElement;
    var searchCustSerial = document.getElementById('shipSerial') as HTMLInputElement;

    // Handle production
    if (prodInput.checked) {
      searchTopSerial.disabled = false;
      searchStartDated.disabled = false;
      searchEndDate.disabled = false;
    }
    else {
      searchTopSerial.disabled = true;
      searchStartDated.disabled = true;
      searchEndDate.disabled = true;
    }

    // Handle shipping
    if (shipInput.checked) {
      searchTpCode.disabled = false;
      searchShipperNum.disabled = false;
      searchReferenceNum.disabled = false;
      searchCustSerial.disabled = false;
    }
    else {
      searchTpCode.disabled = true;
      searchShipperNum.disabled = true;
      searchReferenceNum.disabled = true;
      searchCustSerial.disabled = true;
    }
  }

  /**
   * This function is called when you exit the current component,
   * and unsubscribes from all subscriptions.
   * */
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) =>
      subscription.unsubscribe());
  }
}
