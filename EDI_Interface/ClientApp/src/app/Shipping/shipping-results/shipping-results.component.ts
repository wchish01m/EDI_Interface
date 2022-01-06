import { DatePipe } from '@angular/common';
import { HostListener, OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { parse } from 'querystring';
import { Subscription } from 'rxjs';
import { ShippingResultsService } from '../../Shared/shipping-results.service';

@Component({
  selector: 'app-shipping-results',
  templateUrl: './shipping-results.component.html',
  styleUrls: ['./shipping-results.component.css']
})
/** shipping-results component*/
export class ShippingResultsComponent implements OnInit, OnDestroy {
  selectedDate: string;
  paramStartDate: string;
  paramEndDate: string;
  yesterday: string;
  tomorrow: string;
  facility: string;
  message: string;
  responseBody: string;
  subscriptions: Subscription[] = [];

  /** shipping-results ctor */
  constructor(
    private service: ShippingResultsService,
    private route: ActivatedRoute,
    public datepipe: DatePipe) { }

  /**
   * This is called when the page is initially loaded in.
   * */
  ngOnInit(): void {
    var param$ = this.route.queryParams
      .subscribe(params => {
        this.facility = params.facility;
        if (typeof this.selectedDate !== 'undefined') {
          this.selectedDate = params.selectedDate;
        }
      });

    this.subscriptions.push(param$);

    if (typeof this.selectedDate !== 'undefined') {
      let startDateString = this.selectedDate.split('-');
      let startDate = new Date(parseInt(startDateString[0]), parseInt(startDateString[1]) - 1, parseInt(startDateString[2]));
      let endDate = new Date(parseInt(startDateString[0]), parseInt(startDateString[1]) - 1, parseInt(startDateString[2]));

      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() + 1);

      this.paramStartDate = this.formatDate(startDate.toString());
      this.paramEndDate = this.formatDate(endDate.toString());

      this.checkDate();

      this.getGroupedList();
    }

    if ((document.getElementById('startDate') as HTMLInputElement).value === '') {
      this.getDates();
      (document.getElementById('startDate') as HTMLInputElement).value = this.paramStartDate;
      (document.getElementById('endDate') as HTMLInputElement).value = this.paramEndDate;
      this.getGroupedList();
    }
    this.checkUrl();
  }

  /**
   * This function checks to see if the value of the hideFacility HTML Element
   * id equal to this.facility. If it isn't it will set it equal to this.facility
   * and call the refreshButton function to reaload the table with the
   * appropriate data.
   * */
  checkUrl() {
    var check$ = this.route.queryParams
      .subscribe(params => {
        if ((document.getElementById('hideFacility') as HTMLInputElement).value != this.facility) {
          (document.getElementById('hideFacility') as HTMLInputElement).value = this.facility;
          this.refreshButton();
        }
      });
    this.subscriptions.push(check$);
  }

  /**
   * This function gets all the requested information on parts according to facility
   * and date range.
   * */
  getGroupedList() {
    this.checkDate();
    this.showLoader();
    var sub$ = this.service.getResultsInRange(this.facility, this.paramStartDate, this.paramEndDate)
      .subscribe((data: any) => {
        this.service.GroupedList = data;
        this.hideLoader();
      });
    this.subscriptions.push(sub$);
  }

  /**
   * Gets yesterday's and tomorrow's dates.
   * */
  getDates() {
    this.yesterday = this.getStartOfWeek();
    this.tomorrow = this.getEndOfWeek();

    var start = document.getElementById('startDate') as HTMLInputElement;
    var end = document.getElementById('endDate') as HTMLInputElement;

    start.value = this.yesterday;
    end.value = this.tomorrow;

    this.paramStartDate = this.yesterday;
    this.paramEndDate = this.tomorrow;
  }

  /**
   * This function gets the start date of the current week.
   * */
  getStartOfWeek() {
    const initialDate = new Date();
    var yr = initialDate.getFullYear();
    var mon = (initialDate.getMonth() + 1).toString().padStart(2, '0');
    var start = new Date(initialDate.setDate(initialDate.getDate() - initialDate.getDay())).toString().padStart(2, '0');
    var day = start.substr(8, 2);

    if (parseInt(day) >= 30) {
      mon = (parseInt(mon) - 1).toString();
    }

    // Handle entering new month
    //if (day > this.getEndOfWeek().substr(8, 2)) {
    //  mon = (parseInt(mon) - 1).toString();
    //}

    //alert("START: " + yr + '-' + mon + '-' + day + ' ');

    return yr + '-' + mon + '-' + day + ' ';
  }

  /**
   * This function gets the end date of the current week.
   * */
  getEndOfWeek() {
    var d = new Date(this.getStartOfWeek());
    var start = new Date(d);
    var end = start.setDate(start.getDate() + 6);
    var endAsString = this.datepipe.transform(end, 'yyyy-MM-dd');
    return endAsString;
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

    return [year, month, day].join('-');
  }

  /**
   * This function is called when the "refresh" button is click,
   * and will show this visitor list according to the new dates entered.
   * */
  refreshButton() {
    var newStart;
    var newEnd;

    newStart = (document.getElementById('startDate') as HTMLInputElement).value;
    newEnd = (document.getElementById('endDate') as HTMLInputElement).value;
    this.showLoader();
    var sub$ = this.service.getResultsInRange(this.facility, newStart, newEnd)
      .subscribe((data: any) => {
        this.service.GroupedList = data;
        this.hideLoader();
      });
    this.subscriptions.push(sub$);
  }

  /**
   * This function is called when the "refresh" button is click,
   * and will show this visitor list according to the new dates entered.
   * */
  refreshResults() {
    var newStart;
    var newEnd;

    newStart = (document.getElementById('startDate') as HTMLInputElement).value;
    newEnd = (document.getElementById('endDate') as HTMLInputElement).value;
    
    var sub2$ = this.service.getResultsInRange(this.facility, newStart, newEnd)
      .subscribe((data: any) => {
        this.service.GroupedList = data;
      });
    this.subscriptions.push(sub2$);
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
   * This function handles searching in the table.
   * */
  search() {
    var searchInput = <HTMLInputElement>document.getElementById('searchInput');
    var table = document.getElementById('groupedResults');
    var rows = table.getElementsByTagName('tr');

    this.showLoader();
    for (var x = 1; x < rows.length; x++) {
      var cell = rows[x].getElementsByClassName('searchable');
      if (cell.length > 0) {
        if (cell[0].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase())) {
          rows[x].style.visibility = 'visible';
        }
        else {
          rows[x].style.visibility = 'collapse';
        }
        rows[x + 1].style.visibility = 'collapse';
        x += 1;
      }
    }
    this.hideLoader();
  }

  /**
   * This function will collapse all open sub tables,
   * clear the search bar, and display the original results
   * of the table.
   * */
  clearSearch() {
    var searchInput = <HTMLInputElement>document.getElementById('searchInput');
    var table = document.getElementById('groupedResults');
    var rows = table.getElementsByTagName('tr');

    searchInput.value = '';
    for (var x = 1; x < rows.length; x++) {
      var cell = rows[x].getElementsByClassName('searchable');
      if (cell.length > 0) {
        rows[x + 1].style.visibility = 'collapse';
        x += 1;
      }
    }
    this.search();
  }

  /**
   * This function will show/hide the shipping info for the
   * selected row from the main table.
   * @param tpc holds tpCode
   * @param pn holds part number
   * @param tq holds sum quantity
   * @param sd holds ship date
   */
  displayPartInfo(tpc, pn, tq, sd) {
    var date = new Date(sd);
    var day = ('0' + (date.getDate())).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    var shipDate = year + "" + month + "" + day;
    var rows = document.getElementById(tpc + '_' + pn + '_' + tq + '_' + shipDate);

    if (rows.style.visibility == 'collapse') {
      rows.style.visibility = 'visible';
    }
    else {
      rows.style.visibility = 'collapse';
    }
  }

  /**
   * Sets display of loader element to none after subscribe.
   * */
  hideLoader() {
    let l = document.querySelector("#loader");
    let i = document.querySelector("#loaderImg");
    let b = document.querySelector('#backDrop');

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
    let b = document.querySelector('#backDrop');

    l.classList.remove("hideModal");
    i.classList.remove("hideModal");
    b.classList.remove("hideModal");

    document.getElementById("loader").style.display = "flex";
    document.getElementById("loaderImg").style.display = "flex";
    document.getElementById("backDrop").style.display = "flex";
  }

  /**
   * Will build the excel file for the current results
   * as well as download the excel file after building is complete.
   * */
  buildFile() {
    var newStart = (document.getElementById('startDate') as HTMLInputElement).value;
    var newEnd = (document.getElementById('endDate') as HTMLInputElement).value;

    var build$ = this.service.buildFile(this.facility, newStart, newEnd)
      .subscribe((data: any) => {
        this.responseBody = data;
        this.enableDownloadButton();
      });

    this.subscriptions.push(build$);

    this.showModal("YOUR FILE IS BEING BUILT. DEPENDING ON THE SIZE OF THE FILE THIS COULD TAKE A WHILE. THE DOWNLOAD BUTTON WILL ENABLE WHEN COMPLETE...");
  }

  enableDownloadButton() {
    var downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    downloadBtn.disabled = false;
    downloadBtn.style.backgroundColor = "#2587ff";
  }

  /**
   * This function will download the excel file after it is done
   * being built.
   * */
  download() {
    var downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    var db = document.getElementById('export') as HTMLAnchorElement;
    var re = "File_Export\\";

    var download$ = this.service.download(this.responseBody)
      .subscribe((data: any) => {
        console.log("DOWNLOADING FILE...");
      })

    download$.unsubscribe();

    /*db.href = "http://localhost:5000/api/ShippingResults/Download/" + this.responseBody.replace(re, "File_Export%5C");*/
    db.href = "http://edi_api/api/ShippingResults/Download/" + this.responseBody.replace(re, "File_Export%5C");

    downloadBtn.disabled = true;
    downloadBtn.style.backgroundColor = "#808080";

    this.refreshResults();
    this.exitModal();
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
   * This function is called when you exit the current component,
   * and unsubscribed from all subscriptions.
   * */
  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((subscription) =>
      subscription.unsubscribe());
  }
}
