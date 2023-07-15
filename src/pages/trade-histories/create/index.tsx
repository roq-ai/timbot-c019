import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTradeHistory } from 'apiSdk/trade-histories';
import { Error } from 'components/error';
import { tradeHistoryValidationSchema } from 'validationSchema/trade-histories';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { BotInterface } from 'interfaces/bot';
import { getBots } from 'apiSdk/bots';
import { TradeHistoryInterface } from 'interfaces/trade-history';

function TradeHistoryCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TradeHistoryInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTradeHistory(values);
      resetForm();
      router.push('/trade-histories');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TradeHistoryInterface>({
    initialValues: {
      trade_data: '',
      bot_id: (router.query.bot_id as string) ?? null,
    },
    validationSchema: tradeHistoryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Trade History
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="trade_data" mb="4" isInvalid={!!formik.errors?.trade_data}>
            <FormLabel>Trade Data</FormLabel>
            <Input type="text" name="trade_data" value={formik.values?.trade_data} onChange={formik.handleChange} />
            {formik.errors.trade_data && <FormErrorMessage>{formik.errors?.trade_data}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<BotInterface>
            formik={formik}
            name={'bot_id'}
            label={'Select Bot'}
            placeholder={'Select Bot'}
            fetcher={getBots}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.settings}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'trade_history',
    operation: AccessOperationEnum.CREATE,
  }),
)(TradeHistoryCreatePage);
