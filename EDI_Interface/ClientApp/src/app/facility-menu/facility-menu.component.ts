import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facility-menu',
  templateUrl: './facility-menu.component.html',
  styleUrls: ['./facility-menu.component.css']
})
/** facility-menu component*/
export class FacilityMenuComponent {
  /** facility-menu ctor */
  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  /**
   * This function will assign the facility variable to TAC-AL.
   * */
  facilityClick(selectedFacility: string) {
    this.router.navigate(['/home'],
      {
        relativeTo: this.route,
        queryParams:
        {
          facility: selectedFacility
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false
      });
  }

  /**
   * This function will assign the facility variable to TAC-AL.
   * */
  alabamaClick() {
    this.router.navigate(['/home'],
      {
        relativeTo: this.route,
        queryParams:
        {
          facility: 'TAC-AL'
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false
      });
  }

  /**
   * This function will assign the facility variable to TAC-TN.
   * */
  tennesseeClick() {
    this.router.navigate(['/home'],
      {
        relativeTo: this.route,
        queryParams:
        {
          facility: 'TAC-TN'
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false
      });
  }

  /**
   * This function will assign the facility variable to TAC-OH.
   * */
  ohioClick() {
    this.router.navigate(['/home'],
      {
        relativeTo: this.route,
        queryParams: {
          facility: 'TAC-OH'
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false
      });
  }

  /**
   * This function will assign the facility variable to TAC-MS.
   * */
  mississippiClick() {
    this.router.navigate(['/home'],
      {
        relativeTo: this.route,
        queryParams: {
          facility: 'TAC-MS'
        },
        queryParamsHandling: 'merge',
        skipLocationChange: false
      });
  }
}
