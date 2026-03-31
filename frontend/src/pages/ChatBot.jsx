import React, { useState, useRef, useEffect } from 'react';
import { ai } from '../utils/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const CHIPS = [
  'Explain the OSI model simply',
  'What is deadlock in OS?',
  'Explain normalization in DBMS',
  'TCP vs UDP difference',
  'What is Big O notation?',
  'Explain virtual memory',
  'What is SQL JOIN?',
  'Explain recursion with example',
];

const WELCOME = { role: 'assistant', content: 'Hi! I\'m your AI study buddy 🎓 Ask me anything — concepts, doubts, or "explain like I\'m 5". I\'m here 24/7 to help you ace your exams!' };

export default function ChatBot() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const bottomRef = useRef();

  // Load chat list on mount
  useEffect(() => {
    loadChatList();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatList = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatList(res.data.chats || []);
    } catch (err) {
      // silently fail
    }
  };

  const loadChat = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const chat = res.data.chat;
      setMessages([WELCOME, ...chat.messages]);
      setChatId(id);
      setShowHistory(false);
    } catch (err) {
      toast.error('Could not load chat');
    }
  };

  const send = async (msgText) => {
    const text = (msgText || input).trim();
    if (!text || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages
        .slice(1)
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await ai.chat(text, chatId, history.slice(0, -1));
      setChatId(res.data.chatId);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      loadChatList(); // refresh chat list
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Something went wrong';
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errMsg}` }]);
      if (err.response?.data?.upgradeRequired) {
        toast('Upgrade to Pro for unlimited doubts!', { icon: '⭐' });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared! Ask me anything 😊' }]);
    setChatId(null);
  };

  const newChat = () => {
    setMessages([WELCOME]);
    setChatId(null);
    setShowHistory(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 700 }}>Doubt Solver AI</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>Your personal AI teacher — available 24/7.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { setShowHistory(!showHistory); loadChatList(); }}>
            📋 History ({chatList.length})
          </button>
          <button className="btn btn-ghost btn-sm" onClick={newChat}>✏️ New chat</button>
          <button className="btn btn-ghost btn-sm" onClick={clearChat}>🗑️ Clear</button>
        </div>
      </div>

      {/* Chat History Panel */}
      {showHistory && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>📋 Previous Chats</div>
          {chatList.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No chat history yet.</p>
          ) : (
            chatList.map(chat => (
              <div key={chat._id}
                onClick={() => loadChat(chat._id)}
                style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 6, background: chat._id === chatId ? 'rgba(108,71,255,0.08)' : 'var(--bg)', border: '1px solid var(--border)', fontSize: 14 }}
              >
                <div style={{ fontWeight: 500 }}>{chat.title || 'Untitled Chat'}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {new Date(chat.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 560 }}>
        {/* Quick chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          {CHIPS.map(c => (
            <button key={c} className="chip" onClick={() => send(c)}>{c}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600,
                background: m.role === 'user' ? 'rgba(255,107,53,0.1)' : 'rgba(108,71,255,0.1)',
                color: m.role === 'user' ? 'var(--accent2)' : 'var(--accent)'
              }}>
                {m.role === 'user' ? 'You' : 'AI'}
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: 14, maxWidth: '78%', fontSize: 14, lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                ...(m.role === 'user'
                  ? { background: 'var(--accent)', color: '#fff', borderBottomRightRadius: 4 }
                  : { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--ink2)', borderBottomLeftRadius: 4 })
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(108,71,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>AI</div>
              <div style={{ padding: '12px 16px', borderRadius: 14, borderBottomLeftRadius: 4, background: 'var(--card)', border: '1px solid var(--border)' }}>
                <span className="dot-pulse"><span /><span /><span /></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <input className="input" style={{ flex: 1 }} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask a doubt… (Enter to send)" disabled={loading} />
          <button className="btn" onClick={() => send()} disabled={loading || !input.trim()}>
            Send ↗
          </button>
        </div>
      </div>
    </div>
  );
}
