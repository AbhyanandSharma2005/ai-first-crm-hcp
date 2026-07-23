import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { submitInteraction, clearFormMessages } from "../redux/interactionSlice";

function InteractionForm() {
  const dispatch = useDispatch();
  const { formLoading, formSuccess, formError } = useSelector(
    (state) => state.interaction
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hcp_name: "",
      specialization: "",
      hospital: "",
      interaction_date: "",
      interaction_type: "",
      summary: "",
      product: "",
      outcome: "",
      follow_up: "",
      notes: "",
    },
  });

  // Clear messages on mount
  useEffect(() => {
    dispatch(clearFormMessages());
  }, [dispatch]);

  // Clear form if success
  useEffect(() => {
    if (formSuccess) {
      reset();
    }
  }, [formSuccess, reset]);

  const onSubmit = (data) => {
    dispatch(submitInteraction(data));
  };

  const interactionTypes = [
    "Field Visit",
    "Digital/Email",
    "Phone Call",
    "Conference",
    "Other",
  ];

  const outcomes = [
    "Positive — interested in prescribing",
    "Neutral — needs more info",
    "Negative — not interested",
    "Follow-up Requested",
  ];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {formSuccess}
        </Alert>
      )}
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* HCP Info */}
        <Grid item xs={12} sm={4}>
          <Controller
            name="hcp_name"
            control={control}
            rules={{ required: "HCP Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="HCP Name"
                error={!!errors.hcp_name}
                helperText={errors.hcp_name?.message}
                disabled={formLoading}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="specialization"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Specialization"
                disabled={formLoading}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="hospital"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Hospital/Clinic"
                disabled={formLoading}
              />
            )}
          />
        </Grid>

        {/* Interaction Meta */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="interaction_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                label="Interaction Date"
                InputLabelProps={{ shrink: true }}
                disabled={formLoading}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="interaction_type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Interaction Type"
                disabled={formLoading}
              >
                {interactionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Core Discussion */}
        <Grid item xs={12}>
          <Controller
            name="summary"
            control={control}
            rules={{ required: "Summary is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label="Discussion Summary"
                error={!!errors.summary}
                helperText={errors.summary?.message}
                disabled={formLoading}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="product"
            control={control}
            rules={{ required: "Product is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Product Discussed"
                error={!!errors.product}
                helperText={errors.product?.message}
                disabled={formLoading}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="outcome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Outcome"
                disabled={formLoading}
              >
                {outcomes.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Follow-up & Notes */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="follow_up"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                label="Follow-up Date"
                InputLabelProps={{ shrink: true }}
                disabled={formLoading}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Additional Notes"
                disabled={formLoading}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={20} /> : null}
            sx={{ py: 1.5, mt: 2 }}
          >
            {formLoading ? "Saving..." : "Save Interaction"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InteractionForm;