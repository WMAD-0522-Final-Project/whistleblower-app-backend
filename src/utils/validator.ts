const baseValidator = (val: string, regex: RegExp) => {
  return val.match(regex);
};

// user email
export const validEmailAdress = (val: string) =>
  baseValidator(val, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

// user password
export const specialCharactorExistence = (val: string) =>
  baseValidator(val, /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);

export const numsExistence = (val: string) => baseValidator(val, /\d+/g);

export const upperCaseExistence = (val: string) => baseValidator(val, /[A-Z]/);
