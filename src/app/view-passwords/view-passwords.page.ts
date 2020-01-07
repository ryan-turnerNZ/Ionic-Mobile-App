import {Component, OnDestroy} from '@angular/core';
import {Password, PasswordService} from '../services/passwords/password.service';
import {AlertController} from '@ionic/angular';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Component({
    selector: 'app-view-passwords',
    templateUrl: './view-passwords.page.html',
    styleUrls: ['./view-passwords.page.scss'],
})

/**
 * This class is the JS for the password viewing page. This page allows a user to view all of their
 * stored passwords
 */
export class ViewPasswordsPage implements OnDestroy {
    passwords: Password[] = [];



    constructor(private route: ActivatedRoute,
                private passwordService: PasswordService,
                private alertController: AlertController,
                private router: Router) {
        /**
         * This is used as opposed to OnInit as it needs to be called when navigating back to a page.
         * ngOnInit does not do this
         */
        route.params.subscribe(() => {
            this.populateList();

        });
    }


    /**
     * This deletes the passwords on desctruvtion
     * of the screen so as to avoid duplicating the
     * list of passwords
     */
    ngOnDestroy() {
        this.passwords = [];
    }

    /**
     * Retrieves the list of passwords from the password service
     */
    async populateList() {
        await this.passwordService.getPasswords().then((result) => {
            this.passwords = result;
        });
    }

    /**
     * Activates when a user clicks on a password on the screen.
     * This takes the user to a page where they can change details
     * about the password, and delete it if they wish
     *
     * @param password The password that was clicked on-screen
     */
    onPasswordClick(password: Password) {
        const navExtras: NavigationExtras = {
            state: {
                selectedPassword: password
            }
        };
        this.router.navigate(['/password-details'], navExtras);
    }
}
