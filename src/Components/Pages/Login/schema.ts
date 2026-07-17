import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Введите имя пользователя")
    .min(2, "Минимально 2 символа")
    .max(15, "Максимально 15 символов"),
  password: yup
    .string()
    .required("Введите пароль")
    .min(10, "Минимально 10 символов"),
  remember: yup.boolean().optional().default(false),
});
