import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {RegisterService, User} from '../services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

/**
 * This page is used to register a new user
 */
export class RegisterPage implements OnInit {
  passwordEyeIcon = 'eye-off';
  passwordType = 'password';
  registerForm: FormGroup;

  /**
   * A selection of validation messages that pop up when the
   * user is entering data to inform them of the requirements
   * of a username and password. These messages align with the
   * form validation controls.
   */
  validationMessages = {
    username: [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
  };

  /**
   * This object represents the user that will attempt to
   * login, the fields of the object are linked to inputs
   * on the page
   */
  user: User = {
    username: null,
    password: null
  };

  constructor(private router: Router,
              private registerService: RegisterService,
              private alertController: AlertController) { }

  /**
   * On page init a form is created with two form controls for username
   * and password. Each of these form controls have validators relating whether the
   * input is requires, the min and max length of an input, and the regex pattern to be matched
   */
  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', {updateOn: 'blur', validators: Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        // This pattern means on letters and number may be used
        Validators.pattern('^[a-zA-Z0-9]+$')
      ])}),

      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        // This pattern means that at least 1 lowercase, 1 uppercase, and 1 number must be used
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    });
  }

  /**
   * Toggles whether the password input is hidden or visible
   */
  hideShowPassword() {
    this.passwordEyeIcon = this.passwordEyeIcon === 'eye' ? 'eye-off' : 'eye';
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  /**
   * When a registration is attempted the service is called, on success the new
   * account is registered and the user is navigated to the login screen. On
   * failure an alert is called to appear
   */
  async onRegister() {
    this.registerService.attemptRegistration(this.user).then((success) => {
      if (success) {
        this.router.navigate(['/login']);
      } else {
        this.showInvalidLogin();
      }
    });
  }

  /**
   * An alert that informs the user that the username they are attepting to
   * use is already taken
   */
  private async showInvalidLogin() {
    const passwordChangedAlert = await this.alertController.create({
      header: 'Invalid Username',
      message: 'That username is unavailable',
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
