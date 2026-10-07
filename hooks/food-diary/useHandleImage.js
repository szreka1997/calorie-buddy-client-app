import * as ImgService from "../../services/img-service";

function useHandleImage() {
  async function handleImage(values) {
    const { image, imageUri, imageDeleteUri } = values;

    let result;
    if (image) {
      if (imageDeleteUri) await ImgService.deleteImage(imageDeleteUri);
      result = await ImgService.postImage(image);
    } else if (imageUri) {
      result = { imageUri, imageDeleteUri };
    } else if (imageDeleteUri) {
      result = await ImgService.deleteImage(imageDeleteUri);
    }

    return result;
  }

  return { handleImage };
}

export default useHandleImage;
