"use server";

import prisma from "@/db/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getUserProfileAction() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  
	if (!user) return null;
  
	// Obtener el usuario actual junto con la descripción
	const currentUser = await prisma.user.findUnique({
	  where: { id: user.id },
	  select: {
		id: true,
		name: true,
		email: true,
		image: true,
		slug: true,
		description: true, // Agregamos la descripción
	  },
	});
  
	return currentUser;
  }
  
export async function updateUserProfileAction({
	name,
	image,
	description,
  }: {
	name: string;
	image: string;
	description: string;
  }) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
  
	if (!user) throw new Error("Unauthorized");
  
	const updatedFields: Partial<User> = {};
  
	if (name) updatedFields.name = name;
	if (image) updatedFields.image = image;
	if (description) updatedFields.description = description; // Agregado para manejar la descripción
  
	const updatedUser = await prisma.user.update({
	  where: { id: user.id },
	  data: updatedFields,
	});
  
	revalidatePath("/update-profile");
  
	return { success: true, user: updatedUser };
  }
  