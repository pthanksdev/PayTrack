const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('USD'),
  description: Joi.string().optional(),
});

const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('credit', 'debit').required(),
  description: Joi.string().optional(),
});

module.exports = { validate, userSchema, paymentSchema, transactionSchema };