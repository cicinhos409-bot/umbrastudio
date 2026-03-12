'use client';

import React, { useState, useEffect } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { motion } from 'motion/react';
import { Plus, Trash2, CheckSquare, Check, X } from 'lucide-react';
import { getChecklists, createChecklist, updateChecklist, deleteChecklist, Checklist } from '@/lib/db';

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [title, setTitle] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [items, setItems] = useState<{ text: string; completed: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      const data = await getChecklists();
      setChecklists(data);
    } catch (error) {
      console.error('Error loading checklists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItems([...items, { text: newItemText, completed: false }]);
    setNewItemText('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title.trim() || items.length === 0) return;
    
    try {
      const newChecklist = await createChecklist(title, items);
      setChecklists([newChecklist, ...checklists]);
      setTitle('');
      setItems([]);
    } catch (error) {
      console.error('Error creating checklist:', error);
    }
  };

  const handleToggleItem = async (checklistId: string, itemIndex: number) => {
    const checklist = checklists.find(c => c.id === checklistId);
    if (!checklist) return;

    const newItems = [...checklist.items];
    newItems[itemIndex].completed = !newItems[itemIndex].completed;

    try {
      const updated = await updateChecklist(checklistId, checklist.title, newItems);
      setChecklists(checklists.map(c => c.id === checklistId ? updated : c));
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChecklist(id);
      setChecklists(checklists.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting checklist:', error);
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
            <CheckSquare className="w-8 h-8 text-violet-500" />
            Meus Checklists
          </h1>
          <p className="text-zinc-400">Acompanhe suas tarefas e processos de criação.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Novo Checklist</h2>
            
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Título do checklist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
              />
              
              <form onSubmit={handleAddItem} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar item..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-sm"
                />
                <button
                  type="submit"
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              {items.length > 0 && (
                <ul className="space-y-2 mt-4">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                      <span className="text-sm text-zinc-300">{item.text}</span>
                      <button onClick={() => handleRemoveItem(index)} className="text-zinc-500 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleCreate}
              disabled={!title.trim() || items.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              Salvar Checklist
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : checklists.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl border-dashed">
              <CheckSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-1">Nenhum checklist encontrado</h3>
              <p className="text-zinc-500 text-sm">Crie seu primeiro checklist usando o formulário ao lado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklists.map((checklist) => {
                const completedCount = checklist.items.filter(i => i.completed).length;
                const totalCount = checklist.items.length;
                const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

                return (
                  <motion.div
                    key={checklist.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 relative group"
                  >
                    <button
                      onClick={() => handleDelete(checklist.id)}
                      className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <h3 className="text-lg font-bold text-white mb-3 pr-8">{checklist.title}</h3>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-zinc-400 mb-1">
                        <span>Progresso</span>
                        <span>{completedCount} de {totalCount}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {checklist.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleItem(checklist.id, index)}
                            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              item.completed 
                                ? 'bg-violet-500 border-violet-500 text-white' 
                                : 'bg-zinc-950 border-zinc-700 text-transparent hover:border-violet-500'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <span className={`text-sm ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}
