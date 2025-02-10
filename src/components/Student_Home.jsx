import React, {useState} from "react";
import {Button} from './edu.jsx'
import {ClassCard} from "./edu.jsx";


const StudentPage = () => {
    const [classes, setClasses] = useState([]);

    const joinClass = () => {
        // Simulate joining a class
        const newClass = { className: "Math 101", classCode: "ABC123" };
        setClasses([...classes, newClass]);
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-6">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Join Your Classes</h1>
                <Button onClick={joinClass} bgColor="bg-blue-600 hover:bg-blue-500 mb-6">
                    Join Classroom
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {classes.map((cls, index) => (
                    <ClassCard key={index} className={cls.className} classCode={cls.classCode} />
                ))}
            </div>
        </div>
    );
};

export default StudentPage;