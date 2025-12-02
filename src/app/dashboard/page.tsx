'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Image, Video, Sparkles, Crown, FolderOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const tools = [
    {
      title: 'Gerar Imagem',
      description: 'Crie imagens impressionantes usando IA',
      icon: Image,
      href: '/dashboard/create-image',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Gerar Vídeo',
      description: 'Produza vídeos dinâmicos com inteligência artificial',
      icon: Video,
      href: '/dashboard/create-video',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Bem-vindo ao AI Studio
          </h1>
          <p className="text-slate-400 text-lg">
            Crie imagens e vídeos impressionantes usando Inteligência Artificial
          </p>
        </div>

        {/* Credits Display */}
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Seus Créditos</h3>
                  <p className="text-slate-400">Plano {user?.plan === 'pro' ? 'Pro' : 'Grátis'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{user?.credits || 0}</div>
                <p className="text-slate-400 text-sm">créditos disponíveis</p>
              </div>
            </div>
            {user?.plan === 'free' && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <Link
                  href="/dashboard/credits"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade para Pro
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className={`group ${tool.bgColor} ${tool.borderColor} border rounded-2xl p-6 hover:scale-105 transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Projects */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Projetos Recentes</h2>
            <Link
              href="/dashboard/projects"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
            <FolderOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Nenhum projeto ainda</h3>
            <p className="text-slate-400 mb-4">Comece criando sua primeira imagem ou vídeo</p>
            <Link
              href="/dashboard/create-image"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Image className="h-4 w-4" />
              Criar Primeiro Projeto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}