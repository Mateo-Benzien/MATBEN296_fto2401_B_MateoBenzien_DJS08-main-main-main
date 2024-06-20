import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPreviews } from '../services/Api';
import '../App.css';

const Favorites = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('AZ'); // Default sort by A-Z
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        const data = await fetchPreviews();
        const podcastDetails = await Promise.all(
          data.map(async (podcast) => {
            const response = await fetch(`https://podcast-api.netlify.app/id/${podcast.id}`);
            const podcastData = await response.json();
            return {
              ...podcast,
              seasons: podcastData.seasons || [], // Updated to store all seasons
              genres: podcastData.genres || [],
              episodes: podcastData.episodes || [], // Include episodes data
            };
          })
        );

        const sortedPodcasts = sortPodcasts(podcastDetails, sortBy);
        setPodcasts(sortedPodcasts);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastDetails();
  }, [sortBy]);

  const sortPodcasts = (podcasts, sortBy) => {
    switch (sortBy) {
      case 'AZ':
        return [...podcasts].sort((a, b) => a.title.localeCompare(b.title));
      case 'ZA':
        return [...podcasts].sort((a, b) => b.title.localeCompare(a.title));
      case 'NEW':
        return [...podcasts].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      case 'OLD':
        return [...podcasts].sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
      default:
        return podcasts;
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleEpisodeClick = (event, podcastId, seasonId, episodeId) => {
    event.stopPropagation(); // Prevents bubbling up to div click
    navigate(`/podcast/${podcastId}/season/${seasonId}/episode/${episodeId}`);
  };

  const toggleFavorite = (podcastId, episodeId) => {
    const updatedPodcasts = podcasts.map((podcast) => ({
      ...podcast,
      episodes: podcast.episodes.map((episode) => ({
        ...episode,
        isFavorite: episode.id === episodeId ? !episode.isFavorite : episode.isFavorite,
      })),
    }));
    setPodcasts(updatedPodcasts);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="Sidebar">
        <Link to="/" className="SidebarLink">Home</Link>
        <Link to="/favorites" className="SidebarLink">Favorites</Link>
      </div>
      <div className="MainContent">
        <div className="PodcastListContainer">
          <h2>Favorite Podcasts</h2>
          <div className="SortOptions">
            <label htmlFor="sortBy">Sort By:</label>
            <select id="sortBy" value={sortBy} onChange={handleSortChange}>
              <option value="AZ">Title A-Z</option>
              <option value="ZA">Title Z-A</option>
              <option value="NEW">Newly Updated Shows</option>
              <option value="OLD">Oldest Updated Shows</option>
            </select>
          </div>
          <div className="PodcastList">
            {podcasts.map((podcast) => (
              <div key={podcast.id} className="PodcastItem">
                <h3 className="PodcastItemTitle">{podcast.title}</h3>
                <div className="PodcastItemSeasons">
                  {podcast.seasons.map((season) => (
                    <div key={season.id} className="SeasonItem">
                      <h4 className="SeasonTitle">Season {season.number}</h4>
                      <ul className="EpisodeList">
                        {season.episodes.map((episode) => (
                          <li key={episode.id} className="EpisodeItem">
                            <span>{episode.title}</span>
                            <button
                              className={`FavoriteButton ${episode.isFavorite ? 'favorited' : ''}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(podcast.id, episode.id);
                              }}
                            >
                              {episode.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                            </button>
                            <button
                              className="ViewButton"
                              onClick={(event) => handleEpisodeClick(event, podcast.id, season.id, episode.id)}
                            >
                              View
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
