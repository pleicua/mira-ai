'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { PLANS } from '@/lib/constants';
import { Check, Coins, CreditCard } from 'lucide-react';

export default function CreditsPage() {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Créditos e Planos
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Gerencie seus créditos e escolha o melhor plano para você
        </p>
      </div>

      {/* Current credits */}
      <Card className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Seus créditos disponíveis</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{user?.credits || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Plano atual: <span className="font-semibold capitalize">{user?.plan || 'free'}</span>
              </p>
            </div>
            <Coins className="w-16 h-16 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Escolha seu plano
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card 
              key={key}
              className={`relative ${
                key === 'pro' 
                  ? 'border-2 border-purple-500 shadow-xl' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {key === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price === 0 ? 'Grátis' : `R$ ${plan.price.toFixed(2)}`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-600 dark:text-gray-400">/mês</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    key === 'pro'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  disabled={user?.plan === key}
                >
                  {user?.plan === key ? 'Plano Atual' : key === 'pro' ? 'Fazer Upgrade' : 'Plano Grátis'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Credit costs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Custo por Operação
          </CardTitle>
          <CardDescription>Veja quantos créditos cada ação consome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Gerar Imagem</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">1 crédito</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Gerar Vídeo</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">5 créditos</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Upscale de Imagem</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">2 créditos</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Criar Variação</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">1 crédito</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
