import { memo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styles from './Styles.module.scss';
import { Button } from '../../UI/Button';
import { Checkbox } from '../../UI/Checkbox';
import { Input } from '../../UI/Input';
import { loginSchema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from "yup";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../Contexts/UserContext';
import { authAPI } from '../../../Api/server/auth';

function LoginComponent() {
  const navigate = useNavigate();  
  const { setIsAuth, setIsAdmin, setUserData } = useUserContext();
  
  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: InferType<typeof loginSchema>) => {
    try {
      // 🔹 Запрос к API
      const response = await authAPI.login({
        username: data.username,
        password: data.password,
      });

      console.log('Ответ сервера:', response);

      // 🔹 Если успешно
      if (response.ok) {
        // Сохраняем токен
        localStorage.setItem('token', response.token);
        
        // Обновляем контекст
        setUserData({
          name: response.user.username,
          email: response.user.email || '',
          bio: '',
        });
        setIsAuth(true);
        setIsAdmin(response.user.role === 'admin');
        
        navigate('/');
      } else {
        alert(response.message || 'Неверный логин или пароль');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Ошибка сервера');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.container_form} onSubmit={loginForm.handleSubmit(onSubmit)}>
        <h2 className={styles.container_title}>Вход</h2>
        
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
        
        <div className={styles.container_buttons}>
          <Button type="submit" size="main" color="primary">
            Войти
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Login = memo(LoginComponent);