import { FormProvider } from "react-hook-form";

import Card from "../UI/Card";
import RenderHorizontalRadioInput from "../form/RenderHorizontalRadioInput";
import { getLogFoodFormFieldsConfig } from "../../utils/foodDiaryUtils";

function LogQuantityCardForMeal({ methods, style }) {
  const { control, formState } = methods;
  const { mealConfig } = getLogFoodFormFieldsConfig();

  return (
    <FormProvider {...methods}>
      <Card style={style}>
        {/* MEAL */}
        <RenderHorizontalRadioInput
          formState={formState}
          control={control}
          fieldConfig={mealConfig}
          accent
        />
      </Card>
    </FormProvider>
  );
}

export default LogQuantityCardForMeal;
