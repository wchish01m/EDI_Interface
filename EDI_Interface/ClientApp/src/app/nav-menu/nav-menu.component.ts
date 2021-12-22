import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  intranetButton() {
    window.location.href = 'http://srv04/Intranet/index.html';
  }

  logoutButton() {
    this.router.navigate(['/login'],
      {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        skipLocationChange: false
      });
  }

  /**
   * This function will assign the facility variable to TAC-AL.
   * */
  alabamaClick() {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams:
        {
          facility: 'TAC-AL'
        },
        queryParamsHandling: 'merge',
      });
  }

  /**
   * This function will assign the facility variable to TAC-TN.
   * */
  tennesseeClick() {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams:
        {
          facility: 'TAC-TN'
        },
        queryParamsHandling: 'merge',
      });
  }

  /**
   * This function will assign the facility variable to TAC-OH.
   * */
  ohioClick() {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: {
          facility: 'TAC-OH'
        },
        queryParamsHandling: 'merge',
      });
  }

  /**
   * This function will assign the facility variable to TAC-MS.
   * */
  mississippiClick() {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: {
          facility: 'TAC-MS'
        },
        queryParamsHandling: 'merge',
      });
  }
}
