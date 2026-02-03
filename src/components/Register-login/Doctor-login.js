import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import api from "../../services/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [doctor, setDoctor] = useState({
    email: "",
    password: "",
  });

  const [openForgot, setOpenForgot] = useState(false);

  const [forgotData, setForgotData] = useState({
    email: "",
    newPassword: "",
    oldPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const [toast, setToast] = useState({
  open: false,
  message: "",
  severity: "success", // success | error | warning | info
});
const showToast = (message, severity = "success") => {
  setToast({
    open: true,
    message,
    severity,
  });
};

const handleToastClose = (_, reason) => {
  if (reason === "clickaway") return;
  setToast((prev) => ({ ...prev, open: false }));
};

  const handleForgotSubmit = async () => {
    try {
      console.log(forgotData);
      await api.resetPassword({
        email: forgotData.email,
        oldPassword: forgotData.oldPassword,
        newPassword: forgotData.newPassword,
      });

showToast("Password updated successfully", "success");
      setOpenForgot(false);
      setForgotData({ email: "", newPassword: "", oldPassword: "" });
    } catch (err) {
      console.error(err);
showToast("Failed to reset password", "error");
    }
  };

  const handleLogin = async () => {
    console.log(doctor);
    try {
      const response = await api.doctorLogin(doctor);

      console.log(response.data);
      // response.data should be DoctorDetails
      localStorage.setItem("doctor", response.data.id);

      // optional: redirect to home
      showToast("Login successfull", "success");
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed", error);
showToast("Invalid email or password", "error");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
    <Snackbar
  open={toast.open}
  autoHideDuration={3000}
  onClose={handleToastClose}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <MuiAlert
    onClose={handleToastClose}
    severity={toast.severity}
    elevation={6}
    variant="filled"
  >
    {toast.message}
  </MuiAlert>
</Snackbar>
      <Box
        sx={{
          minHeight: "80vh",
          backgroundColor: "#f4f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 1200,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={6}>
              <Box sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="primary"
                  textAlign="left"
                  gutterBottom
                >
                  Meet Our Doctor
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={600}
                  textAlign="left"
                  sx={{ mt: 1 }}
                >
                  Dr. Tejashri Omkar Jadhav
                </Typography>

                <Typography
                  variant="subtitle1"
                  textAlign="left"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  M.D. in Medicine (Ayurveda)
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="h6"
                  fontWeight={600}
                  textAlign="left"
                  sx={{ mb: 1 }}
                >
                  Expertise
                </Typography>

                <Typography
                  textAlign="left"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                    mb: 3,
                  }}
                >
                  Specializing in integrated healthcare with expertise in both
                  Ayurvedic and Allopathic medicine. Dedicated to providing
                  personalized, compassionate care to every patient.
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={600}
                  textAlign="left"
                  sx={{ mb: 1 }}
                >
                  Approach
                </Typography>

                <Typography
                  textAlign="left"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                  }}
                >
                  Believes in treating the whole person, not just the disease.
                  Combines traditional wisdom with modern medical knowledge for
                  comprehensive healing.
                </Typography>
              </Box>
            </Grid>

            <Box
              sx={{
                width: "100%",
                maxWidth: 420,
                backgroundColor: "#fff",
                borderRadius: 3,
                p: 4,
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Login To Your Account!
              </Typography>

              <TextField
                label="Email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={doctor.password}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember Me"
                />

                <Link
                  component="button"
                  underline="hover"
                  onClick={() => setOpenForgot(true)}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                sx={{
                  mt: 3,
                  py: 1.3,
                  fontSize: "1rem",
                  backgroundColor: "#27c2a5",
                  "&:hover": {
                    backgroundColor: "#20a88f",
                  },
                }}
              >
                Login
              </Button>

              <Typography align="center" sx={{ mt: 3 }}>
                Not Registered Yet?{" "}
                <Link href="/register" fontWeight={600}>
                  Sign-Up
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Paper>
        <Modal open={openForgot} onClose={() => setOpenForgot(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Reset Password
            </Typography>

            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={forgotData.email}
              onChange={handleForgotChange}
            />

            <TextField
              label="Old Password"
              name="oldPassword"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={forgotData.oldPassword}
              onChange={handleForgotChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="New Password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={forgotData.newPassword}
              onChange={handleForgotChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleForgotSubmit}
            >
              Update Password
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default LoginPage;
