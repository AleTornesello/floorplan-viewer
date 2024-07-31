import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {CardModule} from 'primeng/card';
import {ButtonComponent} from '../../../shared/components/button/button.component';
import {Router, RouterModule} from '@angular/router';
import {MsjRoute} from '../../../app.routes';
import {InputPasswordComponent} from "../../../shared/components/inputs/input-password/input-password.component";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {SupabaseAuthService} from "../../services/supabase-auth.service";
import {AuthTokenResponsePassword} from "@supabase/supabase-js";
import {
  ResultMessageDialogComponent
} from "../../../shared/components/dialog/result-message-dialog/result-message-dialog.component";
import {StringManipulationService} from "../../../shared/services/string-manipulation.service";

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
    ResultMessageDialogComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  @ViewChild('loginResultDialog') loginResultDialog!: ResultMessageDialogComponent;
  public form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _supabaseAuthService: SupabaseAuthService,
    private _translationService: TranslocoService,
    private _router: Router,
    private _stringManipulationService: StringManipulationService
  ) {
    this.form = this._buildForm();
  }

  private _buildForm() {
    return this._fb.group({
      email: this._fb.control('', [Validators.required, Validators.email]),
      password: this._fb.control('', [Validators.required]),
    });
  }

  public async onFormSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let loginResponse: AuthTokenResponsePassword | null = null;

    try {
      const email = this.form.get('email')!.value;
      const password = this.form.get('password')!.value;
      loginResponse = await this._supabaseAuthService.signIn(email, password);
    } catch (error) {
      this.loginResultDialog.show("error", this._translationService.translate('auth.loginKo'));
      return;
    }

    if (!loginResponse) {
      this.loginResultDialog.show("error", this._translationService.translate('auth.loginKo'));
      return;
    }

    if (loginResponse.error) {

      const errorMessage = loginResponse.error.code
        ? this._translationService.translate(`auth.loginErrors.${this._stringManipulationService.snakeToCamel(loginResponse.error.code as string)}`)
        : loginResponse.error.message;
      this.loginResultDialog.show("error", errorMessage);
      return;
    }

    const session = await this._supabaseAuthService.session;

    if (!session) {
      this.loginResultDialog.show("error", this._translationService.translate('auth.loginKo'));
      return;
    }

    this._router.navigate([]);
  }

  public get registrationPageLink() {
    return `/${MsjRoute.REGISTER}`;
  }
}
