'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  Image as ImageIcon,
  Video,
  Download,
  Edit,
  Trash2,
  Share,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  type: 'image' | 'video';
  thumbnail_url: string;
  file_url: string;
  created_at: string;
  prompt: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.type === filter;
  });

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    link.click();
  };

  const handleRename = async (projectId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ title: newTitle })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, title: newTitle } : p
      ));
      setEditingId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Erro ao renomear:', error);
      alert('Erro ao renomear projeto');
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir projeto');
    }
  };

  const handleShare = (project: Project) => {
    // Mock share - em produção, geraria um link público
    const shareUrl = `${window.location.origin}/share/${project.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copiado para a área de transferência! (simulado)');
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditingTitle(project.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Meus Projetos</h1>
          <p className="text-slate-400">Gerencie suas imagens e vídeos criados</p>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'image' | 'video')}
                className="bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent px-3 py-2"
              >
                <option value="all" className="bg-slate-700">Todos</option>
                <option value="image" className="bg-slate-700">Imagens</option>
                <option value="video" className="bg-slate-700">Vídeos</option>
              </select>
            </div>
            <span className="text-slate-400 text-sm">
              {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {filter === 'image' ? (
                <ImageIcon className="h-8 w-8 text-slate-400" />
              ) : filter === 'video' ? (
                <Video className="h-8 w-8 text-slate-400" />
              ) : (
                <div className="w-8 h-8 bg-slate-600 rounded" />
              )}
            </div>
            <h3 className="text-white font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-slate-400">
              {filter === 'all'
                ? 'Comece criando sua primeira imagem ou vídeo'
                : `Nenhuma ${filter === 'image' ? 'imagem' : 'vídeo'} encontrada`
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className={viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'aspect-video'}>
                  {project.type === 'video' ? (
                    <video
                      src={project.file_url}
                      className="w-full h-full object-cover"
                      muted
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    {editingId === project.id ? (
                      <div className="flex-1 mr-2">
                        <input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleRename(project.id, editingTitle);
                            } else if (e.key === 'Escape') {
                              cancelEditing();
                            }
                          }}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <h3 className="text-white font-medium text-sm truncate flex-1 mr-2">
                        {project.title}
                      </h3>
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      project.type === 'video' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      {project.type === 'video' ? (
                        <Video className="h-3 w-3 text-white" />
                      ) : (
                        <ImageIcon className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                    {project.prompt}
                  </p>

                  <p className="text-slate-500 text-xs mb-3">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(project.file_url, project.title)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    {editingId === project.id ? (
                      <>
                        <button
                          onClick={() => handleRename(project.id, editingTitle)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-slate-700/50 rounded transition-colors"
                          title="Salvar"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition-colors"
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(project)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                        title="Renomear"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleShare(project)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                      title="Compartilhar"
                    >
                      <Share className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}