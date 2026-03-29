import { createImageProduct, createProduct, getProducts, updateProduct } from '@/actions/products.actions';
import { productsAPI } from '@/api/products.api';
import { useRef, useState, useEffect } from 'react';

const MAX_SIZE_MB = 1;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const useProductForm = (product, type, setOpen) => {
  const [imagePreviewProduct, setImagePreviewProduct] = useState(null);
  const [imageProduct, setImageProduct] = useState(null);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const blob = await productsAPI.getImageProduct(product.imagePath);
        const url = URL.createObjectURL(blob);
        setImagePreviewProduct(url);

        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    };

    if (product?.imagePath) loadImage();
  }, [product?.imagePath]);

  const updatePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setImageError(`Поддерживаются только: ${ACCEPTED_TYPES.map((item) => `.${item.split('/')[1]}`).join(', ')}`);
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setImageError(`Максимальный размер загружаемого файла: ${MAX_SIZE_MB}MB`);
        return;
      }

      setImageError('');
      setImageProduct(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewProduct(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const deletePhoto = async () => {
    if (product?.imagePath) {
      await productsAPI
        .deleteImageProduct(product.id, product.imagePath)
        .then((res) => {
          setImagePreviewProduct(null);
          setImageProduct(null);
        })
        .catch((err) => console.log('err deleteImageProduct', err));
    } else {
      setImagePreviewProduct(null);
      setImageProduct(null);
    }
  };

  const selectImage = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (data) => {
    if (type === 'create') await createProduct(data, setOpen, imageProduct);
    if (type === 'edit') await updateProduct(product.id, data, setOpen, imageProduct);
  };

  return { imagePreviewProduct, imageProduct, imageError, fileInputRef, updatePhoto, deletePhoto, handleSubmit, selectImage };
};

export default useProductForm;
