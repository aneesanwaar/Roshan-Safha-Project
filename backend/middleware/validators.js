const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({ errors: errors.array() });
};

// Based on requirement #93 [cite: 93]
const donationValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('numberOfBooks').isInt({ min: 1 }).withMessage('Minimum 1 book required'),
  body('dropoffMethod').notEmpty().withMessage('Preferred drop-off or pickup is required')
];

// Based on requirements #96 & #97 [cite: 96, 97]
const volunteerValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
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
  body("phone").notEmpty().withMessage("Phone number is required"),
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