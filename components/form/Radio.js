import { View } from "react-native";

import RadioButton from "./RadioButton";

function Radio({ options, checkedValue, onChange, accent = false }) {
  return (
    <View>
      {options.map((option) => {
        return (
          <RadioButton
            key={option.label}
            label={option.label}
            value={option.value}
            details={option.details}
            checkedValue={checkedValue}
            accent={accent}
            onChange={onChange}
          />
        );
      })}
    </View>
  );
}

export default Radio;
