import * as yup from 'yup';

export const questionValidationSchema = yup.object().shape({
  question_text: yup.string().required(),
  answer_text: yup.string().required(),
  organization_id: yup.string().nullable(),
});
