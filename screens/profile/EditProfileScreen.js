import LoadingOverlay from "../../components/UI/LoadingOverlay";
import ProfileAndGoalContent from "../../components/Goal/ProfileAndGoalContent";
import useUpdateUser from "../../hooks/goal/useUpdateUser";

function EditProfileScreen({ route }) {
  const userData = route.params?.userData;
  const { isFetchingData, updateUser } = useUpdateUser();

  if (isFetchingData) return <LoadingOverlay message="Updating Profile..." />;

  return (
    <ProfileAndGoalContent
      data={userData}
      isEditProfile
      onSubmit={updateUser}
    />
  );
}

export default EditProfileScreen;
