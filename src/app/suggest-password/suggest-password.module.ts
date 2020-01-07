import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SuggestPasswordPage } from './suggest-password.page';

const routes: Routes = [
  {
    path: '',
    component: SuggestPasswordPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
  declarations: [SuggestPasswordPage]
})
export class SuggestPasswordPageModule {}
