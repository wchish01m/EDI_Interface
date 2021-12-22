import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SalesRequirementsService } from '../../Shared/sales-requirements.service';

@Component({
  selector: 'app-sales-requirements',
  templateUrl: './sales-requirements.component.html',
  styleUrls: ['./sales-requirements.component.css']
})
/** sales-requirements component*/
export class SalesRequirementsComponent implements OnInit, OnDestroy {
  // Class variables
  facility: string;
  subscriptions: Subscription[] = [];

  // Sales Requirements constructor
  constructor(
    private service: SalesRequirementsService,
    private route: ActivatedRoute) { }

  /**
   * Called when page is initialized
   * */
  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.facility = params.facility;
      });
    this.checkUrl();
  }

  /**
   * This function checks to see if the value of the hideFacility HTML Element
   * id equal to this.facility. If it isn't it will set it equal to this.facility
   * and call the getSalesRequirements function to reaload the table with the
   * appropriate data.
   * */
  checkUrl() {
    this.route.queryParams
      .subscribe(params => {
        if ((document.getElementById('hideFacility') as HTMLInputElement).value != this.facility) {
          (document.getElementById('hideFacility') as HTMLInputElement).value = this.facility;
          this.getSalesRequirements();
        }
      });
  }

  /**
   * Calls the getSalesInfo function in the service class.
   * */
  getSalesRequirements() {
    this.showLoader();
    var sub$ = this.service.getSalesInfo(this.facility)
      .subscribe((data: any) => {
        this.service.SalesInfo$ = data;
        console.log(data);
        this.hideLoader();
      });
    this.subscriptions.push(sub$);
  }

  /**
   * This function handles searching in the table
   * */
  search() {
    var searchInput = <HTMLInputElement>document.getElementById('searchInput');
    var table = document.getElementById('salesRequirements');
    var rows = table.getElementsByTagName('tr');
    var x;

    for (x = 1; x < rows.length; x++) {
      var cell = rows[x].getElementsByTagName('td')
      if (cell[0].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[1].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[2].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[3].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[4].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[5].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[6].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[9].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase()) ||
        cell[13].innerHTML.toUpperCase().includes(searchInput.value.toUpperCase())) {
        rows[x].style.visibility = 'visible';
      }
      else {
        rows[x].style.visibility = 'collapse';
      }
    }
  }

  /**
   * This function will collapse all open sub tables,
   * clear the search bar, and display the original results
   * of the table.
   * */
  clearSearch() {
    var searchInput = <HTMLInputElement>document.getElementById('searchInput');
    searchInput.value = '';
    this.showLoader();
    var sub$ = this.service.getSalesInfo(this.facility)
      .subscribe((data: any) => {
        this.service.SalesInfo$ = data;
        console.log(data);
        this.hideLoader();
      });
    this.subscriptions.push(sub$);
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
   * This function is called when you exit the current component,
   * and unsubscribed from all subscriptions.
   * */
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) =>
      subscription.unsubscribe());
  }
}
