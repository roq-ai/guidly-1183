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
import { createQuestion } from 'apiSdk/questions';
import { Error } from 'components/error';
import { questionValidationSchema } from 'validationSchema/questions';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { QuestionInterface } from 'interfaces/question';

function QuestionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: QuestionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createQuestion(values);
      resetForm();
      router.push('/questions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<QuestionInterface>({
    initialValues: {
      question_text: '',
      answer_text: '',
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: questionValidationSchema,
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
            Create Question
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="question_text" mb="4" isInvalid={!!formik.errors?.question_text}>
            <FormLabel>Question Text</FormLabel>
            <Input
              type="text"
              name="question_text"
              value={formik.values?.question_text}
              onChange={formik.handleChange}
            />
            {formik.errors.question_text && <FormErrorMessage>{formik.errors?.question_text}</FormErrorMessage>}
          </FormControl>
          <FormControl id="answer_text" mb="4" isInvalid={!!formik.errors?.answer_text}>
            <FormLabel>Answer Text</FormLabel>
            <Input type="text" name="answer_text" value={formik.values?.answer_text} onChange={formik.handleChange} />
            {formik.errors.answer_text && <FormErrorMessage>{formik.errors?.answer_text}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
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

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'question',
    operation: AccessOperationEnum.CREATE,
  }),
)(QuestionCreatePage);
