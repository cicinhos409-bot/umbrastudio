'use client';

import React, { useState, useEffect } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { motion } from 'motion/react';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { getEvents, createEvent, deleteEvent, Event } from '@/lib/db';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    
    try {
      const newEvent = await createEvent(title, description, new Date(date).toISOString());
      setEvents([...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setTitle('');
      setDescription('');
      setDate('');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
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
            <CalendarIcon className="w-8 h-8 text-violet-500" />
            Meus Eventos
          </h1>
          <p className="text-zinc-400">Organize suas datas importantes e lançamentos.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Novo Evento</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Título do evento"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                  required
                />
              </div>
              <div>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Descrição (opcional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                Criar Evento
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl border-dashed">
              <CalendarIcon className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-1">Nenhum evento encontrado</h3>
              <p className="text-zinc-500 text-sm">Crie seu primeiro evento usando o formulário ao lado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex items-start justify-between group"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                    <p className="text-violet-400 text-sm font-medium mb-2">
                      {new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                    {event.description && (
                      <p className="text-zinc-400 text-sm whitespace-pre-wrap">{event.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}
