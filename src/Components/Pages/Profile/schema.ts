import * as yup from 'yup';

export const profileSchema = yup.object().shape({
    username: yup.string().required('Введите имя пользователя').min(2, 'Минимально 2 символа').max(15, 'Максимально 15 символов'),
    email: yup.string().required('Введите электронную почту').email(),
    bio: yup.string().optional().max(50, 'Максимально 50 символов').default(''),
})