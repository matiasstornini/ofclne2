"use server";

import { ethers } from "ethers"; // Importa ethers.js
import prisma from "@/db/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function checkAuthStatus() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return { success: false };

  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });

  // Si el usuario no existe en la base de datos, creamos uno nuevo
  if (!existingUser) {
    // Generar el slug a partir del nombre del usuario
    const slug = user.given_name ? user.given_name.toLowerCase().replace(/\s+/g, "-") : "";

    // Generar una billetera Ethereum usando ethers.js
    const wallet = ethers.Wallet.createRandom(); // Crea una billetera aleatoria
    const walletAddress = wallet.address; // Dirección de la billetera
    const walletPrivateKey = wallet.privateKey; // Clave privada de la billetera (guárdala de forma segura)

    // Crear el nuevo usuario con la billetera generada
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.given_name + " " + user.family_name,
        image: user.picture,
        slug: slug, // Añadir el slug
        walletAddress: walletAddress, // Dirección de la billetera
        walletPrivateKey: walletPrivateKey, // (opcional) clave privada
      },
    });
  }

  return { success: true };
}
