import isEmail from "isemail";
import { phone } from "phone";

const validateRequest = (requestBody) => {
  for (const [key, value] of Object.entries(requestBody)) {
    if (!value) {
      return res.status(400).json({
        message: `Please provide the ${key} form field in the request`,
      });
    }
  }

  if (!isEmail.validate(requestBody.contact_email, { tld: true })) {
    return res.status(400).json({
      message: "Please provide a valid email address in the request",
    });
  }

  if (!phone(requestBody.contact_phone).isValid) {
    return res.status(400).json({
      message: "Please provide a valid phone number in the request",
    });
  }
};

export { validateRequest };
