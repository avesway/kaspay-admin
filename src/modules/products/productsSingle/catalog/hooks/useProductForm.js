import useProductImage from './useProductImage';
import { createProduct, updateProduct } from '../productsCatalog.processes';

const useProductForm = (product, type, setOpen) => {
  const imageState = useProductImage(product);

  const handleSubmit = async (data) => {
    if (type === 'create') await createProduct(data, setOpen, imageState.imageProduct);
    if (type === 'edit') await updateProduct(product.id, data, setOpen, imageState.imageProduct);
  };

  return { ...imageState, handleSubmit };
};

export default useProductForm;
