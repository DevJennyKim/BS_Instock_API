import isEmail from 'isemail';
import { phone } from 'phone';

const validateRequest = (requestBody) => {
  for (const [key, value] of Object.entries(requestBody)) {
    if (value === undefined || value === null || value === '') {
      return {
        result: false,
        message: `Please provide the ${key} form field in the request`,
      };
    }
  }

  if (
    requestBody.contact_email &&
    !isEmail.validate(requestBody.contact_email, { tld: true })
  ) {
    return {
      result: false,
      message: 'Please provide a valid email address in the request',
    };
  }

  if (requestBody.contact_phone && !phone(requestBody.contact_phone).isValid) {
    return {
      result: false,
      message: 'Please provide a valid phone number in the request',
    };
  }

  return {
    result: true,
    message: 'All fields valid.',
  };
};

export { validateRequest };
