import LoadingOverlay from "../../components/UI/LoadingOverlay";
import CreateAndEditMealContent from "../../components/food-diary/meal/CreateAndEditMealContent";
import useCreateAndEditMealSubmit from "../../hooks/food-diary/useCreateAndEditMealSubmit";

function CreateAndEditMealScreen({ route }) {
  const { mealData, foodIdAndQuantityList } = route.params || {};

  const { isFetchingData, submit } = useCreateAndEditMealSubmit(mealData);

  if (isFetchingData) return <LoadingOverlay />;

  return (
    <CreateAndEditMealContent
      mealData={mealData}
      foodIdAndQuantityList={foodIdAndQuantityList}
      onSubmit={submit}
    ></CreateAndEditMealContent>
  );
}

export default CreateAndEditMealScreen;
