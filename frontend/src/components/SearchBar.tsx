import React, { useState } from 'react';

interface Props {
  onSearch: (q: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search emails..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '0.5rem', width: '70%' }}
      />
      <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
