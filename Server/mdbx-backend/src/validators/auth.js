const { body } = require('express-validator');

exports.registerValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('othername').notEmpty().withMessage('Other name required'),
  body('firstname').notEmpty().withMessage('First name required'),
  body('surname').notEmpty().withMessage('Surname required'),
  body('mobile').notEmpty().withMessage('Mobile number required'),
  body('dob').isISO8601().withMessage('Valid date of birth required'),
  body('address1').notEmpty().withMessage('Address required'),
  body('country').notEmpty().withMessage('Country required'),
  body('state').notEmpty().withMessage('State required'),
  body('alternatePhone').notEmpty().withMessage('Alternate phone required'),
  body('currency').notEmpty().withMessage('Currency required'),
  body('referral').optional(),
  body('referralPhone').optional(),
  body('nextOfKinName').notEmpty().withMessage('Next of kin name required'),
  body('nextOfKinContact').notEmpty().withMessage('Next of kin contact required'),
  body('city').notEmpty().withMessage('City required'),
  body('gender').notEmpty().withMessage('Gender required'),
];

exports.loginValidation = [
  body('mobile').notEmpty().withMessage('Mobile number required'),
  body('password').notEmpty().withMessage('Password required'),
];
