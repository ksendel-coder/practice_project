import { memo, useState } from "react";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import styles from "./Styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "./schema";
import { InferType } from "yup";
import { useUserContext } from "../../../Contexts/UserContext";

type ProfileFormData = InferType<typeof profileSchema>;

function ProfileComponent() {
  const { userData, setUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: userData?.name || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    setIsLoading(true);
    setSuccessMessage("");

    setTimeout(() => {
      // 🔹 Обновляем данные в контексте
      setUserData({
        name: data.username,
        email: data.email,
        bio: data.bio || "",
      });

      // 🔹 Обновляем данные в localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        localStorage.setItem('user', JSON.stringify({
          ...user,
          username: data.username,
          email: data.email,
          bio: data.bio || "",
        }));
      }

      setIsLoading(false);
      setSuccessMessage("✅ Профиль успешно обновлён!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <form className={styles.container_form} onSubmit={profileForm.handleSubmit(onSubmit)}>
        <h2 className={styles.container_title}>Профиль</h2>

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <Controller
          name="username"
          control={profileForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              error={profileForm.formState.errors.username?.message}
              placeholder="Ник"
            />
          )}
        />

        <Controller
          name="email"
          control={profileForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              error={profileForm.formState.errors.email?.message}
              placeholder="Электронная почта"
            />
          )}
        />

        <Controller
          name="bio"
          control={profileForm.control}
          render={({ field }) => (
            <Input
              {...field}
              error={profileForm.formState.errors.bio?.message}
              placeholder="О себе"
            />
          )}
        />

        <div className={styles.container_buttons}>
          <Button type="submit" size="main" color="primary">
            {isLoading ? "Сохраняем..." : "💾 Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Profile = memo(ProfileComponent);