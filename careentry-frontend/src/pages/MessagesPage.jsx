import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { mockNachrichten } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';
import { messagesService } from '../services/api';

function MessagesPage() {
  const [nachrichten, setNachrichten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' oder 'sent'

  const { user } = useAuth();
  const currentUserId = user?.id || 1;

  useEffect(() => {
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesService.getAll();
      
      console.log('Messages Response:', response);
      
      // Backend gibt { success: true, data: [...] } zurück
      const rawMessages = response?.data || response || [];
      
      // Stelle sicher dass es ein Array ist
      const messagesArray = Array.isArray(rawMessages) ? rawMessages : [];
      
      // Transformiere Backend-Daten zu Frontend-Format
      const transformedMessages = messagesArray.map(m => {
        // Ermittle ob User Sender oder Empfänger ist
        const isSender = m.sender === user?.id;
        
        return {
          id: m.id,
          sender_id: m.sender,
          sender_name: isSender ? (user?.vorname + ' ' + user?.nachname) : 'Dr. Müller', // TODO: Von Backend holen
          sender_role: isSender ? user?.role : 'arzt',
          receiver_id: isSender ? null : user?.id, // TODO: Echter receiver vom Backend
          receiver_name: isSender ? 'Dr. Müller' : (user?.vorname + ' ' + user?.nachname),
          subject: `Konversation #${m.conversation}`, // Backend hat kein Subject
          body: m.messageText || '',
          read: m.isRead || false,
          created_at: m.sentDate || new Date().toISOString(),
          reply_to: null,
          conversation_id: m.conversation
        };
      });
      
      console.log('Transformed Messages:', transformedMessages);
      
      setNachrichten(transformedMessages);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Nachrichten:', err);
      setError('Backend nicht erreichbar');
      // Fallback zu localStorage oder Mock-Daten
      const saved = localStorage.getItem('nachrichten_list');
      setNachrichten(saved ? JSON.parse(saved) : mockNachrichten);
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();
}, [user]);

  // Loading State
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  // Empfangene Nachrichten (Posteingang)
  const receivedMessages = nachrichten.filter(n => n.receiver_id === currentUserId);
  
  // Gesendete Nachrichten
  const sentMessages = nachrichten.filter(n => n.sender_id === currentUserId);

  const unreadCount = receivedMessages.filter(n => !n.read).length;

  const markAsRead = (messageId) => {
    setNachrichten(nachrichten.map(n => 
      n.id === messageId ? { ...n, read: true } : n
    ));
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read && message.receiver_id === currentUserId) {
      markAsRead(message.id);
    }
  };

  const handleDeleteMessage = (messageId) => {
      if (window.confirm('Möchten Sie diese Nachricht wirklich löschen?')) {
        setNachrichten(nachrichten.filter(n => n.id !== messageId));
        setSelectedMessage(null);
      }
  };

  // Aktuell angezeigte Nachrichten basierend auf Tab
  const displayedMessages = activeTab === 'inbox' ? receivedMessages : sentMessages;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nachrichten
        </h1>
        <p className="text-gray-600">
          {unreadCount > 0 ? `${unreadCount} ungelesene Nachricht${unreadCount > 1 ? 'en' : ''}` : 'Keine neuen Nachrichten'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nachrichten-Liste */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            {/* Header mit Button */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Nachrichten</h2>
              <button
                onClick={() => {
                  setShowCompose(true);
                  setSelectedMessage(null);
                  setReplyTo(null);
                }}
                className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                + Neue Nachricht
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => {
                    setActiveTab('inbox');
                    setSelectedMessage(null);
                  }}
                  className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'inbox'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Posteingang
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-primary-600 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('sent');
                    setSelectedMessage(null);
                  }}
                  className={`flex-1 py-3 px-4 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'sent'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gesendet
                </button>
              </nav>
            </div>

            {/* Nachrichten-Liste */}
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {displayedMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {activeTab === 'inbox' ? 'Keine Nachrichten empfangen' : 'Keine Nachrichten gesendet'}
                </div>
              ) : (
                displayedMessages
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((nachricht) => (
                    <div
                      key={nachricht.id}
                      onClick={() => handleSelectMessage(nachricht)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === nachricht.id ? 'bg-primary-50' : ''
                      } ${
                        !nachricht.read && activeTab === 'inbox'
                          ? 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`text-sm font-medium ${
                          !nachricht.read && activeTab === 'inbox'
                            ? 'text-gray-900 font-bold'
                            : 'text-gray-700'
                        }`}>
                          {activeTab === 'inbox' ? nachricht.sender_name : nachricht.receiver_name}
                        </h3>
                        {!nachricht.read && activeTab === 'inbox' && (
                          <span className="h-2 w-2 bg-primary-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                        {nachricht.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {nachricht.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(nachricht.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Nachrichten-Details oder Compose */}
        <div className="lg:col-span-2">
          {showCompose ? (
            <ComposeMessage 
              onCancel={() => {
                setShowCompose(false);
                setReplyTo(null);
              }}
              onSend={() => {
                setShowCompose(false);
                setReplyTo(null);
                setActiveTab('sent');
              }}
              setNachrichten={setNachrichten}
              nachrichten={nachrichten}
              user={user}
              currentUserId={currentUserId}
              replyTo={replyTo}
            />
          ) : selectedMessage ? (
            <MessageDetail 
              message={selectedMessage} 
              currentUserId={currentUserId}
              activeTab={activeTab}
              onReply={(msg) => {
                setReplyTo(msg);
                setShowCompose(true);
              }}
              onDelete={handleDeleteMessage}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Keine Nachricht ausgewählt
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Wählen Sie eine Nachricht aus der Liste
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Message Detail Component
function MessageDetail({ message, activeTab, onReply, onDelete }) {
  const isReceived = activeTab === 'inbox';

  const handleReply = () => {
    onReply(message);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header bleibt gleich */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {message.subject}
            </h2>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">
                {isReceived ? 'Von: ' : 'An: '}
                {isReceived ? message.sender_name : message.receiver_name}
              </span>
              <span className="mx-2">•</span>
              <span>
                {new Date(message.created_at).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            message.sender_role === 'arzt' 
              ? 'bg-blue-100 text-blue-800'
              : message.sender_role === 'staff'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {message.sender_role === 'arzt' ? 'Arzt' : message.sender_role === 'staff' ? 'Praxis' : 'Patient'}
          </span>
        </div>
      </div>

      {/* Body bleibt gleich */}
      <div className="p-6">
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">
            {message.body}
          </p>
        </div>
      </div>

      {/* Actions mit funktionierendem Löschen-Button */}
      <div className="p-6 border-t border-gray-200 flex space-x-3">
        {isReceived && (
          <button
            onClick={handleReply}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Antworten
          </button>
        )}
        <button 
          onClick={() => onDelete(message.id)} 
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-300"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}

function ComposeMessage({ onCancel, onSend, setNachrichten, nachrichten, user, currentUserId, replyTo }) {
  const [formData, setFormData] = useState({
    receiver: replyTo ? (replyTo.sender_id === currentUserId ? replyTo.receiver_name : replyTo.sender_name) : '',
    subject: replyTo ? `Re: ${replyTo.subject}` : '',
    body: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.receiver || !formData.subject || !formData.body) {
    alert('Bitte alle Felder ausfüllen.');
    return;
  }

  setSending(true);

  try {
    // Ermittle receiver_id basierend auf Auswahl
    let receiverId;
    if (formData.receiver === 'dr-mueller') {
      receiverId = 2; // Arzt-ID
    } else if (formData.receiver === 'praxis-team') {
      receiverId = 3; // Praxis-Team-ID
    } else {
      // Falls direkte ID übergeben wurde
      receiverId = parseInt(formData.receiver);
    }

    const messageData = {
      receiver_id: receiverId,
      receiverId: receiverId, // Fallback für andere Backend-Namenskonvention
      subject: formData.subject,
      body: formData.body,
      reply_to: replyTo?.id || null,
      replyTo: replyTo?.id || null // Fallback
    };

    console.log('Sending message:', messageData);

    const response = await messagesService.send(messageData);
    
    console.log('Send response:', response);

    // Erstelle Nachricht für die lokale Liste
    const newMessage = {
      id: response.id || response.data?.id || Date.now(),
      sender_id: currentUserId,
      sender_name: user?.vorname + ' ' + user?.nachname || 'Du',
      sender_role: user?.role || 'patient',
      receiver_id: receiverId,
      receiver_name: formData.receiver === 'dr-mueller' ? 'Dr. Müller' : 'Praxis Team',
      subject: formData.subject,
      body: formData.body,
      read: false,
      created_at: new Date().toISOString(),
      reply_to: replyTo?.id || null
    };
    
    // Füge zur Liste hinzu
    setNachrichten([newMessage, ...nachrichten]);
    
    alert('Nachricht gesendet!');
    onSend();
  } catch (error) {
    console.error('Fehler beim Senden:', error);
    
    // Fallback: Speichere lokal
    const newMessage = {
      id: Date.now(),
      sender_id: currentUserId,
      sender_name: user?.vorname + ' ' + user?.nachname || 'Du',
      sender_role: user?.role || 'patient',
      receiver_id: formData.receiver === 'dr-mueller' ? 2 : 3,
      receiver_name: formData.receiver === 'dr-mueller' ? 'Dr. Müller' : 'Praxis Team',
      subject: formData.subject,
      body: formData.body,
      read: false,
      created_at: new Date().toISOString(),
      reply_to: replyTo?.id || null
    };
    
    setNachrichten([newMessage, ...nachrichten]);
    localStorage.setItem('nachrichten_list', JSON.stringify([newMessage, ...nachrichten]));
    
    alert('Nachricht lokal gespeichert (Backend nicht erreichbar)');
    onSend();
  } finally {
    setSending(false);
  }
};

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Neue Nachricht
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            An
          </label>
          <select
            value={formData.receiver}
            onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Empfänger auswählen</option>
            <option value="dr-mueller">Dr. Müller</option>
            <option value="praxis-team">Praxis Team</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Betreff
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="z.B. Terminanfrage"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nachricht
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows="8"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ihre Nachricht..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={sending}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            disabled={sending}
          >
            {sending ? 'Wird gesendet...' : 'Senden'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessagesPage;