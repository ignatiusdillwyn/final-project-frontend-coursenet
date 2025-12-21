import axios from "axios";

const URL = import.meta.env.VITE_API;

const getBooks = async () => {
  const response = await axios.get(`${URL}/books`);
  return response.data;
};

const deleteBook = async (id) => {
  const response = await axios.delete(`${URL}/books/${id}`);
  return response.data;
};

const getBookById = async (id) => {
  const response = await axios.get(`${URL}/books/${id}`);
  return response.data;
};

export { getBooks, deleteBook, getBookById };
