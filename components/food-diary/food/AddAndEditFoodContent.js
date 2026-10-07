import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { FormProvider } from "react-hook-form";

import Card from "../../UI/Card";
import CustomScrollView from "../../UI/CustomScrollView";
import OutlinedButton from "../../UI/custom-buttons/OutlinedButton";
import RenderHorizontailTextInput from "../../form/RenderHorizontalTextInput";
import ImagePickerContent from "../ImagePickerContent";
import BarcodeScanner from "./BarecodeScanner";
import useFormScrollAndBlur from "../../../hooks/UI/useFormScrollAndBlur";
import useCustomForm from "../../../hooks/useCustomForm";
import {
  getInitialFoodFormValues,
  getAddFoodFormFieldsConfig,
} from "../../../utils/foodDiaryUtils";

function AddAndEditFoodContent({ data, onSubmit }) {
  const inputRefs = {
    name: useRef(null),
    kcalPer100G: useRef(null),
    recommendedServingSize: useRef(null),
    proteinPer100G: useRef(null),
    carbsPer100G: useRef(null),
    fatPer100G: useRef(null),
    sugarPer100G: useRef(null),
    addedSugarPer100G: useRef(null),
  };

  const route = useRoute();
  const { scrollViewRef, inputSubmitHandler, scrollHandle } =
    useFormScrollAndBlur(inputRefs);

  const [pickedImage, setPickedImage] = useState();
  const [pickedImageUri, setPickedImageUri] = useState(data?.imageUri);

  function submitHandler(values) {
    onSubmit({
      id: data?.id,
      ...values,
      barcode: route.params?.barcode || data?.barcode,
      image: pickedImage,
      imageUri: pickedImageUri,
      imageDeleteUri: data?.imageDeleteUri,
    });
  }

  const { handleSubmit, methods } = useCustomForm({
    onSubmit: submitHandler,
    accent: true,
    defaultValues: getInitialFoodFormValues(data),
  });

  const { control, formState } = methods;

  return (
    <CustomScrollView ref={scrollViewRef} onScroll={scrollHandle}>
      <FormProvider {...methods}>
        {/* IMAGE PANEL */}
        <ImagePickerContent
          imageUri={pickedImage || pickedImageUri}
          onChange={(image) => {
            setPickedImage(image);
            if (!image) setPickedImageUri(null);
          }}
          accent={!!data}
        />

        {/* INPUTS */}
        <Card style={styles.container}>
          {getAddFoodFormFieldsConfig().map((item, index, array) => {
            const isFirstItem = index === 0;
            const isLastItem = index === array.length - 1;

            return (
              <RenderHorizontailTextInput
                key={item.name}
                ref={inputRefs[item.name]}
                fieldConfig={item}
                formState={formState}
                control={control}
                enterKeyHint={isLastItem ? "done" : "next"}
                submitBehavior={isLastItem ? "blurAndSubmit" : "submit"}
                accent={!!data}
                isNumeric={!isFirstItem}
                onSubmitEditing={() => {
                  isLastItem
                    ? scrollViewRef?.current?.scrollToEnd()
                    : inputSubmitHandler(inputRefs[array[index + 1].name]);
                }}
              />
            );
          })}
        </Card>

        {/* BARCODE */}
        <BarcodeScanner
          data={data?.barcode}
          scrollViewRef={scrollViewRef}
          accent={!!data}
        />

        {/* SAVE BUTTON */}
        <OutlinedButton
          icon="save"
          accent={!data}
          style={styles.button}
          onPress={handleSubmit}
        >
          Save Food
        </OutlinedButton>
      </FormProvider>
    </CustomScrollView>
  );
}

export default AddAndEditFoodContent;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    marginTop: 4,
  },
});
