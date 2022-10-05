import axios from "axios";

const BASE_URL = "/api";

const getAllPersons = () => axios.get(`${BASE_URL}/persons`);
const createNewPerson = (newName, newNumber) =>
  axios.post(`${BASE_URL}/persons`, {
    name: newName,
    number: newNumber,
  });

const deletePerson = (id) => axios.delete(`${BASE_URL}/persons/${id}`);

const updatePerson = (id, name, number) =>
  axios.put(`${BASE_URL}/persons/${id}`, {
    name: name,
    number: number,
  });

export default {
  getAllPersons: getAllPersons,
  createNewPerson: createNewPerson,
  deletePerson: deletePerson,
  updatePerson: updatePerson,
};
