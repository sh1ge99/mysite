import React, { useEffect } from 'react';
import OGPCard from './OGPCard';
import { createRoot } from 'react-dom/client';

const OGPRenderer: React.FC = () => {
  useEffect(() => {
    // Initialize OGP cards after component mounts
    const ogpContainers = document.querySelectorAll('.ogp-link-container');
    
    ogpContainers.forEach((container) => {
      const url = container.getAttribute('data-url');
      if (url && !container.hasAttribute('data-rendered')) {
        // Mark as rendered to prevent duplicate rendering
        container.setAttribute('data-rendered', 'true');
        
        const root = createRoot(container);
        root.render(<OGPCard url={url} />);
      }
    });
  }, []);

  return null; // This component doesn't render anything itself
};

export default OGPRenderer;