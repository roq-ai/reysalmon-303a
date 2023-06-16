import * as yup from 'yup';

export const menuValidationSchema = yup.object().shape({
  qr_code: yup.string().required(),
  restaurant_id: yup.string().nullable().required(),
});
