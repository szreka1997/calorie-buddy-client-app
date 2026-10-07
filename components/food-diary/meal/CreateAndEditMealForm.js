import { StyleSheet } from "react-native";
import { FormProvider } from "react-hook-form";

import Card from "../../UI/Card";
import RenderHorizontailTextInput from "../../form/RenderHorizontalTextInput";
import { getAddFoodFormFieldsConfig } from "../../../utils/foodDiaryUtils";

function CreateAndEditMealForm({ methods, accent = false }) {
  const { control, formState } = methods;
  const nameConfig = getAddFoodFormFieldsConfig()[0];

  return (
    <FormProvider {...methods}>
      <Card style={styles.inputCard}>
        {/* NAME */}
        <RenderHorizontailTextInput
          formState={formState}
          control={control}
          fieldConfig={nameConfig}
          accent={accent}
        />
      </Card>
    </FormProvider>
  );
}

export default CreateAndEditMealForm;

const styles = StyleSheet.create({
  inputCard: {
    marginTop: 4,
  },
});
