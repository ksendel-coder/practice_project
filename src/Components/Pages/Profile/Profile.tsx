import { memo, useState, useRef } from "react";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import styles from "./Styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "./schema";
import { InferType } from "yup";
import { useUserContext } from "../../../Contexts/UserContext";
import { Icon } from "../../UI/Icon";
import { authAPI } from "../../../Api/auth";

function ProfileComponent() {
  const { userData, setUserData } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(userData?.avatar || null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<InferType<typeof profileSchema>>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: userData?.name || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const onSubmit = async (data: InferType<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      if (data.newPassword) {
        await authAPI.changePassword(data.newPassword);
      }

      const res = await authAPI.updateProfile({
        name: data.username,
        email: data.email,
        bio: data.bio || "",
        avatar: avatar || undefined,
      });

      if (res.ok) {
        const savedUser = localStorage.getItem("userData");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          const newData = {
            ...user,
            name: data.username,
            email: data.email,
            bio: data.bio || "",
            avatar: avatar || null,
          };
          if (data.newPassword) {
            newData.password = data.newPassword;
          }
          localStorage.setItem("userData", JSON.stringify(newData));
        }
        setUserData({
          name: data.username,
          email: data.email,
          bio: data.bio || "",
          avatar: avatar || undefined,
        });
        setIsLoading(false);
        setIsEditing(false);
        setShowPasswordFields(false);
        profileForm.reset({
          username: data.username,
          email: data.email,
          bio: data.bio || "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    profileForm.reset({
      username: userData?.name || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setAvatar(userData?.avatar || null);
    setShowPasswordFields(false);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.container__form}
        onSubmit={profileForm.handleSubmit(onSubmit)}
      >
        <div className={styles.container__form_header}>
          <h2 className={styles.container__form_title}>Профиль</h2>
          <div className={styles.container__form_navbutton}>
            {!isEditing ? (
              <Icon name="edit" onClick={() => setIsEditing(true)} />
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
        </div>

        <div className={styles.avatar}>
          <div
            className={styles.avatar__wrapper}
            onClick={handleAvatarClick}
            style={{
              cursor: isEditing ? "pointer" : "default",
              pointerEvents: isEditing ? "auto" : "none",
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Аватар"
                className={styles.avatar__wrapper_image}
              />
            ) : (
              <div className={styles.avatar__wrapper_placeholder}>
                <Icon name="user" size={48} color="#ffffff4d" />
              </div>
            )}
            {isEditing && (
              <div className={styles.avatar__wrapper_overlay}>
                <Icon name="edit" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className={styles.container__form_input}
          />
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
              className={`${styles.container__form_textarea} ${!isEditing ? styles.container__form_textareaDisabled : ""}`}
              placeholder="О себе"
              disabled={!isEditing}
            />
          )}
        />

        {isEditing && (
          <div className={styles.password}>
            <Button
              type="button"
              size="nav"
              color="transparent"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className={styles.password__change}
            >
              {showPasswordFields ? "Скрыть" : "Сменить пароль"}
            </Button>

            {showPasswordFields && (
              <>
                <Controller
                  name="newPassword"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ""}
                      type="password"
                      error={profileForm.formState.errors.newPassword?.message}
                      placeholder="Новый пароль"
                      disabled={!isEditing}
                    />
                  )}
                />

                <Controller
                  name="confirmNewPassword"
                  control={profileForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ""}
                      type="password"
                      error={
                        profileForm.formState.errors.confirmNewPassword?.message
                      }
                      placeholder="Подтвердите пароль"
                      disabled={!isEditing}
                    />
                  )}
                />
              </>
            )}
          </div>
        )}

        <div className={styles.container__form_button}>
          <Button
            type="submit"
            size="main"
            color="primary"
            radius={12}
            disabled={!isEditing}
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Profile = memo(ProfileComponent);
