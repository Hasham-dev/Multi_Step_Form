import { Grid } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { Button, Box, Stepper, Step, StepLabel } from '@material-ui/core';
import { Card, CardContent } from '@material-ui/core';
import { Form, Formik, Field, formik, FormikValues, FormikConfig } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { boolean, mixed, number, object, string } from 'yup';

const sleep = (time) => new Promise((acc) => setTimeout(acc, time))

export default function Home() {
  return (
    <Card>
      <CardContent>
        <FormikStepper

          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            city: '',
            phone: '',
            message: '',
          }}
          onSubmit={async (values) => {
            await sleep(3000);
            console.log('values', values)
          }}>
          <FormikStep
            validationSchema={object({
              firstName: string().required('Please enter your name'),
              lastName: string().required('Please enter your last name'),
              email: string().email().required(),
            })}

            label="Personal Info">
            <Box paddingBottom={2}>
              <Field fullWidth name="firstName" component={TextField} label="First Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="lastName" component={TextField} label="Last Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="email" component={TextField} label="Email" />
            </Box>
            {/* <Box paddingBottom={2}>
              <Field name="millionaire" color="primary" type="checkbox" component={CheckboxWithLabel} Label={{ label: 'I am a millionaire' }} />
            </Box> */}
          </FormikStep>
          <FormikStep
            label="More Info"
            validationSchema={object({
              city: string().required(),
              phone: number().typeError("That doesn't look like a phone number")
              .positive("A phone number can't start with a minus")
              .integer("A phone number can't include a decimal point")
              .min(10)
              .required('A phone number is required'),
            } )}>
              <Box paddingBottom={2}>

                <Field
                  fullWidth
                  name="city"
                  type="text"
                  component={TextField}
                  label="City"
                />
              </Box>
              <Box paddingBottom={2}>

                <Field
                  fullWidth
                  name="phone"
                  type="text"
                  component={TextField}
                  label="Mobile Number"
                />
              </Box>
          </FormikStep>
          <FormikStep
            validationSchema={object({
              message: string().required().min(15, "Field Must be have 15 or more letters")
              
            })}
            label="Message">
            <Box paddingBottom={2}>
              <Field fullWidth name="message" component={TextField} label="Message.." />
            </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string;
}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>
}

export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children);
  const [step, setStep] = useState(0)
  const currentChild = childrenArray[step] as React.ReactElement<FormikStepProps>;
  const [completed, setCompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1
  }
  return (
    <Formik {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
        } else {
          setStep(s => s + 1);
        }
      }}>
      {({ isSubmitting }) => (

        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}
          <Grid container spacing={2}>
            {step > 0 ? <Grid item>
              <Button disabled={isSubmitting} color="primary" variant="contained" onClick={() => setStep(s => s - 1)}>Back</Button> </Grid> : null}
            <Grid item>
              <Button startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null} disabled={isSubmitting} color="primary" variant="contained" type="submit">
                {isSubmitting ? 'Submitting' : isLastStep() ? "Submit" : "Next"}</Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}