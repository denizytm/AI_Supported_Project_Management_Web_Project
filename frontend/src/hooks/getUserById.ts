import axios from "axios";

export const getUserById = async (id: string) => {
  const response = await axios.get(
    `http://localhost:5110/api/users/find?id=${id}`
  );

  if (response.status) {
    return response.data;
  }
  return null;
};
