import { memo } from "react";
import styles from './Styles.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { createSchema } from "./schema";
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from "yup";
import { Input } from "../../UI/Input";
import { Button } from "../../UI/Button";
import { Link } from "react-router-dom";

function CreateUserComponent() {
  const createForm = useForm({
    resolver: yupResolver(createSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: InferType<typeof createSchema>) => {
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <form className={styles.container_form} onSubmit={createForm.handleSubmit(onSubmit)}>
        <h2 className={styles.container_title}>{'Создание аккаунта'}</h2>
        <Controller
          name="email"
          control={createForm.control}
          render={({ field }) => (
            <Input
              name="{field.name}"
              type="email"
              value={field.value}
              onChange={field.onChange}
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
              name={field.name}
              type="text"
              value={field.value}
              onChange={field.onChange}
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
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              error={createForm.formState.errors.password?.message}
              placeholder="Пароль"
              type="password"
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
            {'Создать'}
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