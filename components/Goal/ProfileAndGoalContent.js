import { useRef } from "react";
import { FormProvider } from "react-hook-form";

import CustomScrollView from "../UI/CustomScrollView";
import OutlinedButton from "../UI/custom-buttons/OutlinedButton";
import ProfileAndGoalBasicInfoCard from "./Cards/ProfileAndGoalBasicInfoCard";
import CalorieNecessityCard from "./Cards/CalorieNecessityCard";
import GoalSettingCard from "./Cards/GoalSettingCard";
import NutritionGoalsCard from "./Cards/NutritionGoalsCard";
import useProfileAndGoalForm from "../../hooks/goal/useProfileAndGoalForm";
import useFormScrollAndBlur from "../../hooks/UI/useFormScrollAndBlur";

function ProfileAndGoalContent({ data, onSubmit, isEditProfile = false }) {
  const inputRefs = {
    username: useRef(null),
    height: useRef(null),
    startingWeight: useRef(null),
    goalWeight: useRef(null),
    goalCalories: useRef(null),
    goalProtein: useRef(null),
    goalCarbs: useRef(null),
    goalFat: useRef(null),
  };

  function submitHandler(values) {
    onSubmit({ values, startingDate: isEditProfile && data.startingDate });
  }

  const { handleSubmit, methods } = useProfileAndGoalForm({
    data,
    onSubmit: submitHandler,
  });
  const { control, getValues, formState } = methods;

  const { scrollViewRef, blurTextInputs, inputSubmitHandler, scrollHandle } =
    useFormScrollAndBlur(inputRefs);

  return (
    <CustomScrollView ref={scrollViewRef} onScroll={scrollHandle}>
      <FormProvider {...methods}>
        {/* BASIC INFORMATION */}
        {(!data || isEditProfile) && (
          <ProfileAndGoalBasicInfoCard
            usernameRef={inputRefs.username}
            heightRef={inputRefs.height}
            control={control}
            formState={methods.formState}
            blurTextInputs={blurTextInputs}
            isEditProfile={isEditProfile}
            accent={!!data}
          />
        )}

        {/* CALORIE NECESSITY */}
        {!isEditProfile && (
          <CalorieNecessityCard
            startingWeightRef={inputRefs.startingWeight}
            control={control}
            formState={methods.formState}
            blurTextInputs={blurTextInputs}
            accent={!!data}
          />
        )}

        {/* GOAL SETTING */}
        {!isEditProfile && (
          <GoalSettingCard
            goalWeightRef={inputRefs.goalWeight}
            goalCaloriesRef={inputRefs.goalCalories}
            control={control}
            formState={methods.formState}
            getValues={methods.getValues}
            inputSubmitHandler={inputSubmitHandler}
            accent={!!data}
          />
        )}

        {/* NUTRITIONGOALS */}
        {!isEditProfile && (
          <NutritionGoalsCard
            goalProteinRef={inputRefs.goalProtein}
            goalCarbsRef={inputRefs.goalCarbs}
            goalFatRef={inputRefs.goalFat}
            control={control}
            formState={formState}
            getValues={getValues}
            inputSubmitHandler={inputSubmitHandler}
            accent={!!data}
          />
        )}
      </FormProvider>

      {/* SAVE BUTTON */}
      <OutlinedButton
        icon="save"
        accent={!data}
        onPress={handleSubmit}
        style={{ marginTop: 4 }}
      >
        {isEditProfile ? "Update Profile" : data ? "Update Goal" : "Save Goal"}
      </OutlinedButton>
    </CustomScrollView>
  );
}

export default ProfileAndGoalContent;
