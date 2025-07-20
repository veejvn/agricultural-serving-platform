import Joi from 'joi';

const registerSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "any.required": "Email là bắt buộc",
            "string.empty": "Email là bắt buộc",
            "string.email": "Email chưa đúng",
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "any.required": "Mật khẩu là bắt buộc",
            "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Xác nhận mật khẩu phải trùng với mật khẩu',
            'any.required': 'Xác nhận mật khẩu là bắt buộc',
        }),
});

export default registerSchema;