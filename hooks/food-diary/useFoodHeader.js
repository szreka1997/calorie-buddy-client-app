import { useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import IconButton from "../../components/UI/custom-buttons/IconButton";
import { AuthContext } from "../../contexts/auth-context";

function useFoodHeader({ foodData, params = {} }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  useLayoutEffect(() => {
    async function setEditButtonForOwner() {
      const { id: loggedInUserId } = await authCtx.getTokenAndId();
      if (loggedInUserId === foodData.userId) {
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon="pencil-sharp"
              iconSize={28}
              accent
              onPressOut={() => {
                navigation.navigate("AddAndEditFood", {
                  ...params,
                });
              }}
            />
          ),
        });
      }
    }

    setEditButtonForOwner();
  }, [navigation, foodData]);
}

export default useFoodHeader;
