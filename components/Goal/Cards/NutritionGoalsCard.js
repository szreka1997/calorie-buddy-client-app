import Card from "../../UI/Card";
import CardTitle from "../../UI/CardTitle";
import MacrosText from "../texts/MacrosText";
import RenderHorizontalTextInput from "../../form/RenderHorizontalTextInput";
import { getNutritionGoalsFormFieldsConfig } from "../../../utils/goalUtils";

function NutritionGoalsCard({
  goalCarbsRef,
  goalProteinRef,
  goalFatRef,
  control,
  formState,
  getValues,
  inputSubmitHandler,
  accent = false,
}) {
  const refs = {
    goalProtein: goalProteinRef,
    goalCarbs: goalCarbsRef,
    goalFat: goalFatRef,
  };

  return (
    <Card>
      {/* TITLE */}
      <CardTitle accent={accent}>Nutrition Goals</CardTitle>

      {/* FIELDS */}
      {getNutritionGoalsFormFieldsConfig(getValues).map(
        (field, index, array) => {
          const isLastItem = index === array.length - 1;

          return (
            <RenderHorizontalTextInput
              key={field.name}
              ref={refs[field.name]}
              formState={formState}
              control={control}
              fieldConfig={field}
              enterKeyHint={isLastItem ? "done" : "next"}
              submitBehavior={isLastItem ? "blurAndSubmit" : "submit"}
              accent={accent}
              isNumeric
              onSubmitEditing={() => {
                !isLastItem && inputSubmitHandler(refs[array[index + 1].name]);
              }}
            />
          );
        },
      )}

      {/* EXPLANATORY TEXT */}
      <MacrosText control={control} formState={formState} />
    </Card>
  );
}

export default NutritionGoalsCard;
