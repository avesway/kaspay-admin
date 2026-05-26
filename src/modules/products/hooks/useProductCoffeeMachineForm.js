import { createProduct, updateProduct } from '../actions/catalog';
import useProductImage from './useProductImage';

const useProductCoffeeMachineForm = (product, type, setOpen) => {
  const imageState = useProductImage(product);

  const handleSubmit = async (data) => {
    if (type === 'create') await createProduct(data, setOpen, imageState.imageProduct);
    if (type === 'edit') await updateProduct(product.id, data, setOpen, imageState.imageProduct);
  };

  return { ...imageState, handleSubmit };
};

export default useProductCoffeeMachineForm;
