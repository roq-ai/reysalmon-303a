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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDishById, updateDishById } from 'apiSdk/dishes';
import { Error } from 'components/error';
import { dishValidationSchema } from 'validationSchema/dishes';
import { DishInterface } from 'interfaces/dish';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { MenuInterface } from 'interfaces/menu';
import { getMenus } from 'apiSdk/menus';

function DishEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DishInterface>(
    () => (id ? `/dishes/${id}` : null),
    () => getDishById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DishInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDishById(id, values);
      mutate(updated);
      resetForm();
      router.push('/dishes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DishInterface>({
    initialValues: data,
    validationSchema: dishValidationSchema,
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
            Edit Dish
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="allergens" mb="4" isInvalid={!!formik.errors?.allergens}>
              <FormLabel>Allergens</FormLabel>
              <Input type="text" name="allergens" value={formik.values?.allergens} onChange={formik.handleChange} />
              {formik.errors.allergens && <FormErrorMessage>{formik.errors?.allergens}</FormErrorMessage>}
            </FormControl>
            <FormControl id="price" mb="4" isInvalid={!!formik.errors?.price}>
              <FormLabel>Price</FormLabel>
              <NumberInput
                name="price"
                value={formik.values?.price}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.price && <FormErrorMessage>{formik.errors?.price}</FormErrorMessage>}
            </FormControl>
            <FormControl id="gltf_model" mb="4" isInvalid={!!formik.errors?.gltf_model}>
              <FormLabel>Gltf Model</FormLabel>
              <Input type="text" name="gltf_model" value={formik.values?.gltf_model} onChange={formik.handleChange} />
              {formik.errors.gltf_model && <FormErrorMessage>{formik.errors?.gltf_model}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<MenuInterface>
              formik={formik}
              name={'menu_id'}
              label={'Select Menu'}
              placeholder={'Select Menu'}
              fetcher={getMenus}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.qr_code}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'dish',
  operation: AccessOperationEnum.UPDATE,
})(DishEditPage);
