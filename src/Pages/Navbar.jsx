
"use client";

import { Button, Navbar } from "flowbite-react";
import {useState} from "react";
import Login from "../login.jsx";
import logo from "../assets/logo.svg"; 

 const NavBar_Component = () => {

     const [OpenModal, setOpenModal] = useState(false)
    return (

        <div>
            <Navbar fluid rounded>
                <Navbar.Brand href="http://localhost:5173/">
                    <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Academix</span>
                </Navbar.Brand>
                <div className="flex md:order-2">
                    <Button onClick={() => {
                        setOpenModal(true)
                    }}
                    >Get started</Button>
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Navbar.Link href="#" active>
                        Home
                    </Navbar.Link>
                    <Navbar.Link href="#">About</Navbar.Link>
                    <Navbar.Link href="#">Services</Navbar.Link>
                    <Navbar.Link href="#">Contact</Navbar.Link>
                </Navbar.Collapse>
            </Navbar>

            {
                OpenModal ? <Login openModal={OpenModal}  setOpenModal={setOpenModal}/> : null
            }
        </div>


    );
}

export default NavBar_Component;
