import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import experiencesAPI from '../services/experiencesAPI';
import '../components/fontAwesome/index';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const ExperiencesPage = () => {

    const [experiences, setExperiences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    // Permet d'aller récuperer les experiences.
    const fetchExperiences = async () => {
        try {
            const data = await experiencesAPe.findAll();
            setExperiences(data);
            setLoading(false);
        } catch (error) {
            console.log(error.response);
        }
    }

    // Gestion du changement de page.
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // S'execute après la récuperation des experiences.
    useEffect(() => {
        fetchExperiences();
    }, [])

    
    // Gestion de la recherche.
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    // Gestion de la suppréssion d'une experience.
    const handleDelete = async(id) => {
        const originalsexperiences = [...experiences];
        setExperiences(experiences.filter(experience => experience.id !== id));

        try {
            await experiencesAPe.deleteExperience(id);
            toast.success("L' experience a bien été supprimée !");
        } catch (error) {
            setExperiences(originalsexperiences);
            toast.error("Une erreur est survenue !");
        }
    }

    // Filtrage des experiences en fonction de la recherche.
    const filteredExperiences = experiences.filter(e => 
        e.employe.firstName.toLowerCase().includes(search.toLowerCase()) ||
        e.employe.lastName.toLowerCase().includes(search.toLowerCase())
    );
    
    // Pagination des données.
    const paginatedExperiences = Pagination.getData(
        filteredExperiences,
        currentPage,
        itemsPerPage
    );
    
    return ( 
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des experiences</h1>
                <Link to="/experiences/new" className="btn btn-primary"><FontAwesomeIcon icon="plus" /></Link>
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
                        <th>Employe</th>
                        <th className="text-center">Titre</th>
                        <th className="text-center">Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {!loading && (
                    <tbody>
                        {paginatedExperiences.map(experience => 
                            <tr key={experience.id}>
                                <td>
                                    <Link to={"/experiences/" + experience.id}>
                                        {experience.employe.firstName} {experience.employe.lastName}
                                    </Link>
                                </td>
                                <td className="text-center">
                                    {experience.title}
                                </td>
                                <td className="text-center">
                                    {experience.description}
                                </td>
                            </tr>    
                        )}
                    </tbody>
                )}
            </table>
            {loading && <TableLoader />}
            {itemsPerPage < filteredExperiences.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredExperiences.length}
                    onPageChanged={handlePageChange}
                />
            )}
        </>
    );
}
 
export default ExperiencesPage;