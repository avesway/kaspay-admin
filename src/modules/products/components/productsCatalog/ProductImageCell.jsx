import { useEffect, useState } from 'react';
import { loadProductImage } from '../../actions/catalog';

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
    <div className="flex flex-col items-center justify-center w-11 h-11 rounded-md bg-muted border border-border overflow-hidden">
      {photo ? (
        <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">нет</p>
          <p className="text-xs text-muted-foreground">фото</p>
        </>
      )}
    </div>
  );
};

export default ProductImageCell;
