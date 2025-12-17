import axios from "axios";

export async function uploadToImgBB(imageBase64: string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not set");
  }

  const formData = new FormData();
  formData.append("image", imageBase64);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data.success) {
    return response.data.data.url;
  } else {
    throw new Error("Failed to upload image to ImgBB");
  }
}
