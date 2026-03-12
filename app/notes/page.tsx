'use client';

import React, { useState, useEffect } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { motion } from 'motion/react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { getNotes, createNote, deleteNote, Note } from '@/lib/db';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      const newNote = await createNote(title, content);
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <DashboardWrapper>
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-violet-500" />
            Minhas Notas
          </h1>
          <p className="text-zinc-400">Guarde suas ideias e rascunhos aqui.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Nova Nota</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Título da nota"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Conteúdo da nota..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Criar Nota
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl border-dashed">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-1">Nenhuma nota encontrada</h3>
              <p className="text-zinc-500 text-sm">Crie sua primeira nota usando o formulário ao lado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 relative group"
                >
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold text-white mb-2 pr-8">{note.title}</h3>
                  <p className="text-zinc-400 text-sm whitespace-pre-wrap line-clamp-4">{note.content}</p>
                  <div className="mt-4 text-xs text-zinc-600">
                    {new Date(note.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}
