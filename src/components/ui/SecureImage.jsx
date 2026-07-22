import React, { useState, useEffect, useRef } from 'react';

const SecureImage = ({ src, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const blobUrlRef = useRef(null);

  const defaultImageSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f7fafc"/><path d="M100 50C89.5228 50 81 58.5228 81 69C81 79.4772 89.5228 88 100 88C110.477 88 119 79.4772 119 69C119 58.5228 110.477 50 100 50ZM100 125C80.1109 125 64 141.111 64 161V75C64 65.4772 72.4772 57 82 57H118C127.523 57 136 65.4772 136 75V161C136 141.111 119.889 125 100 125Z" fill="%23a0aec0"/><text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="14" fill="%234a5568">Image non disponible</text></svg>`;

  useEffect(() => {
    let isCancelled = false;

    const loadImageWithAuth = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const token = localStorage.getItem('token');
        if (!token) {
          if (!isCancelled) setHasError(true);
          return;
        }

        const response = await fetch(src, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok && !isCancelled) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
          blobUrlRef.current = objectUrl;
        } else if (!isCancelled) {
          setHasError(true);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Erreur chargement image:', error);
          setHasError(true);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadImageWithAuth();

    return () => {
      isCancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [src]);

  const handleClick = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      const win = window.open(imageUrl, '_blank');
      if (!win) {
        alert('Popup bloquée. Veuillez autoriser les popups.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="animate-pulse text-gray-400 text-sm">Chargement...</div>
      </div>
    );
  }

  if (hasError) {
    return <img src={defaultImageSVG} alt={alt} className={className} />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onClick={handleClick}
      onError={() => setHasError(true)}
    />
  );
};

export default SecureImage;