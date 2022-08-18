import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {departments} from "../util/departments";
import {cities} from "../util/cities";
import {AverageStarRating} from "../util/AverageStarRating";
import SaveButton from "../buttons/SaveButton";

function ListOfServiceProviders() {

    const value = useContext(UserContext);
    const [responseList, setResponseList] = useState();
    const [dropdownHidden, setDropdownHidden] = useState(true);
    const [departmentHidden, setDepartmentHidden] = useState(true);

    const [selectedTown, setSelectedTown] = useState("");
    const [reset, setReset] = useState(true);
    const [department, setDepartment] = useState({
        name : ""
    })

    useEffect(() => {
        axios.get(`/user/all-providers-with-reviews`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => {
                setResponseList(response.data);
            })
    }, [value, reset])

    const handleTownChange = (e) => {
        setSelectedTown(e.target.value);
        axios.get(`/user/providers-by/${e.target.value}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => {
                setResponseList(response.data);
            })
    }

    const handleDepartmentChange = (e) => {

        axios.get(`/user/providers-by/${selectedTown}/${e.target.value}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => {
                setResponseList(response.data);
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("test")
        // axios.post(`/user/department/add`, department, {
        //     headers: {
        //         Authorization: 'Bearer ' + localStorage.getItem('token')
        //     }
        // })
        //     .then(() => {
        //         setRedirect(true);
        //     })
    }

    return (
        <>
            {value ?
                <div>
                    <h1 className="d-flex justify-content-center">Service Providers</h1>

                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-outline-info" onClick={(e) => {
                            e.preventDefault();
                            setDropdownHidden(!dropdownHidden);
                        }}>Advanced Search</button>
                    </div>
                    {value && value.roles.includes("ADMIN") ?
                            <div className="d-flex justify-content-center margin-top-25">
                                <button type="button" className="btn btn-outline-info" onClick={(e) => {
                                    e.preventDefault();
                                    setDepartmentHidden(!departmentHidden);
                                }}>Add Department
                                </button>
                            </div>
                        :
                        <div></div>
                    }

                    <form onSubmit={handleSubmit}>
                        <div className="d-flex justify-content-center margin-top-25">
                            <div className={"dropdown-width"} hidden={departmentHidden}>
                                <input type="text" name="Department Name" value={department.name} onChange={e => {
                                    const s = {...department};
                                    s.department = e.target.value;
                                    setDepartment(s);
                                }} required placeholder="Department Name"/>
                            </div>
                        </div>

                    </form>

                    <div className="d-flex justify-content-center">
                        <div className={"dropdown-width"} hidden={dropdownHidden}>
                            <select className="custom-select margin-top-25" id="inputGroupSelect01" onChange={handleTownChange} required>
                                <option value="" selected>Choose town...</option>
                                {cities.sort().map((city, index) => {
                                    return <option key={index} value={city}>{city}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <div className={"dropdown-width"} hidden={dropdownHidden}>
                            <select className="custom-select margin-top-25" id="inputGroupSelect01" onChange={handleDepartmentChange} required>
                                <option value="" selected>Choose department...</option>
                                {departments.sort().map((department, index) => {
                                    return <option key={index} value={department}>{department}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center margin-top-25">
                        <button type="button" className="btn btn-outline-info btn-sm" hidden={dropdownHidden} onClick={(e) => {
                            e.preventDefault();
                            setDropdownHidden(!dropdownHidden);
                            setReset(!reset);
                        }}>Reset search</button>
                    </div>

                    <div className="d-flex justify-content-center margin-top-25">
                        <table>
                            <thead>
                            <tr>
                                {value.roles.includes("ADMIN") ?
                                    <th scope="col">ID</th>
                                    :
                                    <th scope="col">#</th>
                                }
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Email</th>
                                <th scope="col">Company</th>
                                <th scope="col">Website</th>
                                <th scope="col">Department</th>
                                <th scope="col">Town</th>
                                <th scope="col">Country</th>
                                <th scope="col">Rating</th>
                                {value.roles.includes("ADMIN") ?
                                    <th scope="col">Remove</th>
                                    :
                                    null
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {responseList && responseList.map((response, index) => {
                                return <tr key={index}>
                                    {value.roles.includes("ADMIN") ?
                                        <td className="index">{response.user && response.user.userId}</td>
                                        :
                                        <td className="index">{index + 1}</td>
                                    }
                                    <td className="provider-firstName">{response.user && response.user.firstName}</td>
                                    <td className="provider-lastName">{response.user && response.user.lastName}</td>
                                    <td className="provider-phone">{response.user && response.user.phone}</td>
                                    <td className="provider-email"><span className={"blue-underline"}>{response.user && response.user.email}</span></td>
                                    <td className="provider-company">{response.user && response.user.company}</td>
                                    <td className="provider-site">{response.user && response.user.website}</td>
                                    <td className="provider-department">{response.user && response.user.department}</td>
                                    <td>{response.user && response.user.town}</td>
                                    <td>{response.user && response.user.country}</td>
                                    {response.totalReviews >  0 ?
                                        <td className="provider-rating">
                                            <Link to={{
                                                pathname : '/review-details',
                                                providerId : response.user.userId,
                                                rating : response.averageStars,
                                                providersList : "providersList"
                                                 }}>
                                                {response.averageStars.toString().substring(0, 4) + " "}
                                                {AverageStarRating(response.averageStars)}
                                            </Link>
                                        </td>
                                        :
                                        <td>No reviews received</td>
                                    }
                                    {value.roles.includes("ADMIN") ?
                                        <td><button type="button" className="btn  btn-outline-danger btn-sm" onClick={(e) => {
                                        e.preventDefault();
                                            axios.delete(`/user/delete-by-userId/${response.user.userId}`, {
                                                headers: {
                                                    Authorization: 'Bearer ' + localStorage.getItem('token')
                                                }
                                            })
                                                .then(() => {
                                                    setReset(!reset);
                                                })}
                                        }>Remove</button></td>
                                        :
                                        null
                                    }
                                </tr>
                            })}
                            </tbody>
                        </table>

                    </div>
                </div>

                :

                <div>
                    <h1 className="d-flex justify-content-center">Service Providers</h1>

                    <div className="d-flex justify-content-center">
                        <div className={"dropdown-width"} hidden={dropdownHidden}>
                            <select className="custom-select margin-top-25" id="inputGroupSelect01" onChange={handleDepartmentChange} required>
                                <option value="" selected>Choose department...</option>
                                {departments.sort().map((department, index) => {
                                    return <option key={index} value={department}>{department}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center margin-top-25">
                        <button type="button" className="btn btn-outline-info btn-sm" hidden={dropdownHidden} onClick={(e) => {
                            e.preventDefault();
                            setDropdownHidden(!dropdownHidden);
                            setReset(!reset);
                        }}>Reset search</button>
                    </div>

                    <div className="d-flex justify-content-center margin-top-25">
                        <table>
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Email</th>
                                <th scope="col">Company</th>
                                <th scope="col">Website</th>
                                <th scope="col">Department</th>
                                <th scope="col">Town</th>
                                <th scope="col">Country</th>
                                <th scope="col">Rating</th>
                            </tr>
                            </thead>
                            <tbody>
                            {responseList && responseList.map((response, index) => {
                                return <tr key={index}>
                                    <td className="index">{index + 1}</td>
                                    <td className="provider-firstName">{response.user && response.user.firstName}</td>
                                    <td className="provider-lastName filter">Lastname</td>
                                    <td className="provider-phone filter">0721456789</td>
                                    <td className="provider-email filter"><span className={"blue-underline"}>provider@email.com</span></td>
                                    <td className="provider-company">{response.user && response.user.company}</td>
                                    <td className="provider-site">{response.user && response.user.website}</td>
                                    <td className="provider-department">{response.user && response.user.department}</td>
                                    <td>{response.user && response.user.town}</td>
                                    <td>{response.user && response.user.country}</td>
                                    {response.totalReviews > 0 ?
                                        <td className="provider-rating">
                                            {response.averageStars.toString().substring(0, 4) + " "}
                                            {AverageStarRating(response.averageStars)}
                                        </td>
                                        :
                                        <td>No reviews received</td>
                                    }
                                </tr>
                            })}
                            </tbody>
                        </table>

                    </div>
                </div>
            }
        </>
    );
}

export default ListOfServiceProviders;