import React from 'react';
import { 
  Button, 
  Card, 
  Carousel,
  Footer
} from 'flowbite-react';
import { HiAcademicCap, HiUserGroup, HiDocumentText } from 'react-icons/hi';
import imag from "../../assets/first.jpg"


export function Home() {
  const features = [
    {
      icon: <HiAcademicCap className="h-10 w-10" />, 
      title: "Seamless Learning", 
      description: "Access courses, assignments, and resources in one central hub."
    },
    {
      icon: <HiUserGroup className="h-10 w-10" />, 
      title: "Collaborative Spaces", 
      description: "Connect with classmates and teachers in real-time discussion forums."
    },
    {
      icon: <HiDocumentText className="h-10 w-10" />, 
      title: "Smart Assignments", 
      description: "Submit work and receive feedback with our intuitive interface."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row-reverse items-center">
            {/* Image on the Right */}
            <div className="md:w-1/2 flex justify-end">
              <img 
                src={imag} 
                alt="Students collaborating" 
                className="max-w-[600px] max-h-[900px] w-auto h-auto object-cover rounded-lg shadow-xl"
              />
            </div>
            {/* Text on the Left */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                Welcome to <span className="text-blue-200">EduConnect</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                The modern classroom management platform that brings teachers and students together.
              </p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need for <span className="text-blue-600">Effective Learning</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {features.map((feature, index) => (
            <Card key={index} className="max-w-sm hover:shadow-lg transition-shadow duration-300 mx-auto">
              <div className="flex justify-center text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
  
      {/* Footer */}
      <Footer container>
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div className="mb-6">
              <span className="text-2xl font-semibold whitespace-nowrap text-blue-600">
                EduConnect
              </span>
              <p className="mt-2 text-gray-500">Making education accessible and engaging</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <Footer.Title title="Resources" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Help Center</Footer.Link>
                  <Footer.Link href="#">Tutorials</Footer.Link>
                  <Footer.Link href="#">Blog</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Privacy Policy</Footer.Link>
                  <Footer.Link href="#">Terms & Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title="Company" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">About Us</Footer.Link>
                  <Footer.Link href="#">Careers</Footer.Link>
                  <Footer.Link href="#">Contact</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#" by="EduConnect™" year={2025} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon href="#" icon={HiAcademicCap} />
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
}  
export default Home;
