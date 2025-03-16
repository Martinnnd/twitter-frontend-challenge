import type { PostData, SingInData, SingUpData } from "./index";
import axios from "axios";
import { S3Service } from "./S3Service";

const url = process.env.REACT_APP_API_URL || "http://localhost:8080/api"; //"https://twitter-ieea.onrender.com/api"

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (e) => {
    if (e.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(e);
  }
);

const httpRequestService = {
  signUp: async (data: Partial<SingUpData>) => {
    const res = await axios.post(`${url}/auth/signup`, data);
    if (res.status === 201) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  signIn: async (data: SingInData) => {
    const res = await axios.post(`${url}/auth/login`, data);
    if (res.status === 200) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  createPost: async (data: PostData) => {
    let res
    if(!data.parentId)
      res = await axios.post(`${url}/post`, data);
    else
      res = await axios.post(`${url}/comment/${data.parentId}`, {content: data.content, images: data.images})
    if (res.status === 201) {
      const { upload } = S3Service;
      for (const imageUrl of res.data.images) {
        const index: number = res.data.images.indexOf(imageUrl);
        const file = new File([data.images![index]], `image-${index}`, { type: "image/jpeg" });
        await upload(file, imageUrl);
      }
      return res.data;
    }
  },
  getPaginatedPosts: async (limit: number, after: string, query: string) => {
    const res = await axios.get(`${url}/post/${query}`, {
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getPosts: async (
    query: string,
    nextCursor: string | undefined = undefined
  ) => {
    const res = await axios.get(`${url}/post/${query}`, {
      params: {
        limit: 5,
        after: nextCursor,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getRecommendedUsers: async (limit: number, skip: number) => {
    const res = await axios.get(`${url}/user`, {
      params: {
        limit,
        skip,
      },
    });
    console.log("Response from API:", res.data); // Verifica la respuesta completa
    if (res.status === 200) {
      return res.data;
    }
  },
  me: async () => {
    const res = await axios.get(`${url}/user/me`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getPostById: async (id: string) => {
    const res = await axios.get(`${url}/post/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  createReaction: async (postId: string, reaction: string) => {
    console.log("Enviando reacción:", reaction); // Verificar que el tipo de reacción es correcto
    const res = await axios.post(`${url}/reaction/${postId}`, {
      type: reaction,
    });
    if (res.status === 201) {
      return res.data;
    }
  },
  deleteReaction: async (reactionId: string, type: string) => {
    const res = await axios.delete(`${url}/reaction/${reactionId}`, {
      data: {
        type,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  followUser: async (userId: string) => {
    const res = await axios.post(`${url}/follower/follow/${userId}`, {});
    if (res.status === 201) {
      return res.data;
    }
  },
  unfollowUser: async (userId: string) => {
    const res = await axios.delete(`${url}/follow/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source();

      const response = await axios.get(`${url}/user/by_username/${username}`, {
        params: {
          username,
          limit,
          skip,
        },
        cancelToken: cancelToken.token,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.log(error);
    }
  },

  getProfile: async (id: string) => {
    const res = await axios.get(`${url}/user/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getPaginatedPostsFromProfile: async (
    limit: number,
    after: string,
    id: string
  ) => {
    const res = await axios.get(`${url}/post/by_user/${id}`, {
      params: {
        limit,
        after,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
  getPostsFromProfile: async (id: string) => {
    const res = await axios.get(`${url}/post/by_user/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  isLogged: async () => {
    const res = await axios.get(`${url}/user/me`);
    return res.status === 200;
  },

  getProfileView: async (id: string) => {
    const res = await axios.get(`${url}/user/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  deleteProfile: async () => {
    const res = await axios.delete(`${url}/user`);

    if (res.status === 204) {
      localStorage.removeItem("token");
    }
  },

  getChats: async () => {
    const res = await axios.get(`${url}/chat`);

    if (res.status === 200) {
      return res.data;
    }
  },

  getMutualFollows: async () => {
    const res = await axios.get(`${url}/follow/mutual`);

    if (res.status === 200) {
      return res.data;
    }
  },

  createChat: async (id: string) => {
    const res = await axios.post(`${url}/chat`, {
      users: [id],
    });

    if (res.status === 201) {
      return res.data;
    }
  },

  getChat: async (id: string) => {
    const res = await axios.get(`${url}/chat/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  deletePost: async (id: string) => {
    await axios.delete(`${url}/post/${id}`);
  },

  getPaginatedCommentsByPostId: async (
    id: string,
    limit: number,
    after: string
  ) => {
    const res = await axios.get(`${url}/post/comment/by_post/${id}`, {
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getCommentsByPostId: async (postId: string) => {
    const res = await axios.get(`${url}/comment/${postId}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getFollowing: async () => {
    const res = await axios.get(`${url}/follower/followings/`);
    if (res.status === 200) {
      return res.data;
    }
  },
  commentPost: async (postId: string, content: string, images: string[]) => {
    const res = await axios.post(`${url}/comment/${postId}`, {
      content,
      images,
    });
    if (res.status === 201) {
      return res.data;
    }
  },
  putImage: async (file: File, putObjectUrl: string) => {
    console.log("📤 Subiendo imagen a:", putObjectUrl);
    
    if (!putObjectUrl) {
        console.error("❌ Error: putObjectUrl es undefined");
        throw new Error("La URL pre-firmada es inválida");
    }

    const axiosInstance = axios.create();

    const res = await axiosInstance.put(putObjectUrl, file, { 
        headers: { "Content-Type": file.type },
    });

    if (res.status === 200) {
        console.log("✅ Imagen subida correctamente");
        return res.data;
    } else {
        console.error("❌ Error al subir la imagen:", res);
        throw new Error("Fallo en la subida de la imagen");
    }
},

addImage: async (fileType: string) => {
    try {
        const res = await axios.post(`${url}/post/image/presignedUrl`, { fileType });

        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        console.error("Error al obtener presigned URL:", error);
        throw new Error("No se pudo obtener la presigned URL.");
    }
},

  getMutuals: async () => {
    const res = await axios.get(`${url}/follower/mutual`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getChatHistory: async (userId: string) => {
    const res = await axios.get(`${url}/message/conversation/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getFollowers: async () => {
    const res = await axios.get(
      '/follower/followers',
      {}
    );
    if (res.status === 200) {
      return res.data;
    }
  },
  getFollowings: async () => {
    const res = await axios.get(
      '/follower/followings',
      {}
    );
    if (res.status === 200) {
      return res.data;
    }
  },
};

const useHttpRequestService = () => httpRequestService;

// For class component (remove when unused)
class HttpService {
  service = httpRequestService;
}

export { useHttpRequestService, HttpService };
