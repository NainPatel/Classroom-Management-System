import React, { useState } from "react";

const ClassCard = ({ className, classCode }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition transform hover:shadow-2xl w-80 border-2 border-gray-300 hover:border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800">{className}</h2>
            <p className="text-gray-500 mt-2">Class Code: {classCode}</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
                View Class
            </button>
        </div>
    );
};

const Button = ({ onClick, children, bgColor }) => {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 text-white rounded-full shadow-md hover:shadow-xl transition ${bgColor}`}
        >
            {children}
        </button>
    );
};

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

const TeacherPage = () => {
    const [classes, setClasses] = useState([]);

    const createClass = () => {
        // Simulate creating a class
        const newClass = { className: "Science 101", classCode: "XYZ456" };
        setClasses([...classes, newClass]);
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-6">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Create Your Classes</h1>
                <Button onClick={createClass} bgColor="bg-blue-600 hover:bg-blue-500 mb-6.">
                    Create Class
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

export { TeacherPage,Button,ClassCard };
