import { postcodeValidator } from "postcode-validator";
import { phone } from "phone";
import * as EmailValidator from "email-validator";

export const validatePostalCode = (postalCode: string) =>
  postcodeValidator(postalCode, "PL");

export const validatePhoneNumber = (phoneNumber: string) =>
  phone(phoneNumber, {
    country: "PL",
    validateMobilePrefix: false,
  }).isValid;

export const validateEmail = (emailAddress: string) =>
  EmailValidator.validate(emailAddress);
