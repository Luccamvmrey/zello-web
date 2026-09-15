import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

/** Valida `value` contra o `type` irmão: PERCENTAGE em [0.01, 100], FIXED > 0. */
@ValidatorConstraint({ name: 'isValidSplitValue', async: false })
class IsValidSplitValueConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return false;
    }

    const type = (args.object as { type?: unknown }).type;

    if (type === 'PERCENTAGE') {
      return value >= 0.01 && value <= 100;
    }

    if (type === 'FIXED') {
      return value > 0;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const type = (args.object as { type?: unknown }).type;
    return type === 'PERCENTAGE'
      ? 'O percentual deve estar entre 0.01 e 100.'
      : 'O valor deve ser maior que 0.';
  }
}

export function IsValidSplitValue(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidSplitValueConstraint,
    });
  };
}
