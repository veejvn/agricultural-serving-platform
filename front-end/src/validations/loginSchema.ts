import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Email là bắt buộc",
      "string.empty": "Email là bắt buộc",
      "string.email": "Email chưa đúng",
    }),
  password: Joi.string().min(8).required().messages({
    "any.required": "Mật khẩu là bắt buộc",
    "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
  }),
});

export default loginSchema;
