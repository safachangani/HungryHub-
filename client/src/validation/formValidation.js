import * as yup from 'yup'

export const registerSchema = yup.object().shape({
  RestaurantName: yup.string().required(),
  RestaurantAddress: yup.string().required(),
  OwnerNumber: yup.number().required(),
  CuisineType: yup.string().required(),
  EmailAddress: yup.string().email('Invalid Email address').required('Email Address is required'),
  Password: yup.string().required('Password is required').min(5, 'Password should be at least 5 character').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain uppercase, lowercase, number, and special character'),
  ConfirmPassword: yup.string().oneOf([yup.ref('Password')],'Password must match').required('Passwordis required')
})


export const addMenuSchema = yup.object().shape({
  itemName: yup.string().required(),
  category: yup.string().required(),
  price: yup.number().required(),
  menu: yup.mixed().test('fileRequired', 'Please upload a file', function (value) {
    if (value && value.length > 0) {
      return true;
    }
    return false;
  }),
})

export const userSignUpSchema = yup.object().shape({
  EmailAddress: yup.string().email('Invalid Email address').required('Email Address is required'),
  FullName: yup.string().required('Full Name is required'),
  Password: yup.string().required('Password is required').min(5, 'Password should be at least 5 character').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain uppercase, lowercase, number, and special character'),
  ConfirmPassword: yup.string().oneOf([yup.ref('Password')], 'Passwords must match').required('Password is required')
})

export const userLoginSchema = yup.object().shape({
  Email: yup.string().email('Invalid Email address').required('Email Address is required'),
  Password: yup.string().required('Password is required').min(5, 'Password should be at least 5 character')
})

export const userAddressSchema = yup.object().shape({
  Name: yup.string().required('name is required'),
  StreetAddress: yup.string().required('address is required'),
  City: yup.string().required('city name is required'),
  State: yup.string().required('state is required'),
  Pincode: yup.string().required('pincode is required'),
  PhoneNumber: yup.string().required('phone number is required').min(10,'invalid phone number').max(10,'invalid phone number'),
  DeliveryType: yup.string().required('address type is required')
})

export const PaymentScheme = yup.object().shape({
  test:yup.string().required('select a payment method')
})