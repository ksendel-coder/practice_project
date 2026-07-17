import { memo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./Styles.module.scss";
import { Button } from "../../UI/Button";
import { Checkbox } from "../../UI/Checkbox";
import { Input } from "../../UI/Input";
import { loginSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../../Contexts/UserContext";
import { authAPI } from "../../../Api/auth";

function LoginComponent() {
  const navigate = useNavigate();
  const { setIsAuth, loadUserData } = useUserContext();

  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const remember = localStorage.getItem("remember") === "true";
    if (remember && savedUsername) {
      loginForm.setValue("username", savedUsername);
      loginForm.setValue("remember", true);
    }
  }, []);

  const onSubmit = async (data: InferType<typeof loginSchema>) => {
    try {
      const res = await authAPI.login({
        username: data.username,
        password: data.password,
      });
      console.log(res);

      if (res.ok) {
        localStorage.setItem("token", res.token);
        if (data.remember) {
          localStorage.setItem("savedUsername", data.username);
          localStorage.setItem("remember", "true");
        } else {
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("remember");
        }

        localStorage.setItem(
          "userData",
          JSON.stringify({
            _id: res.user._id,
            name: res.user.username,
            email: res.user.email || "",
            bio: res.user.bio || "",
            avatar: res.user.avatar || null,
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
        onSubmit={loginForm.handleSubmit(onSubmit)}
      >
        <h2 className={styles.container__title}>Вход</h2>

        <Controller
          name="username"
          control={loginForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              error={loginForm.formState.errors.username?.message}
              placeholder="Логин"
            />
          )}
        />

        <Controller
          name="password"
          control={loginForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              error={loginForm.formState.errors.password?.message}
              placeholder="Пароль"
            />
          )}
        />

        <Controller
          name="remember"
          control={loginForm.control}
          render={({ field }) => (
            <Checkbox
              label="Запомнить меня"
              isActive={field.value}
              onChange={() => field.onChange(!field.value)}
            />
          )}
        />

        <div className={styles.container__transition}>
          <Button
            type="submit"
            size="main"
            color="primary"
            className={styles.container__transition_button}
          >
            Войти
          </Button>
          <div className={styles.container__transition_reg}>
            Нет аккаунта?{" "}
            <Link
              to="/createUser"
              className={styles.container__transition_reg__link}
            >
              Регистрация
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export const Login = memo(LoginComponent);
