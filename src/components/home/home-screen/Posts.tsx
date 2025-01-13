// components/home/home-screen/Posts.tsx

import React from "react";
import { Post } from "@prisma/client"; // Asegúrate de importar el tipo Post de Prisma si lo usas

interface PostsProps {
  posts: Post[];  // Recibimos los posts como prop
  admin: any;  // Puedes ajustar el tipo según tu modelo de admin
  isSubscribed?: boolean; // Es opcional
}

const Posts: React.FC<PostsProps> = ({ posts, admin, isSubscribed }) => {
  // Asegurándonos de que 'posts' no sea undefined y sea un array
  const safePosts = posts || []; // Si posts es undefined, lo convertimos en un array vacío

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Posts</h2>

      {safePosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        safePosts.map((post) => (
          <div key={post.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            {post.mediaUrl && (
              <img src={post.mediaUrl} alt="Post media" className="w-full h-auto mb-2" />
            )}
            <h3 className="text-lg font-semibold">{post.text}</h3>
            <small className="text-gray-500">
              Posted on: {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
