import {Base64String} from "./types";

const getBase64 = (file: File): Promise<Base64String> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as Base64String);
    reader.onerror = (error) => reject(error);
  });
}

export default getBase64;
