import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TranslocoPipe} from '@jsverse/transloco';
import {CardModule} from 'primeng/card';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {RouterModule} from '@angular/router';
import {MsjRoute} from '../../../app.routes';
import {InputPasswordComponent} from "../../../shared/components/inputs/input-password/input-password.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CardModule,
    TranslocoPipe,
    ReactiveFormsModule,
    InputTextComponent,
    InputPasswordComponent,
    ButtonComponent,
    RouterModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  public form: FormGroup;

  constructor(private _fb: FormBuilder) {
    this.form = this._buildForm();
  }

  private _buildForm() {
    return this._fb.group({
      email: this._fb.control('', [Validators.required, Validators.email]),
      password: this._fb.control('', [Validators.required]),
    });
  }

  public onFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: Implement login
  }

  public get registrationPageLink() {
    return `/${MsjRoute.REGISTER}`;
  }
}
