import { StyleSheet, View } from "react-native";

import Card from "../../components/UI/Card";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import OutlinedButton from "../../components/UI/custom-buttons/OutlinedButton";
import ScreenContainer from "../../components/UI/ScreenContainer";
import HorizontalTextWithNoInput from "../../components/UI/HorizontalTextWithNoInput";
import CustomKeyboardAvoidingView from "../../components/UI/CustomKeyboardAvoidingView";
import RenderHorizontailTextInput from "../../components/form/RenderHorizontalTextInput";
import useCustomForm from "../../hooks/useCustomForm";
import useWeightSubmit from "../../hooks/home/useWeightSubmit";
import { getDateShortStringFormat } from "../../utils/dateUtils";
import { getAddWeightFormFieldsConfig } from "../../utils/homeUtils";

function AddWeightScreen({ route }) {
  const { lastWeight, accent = false } = route?.params || {};
  const { weightConfig } = getAddWeightFormFieldsConfig();

  const { isFetchingData, onSubmit } = useWeightSubmit();

  const { handleSubmit, methods } = useCustomForm({
    onSubmit,
    accent: true,
    defaultValues: {
      weight: "",
    },
  });

  const { control, formState } = methods;

  if (isFetchingData) return <LoadingOverlay message="Submitting data..." />;

  return (
    <ScreenContainer>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          {/* ADD WEIGHT CARD */}
          <Card style={styles.card}>
            {lastWeight?.date && (
              <HorizontalTextWithNoInput
                label={`Last weight (${getDateShortStringFormat(lastWeight.date)})`}
                value={lastWeight.weight}
                bold
              />
            )}

            <RenderHorizontailTextInput
              formState={formState}
              control={control}
              fieldConfig={weightConfig}
              isNumeric
              accent={accent}
            />
          </Card>

          {/* ADD BUTTON */}
          <OutlinedButton icon="save" accent={!accent} onPress={handleSubmit}>
            Add Weight
          </OutlinedButton>
        </View>
      </CustomKeyboardAvoidingView>
    </ScreenContainer>
  );
}

export default AddWeightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 8,
  },
});
