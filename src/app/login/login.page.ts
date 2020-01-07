import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService, User} from '../services/login/login.service';
import {AlertController} from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

/**
 * This is the page where users login using their credentials
 */
export class LoginPage {
  passwordEyeIcon = 'eye-off';
  passwordType = 'password';

  possibleUser: User = {
      username: null,
      password: null
  };




  constructor(private router: Router, private loginService: LoginService, private alertController: AlertController) { }


    /**
     * Changes the password input to be visible or hidden
     */
  hideShowPassword() {
    this.passwordEyeIcon = this.passwordEyeIcon === 'eye' ? 'eye-off' : 'eye';
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

    /**
     * Attempts to log a user into the app using the login service.
     * If the login fails an alert is called to open.
     */
  onLogin() {
      this.loginService.loginUser(this.possibleUser).then( () => {
          if (this.loginService.getLoggedInUser() !== null) {
              this.router.navigate(['/home']);
          } else {
              this.showInvalidLogin();
          }
      });
  }

    /**
     * An alert that informs the user that the username or password
     * they entered was invalid
     */
    private async showInvalidLogin() {
        const passwordChangedAlert = await this.alertController.create({
            header: 'Invalid Login',
            message: 'Your login details were invalid',
            buttons: [
                {
                    text: 'Close',
                    role: 'close'
                }
            ]
        });
        await passwordChangedAlert.present();
    }

    /**
     * Navigates the user to the registration page
     */
    onRegisterClick() {
        this.router.navigate(['/register']);
    }
}
