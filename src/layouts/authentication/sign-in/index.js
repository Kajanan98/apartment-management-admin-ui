

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

import * as Yup from 'yup';
import { FormikProvider, useFormik, Form } from "formik";
import { useNavigate } from "react-router-dom";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import {
  IconButton,
  InputAdornment
} from "@mui/material";

import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { useAuth } from "context/AuthContext";
import MDAlert from "components/MDAlert";

function Basic() {

const navigate = useNavigate()
const {login} = useAuth()
const [err, setErr] = useState('')

const initialValues = {
  email: '',
  password: '',
  rememberMe: false,
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const formik = useFormik({
  enableReinitialize: true,
  initialValues: initialValues,
  validationSchema: validationSchema,
  onSubmit: (values, { setSubmitting }) => {
    setSubmitting(true)
    console.log(values)
    login(values.email, values.password)
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch(error => {
          setErr('invalid credentials')
          setSubmitting(false)
      })
  }
})

const { errors, touched, values, isSubmitting,setSubmitting, handleChange, handleSubmit, setFieldValue, getFieldProps, resetForm } = formik;
// console.log(values)
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        {err ? <MDAlert color='error' dismissible={true} >{err}</MDAlert> : null}
        <MDBox pt={4} pb={3} px={3}>
          <FormikProvider value={formik} >
            <Form autoComplete="on" onSubmit={handleSubmit}>
              {/* <MDBox component="form" role="form" onSubmit={handleSubmit}> */}
              <MDBox mb={2}>
                <MDInput 
                  type="email" 
                  label="Email" 
                  name='email' fullWidth  
                  {...getFieldProps("email")}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput 
                  type={showPassword ? "text" : "password"}
                  label="Password" fullWidth 
                  {...getFieldProps("password")}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ), 
                  }}
                />
              </MDBox>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Switch checked={values.rememberMe} name='rememberMe' onChange={handleChange} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Remember me
                </MDTypography>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type='submit'>
                  {isSubmitting ? 'Loading...' : 'sign in'}
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Don&apos;t have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-up"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign up
                  </MDTypography>
                </MDTypography>
              </MDBox>
              {/* </MDBox> */}
            </Form>
          </FormikProvider>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
