export enum EMAIL_VALIDATION_TEXT {
  INVALID = 'Entered Email is Invalid',
  REQUIRED = 'Email is Required',
  CHARACTERS = 'Email must have at least 6 characters',
}

export enum PASSWORD_VALIDATION_TEXT {
  INVALID = 'Entered Password is Invalid',
  REQUIRED = 'Password is Required',
  CHARACTERS = 'Password must have atleast 1 lowercase, 1 uppercase, 1 number, 1 special characters and minimum of 8 characters long',
  NOT_MATCHING = 'Passwords do not match',
}

export enum NAME_VALIDATION_TEXT {
  INVALID = 'Enter a valid',
  REQUIRED = 'is Required',
  CHARACTERS = 'must have atleast 1 character',
}

export enum BRAND_VALIDATION_TEXT {
  REQUIRED = 'Brand Name is Required',
  CHARACTERS = 'Brand Name must have atleast 2 characters',
}

export enum ROLE_VALIDATION_TEXT {
  INVALID = 'Choose a valid Access Type',
  REQUIRED = 'Access Type is Required',
}
