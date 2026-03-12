import { supabase } from './supabase';

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
};

export type Checklist = {
  id: string;
  user_id: string;
  title: string;
  items: { text: string; completed: boolean }[];
  created_at: string;
  updated_at: string;
};

// Notes
export async function getNotes() {
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Note[];
}

export async function createNote(title: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('notes').insert([
    { user_id: user.id, title, content }
  ]).select().single();
  
  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: string, title: string, content: string) {
  const { data, error } = await supabase.from('notes').update({ title, content, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}

// Events
export async function getEvents() {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  if (error) throw error;
  return data as Event[];
}

export async function createEvent(title: string, description: string, date: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('events').insert([
    { user_id: user.id, title, description, date }
  ]).select().single();
  
  if (error) throw error;
  return data as Event;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

// Checklists
export async function getChecklists() {
  const { data, error } = await supabase.from('checklists').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Checklist[];
}

export async function createChecklist(title: string, items: { text: string; completed: boolean }[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.from('checklists').insert([
    { user_id: user.id, title, items }
  ]).select().single();
  
  if (error) throw error;
  return data as Checklist;
}

export async function updateChecklist(id: string, title: string, items: { text: string; completed: boolean }[]) {
  const { data, error } = await supabase.from('checklists').update({ title, items, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data as Checklist;
}

export async function deleteChecklist(id: string) {
  const { error } = await supabase.from('checklists').delete().eq('id', id);
  if (error) throw error;
}
