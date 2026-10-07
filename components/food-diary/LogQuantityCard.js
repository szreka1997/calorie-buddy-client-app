import { useRef } from "react";
import { FormProvider } from "react-hook-form";

import Card from "../UI/Card";
import HorizontalTextWithNoInput from "../UI/HorizontalTextWithNoInput";
import RenderHorizontailTextInput from "../form/RenderHorizontalTextInput";
import RenderHorizontalRadioInput from "../form/RenderHorizontalRadioInput";
import { getLogFoodFormFieldsConfig } from "../../utils/foodDiaryUtils";

function LogQuantityCard({
  recommendedServingSize,
  methods,
  style,
  isCreateAndEditMealScreen = false,
  isSearchForMealItem = false,
  isMealLogScreen = false,
  accent = false,
}) {
  const quantityRef = useRef(null);

  const { control, formState } = methods;
  const { quantityConfig, mealConfig } = getLogFoodFormFieldsConfig();

  function blurTextInputs() {
    quantityRef.current?.isFocused && quantityRef.current?.blur();
  }

  return (
    <FormProvider {...methods}>
      <Card style={style}>
        {/* QUANTITY (G)  */}
        <RenderHorizontailTextInput
          formState={formState}
          control={control}
          fieldConfig={quantityConfig}
          ref={quantityRef}
          accent={accent}
          isNumeric
        />

        {/* MEAL */}
        {!isCreateAndEditMealScreen &&
          !isSearchForMealItem &&
          !isMealLogScreen && (
            <RenderHorizontalRadioInput
              formState={formState}
              control={control}
              fieldConfig={mealConfig}
              accent={accent}
              onFocus={blurTextInputs}
            />
          )}

        {/* Recommended Serving Size (g) */}
        <HorizontalTextWithNoInput
          label="Recommended Serving Size (g)"
          value={recommendedServingSize}
          accent={accent}
        />
      </Card>
    </FormProvider>
  );
}

export default LogQuantityCard;
