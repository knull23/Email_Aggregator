import React from 'react';
import { EmailSummary } from '../services/emailService';
import { Link } from 'react-router-dom';

interface Props {
  emails: EmailSummary[];
}

const EmailList: React.FC<Props> = ({ emails }) => {
  if (!emails.length) return <p>No emails found.</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {emails.map((email) => (
        <li
          key={email.id}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '0.5rem',
            borderRadius: '4px'
          }}
        >
          <Link to={`/email/${email.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>{email.subject}</h3>
            <p>
              From: {email.from} | Date: {new Date(email.date).toLocaleString()}
            </p>
            <p>Category: {email.category}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default EmailList;
