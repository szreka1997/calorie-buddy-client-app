import { useContext } from "react";
import { useForm } from "react-hook-form";

import { AlertContext } from "../contexts/alert-context";

function useCustomForm({
  onSubmit,
  errorTitle = "Error!",
  errorMessage = "Check your inputs and try again!",
  accent = false,
  defaultValues = null,
}) {
  const alertCtx = useContext(AlertContext);

  const methods = defaultValues
    ? useForm({
        mode: "onTouched",
        defaultValues: { ...defaultValues },
      })
    : useForm({
        mode: "onTouched",
      });

  function submitHandler() {
    onSubmit(methods.getValues());
  }

  function errorHandler() {
    alertCtx.showAlert({ title: errorTitle, message: errorMessage, accent });
  }

  return {
    handleSubmit: () => {
      methods.handleSubmit(submitHandler, errorHandler)();
    },
    methods,
  };
}

export default useCustomForm;
