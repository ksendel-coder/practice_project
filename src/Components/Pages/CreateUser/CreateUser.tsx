import { memo } from "react";
import styles from './Styles.module.scss';
import { useForm, Controller } from 'react-hook-form';
import { createSchema } from "./schema";
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from "yup";
import { Input } from "../../UI/Input";
import { Button } from "../../UI/Button";

function CreateUserComponent() {
  const createForm = useForm({
    resolver: yupResolver(createSchema),
    defaultValues: {
      username: '',
      password: '',
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

        <div className={styles.container_buttons}>
          <Button type="submit" size="main" color="primary">
            {'Создать'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const CreateUser = memo(CreateUserComponent);