import * as yup from "yup";

export const profileSchema = yup.object().shape({
  username: yup
    .string()
    .required("Введите имя пользователя")
    .min(2, "Минимально 2 символа")
    .max(15, "Максимально 15 символов"),

  email: yup
    .string()
    .required("Введите электронную почту")
    .email("Неверный формат email"),

  bio: yup.string().optional().max(50, "Максимально 50 символов").default(""),

  newPassword: yup
    .string()
    .nullable()
    .optional()
    .default(null)
    .test("min", "Минимально 10 символов", function (value) {
      if (!value) return true;
      return value.length >= 10;
    }),

  confirmNewPassword: yup
    .string()
    .nullable()
    .optional()
    .default(null)
    .when("newPassword", {
      is: (val: string | null) => val && val.length > 0,
      then: (schema) =>
        schema
          .required("Подтвердите пароль")
          .oneOf([yup.ref("newPassword")], "Пароли не совпадают"),
    }),
});
