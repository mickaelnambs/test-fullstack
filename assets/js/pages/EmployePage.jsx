import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import FormContentLoader from '../components/loaders/FormContentLoader';
import EmployesAPI from '../services/employesAPI';

const EmployePage = ({match, history}) => {

    const { id = "new" } = match.params;

    const [employe, setEmploye] = useState({
        lastName: "",
        firstName: "",
        age: "",
        poste: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        age: "",
        poste: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Récuperation du employe en fonction de l'identifiant.
    const fetchEmploye = async (id) => {
        try {
            const { firstName, lastName, age, poste } = await EmployesAPI.find(id);
            setEmploye({ firstName, lastName, age, poste });
            setLoading(false);
        } catch (error) {
            console.log(error.response);
            history.replace("/employes");
        }
    }

    // Chargement du employe si besoin au chargement 
    // du composant ou au changement de l'identifiant.
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchEmploye(id);
            setLoading(true);
        }
    }, [id])

    // Gestion des changements des inputs dans le formulaire.
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setEmploye({ ...employe, [name]: value });
    }

    // Gestion de la soumission du formulaire.
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                await EmployesAPI.updateEmploye(id, employe);
                history.replace("/employes");
                toast.success("L'employe a bien été modifié !");
            } else {
                await EmployesAPI.createEmploye(employe);
                toast.success("L'employe a bien été crée !");
                history.replace("/employes");
            }
            setErrors({});
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
            {(!editing && <h1 className="text-center mb-4">Création d'un employe</h1>) || (
                <h1 className="text-center mb-4">Modification d'un employe</h1>
            )}
            {!loading && <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <Field
                            name="lastName"
                            label="Nom de famille"
                            placeholder="Nom de famille ..."
                            value={employe.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                        />
                        <Field
                            name="firstName"
                            label="Prénom(s)"
                            placeholder="Prénom(s) ..."
                            value={employe.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                        />
                        <Field
                            name="age"
                            label="Age"
                            placeholder="Age ..."
                            type="email"
                            value={employe.age}
                            onChange={handleChange}
                            error={errors.age}
                        />
                        <Field
                            name="poste"
                            label="Poste"
                            placeholder="Poste..."
                            value={employe.poste}
                            onChange={handleChange}
                            error={errors.poste}
                        />
                        <div className="form-group">
                            <button type="submit" className="btn btn-success mr-2">Enregister</button>
                            <Link to="/employes" className="btn btn-primary">Retour</Link>
                        </div>
                    </form>
                </div>
                <div className="col-md-3"></div>
            </div>}
            {loading && (<FormContentLoader />)}
        </>
    );
}
 
export default EmployePage;