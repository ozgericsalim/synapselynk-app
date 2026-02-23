import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Send, MessageSquare } from 'lucide-react';

export default function Messages() {
  const { profile } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await supabase.from('profiles').select('*').neq('id', profile?.id);
      if (data) setContacts(data);
    };
    if (profile) fetchContacts();
  }, [profile]);

  useEffect(() => {
    if (!selected || !profile) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').or("and(sender_id.eq." + profile.id + ",receiver_id.eq." + selected + "),and(sender_id.eq." + selected + ",receiver_id.eq." + profile.id + ")").order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();
    const channel = supabase.channel('messages').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchMessages()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selected, profile]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !selected || !profile) return;
    await supabase.from('messages').insert({ sender_id: profile.id, receiver_id: selected, content: newMsg.trim() });
    setNewMsg('');
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold mb-4">Mesajlar</h1>
      <div className="flex gap-4 h-[calc(100%-60px)]">
        <div className="w-64 bg-gray-900 rounded-xl border border-gray-800 overflow-y-auto">
          {contacts.map(c => (
            <button key={c.id} onClick={() => setSelected(c.id)} className={"w-full text-left px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition-colors " + (selected === c.id ? 'bg-gray-800' : '')}>
              <p className="font-medium text-sm">{c.full_name}</p>
              <p className="text-xs text-gray-500">{c.role}</p>
            </button>
          ))}
        </div>
        <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-500"><MessageSquare size={40} className="opacity-50" /></div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(m => (
                  <div key={m.id} className={"max-w-xs rounded-lg px-4 py-2 " + (m.sender_id === profile?.id ? 'ml-auto bg-emerald-500/20 text-emerald-100' : 'bg-gray-800')}>
                    <p className="text-sm">{m.content}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-800 flex gap-2">
                <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm" placeholder="Mesaj yazin..." />
                <button onClick={sendMessage} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"><Send size={18} /></button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
