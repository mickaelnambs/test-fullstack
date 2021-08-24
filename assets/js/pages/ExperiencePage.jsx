import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import FormContentLoader from '../components/loaders/FormContentLoader';
import EmployesAPI from '../services/employesAPI';
import ExperiencesAPI from '../services/experiencesAPI';

const ExperiencePage = ({ history, match }) => {
    
    const { id = "new " } = match.params;

    const [experience, setExperience] = useState({
        title: "",
        description: "",
        employe: "",
    });

    const [employes, setEmployes] = useState([]);
    const [loading, setloading] = useState(true);

    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        employe: "",
    });

    // Récuperation de la liste des employes.
    useEffect(() => {
        fetchEmployes();
    }, []);
    
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchExperience(id);
        }
    }, [id]);

    // Récuperation d'une facture.
    const fetchExperience = async id => {
        try {
            const { title, description, employe } = await ExperiencesAPI.find(id);
            // const { amount, status, employe } = data;
            setExperience({ title, description, employe: employe.id });
            setloading(false);
        } catch (error) {
            console.log(error.response);
        }
    }

    // Récuperation des employes.
    const fetchEmployes = async () => {
        try {
            const data = await EmployesAPI.findAll();
            setEmployes(data);
            setloading(false);
            // Si on ne modifie pas le client, 
            // çela veut dire qu'on va sélectionner le prémier employe dans la liste déroulante.
            if (!experience.employe) setExperience({...experience, employe: data[0].id})
        } catch (error) {
            console.log(error.response);
        }
    }

    // Gestion des changements des inputs dans le formulaire.
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;  

        setExperience({ ...experience, [name]: value });
    }

    // Gestion de la soumission du formulaire.
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                await ExperiencesAPI.updateExperience(id, experience);
                toast.success("L'experence a bien été modifiée !");
            } else {
                await ExperiencesAPI.createExperience(experience);
                toast.success("L'experience a bien été créée !");
                history.replace("/experiences");
            }
        } catch (error) {
            if (error.response.data.violations) {
                const apiErros = {};
                error.response.data.violations.forEach(violation => {
                    apiErros[violation.propertyPath] = violation.message;
                });
                setErrors(apiErros);
            }
            toast.error("Une erreur est survenue !");
        }
    }

    return (  
        <>
            {editing && (<h1 className="text-center mb-4">Modifiction d'une experience</h1>) || (
                <h1 className="text-center mb-4">Création d'une experience</h1>
            )}
            {loading && <FormContentLoader />}
            {!loading && (
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit}>
                            <Field
                                name="title"
                                type="text"
                                placeholder="Titre"
                                label="Titre"
                                onChange={handleChange}
                                value={experience.title}
                                error={errors.title}
                            />
                            <Field
                                name="description"
                                type="text"
                                placeholder="Description"
                                label="Description"
                                onChange={handleChange}
                                value={experience.description}
                                error={errors.description}
                            />
                            <Select
                                name="employe"
                                label="Employe"
                                value={experience.employe}
                                error={errors.employe}
                                onChange={handleChange}
                            >
                                {employes.map(employe => 
                                    <option key={employe.id} value={employe.id}>
                                        {employe.firstName} {employe.lastName}
                                    </option>    
                                )}
                            </Select>

                            <div className="form-group">
                                <button type="submit" className="btn btn-success mr-2">Enregister</button>
                                <Link to="/experiences" className="btn btn-primary">Retour</Link>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-3"></div>
                </div>
            )}
        </>
    );
}
 
export default ExperiencePage;