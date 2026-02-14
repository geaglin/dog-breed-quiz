import { useState, useEffect } from 'react';
import CockapooLogo from './CockapooLogo';

export default function Result({ result, onRetake }) {
  const { breed, matchScore } = result;
  const [imageUrl, setImageUrl] = useState(breed.localImage || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch(`https://dog.ceo/api/breed/${breed.apiBreed}/images/random`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setImageUrl(data.message);
        }
      })
      .catch(() => {
        // Local image is already set as fallback
      });
  }, [breed.apiBreed]);

  const handleRetake = () => {
    setRevealed(false);
    setTimeout(onRetake, 400);
  };

  return (
    <div className={`result-screen ${revealed ? 'revealed' : ''}`}>
      <div className="result-card">
        <div className="result-header">
          <div className="match-badge">{matchScore}% Match</div>
          <h1 className="result-title">You are a</h1>
          <h2 className="breed-name">{breed.name}</h2>
        </div>

        {imageUrl && (
          <div className={`breed-image-container ${imageLoaded ? 'loaded' : ''}`}>
            <img
              src={imageUrl}
              alt={breed.name}
              className="breed-image"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}

        <p className="breed-description">{breed.description}</p>

        <div className="traits-section">
          <h3>Your Key Traits</h3>
          <div className="traits-grid">
            {breed.traits.map((trait, i) => (
              <span
                key={trait}
                className="trait-tag"
                style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="result-actions">
          <button className="retake-btn" onClick={handleRetake}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Take Quiz Again
          </button>
          <button
            className="share-btn"
            onClick={() => {
              const text = `I took the Dog Breed Personality Quiz and I'm a ${breed.name}! 🐾 ${matchScore}% match. Find out your breed:`;
              if (navigator.share) {
                navigator.share({ title: 'Dog Breed Personality Quiz', text, url: window.location.href });
              } else {
                navigator.clipboard.writeText(`${text} ${window.location.href}`);
                alert('Copied to clipboard!');
              }
            }}
          >
            <CockapooLogo size={22} />
            Share Result
          </button>
        </div>
      </div>
    </div>
  );
}
