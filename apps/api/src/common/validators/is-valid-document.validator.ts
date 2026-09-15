import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { isValidCnpj } from '../utils/cnpj.util.js';
import { isValidCpf } from '../utils/cpf.util.js';

/** Valida o campo `document` contra o `documentType` irmão no mesmo DTO. */
@ValidatorConstraint({ name: 'isValidDocument', async: false })
class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: unknown, args: ValidationArguments): boolean {
    if (typeof document !== 'string') {
      return false;
    }

    const documentType = (args.object as { documentType?: unknown }).documentType;

    if (documentType === 'CPF') {
      return isValidCpf(document);
    }

    if (documentType === 'CNPJ') {
      return isValidCnpj(document);
    }

    return false;
  }

  defaultMessage(): string {
    return 'Documento inválido.';
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidDocumentConstraint,
    });
  };
}
