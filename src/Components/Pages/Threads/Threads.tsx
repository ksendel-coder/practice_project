import { memo, useState, useEffect } from "react";
import { Button } from "../../UI/Button";
import { Input } from "../../UI/Input";
import styles from "./Styles.module.scss";
import { Card } from "../../Layouts/Card";
import { Icon } from "../../UI/Icon";
import { useUserContext } from "../../../Contexts/UserContext";
import { threadsAPI } from "../../../Api/threads";
import { ScrollToTop } from "../../UI/ScrollToTop";

export interface Post {
  _id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  avatar?: string | null;
  likes?: number;
  likedBy?: number[];
  isLiked?: boolean;
}

// export interface Comment {
//   _id: number;
//   author: string;
//   text: string;
//   createdAt: string;
//   likes: number;
// }

function ThreadsComponent() {
  const { userData } = useUserContext();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      console.log("Загрузка постов...");
      try {
        const data = await threadsAPI.getAll();
        const saved = localStorage.getItem("userData");
        let currentUserId = null;
        if (saved) {
          try {
            const user = JSON.parse(saved);
            currentUserId = user._id;
          } catch {}
        }

        const postsWithLikes = data.map((post: Post) => ({
          ...post,
          likes: post.likes || 0,
          likedBy: post.likedBy || [],
          isLiked: currentUserId
            ? (post.likedBy || []).includes(currentUserId)
            : false,
        }));
        setPosts(postsWithLikes);
        console.log("Загружено постов:", data.length);
      } catch (error) {
        console.error(error);
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
                  likes: res.likes,
                  isLiked: res.isLiked,
                }
              : post,
          ),
        );
      }
    } catch (error) {
      console.error(error);
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
        setPosts((prev) => [
          { ...res.post, likes: 0, isLiked: false, likedBy: [] },
          ...prev,
        ]);
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
      )}

      {posts.length === 0 ? (
        <div className={styles.threads__empty}>
          <p className={styles.threads__empty_line}>
            Пока нет тредов. Создайте первый!
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <Card
            key={post._id}
            className={styles.threads__card}
            hideButton={true}
          >
            <div className={styles.threads__post}>
              <div className={styles.threads__post__header}>
                <div className={styles.threads__post__author}>
                  <div className={styles.threads__post__author_avatar}>
                    {post.avatar ? (
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className={styles.threads__post__author_avatarImg}
                      />
                    ) : (
                      <Icon name="user" />
                    )}
                  </div>
                  <span>{post.author || "Аноним"}</span>
                </div>
                <span className={styles.threads__post__date}>
                  {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <h3 className={styles.threads__post__title}>{post.title}</h3>
              <p className={styles.threads__post__content}>{post.content}</p>
            </div>

            <div className={styles.threads__post__footer}>
              <button
                className={`${styles.threads__post__like} ${
                  post.isLiked ? styles.threads__post__like_active : ""
                }`}
                onClick={() => handleLike(post._id)}
              >
                <Icon name={post.isLiked ? "likeFilled" : "like"} size={18} />
                <span>{post.likes || 0}</span>
              </button>

              {userData?.name === post.author && (
                <Icon
                  name="delete"
                  onClick={() => handleDeletePost(post._id)}
                  className={styles.threads__post__deleteIcon}
                />
              )}
            </div>
          </Card>
        ))
      )}
      <ScrollToTop />
    </div>
  );
}

export const Threads = memo(ThreadsComponent);
