import * as FileSystem from "expo-file-system/legacy";

import {
  BASE_IMGBB_URL,
  BASE_IMGBB_DELETE_URL,
} from "../constants/urlConstants";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";

export async function postImage(imageUri) {
  const apiKey = module.exports.getAPIKey();
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("image", base64);

  const response = await fetch(BASE_IMGBB_URL, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return {
    imageUri: data.data.url,
    imageDeleteUri: data.data.delete_url,
  };
}

export async function deleteImage(deleteUri) {
  const path = deleteUri.split("//")[1];
  const parts = path.split("/").filter(Boolean);
  const imageId = parts[parts.length - 2];
  const imageHash = parts[parts.length - 1];

  if (!imageId || !imageHash) throw new Error("Invalid delete URI");

  const formData = new FormData();
  formData.append("pathname", `/${imageId}/${imageHash}`);
  formData.append("action", "delete");
  formData.append("delete", "image");
  formData.append("from", "resource");
  formData.append("deleting[id]", imageId);
  formData.append("deleting[hash]", imageHash);

  const response = await fetch(BASE_IMGBB_DELETE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  await handleFetchResponseErrorsAndData(response);

  return {
    imageUri: null,
    imageDeleteUri: null,
  };
}

// HELPERS
export function getAPIKey() {
  const apiKey = process.env.EXPO_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(`$IMGBB_API_KEY environment variable is not set`);
  }

  return apiKey;
}
