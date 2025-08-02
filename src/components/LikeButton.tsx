import React, { useState, useEffect } from 'react';

interface LikeButtonProps {
  postSlug: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postSlug }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load likes from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem(`likes-${postSlug}`);
    const savedIsLiked = localStorage.getItem(`liked-${postSlug}`);
    
    if (savedLikes) {
      setLikes(parseInt(savedLikes, 10));
    }
    
    if (savedIsLiked === 'true') {
      setIsLiked(true);
    }
  }, [postSlug]);

  const handleLike = () => {
    setIsAnimating(true);
    
    if (isLiked) {
      // Unlike
      const newLikes = Math.max(0, likes - 1);
      setLikes(newLikes);
      setIsLiked(false);
      localStorage.setItem(`likes-${postSlug}`, newLikes.toString());
      localStorage.setItem(`liked-${postSlug}`, 'false');
    } else {
      // Like
      const newLikes = likes + 1;
      setLikes(newLikes);
      setIsLiked(true);
      localStorage.setItem(`likes-${postSlug}`, newLikes.toString());
      localStorage.setItem(`liked-${postSlug}`, 'true');
    }
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="flex items-center justify-center space-x-4 py-8">
      <div className="text-center">
        <button
          onClick={handleLike}
          className={`
            group relative inline-flex items-center justify-center
            w-16 h-16 rounded-full transition-all duration-300 transform
            ${isLiked 
              ? 'bg-red-50 hover:bg-red-100 text-red-500' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-400'
            }
            ${isAnimating ? 'scale-110' : 'hover:scale-105'}
            focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50
          `}
          aria-label={isLiked ? 'いいねを取り消す' : 'いいねする'}
        >
          {/* Heart Icon */}
          <svg 
            className={`w-8 h-8 transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
            fill={isLiked ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={isLiked ? 0 : 2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          
          {/* Animation particles */}
          {isAnimating && isLiked && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-red-400 rounded-full animate-ping opacity-75`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-20px)`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: '600ms'
                  }}
                />
              ))}
            </>
          )}
        </button>
        
        {/* Like count */}
        <div className="mt-2">
          <span className="text-sm font-medium text-gray-600">
            {likes > 0 && (
              <span className={`transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
                {likes}
              </span>
            )}
            {likes === 0 && (
              <span className="text-gray-400">いいね</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LikeButton;