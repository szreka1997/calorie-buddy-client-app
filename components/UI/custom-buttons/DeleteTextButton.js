import IconButton from "./IconButton";

function DeleteTextButton({ onDelete, isVisible = false, accent = false }) {
  return (
    <>
      {isVisible && (
        <IconButton
          icon="close"
          borderWidth={0}
          iconSize={28}
          accent={!accent}
          onPress={onDelete}
        />
      )}
    </>
  );
}

export default DeleteTextButton;
