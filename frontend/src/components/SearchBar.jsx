import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, onClear, theme = "light" }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        onClear();
    };

    return (
        <div className={`search-container ${theme}`}>
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by title, creator, or assigned user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="clear-btn"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
                <button type="submit" className="search-btn">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;