import React, { useState, useEffect } from 'react';

interface OGPData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
}

interface OGPCardProps {
  url: string;
}

const OGPCard: React.FC<OGPCardProps> = ({ url }) => {
  const [ogpData, setOgpData] = useState<OGPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOGP = async () => {
      try {
        // CORSプロキシを使用してOGPデータを取得
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
          const html = data.contents;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // OGPメタタグを抽出
          const title = 
            doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
            doc.querySelector('title')?.textContent ||
            url;
            
          const description = 
            doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
            doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
            '';
            
          const image = 
            doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
            '';
            
          const siteName = 
            doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
            new URL(url).hostname;

          setOgpData({
            title,
            description,
            image,
            url,
            siteName
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch OGP data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOGP();
  }, [url]);

  if (loading) {
    return (
      <span className="text-gray-400">読み込み中...</span>
    );
  }

  if (error || !ogpData) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-800 underline hover:no-underline transition-colors"
      >
        {url}
      </a>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-600 hover:text-gray-800 underline hover:no-underline transition-colors"
    >
      {ogpData.title}
    </a>
  );
};

export default OGPCard;