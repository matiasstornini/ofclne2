import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ethers } from "ethers"; // Compatible con Ethers v6
import prisma from "@/db/prisma";

// Proveedor de BSC (Binance Smart Chain)
const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");

// Dirección del contrato de USDT en BSC
const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";

// ABI de USDT para consultar saldo
const usdtAbi = ["function balanceOf(address owner) view returns (uint256)"];

// Función para obtener saldo de USDT
async function getUSDTBalance(walletAddress: string) {
  const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
  const balance = await usdtContract.balanceOf(walletAddress);
  return ethers.formatUnits(balance, 18); // Formatear a unidades legibles
}

export async function GET() {
  // Obtener el usuario actual desde la sesión
  const { getUser } = getKindeServerSession();
  const currentUser = await getUser();

  if (!currentUser) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  // Buscar al usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { walletAddress: true },
  });

  if (!user?.walletAddress) {
    return NextResponse.json({ error: "No wallet found" }, { status: 404 });
  }

  try {
    // Obtener el balance de USDT
    const usdtBalance = await getUSDTBalance(user.walletAddress);
    return NextResponse.json({
      walletAddress: user.walletAddress,
      balances: {
        USDT: {
          balance: parseFloat(usdtBalance),
          value: parseFloat(usdtBalance), // Aquí podrías usar una función para calcular el valor en USD
        },
      },
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json({ error: "Failed to load balances" }, { status: 500 });
  }
}
