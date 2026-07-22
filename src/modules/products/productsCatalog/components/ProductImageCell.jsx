import { useEffect, useState } from 'react';

import { loadProductImage } from '../productImages.processes';

const ProductImageCell = ({ imagePath, alt }) => {
  const photo = imagePath && imagePath !== '-' ? imagePath : null;
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!photo) return;

    let objectUrl;
    let cancelled = false;

    loadProductImage(photo)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setImageUrl(url);
      })
      .catch((error) => {
        console.error('Ошибка загрузки:', error);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  return (
    <div className="bg-muted border-border flex h-11 w-11 flex-col items-center justify-center overflow-hidden rounded-md border">
      {photo ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <>
          <p className="text-muted-foreground text-xs">нет</p>
          <p className="text-muted-foreground text-xs">фото</p>
        </>
      )}
    </div>
  );
};

export default ProductImageCell;
