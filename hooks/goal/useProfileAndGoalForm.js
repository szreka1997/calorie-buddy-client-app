import { useEffect } from "react";

import useCustomForm from "../useCustomForm";

function useProfileAndGoalForm({ data, onSubmit }) {
  const { handleSubmit, methods } = useCustomForm({
    onSubmit,
    accent: true,
    defaultValues: {
      username: data?.username || "",
      sex: data?.sex?.toString() || "",
      birthday: data?.birthday ? new Date(Date.parse(data.birthday)) : null,
      height: data?.height?.toString() || "",
      startingWeight: data?.startingWeight?.toString() || "",
      activityLevel: data?.activityLevel?.toString() || "",
      goalWeight: data?.goalWeight?.toString() || "",
      goalCalories: data?.goalCalories?.toString() || "",
      goalProtein: data?.goalProtein?.toString() || "25",
      goalCarbs: data?.goalCarbs?.toString() || "45",
      goalFat: data?.goalFat?.toString() || "30",
    },
  });

  useEffect(() => {
    const { unsubscribe } = methods.watch((_, { name }) => {
      if (name === "goalProtein") {
        methods.trigger(["goalCarbs", "goalFat"]);
      } else if (name === "goalCarbs") {
        methods.trigger(["goalProtein", "goalFat"]);
      } else if (name === "goalFat") {
        methods.trigger(["goalProtein", "goalCarbs"]);
      } else if (
        name !== "goalCalories" &&
        (methods.formState.touchedFields.goalCalories ||
          methods.formState.defaultValues.goalCalories)
      ) {
        methods.trigger("goalCalories");
      }
    });

    return () => unsubscribe();
  }, [methods.watch, methods.trigger, methods.formState]);

  return { handleSubmit, methods };
}

export default useProfileAndGoalForm;
