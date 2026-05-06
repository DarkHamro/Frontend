import React, { useState } from 'react';
import './AIModal.css';

const AIModal = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  if (!isOpen) return null;

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch(`${API_URL}/ai`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResponse(data.content);
    } catch (err) {
      setResponse("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h3>Помощник ИИ</h3>
        
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Напишите задачу или вопрос..."
          disabled={loading}
        />

        <div className="actions">
          <button onClick={handleAskAI} disabled={loading || !prompt}>
            {loading ? <div className="spinner"></div> : "Спросить"}
          </button>
        </div>

        {response && (
          <div className="ai-answer">
            <strong>Ответ:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModal;