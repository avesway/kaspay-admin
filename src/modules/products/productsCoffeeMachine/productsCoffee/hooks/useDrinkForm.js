import { createDrink, updateDrink } from '../productsCoffee.processes';

const useDrinkForm = (drink, type, setOpen) => {
  const handleSubmit = async (data) => {
    if (type === 'create') await createDrink(data, setOpen);
    if (type === 'edit') await updateDrink(drink.id, data, setOpen);
  };

  return { handleSubmit };
};

export default useDrinkForm;
