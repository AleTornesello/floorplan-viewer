import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputPasswordComponent } from '../../../shared/components/input-password/input-password.component';
import { InputTextComponent } from '../../../shared/components/input-text/input-text.component';
import { RouterModule } from '@angular/router';
import { MsjRoute } from '../../../app.routes';

@Component({
  selector: 'app-register-page',
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
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
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

    // TODO: Implement register
  }

  public get registrationPageLink() {
    return `/${MsjRoute.LOGIN}`;
  }
}
