import React, { useEffect, useState } from 'react';
import EmailList from '../components/EmailList';
import SearchBar from '../components/SearchBar';
import { fetchEmails, EmailSummary } from '../services/emailService';
import { searchEmails } from '../services/searchService';

const HomePage: React.FC = () => {
  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEmails().then((data) => {
      setEmails(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = async (q: string) => {
    setLoading(true);
    const results = await searchEmails(q);
    setEmails(results as EmailSummary[]);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Onebox Email Aggregator</h1>
      <SearchBar onSearch={handleSearch} />
      {loading ? <p>Loading...</p> : <EmailList emails={emails} />}
    </div>
  );
};

export default HomePage;
