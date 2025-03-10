import { Button, Card, Modal, Table, Badge } from "flowbite-react";
import { HiPlus, HiOutlineDocument } from "react-icons/hi";
import { useEffect, useState } from "react";
import UploadMaterial from "../forms/UploadMaterial.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { TbListDetails } from "react-icons/tb";
import { BiTime } from "react-icons/bi";

export function Materials() {
    const [materialModal, setMaterialModal] = useState(false);
    const onCloseModal = () => {
        setMaterialModal(false);
    };
    const [files, setFiles] = useState([]);
    const class_id = useParams();
    const [issubmited, setIssubmited] = useState(false);
    const [materials, setMaterials] = useState([]);
    const navigate = useNavigate();
    const storage = getStorage();
    const user = useSelector(state => state.User);

    const handle_navigation = (data) => {
        if (user.role === 'Teacher' || user.role === 'Student') {
            navigate('/MaterialsDetails', {
                state: data
            });
        }
    };

    const deleteMaterial = (id, file_names) => {
        const auth = getAuth();
        const uid = auth.currentUser.uid;

        file_names.map((name) => {
            const Ref = ref(storage, `Materials/${class_id.code}/${name}`);
            deleteObject(Ref).then(() => {
                // Success
            });
        });
        
        const responses = fetch(`http://localhost:8080/api/materials/${class_id.code}/${id}`, {
            method: 'DELETE'
        });
        
        responses.then(
            (responses) => {
                responses.json().then(
                    (value) => {
                        setMaterials(value);
                    }
                );
            }
        );
    };

    useEffect(() => {
        const response = fetch(`http://localhost:8080/api/materials/${class_id.code}`, {});
        response.then(
            response => {
                response.json().then(
                    (value) => {
                        setMaterials(value);
                    }
                );
            }
        );
    }, []);

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <HiOutlineDocument className="mr-2 text-blue-600" />
                    Course Materials
                </h2>
                
                {user.role === 'Teacher' && (
                    <Button 
                        color="blue" 
                        pill
                        className="transition-all duration-200 hover:shadow-lg"
                        onClick={() => setMaterialModal(true)}
                    >
                        <HiPlus className="mr-2 h-5 w-5" />
                        <span className="font-medium">Add Material</span>
                    </Button>
                )}
            </div>

            {/* Materials Grid */}
            {materials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <HiOutlineDocument className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No materials available</h3>
                    {user.role === 'Teacher' && (
                        <p className="text-gray-400 mt-2">Click "Add Material" to upload course content</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((material) => (
                        <Card key={material.code} className="hover:shadow-lg transition-shadow duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {truncateText(material.title, 60)}
                                </h5>
                                <Badge color="info" className="ml-2">
                                    {material.file_names.length} files
                                </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <BiTime className="mr-1" />
                                <span>Added on {new Date().toLocaleDateString()}</span>
                            </div>
                            
                            <div className="mb-4">
                                <p className="text-gray-700 dark:text-gray-400 line-clamp-3 h-16 overflow-hidden">
                                    {material.description}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 justify-end mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                                <Button 
                                    color="light"
                                    onClick={() => {
                                        const data = {
                                            code: material.class_id,
                                            urls: material.urls,
                                            file_names: material.file_names
                                        };
                                        handle_navigation(data);
                                    }}
                                >
                                    <TbListDetails className="mr-2 h-5 w-5" />
                                    <span className="font-medium">View Details</span>
                                </Button>

                                {user.role === 'Teacher' && (
                                    <Button 
                                        color="failure" 
                                        className="bg-red-50 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                                        onClick={() => {
                                            deleteMaterial(material.code, material.file_names);
                                        }}
                                    >
                                        <FaTrash className="mr-2 h-4 w-4" />
                                        <span className="font-medium">Delete</span>
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            <Modal 
                show={materialModal} 
                size="2xl" 
                onClose={onCloseModal} 
                popup
            >
                <Modal.Header className="border-b dark:border-gray-700" />
                <Modal.Body>
                    <UploadMaterial 
                        props={{
                            files: files,
                            setFiles: setFiles,
                            class_id: class_id.code,
                            setIssubmited: setIssubmited,
                            issubmited: issubmited,
                            setMaterialModal: setMaterialModal,
                            setMaterials: setMaterials
                        }}
                    />
                    
                    {!issubmited && files.length > 0 && (
                        <div className="overflow-x-auto mt-6">
                            <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white flex items-center">
                                <HiOutlineDocument className="mr-2 text-blue-600" />
                                Selected Files ({files.length})
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                                <Table striped>
                                    <Table.Head>
                                        <Table.HeadCell className="text-sm font-medium">File Name</Table.HeadCell>
                                        <Table.HeadCell>
                                            <span className="sr-only">Actions</span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {files.map((file, i) => (
                                            <Table.Row 
                                                key={i}
                                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <Table.Cell className="text-sm">
                                                    <div className="flex items-center">
                                                        <HiOutlineDocument className="mr-2 text-blue-600" />
                                                        {file.name}
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        size="xs"
                                                        color="failure"
                                                        onClick={async (event) => {
                                                            event.preventDefault();
                                                            let updatedFiles = [...files];
                                                            updatedFiles.splice(i, 1);
                                                            await setFiles(updatedFiles);
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}