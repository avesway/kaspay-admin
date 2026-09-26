import { createComposition, updateComposition } from '../productsCoffee.processes';

const useCompositionForm = (composition, type, setOpen) => {
  const handleSubmit = async (data) => {
    if (type === 'create') await createComposition(data, setOpen);
    if (type === 'edit') await updateComposition(composition.id, data, setOpen);
  };

  return { handleSubmit };
};

export default useCompositionForm;
