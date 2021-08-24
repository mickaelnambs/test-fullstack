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

function createEmploye(customer) {
    return axios
        .post(EMPLOYES_API, customer)
        .then(async response => {
            const cachedEmployes = await Cache.get("employes");
            if (cachedEmployes) {
                Cache.set("employes", [...cachedEmployes, response.data]);
            }
            return response;
        });
}

async function find(id) {
    const cachedCustomer = await Cache.get("employes." + id);
    if (cachedCustomer) return cachedCustomer;

    return axios
        .get(EMPLOYES_API + "/" + id)
        .then(response => {
            const customer = response.data;
            Cache.set("employes." + id, customer);

            return customer;
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

function updateEmploye(id, customer) {
    return axios
        .put(EMPLOYES_API + "/" + id, customer)
        .then(async response => {
            const cachedEmployes = await Cache.get("employes");
            const cachedCustomer = await Cache.get("employes." + id);

            if (cachedCustomer) {
                Cache.set("employes." + id, response.data);
            }

            if (cachedEmployes) {
                const index = cachedEmployes.findIndex(customer => customer.id === +id);
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