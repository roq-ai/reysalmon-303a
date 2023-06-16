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
import { createMenu } from 'apiSdk/menus';
import { Error } from 'components/error';
import { menuValidationSchema } from 'validationSchema/menus';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { RestaurantInterface } from 'interfaces/restaurant';
import { getRestaurants } from 'apiSdk/restaurants';
import { MenuInterface } from 'interfaces/menu';

function MenuCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MenuInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMenu(values);
      resetForm();
      router.push('/menus');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MenuInterface>({
    initialValues: {
      qr_code: '',
      restaurant_id: (router.query.restaurant_id as string) ?? null,
    },
    validationSchema: menuValidationSchema,
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
            Create Menu
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="qr_code" mb="4" isInvalid={!!formik.errors?.qr_code}>
            <FormLabel>Qr Code</FormLabel>
            <Input type="text" name="qr_code" value={formik.values?.qr_code} onChange={formik.handleChange} />
            {formik.errors.qr_code && <FormErrorMessage>{formik.errors?.qr_code}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<RestaurantInterface>
            formik={formik}
            name={'restaurant_id'}
            label={'Select Restaurant'}
            placeholder={'Select Restaurant'}
            fetcher={getRestaurants}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'menu',
  operation: AccessOperationEnum.CREATE,
})(MenuCreatePage);
