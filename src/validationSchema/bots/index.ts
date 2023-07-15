import * as yup from 'yup';

export const botValidationSchema = yup.object().shape({
  settings: yup.string().required(),
  organization_id: yup.string().nullable(),
});
