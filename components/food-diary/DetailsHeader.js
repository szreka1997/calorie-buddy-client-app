import { View } from "react-native";

import DetailsTitleLine from "./DetailsTitleLine";
import DetailsNutriScoreLine from "./DetailsNutriScoreLine";

function DetailsHeader({
  name,
  calories,
  imageUri,
  isVerified,
  nutriScore,
  isMeal = false,
  accent = false,
}) {
  return (
    <View>
      {/* TITLE LINE */}
      <DetailsTitleLine
        name={name}
        calories={calories}
        imageUri={imageUri}
        isMeal={isMeal}
        accent={accent}
      />

      {/* NUTRI-SCORE LINE */}
      <DetailsNutriScoreLine
        nutriScore={nutriScore}
        isVerified={isVerified}
        isMeal={isMeal}
        accent={accent}
      />
    </View>
  );
}

export default DetailsHeader;
