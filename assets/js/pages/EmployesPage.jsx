import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../components/fontAwesome/index';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { default as EmployesAPI } from '../services/employesAPI';
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const EmployesPage = () => {

    const [employes, setEmployes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    // Permet d'aller récuperer les employes.
    const fetchEmployes = async () => {
        try {
            const data = await EmployesAPI.findAll();
            setEmployes(data);
            setLoading(false);
        } catch (error) {
            console.log(error.response)
        }
    }
    
    // Au chargement du composant, on va récuperer les employes.
    useEffect(() => {
        fetchEmployes();
    }, [])

    // Gestion du changement de page.
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Gestion de la suppréssion d'un employe.
    const handleDelete = async (id) => {
        const originalEmployes = [...employes];
        setEmployes(employes.filter(employe => employe.id !== id));

        try {
            await EmployesAPI.deleteEmploye(id);
            toast.success("L'employe a bien été supprimé !");
        } catch (error) {
            setEmployes(originalEmployes);
            toast.error("Une erreur est survenue !");
        }
    }

    // Gestion de la recherche.
    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    // Filtrage des employes en fonction de la recherche.
    const filteredEmployes = employes.filter(
        e => e.firstName.toLowerCase().includes(search.toLowerCase()) ||
            e.lastName.toLowerCase().includes(search.toLowerCase()) ||
            e.age.toString().includes(search.toLowerCase()) ||
            (e.poste && e.poste.toLowerCase().includes(search.toLowerCase()))
    );
    
    // Pagination des données.
    const paginatedEmployes = Pagination.getData(
        filteredEmployes,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>La liste des employes</h1>
                <Link to="/employes/new" className="btn btn-primary"><FontAwesomeIcon icon="plus"/></Link>
            </div>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher ..."
                    onChange={handleSearch}
                    value={search}
                />
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Employe</th>
                        <th>Age</th>
                        <th>Poste</th>
                        <th className="text-center">Experiences</th>
                        <th />
                    </tr>
                </thead>
                {!loading && (
                    <tbody>
                        {paginatedEmployes.map(employe => (
                            <tr key={employe.id}>
                                <td>{employe.id}</td>
                                <td>
                                    <Link to={"/employes/" + employe.id}>{employe.firstName} {employe.lastName}</Link>
                                </td>
                                <td>{employe.age}</td>
                                <td>{employe.poste}</td>
                                <td className="text-center">
                                    <span className="badge badge-primary">{employe.experiences.length}</span>
                                </td>
                                <td>
                                    <Link to={"/employes/" + employe.id} className="btn btn-sm btn-primary mr-2"><FontAwesomeIcon icon="edit" /></Link>
                                    <button
                                        onClick={() => handleDelete(employe.id)}
                                        // disabled={employe.invoices.length > 0}
                                        className="btn btn-sm btn-danger"
                                    >
                                        <FontAwesomeIcon icon="trash" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
            {loading && <TableLoader />}
            {itemsPerPage < filteredEmployes.length &&
                < Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredEmployes.length}
                onPageChanged={handlePageChange}
            />}
        </>
    );
};
 
export default EmployesPage;