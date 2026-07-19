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
import { authAPI } from "../../../Api/auth";

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
      const res = await authAPI.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (res.ok) {
        localStorage.setItem("token", res.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            _id: res.user._id,
            name: res.user.username,
            email: res.user.email || "",
            bio: "",
            avatar: null,
          }),
        );
        loadUserData();
        setIsAuth(true);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.container__form}
        onSubmit={createForm.handleSubmit(onSubmit)}
      >
        <h2 className={styles.container__form_title}>Создание аккаунта</h2>

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

        <div className={styles.container__transition}>
          <Button type="submit" size="main" color="primary" className={styles.container__transition_button}>
            Создать
          </Button>
          <div className={styles.container__transition_login}>
            Уже есть аккаунт? <Link to="/login" className={styles.container__transition_login__link}>Войти</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export const CreateUser = memo(CreateUserComponent);
