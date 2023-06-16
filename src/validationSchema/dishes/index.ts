import * as yup from 'yup';

export const dishValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  allergens: yup.string().required(),
  price: yup.number().integer().required(),
  gltf_model: yup.string().required(),
  menu_id: yup.string().nullable().required(),
});
