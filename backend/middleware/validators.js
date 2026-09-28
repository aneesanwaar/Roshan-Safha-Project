const { body, validationResult } = require('express-validator');

// Regex explains:
// ^((\+92)|(0092)|(0))? -> Optional country code (+92, 0092) or leading 0
// [ -]?                 -> Optional space or hyphen
// 3[0-9]{2}             -> Starts with 3 followed by 2 network digits (00-49, etc.)
// [ -]?                 -> Optional space or hyphen separator
// [0-9]{7}$             -> 7-digit subscriber number
const pakistaniPhoneRegex = /^((\+92)|(0092)|(0))?[ -]?3[0-9]{2}[ -]?[0-9]{7}$/;

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // Provide both 'error' string (for easy UI alerts) and 'errors' array (for form field highlights)
  return res.status(400).json({
    success: false,
    error: errors.array()[0]?.msg || 'Validation failed',
    errors: errors.array()
  });
};

// Based on requirement 
const donationValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(pakistaniPhoneRegex)
    .withMessage('Enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)'),
  body('numberOfBooks').isInt({ min: 1 }).withMessage('Minimum 1 book required'),
  body('dropoffMethod').notEmpty().withMessage('Preferred drop-off or pickup is required')
];

// Based on requirements 
const volunteerValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(pakistaniPhoneRegex)
    .withMessage('Enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)'),
  //   body('age').isInt({ min: 13 }).withMessage('Must be at least 13 years old'),
  body('skills').notEmpty().withMessage('Please mention your skills or interests')
];

// conatact form validation rules based on Contact model
const contactValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("message").isLength({ min: 10 }).withMessage("Message must be at least 10 characters long")
];

//event registration validation rules based on Event model
const eventValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(pakistaniPhoneRegex)
    .withMessage('Enter a valid Pakistani mobile number (e.g., 03001234567 or +923001234567)'),
  body("eventName").notEmpty().withMessage("Event name is required"),
  body("attendees").isInt({ min: 1 }).withMessage("At least 1 attendee required")
];


// collaboration form validation rules 
const collabValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("organization").notEmpty().withMessage("Organization name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("collabType").notEmpty().withMessage("Collaboration type is required"),
  body("message").isLength({ min: 20 }).withMessage("Please provide a detailed proposal (min 20 chars)")
];

module.exports = {
  validate,
  donationValidationRules,
  volunteerValidationRules,
  contactValidationRules,
  eventValidationRules,
  collabValidationRules
};