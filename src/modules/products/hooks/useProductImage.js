import { useRef, useState, useEffect } from 'react';
import {
  loadProductImage,
  readProductImagePreview,
  validateProductImageFile,
  deleteProductImage,
} from '../actions/catalog';

const useProductImage = (product) => {
  const [imagePreviewProduct, setImagePreviewProduct] = useState(null);
  const [imageProduct, setImageProduct] = useState(null);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!product?.imagePath) return;

    let objectUrl;
    let cancelled = false;

    loadProductImage(product.imagePath)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setImagePreviewProduct(url);
      })
      .catch((error) => {
        console.error('Ошибка загрузки изображения:', error);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [product?.imagePath]);

  const updatePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateProductImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageError('');
    setImageProduct(file);

    try {
      const preview = await readProductImagePreview(file);
      setImagePreviewProduct(preview);
    } catch (error) {
      console.error('Ошибка чтения изображения:', error);
    }
  };

  const deletePhoto = async () => {
    if (product?.imagePath) {
      await deleteProductImage(product.id, product.imagePath);
    }
    setImagePreviewProduct(null);
    setImageProduct(null);
  };

  const selectImage = () => {
    fileInputRef.current?.click();
  };

  return {
    imagePreviewProduct,
    imageProduct,
    imageError,
    fileInputRef,
    updatePhoto,
    deletePhoto,
    selectImage,
  };
};

export default useProductImage;
