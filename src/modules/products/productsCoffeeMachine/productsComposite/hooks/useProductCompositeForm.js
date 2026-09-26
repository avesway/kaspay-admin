import useProductImage from '../../../productsSingle/catalog/hooks/useProductImage';
import { createProductComposite } from '../productsComposite.processes';

const useProductCompositeForm = (product, type, purposeType, purposeTypes, setOpen) => {
  const imageState = useProductImage(product);

  const handleSubmit = async (data) => {
    if (type === 'create') await createProductComposite({ ...data, purposeType }, purposeTypes, setOpen, imageState.imageProduct);
  };

  return { ...imageState, handleSubmit };
};

export default useProductCompositeForm;
