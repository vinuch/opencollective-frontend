import { defineMessages } from 'react-intl';
import { get } from 'lodash';

export const FORM_ERROR = {
  MIN: 'MIN',
  MAX: 'MAX',
  PATTERN: 'PATTERN',
  MIN_LENGTH: 'MIN_LENGTH',
  MAX_LENGTH: 'MAX_LENGTH',
  REQUIRED: 'REQUIRED',
};

const msg = defineMessages({
  [FORM_ERROR.MIN]: {
    id: 'FormError.min',
    defaultMessage: 'The value is too low',
  },
  [FORM_ERROR.MAX]: {
    id: 'FormError.max',
    defaultMessage: 'The value is too high',
  },
  [FORM_ERROR.REQUIRED]: {
    id: 'Error.FieldRequired',
    defaultMessage: 'This field is required',
  },
  [FORM_ERROR.MIN_LENGTH]: {
    id: 'FormError.minLength',
    defaultMessage: 'The value is too short',
  },
  [FORM_ERROR.MAX_LENGTH]: {
    id: 'FormError.maxLength',
    defaultMessage: 'The value is too long',
  },
  [FORM_ERROR.PATTERN]: {
    id: 'FormError.pattern',
    defaultMessage: 'This value is not formatted properly',
  },
  _fallback: {
    id: 'FormError.fallback',
    defaultMessage: 'Invalid value',
  },
});

/**
 * Translate an error as returned to a human-readable, internationalized error message.
 * Fully supports `react-hook-form` errors.
 *
 * @param {function} formatMessage react-intl's formatMessage
 * @param {object} error - as returned by react-hook-form
 */
export const formatErrorMessage = (intl, error) => {
  // No error
  if (!error) {
    return null;
  }

  // Known error
  const i18nMsg = msg[error.type];
  if (i18nMsg) {
    return intl.formatMessage(i18nMsg, error);
  }

  // Won't be translated
  if (error.message) {
    return error.message;
  }

  // Fallback
  return intl.formatMessage(msg._fallback);
};

/**
 * Create an error that will be safe to pass to `formatErrorMessage`.
 * `params` will be passed to the translated string.
 */
export const createError = (type, params) => {
  return { type, params };
};

/**
 * returns true if the error is of the given type
 */
export const isErrorType = (error, type) => {
  return error && typeof error === 'object' && error.type === type;
};

/**
 * Will return an object of errors for all fields defined in `requiredFields`
 * that are not in `data`.
 */
export const requireFields = (data, requiredFields, { stopOnFirstError = false } = {}) => {
  const errors = {};

  for (const field of requiredFields) {
    const value = get(data, field);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      errors[field] = createError(FORM_ERROR.REQUIRED);
      if (stopOnFirstError) {
        return errors;
      }
    }
  }

  return errors;
};
