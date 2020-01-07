import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Password, PasswordService} from '../services/passwords/password.service';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-suggest-password',
    templateUrl: './suggest-password.page.html',
    styleUrls: ['./suggest-password.page.scss'],
})

/**
 * This is a page where a user can have a password suggested for them to use.
 */
export class SuggestPasswordPage implements OnInit {

    suggestedPassword: Password = {
        passwordName: null,
        password: null
    };
    addPasswordForm: FormGroup;

    /**
     * These are used to switch the password input between visible
     * and not visible
     */
    passwordEyeIcon = 'eye-off';
    passwordType = 'password';




    constructor(private passwordService: PasswordService, private router: Router, private alertController: AlertController) {
    }


    ngOnInit() {
        /**
         * Creates a form with two FormControls. These FormControls
         * validate both the passwordName and password the user enters.
         * This form only has validators that require the fields to be not empty
         */

        this.addPasswordForm = new FormGroup({
            passwordName: new FormControl('', {
                updateOn: 'change', validators: Validators.compose([
                    Validators.required,
                ])
            }),
            password: new FormControl('', {
                updateOn: 'change', validators: Validators.compose([
                    Validators.required,
                ])
            })
        });
    }

    /**
     * Changes the password field to be either visible as a test input,
     * or hidden as a password input
     */
    hideShowPassword() {
        this.passwordEyeIcon = this.passwordEyeIcon === 'eye' ? 'eye-off' : 'eye';
        this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    }

    /**
     * Generates a random password using a random generator and converting it to radix
     */
    generatePassword() {
        this.suggestedPassword.password = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    }

    /**
     * Attempts to save a password to the users firestore storage
     */
    onAddPassword() {
        this.passwordService.attemptPasswordSave(this.suggestedPassword).then((success) => {
            if (success) {
                this.router.navigate(['/home']);
            } else {
                this.showInvalidPasswordName();
            }
        });
    }

    /**
     * This is an alert that appears when a user trues to submit an invalid password
     */
    private async showInvalidPasswordName() {
        const passwordChangedAlert = await this.alertController.create({
            header: 'Invalid Password Name',
            message: 'That password name is already in use',
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
