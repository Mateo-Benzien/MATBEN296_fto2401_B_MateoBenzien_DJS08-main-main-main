import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PodcastLists from './Components/podcastLists.jsx';
import PodcastDetails from './Components/podcastDetails.jsx';
import AudioPlayer from './Components/audioPlayer.jsx';
import Favorites from './Components/favorites.jsx';
import './App.css';

const App = () => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');

  const toggleFavorite = ({ podcastId, seasonId, episode }) => {
    console.log(`Toggle favorite: ${episode.title}`);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="header-text">PodCastaway</h1>
          <nav className="App-nav">
            <div className="filter-container">
              <select
                className="genre-filter"
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                <option value="">Filter by Genre</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="sci-fi">Sci-Fi</option>
              </select>
            </div>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<PodcastLists setCurrentEpisode={setCurrentEpisode} selectedGenre={selectedGenre} />} />
          <Route
            path="/podcast/:id"
            element={<PodcastDetails setCurrentEpisode={setCurrentEpisode} toggleFavorite={toggleFavorite} />}
          />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>

        <AudioPlayer currentEpisode={currentEpisode} />
      </div>
    </Router>
  );
};

export default App;
