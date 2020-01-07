import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService, User} from '../services/login/login.service';
import {AlertController} from '@ionic/angular';
import {PasswordService} from '../services/passwords/password.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})

/**
 * This is a page providing services to the user with regards to their account
 * such as changing their password, or deleting their account
 */
export class SettingsPage implements OnInit {
    currentUser: User;

    constructor(private router: Router,
                private loginService: LoginService,
                private passwordService: PasswordService,
                private alertController: AlertController) {}

    ngOnInit() {
        this.currentUser = this.loginService.getLoggedInUser();
    }


    /**
     * Logs the user out using the login service then
     * navigates back to the login screen
     */
    logUserOut() {
        this.loginService.logoutUser();
        this.router.navigate(['/login']);
    }

    /**
     * Creates an alert asking a user to confirm whether they
     * wish to permanently delete their account.
     */
    async queryDeleteUser() {
        const deleteAccountAlert = await this.alertController.create({
            header: 'Delete Account',
            message: 'Are you sure you want to delete you account? All your stored passwords will be lost',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Confirm',
                    role: 'confirm',
                    handler: () => {
                        this.finalDelete();
                    }
                }
            ]
        });
        await deleteAccountAlert.present();
    }

    /**
     * Finalises the deletion process
     * and removes the user from the firestore
     * database
     */
    private finalDelete() {
        this.loginService.deleteUser();
        this.router.navigate(['/login']);
    }

    /**
     * Creates an alert that allows a user to change their password
     * to something new
     */
    async changeUserDetails() {
        const changeDetailsAlert = await this.alertController.create({
            header: 'Change Your Password',
            inputs: [
                {
                    name: 'password',
                    type: 'text',
                    placeholder: 'New Password'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Confirm',
                    role: 'confirm',
                    /**
                     * This nested functions first validates the
                     * password by checking length and that it is
                     * a different password
                     *
                     * @param data the new password from the
                     * alert input
                     */
                    handler: (data) => {
                        if (data.password.length < 1) {
                            this.showInvalidDetailsAlert();
                        } else if (this.currentUser.password === data.password) {
                            this.showIdenticalDetailsAlert();

                        } else if (!this.validatePassword(data.password)) {
                            this.showInvalidDetailsAlert();
                        } else {
                            this.loginService.attemptChangeDetails(this.currentUser, data.password);
                            this.showPasswordChanged();
                        }
                    }
                }
            ]
        });
        await changeDetailsAlert.present();
    }

    /**
     * Ensures that the provided password is of the correct length and also
     * fits the regex pattern
     *
     * @param password The password to be validated
     */
    private validatePassword(password: string): boolean {
        if (password.length < 5 || password.length > 20) {
            return false;
            // This regex checks that a string has 1 lowercase, 1 uppercase, and 1 number
        } else if (!password.match('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')) {
            return false;
        }
        return true;
    }


    /**
     * Shows an alert informing the user that the password
     * they entered is identical to their current password
     * and cannot be changed
     */
    private async showIdenticalDetailsAlert() {
        const identicalDetailsAlert = await this.alertController.create({
            header: 'Invalid Password',
            message: 'You have not entered a new password',
            buttons: [
                {
                    text: 'Close',
                    role: 'close'
                }
            ]
        });
        await identicalDetailsAlert.present();
    }

    /**
     * Informs the user that their password did not pass the validation
     * method and cannot be changed to their input
     */
    private async showInvalidDetailsAlert() {
        const invalidDetailsAlert = await this.alertController.create({
            header: 'Invalid Password',
            message: 'The password you have entered is invalid. Passwords must be between 5 and 20 characters long, ' +
                'contain 1 uppercase letter, 1 lowercase letter, and 1 number',
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
     * Alert to inform the user that their password was successfully changed
     */
    private async showPasswordChanged() {
        const passwordChangedAlert = await this.alertController.create({
            header: 'Password Changed',
            message: 'Your password has been successfully changed',
            buttons: [
                {
                    text: 'Close',
                    role: 'close'
                }
            ]
        });
        await passwordChangedAlert.present();
    }
}
