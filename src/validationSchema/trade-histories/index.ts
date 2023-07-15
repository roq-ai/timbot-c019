import * as yup from 'yup';

export const tradeHistoryValidationSchema = yup.object().shape({
  trade_data: yup.string().required(),
  bot_id: yup.string().nullable(),
});
