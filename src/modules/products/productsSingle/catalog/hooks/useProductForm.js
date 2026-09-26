import useProductImage from './useProductImage';
import { createProductSingle, updateProductSingle } from '../productsSingle.processes';

const useProductForm = (product, type, setOpen) => {
  const imageState = useProductImage(product);

  const handleSubmit = async (data) => {
    if (type === 'create') await createProductSingle(data, setOpen, imageState.imageProduct);
    if (type === 'edit') await updateProductSingle(product.id, data, setOpen, imageState.imageProduct);
  };

  return { ...imageState, handleSubmit };
};

export default useProductForm;
