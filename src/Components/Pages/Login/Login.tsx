import { memo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './Styles.module.scss';
import { Button } from '../../UI/Button';
import { Checkbox } from '../../UI/Checkbox';
import { Input } from '../../UI/Input';
import { loginSchema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from "yup";

function LoginComponent() {
  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
    username: '',
    password: '',
    },
  });

  const onSubmit = (data: InferType<typeof loginSchema>) => {
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <form className={styles.container_form} onSubmit={loginForm.handleSubmit(onSubmit)}>
        <h2 className={styles.container_title}>{'Вход'}</h2>
        <Controller
          name="username"
          control={loginForm.control}
          render={({ field }) => (
            <Input
              name={field.name}
              type="text"
              value={field.value}
              onChange={field.onChange}
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
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              error={loginForm.formState.errors.password?.message}
              placeholder="Пароль"
              type="password"
            />
          )}
        />
        <Controller
          name="remember"
          control={loginForm.control}
          render={({ field }) => (
            <Checkbox label="Запомнить меня" isActive={field.value} onChange={() => field.onChange(!field.value)} />
          )}
        />
        <div className={styles.container_buttons}>
          <Button type="submit" size="main" color="primary">
            {'Войти'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Login = memo(LoginComponent);
