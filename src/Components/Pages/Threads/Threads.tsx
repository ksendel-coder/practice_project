import { memo, useState, useEffect } from "react";
import { Button } from "../../UI/Button";
import { Input } from "../../UI/Input";
import styles from "./Styles.module.scss";
import { Card } from "../../Layouts/Card";
import { Icon } from "../../UI/Icon";
import { useUserContext } from "../../../Contexts/UserContext";
import { threadsAPI } from "../../../Api/server/threads";

interface Post {
  _id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  avatar?: string | null;  // ← добавить null
  likes?: number;
  isLiked?: boolean;
}

function ThreadsComponent() {
  const { userData } = useUserContext();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      console.log('🔄 Загрузка постов...');
      try {
        const data = await threadsAPI.getAll();
        console.log('✅ Загружено постов:', data.length);
        console.log('📦 Данные:', data);
        setPosts(data);
      } catch (error) {
        console.error('❌ Ошибка загрузки постов:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      const res = await threadsAPI.like(postId);
      if (res.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: (post.likes || 0) + 1,
                  isLiked: true,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Ошибка лайка:", error);
    }
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await threadsAPI.create({
        title: newTitle,
        content: newContent,
      });

      if (res.ok) {
        setPosts((prev) => [{ ...res.post, likes: 0, isLiked: false }, ...prev]);
        setNewTitle("");
        setNewContent("");
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await threadsAPI.delete(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className={styles.threads__loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.threads}>
      <Button
        size="main"
        color="primary"
        radius={8}
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? "Отмена" : "+ Создать тред"}
      </Button>

      {showCreateForm && (
        <div className={styles.threads__createForm}>
          <Input
            placeholder="Заголовок"
            value={newTitle}
            onChange={setNewTitle}
          />
          <textarea
            className={styles.threads__textarea}
            placeholder="Что вы думаете?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={5}
          />
          <div className={styles.threads__createFormActions}>
            <Button
              size="main"
              color="primary"
              radius={8}
              onClick={handleCreatePost}
              disabled={!newTitle.trim() || !newContent.trim()}
            >
              Опубликовать
            </Button>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className={styles.threads__empty}>
          <p>Пока нет тредов. Создайте первый!</p>
        </div>
      ) : (
        posts.map((post) => (
          <Card
            key={post._id}
            className={styles.threads__card}
            hideButton={true}
          >
            <div className={styles.threads__post}>
              <div className={styles.post__header}>
                <div className={styles.header__author}>
                  <div className={styles.author__avatar}>
                    {post.avatar ? (
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <Icon name="user" size={24} color="rgba(255,255,255,0.3)" />
                    )}
                  </div>
                  <span className={styles.author__name}>
                    {post.author || "Аноним"}
                  </span>
                </div>
                <span className={styles.post__date}>
                  {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <h3 className={styles.threads__card__post_title}>{post.title}</h3>
              <p className={styles.post__content}>{post.content}</p>
            </div>

            <div className={styles.post__footer}>
              <button
                className={`${styles.post__like} ${post.isLiked ? styles.post__like_active : ''}`}
                onClick={() => handleLike(post._id)}
              >
                <Icon
                  name={post.isLiked ? 'likeFilled' : 'like'}
                  size={18}
                  color={post.isLiked ? '#686DE0' : 'rgba(255,255,255,0.4)'}
                />
                <span>{post.likes || 0}</span>
              </button>

              <Icon
                name="delete"
                size={18}
                color="rgba(255,255,255,0.3)"
                onClick={() => handleDeletePost(post._id)}
                className={styles.deleteIcon}
              />
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

export const Threads = memo(ThreadsComponent);