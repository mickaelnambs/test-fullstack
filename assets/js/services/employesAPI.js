import axios from 'axios';
import Cache from './cache';
import { EMPLOYES_API } from '../config';

async function findAll() {
    const cachedEmployes = await Cache.get("employes");

    if (cachedEmployes) return cachedEmployes;

    return axios
        .get(EMPLOYES_API,)
        .then(response => {
            const employes = response.data['hydra:member'];
            Cache.set("employes", employes);
            return employes;
        });
}

function createEmploye(employe) {
    return axios
        .post(EMPLOYES_API, employe)
        .then(async response => {
            const cachedEmployes = await Cache.get("employes");
            if (cachedEmployes) {
                Cache.set("employes", [...cachedEmployes, response.data]);
            }
            return response;
        });
}

async function find(id) {
    const cachedemploye = await Cache.get("employes." + id);
    if (cachedemploye) return cachedemploye;

    return axios
        .get(EMPLOYES_API + "/" + id)
        .then(response => {
            const employe = response.data;
            Cache.set("employes." + id, employe);

            return employe;
        });
}

function deleteEmploye(id) {
    return axios
        .delete(EMPLOYES_API + "/" + id)
        .then(async response => {
            const cachedEmployes = await Cache.get("employes");
            if (cachedEmployes) {
                Cache.set("employes", cachedEmployes.filter(c => c.id !== id));
            }
            return response;
        });
}

function updateEmploye(id, employe) {
    return axios
        .put(EMPLOYES_API + "/" + id, employe)
        .then(async response => {
            const cachedEmployes = await Cache.get("employes");
            const cachedemploye = await Cache.get("employes." + id);

            if (cachedemploye) {
                Cache.set("employes." + id, response.data);
            }

            if (cachedEmployes) {
                const index = cachedEmployes.findIndex(employe => employe.id === +id);
                cachedEmployes[index] = response.data;
            }
            return response;
        });
}

export default {
    findAll,
    find,
    createEmploye,
    deleteEmploye,
    updateEmploye
}