import {Component} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {Password, PasswordService} from '../services/passwords/password.service';
import {AlertController} from '@ionic/angular';


@Component({
    selector: 'app-password-details',
    templateUrl: './password-details.page.html',
    styleUrls: ['./password-details.page.scss'],
})

/**
 * This is a page for viewwing details about a password such as its name, and the
 * password value associated with it. Also offers services for changing a passwords value,
 * or deleting it
 */
export class PasswordDetailsPage {

    /**
     * The password currently being viewed on the page
     */
    currentPassword: Password = {
        passwordName: null,
        password: null
    };
    passwordEyeIcon = 'eye-off';
    passwordType = 'password';

    constructor(private passwordService: PasswordService,
                private route: ActivatedRoute,
                private router: Router,
                private alertController: AlertController) {

        /**
         * This is used in place of ngOnInit so that the app can get
         * the parameters passed during navigation. This is currently
         * unavailable with ngOnInit
         */
        this.route.queryParams.subscribe(() => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.currentPassword = this.router.getCurrentNavigation().extras.state.selectedPassword;
            }
        });
    }

    /**
     * Changes the password between hidden/visible
     */
    hideShowPassword() {
        this.passwordEyeIcon = this.passwordEyeIcon === 'eye' ? 'eye-off' : 'eye';
        this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    }

    /**
     * An alert asking the user to confirm whether they wish to delete
     * the password
     */
    async queryDelete() {
        const passwordChangedAlert = await this.alertController.create({
            header: 'Confirm Delete',
            message: 'Are you sure you want to delete the password for ' + this.currentPassword.passwordName + '? This is irreversible',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    role: 'delete',
                    handler: () => {
                        this.deletePassword();
                    }
                }
            ]
        });
        await passwordChangedAlert.present();
    }

    /**
     * Alert asking the user to confirm they wish to change the password for the currently
     * selected password object
     */
    async queryUpdate() {
        const passwordChangedAlert = await this.alertController.create({
            header: 'Confirm Password Update',
            message: 'Are you sure you want to update the password for ' + this.currentPassword.passwordName + '?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Confirm',
                    role: 'confirm',
                    handler: () => {
                        this.updatePassword();
                    }
                }
            ]
        });
        await passwordChangedAlert.present();
    }

    /**
     * Ensures that the entered passwords name and password value are at least 1
     * @param currentPassword The password being validated
     */
    private validatePassword = (currentPassword: Password) => currentPassword.password.length > 0
        && currentPassword.passwordName.length > 0

    /**
     * Deletes the password from the users storage then navigates back to the
     * view-passwords page
     */
    deletePassword() {
        this.passwordService.deletePassword(this.currentPassword).then(() => {
            this.router.navigate(['/view-passwords']);
        });
    }

    /**
     * Attempts to update the users password, if successful the app navigates to the
     * view passwords page. Otherwise presents an an alert informing the user why the
     * password is invalid
     */
    updatePassword() {
        if (this.validatePassword(this.currentPassword)) {
            this.passwordService.attemptUpdatePassword(this.currentPassword).then((success) => {
                if (success) {
                    this.router.navigate(['/view-passwords']);
                } else {
                    this.showInvalidDetailsAlert();
                }
            });
        } else {
            this.showEmptyDetailsAlert();
        }
    }

    /**
     * Navigates the user back to the view-passwords screen
     */
    onBack() {
        this.router.navigate(['/view-passwords']);
    }

    /**
     * An alert that informs the user their entered password was invalid
     * as nothing was entered
     */
    private async showEmptyDetailsAlert() {
        const invalidDetailsAlert = await this.alertController.create({
            header: 'Invalid Password',
            message: 'You must enter a value for both password name and password',
            buttons: [
                {
                    text: 'Close',
                    role: 'close'
                }
            ]
        });
        await invalidDetailsAlert.present();
    }

    /**
     * An alert informing the user that they already have a password stored with this name,
     * and that they will need to pick another name
     */
    private async showInvalidDetailsAlert() {
        const invalidDetailsAlert = await this.alertController.create({
            header: 'Invalid Password Name',
            message: 'You already have a password with that name',
            buttons: [
                {
                    text: 'Close',
                    role: 'close'
                }
            ]
        });
        await invalidDetailsAlert.present();
    }
}
