// app/[slug]/page.tsx

import BaseLayout from "@/components/BaseLayout";
import UserProfile from "../../components/home/home-screen/UserProfile";
import Posts from "../../components/home/home-screen/Posts";
import prisma from "@/db/prisma";
import { notFound } from "next/navigation";

// Función para obtener los posts de un usuario específico
async function getUserPosts(userId: string) {
  return await prisma.post.findMany({
    where: { userId: userId },  // Filtra los posts del usuario
    orderBy: { createdAt: "desc" },  // Ordena por la fecha de creación
  });
}

const UserSlugPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  // Buscar el usuario por el slug
  const user = await prisma.user.findUnique({
    where: { slug: slug },
  });

  // Si no se encuentra el usuario, mostrar un 404
  if (!user) {
    return notFound();
  }

  // Obtener los posts del usuario
  const posts = await getUserPosts(user.id);

  // Buscar al administrador para pasarle los datos a los Posts
  const admin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL! },
  });

  return (
    <BaseLayout>
      <UserProfile user={user} />  {/* Pasamos los datos del usuario como props */}
      <Posts admin={admin!} isSubscribed={user?.isSubscribed} posts={posts || []} /> {/* Pasamos los posts al componente Posts */}
    </BaseLayout>
  );
};

export default UserSlugPage;
