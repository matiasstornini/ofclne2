import BaseLayout from "@/components/BaseLayout";
import UserProfile from "../../components/home/home-screen/UserProfile";
import Posts from "../../components/home/home-screen/Posts";
import prisma from "@/db/prisma";
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Función para obtener los posts de un usuario específico
async function getUserPosts(userId: string) {
  return await prisma.post.findMany({
    where: { userId: userId }, // Filtra los posts del usuario
    orderBy: { createdAt: "desc" }, // Ordena por la fecha de creación
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

  // Obtener el usuario autenticado
  const { getUser } = getKindeServerSession();
  const authenticatedUser = await getUser();

  // Determinar si el usuario autenticado es el dueño del perfil
  const isOwner = authenticatedUser?.id === user.id;

  return (
    <BaseLayout>
      <UserProfile user={user} isOwner={isOwner} /> {/* Pasamos isOwner */}
      <Posts admin={admin!} isSubscribed={user.isSubscribed} posts={posts || []} />
    </BaseLayout>
  );
};

export default UserSlugPage;
