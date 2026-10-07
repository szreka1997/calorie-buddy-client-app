import Card from "../../UI/Card";
import CardTitle from "../../UI/CardTitle";
import GoalPlanText from "../texts/GoalPlanText";
import RenderHorizontalTextInput from "../../form/RenderHorizontalTextInput";
import { getGoalSettingFormFieldsConfig } from "../../../utils/goalUtils";

function GoalSettingCard({
  goalWeightRef,
  goalCaloriesRef,
  control,
  formState,
  getValues,
  inputSubmitHandler,
  accent = false,
}) {
  return (
    <Card>
      {/* TITLE */}
      <CardTitle accent={accent}>Goal Setting</CardTitle>

      {/* FIELDS */}
      {getGoalSettingFormFieldsConfig(getValues).map((field, index) => {
        const isFirstItem = index === 0;

        return (
          <RenderHorizontalTextInput
            key={field.name}
            ref={isFirstItem ? goalWeightRef : goalCaloriesRef}
            formState={formState}
            control={control}
            fieldConfig={field}
            enterKeyHint={isFirstItem ? "next" : "done"}
            submitBehavior={isFirstItem ? "submit" : "blurAndSubmit"}
            accent={accent}
            isNumeric
            onSubmitEditing={() => {
              isFirstItem && inputSubmitHandler(goalCaloriesRef);
            }}
          />
        );
      })}

      {/* EXPLANATORY TEXT */}
      <GoalPlanText control={control} formState={formState} />
    </Card>
  );
}

export default GoalSettingCard;
