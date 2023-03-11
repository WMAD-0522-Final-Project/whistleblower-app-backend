// user email
export const validEmailAdress = (val: string) => {
  const validFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return val.match(validFormat);
};

// user password
export const specialCharactorExistence = (val: string) => {
  const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return val.match(specialChars);
};

export const numsExistence = (val: string) => {
  const nums = /\d+/g;
  return val.match(nums);
};
