import axios from "axios";
import { EXPERIENCES_API } from "../config";

function findAll() {
  return axios
    .get(EXPERIENCES_API)
    .then(response => response.data["hydra:member"]);
}

function deleteExperience(id) {
  return axios.delete(EXPERIENCES_API + "/" + id);
}

function find(id) {
  return axios.get(EXPERIENCES_API + "/" + id).then(response => response.data);
}

function updateExperience(id, experience) {
  return axios.put(EXPERIENCES_API + "/" + id, {
    ...experience,
    employe: `/api/employes/${experience.employe}`
  });
}

function createExperience(experience) {
  return axios.post(EXPERIENCES_API, {
    ...experience,
    employe: `/api/employes/${experience.employe}`
  });
}

export default {
    findAll,
    find,
    createExperience,
    updateExperience,
    deleteExperience
}