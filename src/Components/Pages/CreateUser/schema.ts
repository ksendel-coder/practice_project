import * as yup from 'yup';

export const createSchema = yup.object().shape({
    username: yup.string().required('Придумайте имя пользователя').min(2, 'Минимально 2 символа').max(15, 'Максимально 15 символов'),
    password: yup.string().required('Придумайте пароль').min(10,'Минимально 10 символов')
})