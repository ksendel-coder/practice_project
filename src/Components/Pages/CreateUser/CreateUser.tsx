import { memo } from "react";
import styles from "./Styles.module.scss";
import { useForm, Controller } from "react-hook-form";
import { createSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Input } from "../../UI/Input";
import { Button } from "../../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../../Contexts/UserContext";
import { authAPI } from "../../../Api/server/auth";

function CreateUserComponent() {
  const navigate = useNavigate();
  const { setIsAuth, loadUserData } = useUserContext();

  const createForm = useForm({
    resolver: yupResolver(createSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: InferType<typeof createSchema>) => {
    try {
      // 🔹 Запрос к API
      const response = await authAPI.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      console.log("Ответ сервера:", response);

      // 🔹 Если успешно
      if (response.ok) {
        // Сохраняем токен
        localStorage.setItem("token", response.token);

        // Обновляем контекст
        localStorage.setItem(
          "userData",
          JSON.stringify({
            name: response.user.username,
            email: response.user.email || "",
            bio: "",
          }),
        );
        loadUserData();
        setIsAuth(true);

        navigate("/");
      } else {
        alert(response.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert("Ошибка сервера");
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.container_form}
        onSubmit={createForm.handleSubmit(onSubmit)}
      >
        <h2 className={styles.container_title}>Создание аккаунта</h2>

        <Controller
          name="email"
          control={createForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              error={createForm.formState.errors.email?.message}
              placeholder="Электронная почта"
            />
          )}
        />

        <Controller
          name="username"
          control={createForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              error={createForm.formState.errors.username?.message}
              placeholder="Имя пользователя"
            />
          )}
        />

        <Controller
          name="password"
          control={createForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              error={createForm.formState.errors.password?.message}
              placeholder="Пароль"
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={createForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              error={createForm.formState.errors.confirmPassword?.message}
              placeholder="Подтвердите пароль"
            />
          )}
        />

        <div className={styles.container_buttons}>
          <Button type="submit" size="main" color="primary">
            Создать
          </Button>
          <div className={styles.container_loginLink}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export const CreateUser = memo(CreateUserComponent);
