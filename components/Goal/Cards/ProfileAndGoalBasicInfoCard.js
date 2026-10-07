import Card from "../../UI/Card";
import CardTitle from "../../UI/CardTitle";
import OptimalWeightText from "../texts/OptimalWeightText";
import RenderHorizontailTextInput from "../../form/RenderHorizontalTextInput";
import RenderHorizontalRadioInput from "../../form/RenderHorizontalRadioInput";
import RenderHorizontalDateInput from "../../form/RenderHorizontalDateInput";
import { getBasicInformationFormFieldsConfig } from "../../../utils/goalUtils";

function ProfileAndGoalBasicInfoCard({
  usernameRef,
  heightRef,
  control,
  formState,
  blurTextInputs,
  isEditProfile = false,
  accent = false,
}) {
  const { usernameConfig, sexConfig, birthdayConfig, heightConfig } =
    getBasicInformationFormFieldsConfig();

  return (
    <Card>
      {!isEditProfile && (
        <CardTitle accent={accent}>Basic Information</CardTitle>
      )}
      {/* USERNAME  */}
      {isEditProfile && (
        <RenderHorizontailTextInput
          ref={usernameRef}
          formState={formState}
          control={control}
          fieldConfig={usernameConfig}
          accent={accent}
        />
      )}

      {/* SEX */}
      <RenderHorizontalRadioInput
        formState={formState}
        control={control}
        fieldConfig={sexConfig}
        accent={accent}
        onFocus={blurTextInputs}
      />

      {/* BIRTHDAY */}
      <RenderHorizontalDateInput
        formState={formState}
        control={control}
        fieldConfig={birthdayConfig}
        accent={accent}
        onFocus={blurTextInputs}
      />

      {/* HEIGHT  */}
      <RenderHorizontailTextInput
        ref={heightRef}
        formState={formState}
        control={control}
        fieldConfig={heightConfig}
        accent={accent}
        isNumeric
      />

      {!isEditProfile && (
        <OptimalWeightText control={control} formState={formState} />
      )}
    </Card>
  );
}

export default ProfileAndGoalBasicInfoCard;
