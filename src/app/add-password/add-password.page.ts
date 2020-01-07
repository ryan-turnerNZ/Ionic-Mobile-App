import {Component, OnInit} from '@angular/core';
import {PasswordService, Password} from '../services/passwords/password.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-add-password',
    templateUrl: './add-password.page.html',
    styleUrls: ['./add-password.page.scss'],
})

/**
 * This page allows for the user to add a password to their
 * database storage
 */
export class AddPasswordPage implements OnInit {

    /**
     * These two fields are for changing the password input field
     * to hidden or visible
     */

    passwordEyeIcon = 'eye-off';
    passwordType = 'password';


    passwordForm: FormGroup;

    /**
     * This password will become the password to be
     * added to the firebase storage
     */
    password: Password = {
        passwordName: null,
        password: null
    };


    constructor(private router: Router,
                private passwordService: PasswordService,
                private alertController: AlertController) {
    }

    /**
     * Creates the form when the page is initialized.
     * This is a basic form that only has two controls,
     * and both controls are only required with no further
     * validators
     */
    ngOnInit() {
        this.passwordForm = new FormGroup({
            passwordName: new FormControl('', {
                updateOn: 'change', validators: Validators.compose([
                    Validators.required
                ])
            }),
            password: new FormControl('', {
                updateOn: 'change', validators: Validators.compose([
                    Validators.required
                ])
            })
        });
    }

    /**
     * Attempts to save the password using the password service, if the save is successful then
     */
    savePassword() {
        this.passwordService.attemptPasswordSave(this.password).then((success) => {
            if (success) {
                this.router.navigate(['/home']);
            } else {
                this.showInvalidDetailsAlert();
            }
        });
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
     * Changes the password input between visible and hidden
     */
    hideShowPassword() {
        this.passwordEyeIcon = this.passwordEyeIcon === 'eye' ? 'eye-off' : 'eye';
        this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    }
}
