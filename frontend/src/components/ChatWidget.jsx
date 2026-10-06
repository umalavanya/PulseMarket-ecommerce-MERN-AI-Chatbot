import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Bot,
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  RotateCcw,
  LogIn,
  ExternalLink,
  ShoppingBag,
  Star,
  Package
} from 'lucide-react';
import './ChatWidget.css';

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-1',
  sender: 'bot',
  text: `👋 **Hello! I'm your ShopSphere AI Assistant.**\n\nHow can I help you today? Try asking me:`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isWelcome: true,
};

const SUGGESTIONS = [
  { label: '👟 Running shoes under $100', text: 'Show me running shoes under $100' },
  { label: '📦 Where is my order?', text: 'Where is my order?' },
  { label: '🔄 Return policy', text: 'What is your return policy?' },
  { label: '⚖️ Compare products', text: 'Compare headphones vs earbuds' },
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth || {});

  // Scroll to bottom whenever messages change or window opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Build conversation history format
      const conversationHistory = messages
        .filter((m) => !m.isWelcome)
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      // Setup auth header if token exists
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }

      const { data } = await axios.post('/api/chat/message', {
        message: queryText,
        conversationHistory,
      }, config);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        products: data.products || [],
        orders: data.orders || [],
        requiresLogin: data.requiresLogin || false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting right now. Please check your internet connection or try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Helper to format basic markdown (bold, bullets, linebreaks)
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bolding replacement **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={idx} style={{ marginLeft: '12px' }}>{lineContent.slice(1)}</li>;
      }
      if (line.startsWith('### ')) {
        return <h5 key={idx} style={{ margin: '6px 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#131921' }}>{lineContent}</h5>;
      }
      return <p key={idx} style={{ margin: line.trim() === '' ? '4px 0' : '0 0 4px 0' }}>{lineContent}</p>;
    });
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Toggle Button */}
      <button
        className="chat-trigger-btn"
        onClick={toggleChat}
        aria-label="Toggle Shopping Assistant Chat"
      >
        {isOpen ? <X size={26} /> : <Bot size={28} />}
        {!isOpen && <span className="chat-trigger-badge">AI</span>}
      </button>

      {/* Main Chat Box */}
      {isOpen && (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-icon">
                <Sparkles size={20} />
              </div>
              <div className="chat-title-group">
                <h4>
                  ShopSphere AI <Bot size={15} />
                </h4>
                <p className="chat-subtitle">Powered by Google Gemini</p>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                className="chat-icon-btn"
                onClick={handleClearHistory}
                title="Clear Chat History"
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="chat-icon-btn"
                onClick={toggleChat}
                title="Close Assistant"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className="message-bubble">
                  <div className="chat-markdown">{renderFormattedText(msg.text)}</div>

                  {/* Suggestion Chips on Welcome Message */}
                  {msg.isWelcome && (
                    <div className="chat-suggestions">
                      {SUGGESTIONS.map((s, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => handleSendMessage(s.text)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Requires Login Action Button */}
                  {msg.requiresLogin && (
                    <Link to="/login" className="chat-login-btn" onClick={() => setIsOpen(false)}>
                      <LogIn size={14} /> Log In Now
                    </Link>
                  )}

                  {/* Embedded Recommended Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="chat-product-list">
                      {msg.products.slice(0, 3).map((prod) => (
                        <Link
                          key={prod._id}
                          to={`/product/${prod._id}`}
                          className="chat-product-card"
                          onClick={() => setIsOpen(false)}
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="chat-product-img"
                          />
                          <div className="chat-product-details">
                            <div className="chat-product-title">{prod.name}</div>
                            <div className="chat-product-price">${prod.price?.toFixed(2)}</div>
                            <div className="chat-product-rating">
                              <Star size={11} fill="#ffa41c" stroke="none" />
                              <span>{prod.rating} ({prod.numReviews})</span>
                            </div>
                          </div>
                          <ExternalLink size={14} color="#007185" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="message-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {/* Typing Indicator while waiting */}
            {loading && (
              <div className="message-row bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="chat-footer">
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask about products, orders, policies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!input.trim() || loading}
                title="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
