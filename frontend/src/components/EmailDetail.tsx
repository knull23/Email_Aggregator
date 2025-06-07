import React, { useEffect, useState } from 'react';
import { EmailDetail, fetchEmailDetail } from '../services/emailService';
import { getSuggestedReply } from '../services/replyService';
import { useParams } from 'react-router-dom';

const EmailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [email, setEmail] = useState<EmailDetail | null>(null);
  const [replySuggestion, setReplySuggestion] = useState<string>('');
  const [loadingReply, setLoadingReply] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    fetchEmailDetail(id).then(setEmail);
  }, [id]);

  const handleSuggestReply = async () => {
    if (!email) return;
    setLoadingReply(true);
    const suggestion = await getSuggestedReply(email.id, email.body);
    setReplySuggestion(suggestion);
    setLoadingReply(false);
  };

  if (!email) return <p>Loading email...</p>;

  return (
    <div>
      <h2>{email.subject}</h2>
      <p>
        <strong>From:</strong> {email.from} | <strong>Date:</strong>{' '}
        {new Date(email.date).toLocaleString()}
      </p>
      <hr />
      <div style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{email.body}</div>
      <button onClick={handleSuggestReply} disabled={loadingReply}>
        {loadingReply ? 'Generating reply...' : 'Suggest Reply'}
      </button>
      {replySuggestion && (
        <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem' }}>
          <h4>Suggested Reply:</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{replySuggestion}</p>
        </div>
      )}
    </div>
  );
};

export default EmailDetailPage;
