import { toast } from 'sonner';

import { productsCatalogAPI } from './productsCatalog.api';

export const PRODUCT_IMAGE_MAX_SIZE_MB = 1;
export const PRODUCT_IMAGE_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export function validateProductImageFile(file) {
  if (!PRODUCT_IMAGE_ACCEPTED_TYPES.includes(file.type)) {
    const extensions = PRODUCT_IMAGE_ACCEPTED_TYPES.map((item) => `.${item.split('/')[1]}`).join(', ');
    return `Поддерживаются только: ${extensions}`;
  }
  if (file.size > PRODUCT_IMAGE_MAX_SIZE_MB * 1024 * 1024) {
    return `Максимальный размер загружаемого файла: ${PRODUCT_IMAGE_MAX_SIZE_MB}MB`;
  }
  return '';
}

export function readProductImagePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function loadProductImage(imagePath) {
  const blob = await productsCatalogAPI.getImageProduct(imagePath);
  return URL.createObjectURL(blob);
}

export async function deleteProductImage(productId, imagePath) {
  await productsCatalogAPI.deleteImageProduct(productId, imagePath).catch(() => {
    toast.error('Ошибка удаления изображения', { position: 'top-center' });
  });
}

export async function createImageProduct(productId, image) {
  const formData = new FormData();
  formData.append('file', image);
  await productsCatalogAPI.createImageProduct(productId, formData).catch(() => {
    toast.error('Ошибка изменения изображения', { position: 'top-center' });
  });
}
