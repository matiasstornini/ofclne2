'use client';

import { useEffect, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WalletInterface() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener la wallet desde la API
  useEffect(() => {
    async function fetchWalletAddress() {
      try {
        const response = await fetch("/api/wallet");
        if (!response.ok) {
          throw new Error("Failed to fetch wallet address");
        }
        const data = await response.json();
        setWalletAddress(data.walletAddress);
      } catch (err) {
        setError("Failed to load wallet address");
      } finally {
        setLoading(false);
      }
    }

    fetchWalletAddress();
  }, []);

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) return <p>Loading wallet...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" className="p-2">
          <RefreshCw className="w-6 h-6 rotate-180" />
        </Button>
        <h1 className="text-xl font-bold">MY WALLET</h1>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Service Wallet</h2>
            <Button variant="ghost" className="p-1 h-auto">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-400">Address</span>
            <code className="text-blue-400">{walletAddress}</code>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={() => walletAddress && copyToClipboard(walletAddress)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <div className="ml-auto flex gap-2">
              <Badge variant="secondary" className="bg-pink-500/20 text-pink-500">
                <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5" />
                BNB Chain
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5" />
                Arbitrum
              </Badge>
            </div>
          </div>
        </section>

        {/* Payout Wallet Section 
        <section>
          <h2 className="text-lg font-semibold mb-4">Payout Wallet</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-mono">0x466...c08c</span>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                  Primary
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
              <span className="font-mono">0xaa5...84e1</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              className="w-full border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
            >
              <span className="text-xl mr-2">+</span> ADD NEW PAYOUT WALLET
            </Button>
          </div>
        </section>*/}
      </div>
    </div>
  )
}
