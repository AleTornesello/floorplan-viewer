import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class FormControlValidationService {
  constructor(private _translationService: TranslocoService) {}

  public getErrorMessage(
    errorKey: string,
    field: string,
    args: { [key: string]: string | number } | null | boolean
  ): string {
    switch (errorKey) {
      case 'alpha':
        return this._translationService.translate(
          'common.validationErrors.alpha',
          {
            field,
          }
        );
      case 'alpha_num':
        return this._translationService.translate(
          'common.validationErrors.alphaNum',
          {
            field,
          }
        );
      case 'alpha_dash':
        return this._translationService.translate(
          'common.validationErrors.alphaDash',
          {
            field,
          }
        );
      case 'alpha_spaces':
        return this._translationService.translate(
          'common.validationErrors.alphaSpaces',
          { field }
        );
      case 'between':
        return this._translationService.translate(
          'common.validationErrors.between',
          {
            field,
          }
        );
      case 'confirmed':
        return this._translationService.translate(
          'common.validationErrors.confirmed',
          {
            field,
          }
        );
      case 'digits':
        return this._translationService.translate(
          'common.validationErrors.digits',
          {
            field,
          }
        );
      case 'dimensions':
        return this._translationService.translate(
          'common.validationErrors.dimensions',
          {
            field,
          }
        );
      case 'email':
        return this._translationService.translate(
          'common.validationErrors.email',
          {
            field,
          }
        );
      case 'excluded':
        return this._translationService.translate(
          'common.validationErrors.excluded',
          {
            field,
          }
        );
      case 'ext':
        return this._translationService.translate(
          'common.validationErrors.ext',
          {
            field,
          }
        );
      case 'image':
        return this._translationService.translate(
          'common.validationErrors.image',
          {
            field,
          }
        );
      case 'integer':
        return this._translationService.translate(
          'common.validationErrors.integer',
          {
            field,
          }
        );
      case 'is_not':
        return this._translationService.translate(
          'common.validationErrors.isNot',
          {
            field,
          }
        );
      case 'length':
        return this._translationService.translate(
          'common.validationErrors.length',
          {
            field,
            length: typeof args !== 'boolean' ? args?.['length'] : null,
          }
        );
      case 'max_value':
        return this._translationService.translate(
          'common.validationErrors.maxValue',
          {
            field,
            max: typeof args !== 'boolean' ? args!['suggestion'] : null,
          }
        );
      case 'max_date':
        return this._translationService.translate(
          'common.validationErrors.maxDate',
          {
            field,
            max: typeof args !== 'boolean' ? args!['suggestion'] : null,
          }
        );
      case 'max':
        return this._translationService.translate(
          'common.validationErrors.max',
          {
            field,
          }
        );
      case 'min_value':
        return this._translationService.translate(
          'common.validationErrors.minValue',
          {
            field,
          }
        );
      case 'min':
        return this._translationService.translate(
          'common.validationErrors.min',
          {
            field,
          }
        );
      case 'numeric':
        return this._translationService.translate(
          'common.validationErrors.numeric',
          {
            field,
          }
        );
      case 'one_of':
        return this._translationService.translate(
          'common.validationErrors.oneOf',
          {
            field,
          }
        );
      case 'regex':
        if (typeof args !== 'boolean' && args?.['suggestion']) {
          return this._translationService.translate(
            'common.validationErrors.regexWithSuggestion',
            { field, suggestion: args['suggestion'] }
          );
        }
        return this._translationService.translate(
          'common.validationErrors.regex',
          {
            field,
          }
        );
      case 'required':
        return this._translationService.translate(
          'common.validationErrors.required',
          {
            field,
          }
        );
      case 'required_if':
        return this._translationService.translate(
          'common.validationErrors.requiredIf',
          {
            field,
          }
        );
      case 'size':
        return this._translationService.translate(
          'common.validationErrors.size',
          {
            field,
          }
        );
      case 'date_is_before':
        return this._translationService.translate(
          'common.validationErrors.dateIsBefore',
          {
            field,
            comparisonField:
              typeof args !== 'boolean' ? args?.['comparisonField'] : null,
          }
        );
      case 'max_length':
        return this._translationService.translate(
          'common.validationErrors.maxlength',
          {
            field,
            num: typeof args !== 'boolean' ? args?.['requiredLength'] : null,
          }
        );
      case 'min_length':
        return this._translationService.translate(
          'common.validationErrors.minlength',
          {
            field,
            num: typeof args !== 'boolean' ? args?.['requiredLength'] : null,
          }
        );
      case 'passwords_are_not_equals':
        return this._translationService.translate(
          'common.validationErrors.passwordsAreNotEquals'
        );
      case 'password_invalid_characters':
        return this._translationService.translate(
          'common.validationErrors.passwordInvalidCharacters'
        );
      case 'password_weak':
        return this._translationService.translate(
          'common.validationErrors.passwordWeak'
        );
      case 'regex_error':
        if (typeof args !== 'boolean' && !!args?.['suggestion']) {
          return this._translationService.translate(
            'common.validationErrors.regexWithSuggestion',
            { field, suggestion: args?.['suggestion'] }
          );
        }

        return this._translationService.translate(
          'common.validationErrors.generic'
        );

      default:
        return this._translationService.translate(
          'common.validationErrors.generic'
        );
    }
  }
}
