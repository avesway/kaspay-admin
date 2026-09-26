import useProductImage from '../../../productsSingle/catalog/hooks/useProductImage';
import { createProductComposite, updateProductComposite } from '../productsComposite.processes';

const useProductCompositeForm = (product, type, setOpen) => {
  const imageState = useProductImage(product);

  const handleSubmit = async (data) => {
    if (type === 'create') {
      await createProductComposite({ ...data, purposeType: 'composite' }, setOpen, imageState.imageProduct);
    }
    if (type === 'edit') await updateProductComposite(product.id, data, setOpen, imageState.imageProduct);
  };

  return { ...imageState, handleSubmit };
};

export default useProductCompositeForm;
