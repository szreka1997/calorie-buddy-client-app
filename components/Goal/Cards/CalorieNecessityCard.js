import Card from "../../UI/Card";
import CardTitle from "../../UI/CardTitle";
import CalorieNecessityText from "../texts/CalorieNecessityText";
import RenderHorizontailTextInput from "../../form/RenderHorizontalTextInput";
import RenderHorizontalRadioInput from "../../form/RenderHorizontalRadioInput";
import { getCalorieNecessityFormFieldsConfig } from "../../../utils/goalUtils";

function CalorieNecessityCard({
  startingWeightRef,
  control,
  formState,
  blurTextInputs,
  accent = false,
}) {
  const { startingWeightConfig, activityLevelConfig } =
    getCalorieNecessityFormFieldsConfig();

  return (
    <Card>
      {/* TITLE */}
      <CardTitle accent={accent}>Calorie Necessity</CardTitle>

      {/* STARTING WEIGHT */}
      <RenderHorizontailTextInput
        ref={startingWeightRef}
        formState={formState}
        control={control}
        fieldConfig={startingWeightConfig}
        accent={accent}
        isNumeric
      />

      {/* ACTIVITY LEVEL  */}
      <RenderHorizontalRadioInput
        formState={formState}
        control={control}
        fieldConfig={activityLevelConfig}
        accent={accent}
        onFocus={blurTextInputs}
      />

      <CalorieNecessityText control={control} formState={formState} />
    </Card>
  );
}

export default CalorieNecessityCard;
