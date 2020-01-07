import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/**
 * All the pages for the application and their routes
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'},
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterPageModule'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsPageModule'
  },
  {
    path: 'add-password',
    loadChildren: './add-password/add-password.module#AddPasswordPageModule'
  },
  {
    path: 'view-passwords',
    loadChildren: './view-passwords/view-passwords.module#ViewPasswordsPageModule'
  },
  {
    path: 'suggest-password',
    loadChildren: './suggest-password/suggest-password.module#SuggestPasswordPageModule'
  },
  { path: 'password-details',
    loadChildren: './password-details/password-details.module#PasswordDetailsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
