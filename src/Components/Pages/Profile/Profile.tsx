import { memo, useState } from "react";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import styles from "./Styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "./schema";
import { InferType } from "yup";
import { useUserContext } from "../../../Contexts/UserContext";

function ProfileComponent() {
  const { userData, setUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const profileForm = useForm<InferType<typeof profileSchema>>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: userData?.name || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
    },
  });

  const onSubmit = (data: InferType<typeof profileSchema>) => {
    setIsLoading(true);

    setTimeout(() => {
      setUserData({
        name: data.username,
        email: data.email,
        bio: data.bio || "",
      });

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            username: data.username,
            email: data.email,
            bio: data.bio || "",
          }),
        );
      }
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleCancel = () => {
    profileForm.reset({
      username: userData?.name || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
    });
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.container__form}
        onSubmit={profileForm.handleSubmit(onSubmit)}
      >
        <h2 className={styles.container__form_title}>Профиль</h2>
        <div className={styles.container__form_navbutton}>
          {!isEditing ? (
            <Button
              size="nav"
              color="transparent"
              radius={8}
              onClick={() => setIsEditing(true)}
            >
              Редактировать
            </Button>
          ) : (
            <Button
              size="nav"
              color="transparent"
              radius={8}
              onClick={handleCancel}
            >
              Отмена
            </Button>
          )}
        </div>

        <Controller
          name="username"
          control={profileForm.control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              error={profileForm.formState.errors.username?.message}
              placeholder="Ник"
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          )}
        />

        <Controller
          name="bio"
          control={profileForm.control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              className={`${styles.textarea} ${!isEditing ? styles.textareaDisabled : ""}`}
              placeholder="О себе"
              disabled={!isEditing}
            />
          )}
        />

        <div className={styles.container__form_button}>
          <Button
            type="submit"
            size="main"
            color="primary"
            radius={12}
            disabled={!isEditing}
          >
            {isLoading ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Profile = memo(ProfileComponent);
