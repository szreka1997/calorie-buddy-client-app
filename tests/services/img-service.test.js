import {
  BASE_IMGBB_URL,
  BASE_IMGBB_DELETE_URL,
} from "../../constants/urlConstants";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import * as ImgService from "../../services/img-service";

const FileSystem = require("expo-file-system/legacy");

jest.mock("../../utils/errorUtils", () => ({
  handleFetchResponseErrorsAndData: jest.fn(),
}));

describe("Img Service", () => {
  const imageUri = "file:///image.jpg";
  const imageUriResponse = "https://imgbb.com/image.jpg";
  const imageDeleteUri = "https://ibb.co/abc123/hash456";
  const base64Image = "ZmFrZS1iYXNlNjQ=";
  const apiKey = "imgbb-api-key";

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.EXPO_PUBLIC_IMGBB_API_KEY = apiKey;
    FileSystem.readAsStringAsync.mockResolvedValue(base64Image);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
    delete process.env.EXPO_PUBLIC_IMGBB_API_KEY;
  });

  describe("[postImage]", () => {
    beforeEach(() => {
      handleFetchResponseErrorsAndData.mockResolvedValue({
        data: {
          url: imageUriResponse,
          delete_url: imageDeleteUri,
        },
      });
    });

    test("uploads image and returns image urls", async () => {
      const result = await ImgService.postImage(imageUri);

      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      expect(global.fetch).toHaveBeenCalledWith(BASE_IMGBB_URL, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: expect.any(FormData),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual({
        imageUri: imageUriResponse,
        imageDeleteUri: imageDeleteUri,
      });
    });
  });

  describe("[deleteImage]", () => {
    test("throws when delete uri is invalid", async () => {
      await expect(ImgService.deleteImage("https://ibb.co")).rejects.toThrow(
        "Invalid delete URI",
      );
    });

    test("calls delete endpoint and returns nullified image data", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue({});

      const result = await ImgService.deleteImage(imageDeleteUri);

      expect(global.fetch).toHaveBeenCalledWith(BASE_IMGBB_DELETE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: expect.any(FormData),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual({
        imageUri: null,
        imageDeleteUri: null,
      });
    });
  });

  describe("[getAPIKey]", () => {
    test("throws when EXPO_PUBLIC_IMGBB_API_KEY is not set", () => {
      delete process.env.EXPO_PUBLIC_IMGBB_API_KEY;

      expect(() => ImgService.getAPIKey()).toThrow(
        "$IMGBB_API_KEY environment variable is not set",
      );
    });

    test("returns EXPO_PUBLIC_IMGBB_API_KEY when set", () => {
      expect(ImgService.getAPIKey()).toEqual(apiKey);
    });
  });
});
