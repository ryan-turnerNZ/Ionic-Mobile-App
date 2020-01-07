import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
/**
 * Basic home page that contains a list of pages the user
 * can naviagte to.
 */
export class HomePage {
  pages: Array<{pageName: string, descriptor: string}>;

  /**
   * Creates a list of page names with associated descriptors to be
   * displayed on the screen
   *
   * @param router This router is used to navigate around the application
   */
  constructor(private router: Router) {
    this.pages = [{pageName: 'add-password', descriptor: 'Add a Password'},
      {pageName: 'view-passwords', descriptor: 'View Passwords'},
      {pageName: 'suggest-password', descriptor: 'Suggest a Password'},
      {pageName: 'settings', descriptor: 'Settings'}];
  }

  /**
   * When a page is clicked on the user is navigated to that page using
   * the router
   *
   * @param pageName Name of the page clicked on, and to be navigated to
   */
  pageClicked(pageName: string) {
    this.router.navigate(['/' + pageName]);
  }
}
