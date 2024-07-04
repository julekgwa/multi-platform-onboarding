import FormWizard from 'react-form-wizard-component';
import 'react-form-wizard-component/dist/style.css';
import { Footer } from './app/components/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import LoadingOverlay from 'react-loading-overlay-ts';
import * as Yup from 'yup';
import { TextField } from './app/components/TextField';
import { Selfie } from './app/components/Selfie';
import { ScanQRCode } from './app/components/ScanQRCode';
import { CardUserProfile } from './app/components/Profile';

const BASE_URL = import.meta.env.VITE_BASE_URL;

type InitialValues = {
  name: string;
  surname: string;
  selfie: string;
  applicationId?: string;
  stepIndex: number;
};

export type User = {
  _id: string;
  name: string;
  surname: string;
  selfie: string;
};

// create a yup schema for validation, for each step index
// create a validation schema for each step
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  surname: Yup.string().required('Surname is required'),
  selfie: Yup.string().when('stepIndex', {
    is: (stepIndex: number) => stepIndex === 2,
    then: (Schema) => Schema.required('Selfie is required'),
  }),
  applicationId: Yup.string().when('stepIndex', {
    is: (stepIndex: number) => stepIndex === 2,
    then: (Schema) => Schema.required('Application ID is required'),
  }),
});

export interface FormWizardMethods {
  nextTab: () => void;
  prevTab: () => void;
  reset: () => void;
  activeAll: () => void;
  goToTab: (index: number) => void;
}

function Onboarding() {
  const formWizardRef = React.createRef<FormWizardMethods>();
  const initialValues: InitialValues = {
    name: '',
    surname: '',
    selfie: '',
    applicationId: '',
    stepIndex: 0,
  };

  const onNext = () => formWizardRef.current?.nextTab();
  const onBack = () => formWizardRef.current?.prevTab();

  const submitNameAndSurname = (
    values: InitialValues,
    helpers: FormikHelpers<InitialValues>
  ) => {
    const response = fetch(`${BASE_URL}/api/v1/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        surname: values.surname,
      }),
    });

    response
      .then((res) => res.json())
      .then((data: User) => {
        console.log(data);
        helpers.setFieldValue('applicationId', data._id);
        helpers.setSubmitting(false);
        onNext();
      });
  };

  const submit = (
    values: InitialValues,
    helpers: FormikHelpers<InitialValues>
  ) => {
    // if index is 1, submit name and surname
    if (values.stepIndex === 1) {
      return submitNameAndSurname(values, helpers);
    }
  };

  return (
    <Formik<InitialValues>
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={submit}
    >
      {({
        values,
        setFieldValue,
        isSubmitting,
        handleSubmit,
        isValid,
        handleBlur,
      }) => (
        <Form>
          <LoadingOverlay
            active={isSubmitting}
            spinner
            text='Submitting application...'
            className=''
          >
            <div className='h-[100vh] overflow-hidden'>
              <FormWizard
                shape='circle'
                color='#10b981'
                stepSize='xs'
                ref={formWizardRef}
              >
                <FormWizard.TabContent title='Personal details' icon='ti-user'>
                  <section className='flex flex-col items-center'>
                    <div className='lg:w-[1030px] md:w-[760px] space-y-3 mx-0 lg:mx-5 lg:px-5 px-4 w-full max-w-full mt-[40px]'>
                      <Field
                        onBlur={handleBlur}
                        component={TextField}
                        name='name'
                        label='Name'
                      />
                      <Field
                        onBlur={handleBlur}
                        component={TextField}
                        name='surname'
                        label='Surname'
                      />
                    </div>
                  </section>
                </FormWizard.TabContent>
                <FormWizard.TabContent
                  title='Additional Info'
                  icon='ti-settings'
                >
                  <ScanQRCode
                    applicationId={values.applicationId || ''}
                    setImage={(image) => {
                      setFieldValue('selfie', image);
                      onNext();
                    }}
                  />
                </FormWizard.TabContent>
                <FormWizard.TabContent title='Last step' icon='ti-check'>
                  <CardUserProfile
                    image={values.selfie}
                    name={values.name}
                    surname={values.surname}
                  />
                </FormWizard.TabContent>
              </FormWizard>
              {/* add style */}
              <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
              {values.stepIndex < 2 && <Footer
                backDisabled={values.stepIndex === 1}
                showBack={values.stepIndex === 0}
                nextDisabled={!isValid || values.stepIndex === 3}
                onNext={() => {
                  if (values.stepIndex === 3) return;
                  setFieldValue('stepIndex', values.stepIndex + 1);
                  // onNext();
                 if (values.stepIndex <= 3) handleSubmit();
                }}
                onBack={() => {
                  if (values.stepIndex === 1) return;
                  setFieldValue('stepIndex', values.stepIndex - 1);
                  onBack();
                }}
              />}
            </div>
          </LoadingOverlay>
        </Form>
      )}
    </Formik>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Onboarding />} />
        <Route path='/selfie/:id' element={<Selfie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
