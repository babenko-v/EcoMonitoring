import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../Components/UI/Modal/Modal";
import ObjectUpdateForm from "../../Components/Objects/UpdateForm/ObjectUpdateForm";
import ObjectFilter from "../../Components/Objects/ObjectFilter/ObjectFilter";
import PollutantPostForm from "../../Components/Pollutants/PostForm/PollutantPostForm";
import ObjectPostForm from "../../Components/Objects/PostForm/ObjectPostForm";

const ObjectsList = () => {
    const [objects, setObjects] = useState([]);
    const [modal, setModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [editingObject, setEditingObject] = useState(null);

    const fetchObjects = async ({ filterBy = '', filterValue = '', sortBy = '', sortOrder = '' } = {}) => {
        const queryParams = new URLSearchParams();

        if (filterBy && filterValue) {
            queryParams.append(filterBy, filterValue);
        }
        if (sortBy) {
            const order = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
            queryParams.append('ordering', order);
        }
        try {
            const res = await axios.get(`/objects/?${queryParams.toString()}`);
            setObjects(res.data)
        } catch (err) {
            console.error(err);
        }
    };

    const deleteObject = async (id) => {
        try {
            await axios.delete(`/objects/${id}/`);
            fetchObjects();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchObjects();
    }, []);

    return (
        <div>
            <ObjectFilter fetch={fetchObjects}/>
            <table className="table">
                <thead>
                <tr className="dark">
                    <th>#</th>
                    <th>Name</th>
                    <th>Head</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {objects.map((obj, index) => (
                    <tr key={obj.id}>
                        <td>{index + 1}</td>
                        <td>{obj.name}</td>
                        <td>{obj.head}</td>
                        <td>{obj.address}</td>
                        <td>
                            <button
                                onClick={() => {
                                    setEditingObject(obj);
                                    setUpdateModal(true);
                                }}
                                className="btn btn-warning btn-sm m-2"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => deleteObject(obj.id)}
                                className="btn btn-danger btn-sm m-2"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="button-container">
                <button
                    type="button"
                    className="btn btn-primary m-2"
                    onClick={() => {
                        setEditingObject(null);
                        setModal(true);
                    }}
                >
                    Add Object
                </button>
            </div>

            <Modal visible={updateModal} setVisible={setUpdateModal}>
                <ObjectUpdateForm
                    initialData={editingObject}
                    onSubmit={() => {
                        setUpdateModal(false);
                        fetchObjects();
                    }}
                />
            </Modal>
            <Modal visible={modal} setVisible={setModal}>
                <ObjectPostForm onSubmit={() => {
                    setModal(false);
                    fetchObjects();
                }} />
            </Modal>
        </div>
    );
};

export default ObjectsList;
