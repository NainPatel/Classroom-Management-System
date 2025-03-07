import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge, Button, Modal, Table } from "flowbite-react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { HiCheck } from "react-icons/hi";
import { FaExclamation } from "react-icons/fa";
import { Hourglass } from "react-loader-spinner";
import { saveAs } from 'file-saver';


const AssignmentDetails = () => {
    const navigation = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const { state } = useLocation();
    const [submissionModal, setSubmissionModal] = useState(false);
    const [urls, setUrls] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const regex = /\.(jpg|jpeg|png|gif|webp|html|css|txt|mp4|webm|pdf)$/i;
    const storage = getStorage();
    const [updatedMarks, setUpdatedMarks] = useState({});


    const onCloseModal = () => {
        setSubmissionModal(false);
        setFileNames([]);
        setUrls([]);
    };

    const manage_submission_download = (file_ref, file_name) => {
        getDownloadURL(file_ref)
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                    saveAs(blob, file_name);
                };
                xhr.open('GET', url);
                xhr.send();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        const res2 = fetch(`http://localhost:8080/api/get_students/${state.code}`, {
            method: 'GET',
        });
        const res = fetch(`http://localhost:8080/api/submissions_by_assignment/${state.assignment_id}`, {
            method: 'GET',
        });

        res.then((response) => {
            response.json().then(
                async (value) => {
                    const subs = [];
                    for (const valueElement of value) {
                        subs.push(valueElement.student_id);
                    }

                    setSubmissions([...value]);
                    await res2.then((response) => {
                        response.json().then(
                            (value1) => {
                                const Not_subs = [];
                                value1.student_id.map((id, i) => {
                                    if (subs.indexOf(id) === -1) {
                                        Not_subs.push({
                                            student_id: id,
                                            student_name: value1.student_name[i],
                                        });
                                    }
                                });
                                setSubmissions([...value, ...Not_subs]);
                                setIsloading(false);
                            }
                        );
                    });
                }
            );
        });
    }, []);



    const handleMarkChange = (studentId, newMark, originalMark) => {
        // Ensure only numbers are entered
        if (newMark !== '' && !/^\d+$/.test(newMark)) return;

        setUpdatedMarks(prev => ({
            ...prev,
            [studentId]: newMark
        }));

        setSubmissions(prevSubmissions =>
            prevSubmissions.map(submission =>
                submission.student_id === studentId
                    ? {
                        ...submission,
                        tempMarks: newMark,
                        showUpdateButton: newMark !== '' && Number(newMark) !== (originalMark !== undefined ? Number(originalMark) : NaN)
                    }
                    : submission
            )
        );
    };

    const updateMarks = async (studentId) => {
        const newMark = updatedMarks[studentId]; // Get updated mark for student

        if (newMark === undefined) return; // Prevent unnecessary API calls

        try {
            const response = await fetch(`http://localhost:8080/api/AddMarks/${state.assignment_id}/${studentId}/${newMark}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                console.log("Marks updated successfully");

                // Reset the update state
                setUpdatedMarks(prev => {
                    const newState = { ...prev };
                    delete newState[studentId];
                    return newState;
                });

                setSubmissions(prevSubmissions =>
                    prevSubmissions.map(submission =>
                        submission.student_id === studentId
                            ? {
                                ...submission,
                                marks: newMark,
                                showUpdateButton: false,
                                tempMarks: undefined
                            }
                            : submission
                    )
                );
            } else {
                console.error("Failed to update marks:", response.status);
            }
        } catch (error) {
            console.error("Error updating marks:", error);
        }
    };




    return (
        <div>
            <Modal show={submissionModal} size="4xl" position={'center'} className={'flex flex-row shadow'}
                onClose={onCloseModal} popup>
                <Modal.Header>
                    Submission
                </Modal.Header>
                <Modal.Body>
                    <div className="overflow-x-auto drop-shadow-2xl justify-center">
                        <Table striped className={'shadow border-gray-500 rounded-lg'}>
                            <Table.Head className={'justify-between'}>
                                <Table.HeadCell style={{ fontSize: 'medium' }}>File Names Name</Table.HeadCell>
                                <Table.HeadCell></Table.HeadCell>
                            </Table.Head>
                            <Table.Body className={'divide-y'}>
                                {
                                    fileNames.map((file, i) => (
                                        <Table.Row key={i}>
                                            <Table.Cell className={'font-medium'}>
                                                <b>{file}</b>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className={'flex flex-wrap justify-center'}>
                                                    <Button color={'green'} className={'mr-4 border-2 shadow'}
                                                        onClick={
                                                            (event) => {
                                                                event.preventDefault();
                                                                const file_ref = ref(storage, `Assignments/${state.code}/${state.assignment_id}/${file}`);
                                                                manage_submission_download(file_ref, file);
                                                            }
                                                        }>
                                                        <b>Download</b>
                                                    </Button>

                                                    {
                                                        regex.test(file) ?
                                                            <Button className={'ml-4 border-2 shadow'} color={'cyan'}
                                                                href={urls.at(i).toString()} target={'_blank'}>
                                                                <b>View</b>
                                                            </Button>
                                                            : null
                                                    }
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>

            <div className={'mt-8'}>
                <a className={'ml-20 hover:cursor-pointer '} style={{ fontSize: "medium", color: 'blue' }} onClick={
                    () => {
                        navigation(`/ClassDetails/${state.code}`);
                    }
                }>
                    <b><u>back</u></b>
                </a>
            </div>

            {
                isloading ?
                    <div style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', marginTop: '18rem' }}>
                        <Hourglass
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="hourglass-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            colors={['#306cce', '#72a1ed']}
                        />
                    </div> :

                    <div className="overflow-x-auto justify-center" style={{ padding: '3rem' }}>
                        <Table striped className={'shadow border-gray-500 rounded-lg'}>
                            <Table.Head className={'justify-between'}>
                                <Table.HeadCell style={{ fontSize: 'medium' }}>Name</Table.HeadCell>
                                <Table.HeadCell style={{ fontSize: 'medium' }}>Submission Status</Table.HeadCell>
                                <Table.HeadCell style={{ fontSize: 'medium' }}>Details</Table.HeadCell>
                                {
                                    state.enableMark && <Table.HeadCell style={{ fontSize: 'medium' }}>Marks</Table.HeadCell>
                                }
                            </Table.Head>
                            <Table.Body className={'divide-y'}>
                                {
                                    submissions.map((submission, i) => (
                                        <Table.Row key={i}>
                                            <Table.Cell style={{ fontSize: 'medium' }}>{submission.student_name}</Table.Cell>
                                            <Table.Cell style={{ fontSize: 'medium' }}>
                                                {
                                                    submission.sub_date ? <div className="flex flex-wrap gap-2">
                                                        <Badge icon={HiCheck} className={'shadow font-medium'} color={'green'}>
                                                            <b>Submitted</b>
                                                        </Badge>
                                                        {
                                                            state.last_date < (new Date(submission.sub_date)) ?
                                                                <Badge className={'shadow'} icon={FaExclamation} color={'failure'}>
                                                                    <b>Late</b>
                                                                </Badge> : null
                                                        }
                                                    </div> : <div className="flex flex-wrap">
                                                        <Badge icon={FaExclamation} className={'shadow font-medium'} color={'warning'}>
                                                            <b>Not Submitted</b>
                                                        </Badge>
                                                    </div>
                                                }
                                            </Table.Cell>
                                            <Table.Cell style={{ fontSize: 'medium' }}>
                                                {
                                                    submission.sub_date ?
                                                        <Button color={'green'}
                                                            className={'font-medium border-2 shadow'} onClick={
                                                                () => {
                                                                    setSubmissionModal(true);
                                                                    setUrls(submission.urls);
                                                                    setFileNames(submission.file_names);
                                                                }
                                                            }><b>Details</b></Button>
                                                        : <Button color={'green'} disabled={true}
                                                            className={'font-medium border-2 shadow'}><b>Details</b></Button>
                                                }
                                            </Table.Cell>
                                            {
                                                state.enableMark && submission.sub_date &&
                                                <Table.Cell style={{ fontSize: 'medium' }}>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={submission.tempMarks !== undefined ? submission.tempMarks : submission.marks || ''}
                                                            onChange={(e) => handleMarkChange(submission.student_id, e.target.value, submission.marks)}
                                                            className="border p-1 mr-5 rounded w-16 text-center"
                                                            placeholder="Mark"
                                                            min="0"  // Prevent negative numbers
                                                            step="1" // Only whole numbers
                                                            pattern="[0-9]*" // Restrict non-numeric input
                                                        />
                                                        {submission.showUpdateButton && (
                                                            <Button
                                                                pill
                                                                // color="success"
                                                                gradientMonochrome="success"
                                                                onClick={() => updateMarks(submission.student_id)}
                                                            >
                                                                <b>Update</b>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Table.Cell>

                                            }
                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>
                    </div>
            }
        </div>
    );
};

export default AssignmentDetails;