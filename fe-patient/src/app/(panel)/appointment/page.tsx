"use client"

import React, { useState } from "react";
import { LuSquarePen } from "react-icons/lu";
import { GoMail } from "react-icons/go";
import { MdOutlinePhone } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { LuChartBarIncreasing } from "react-icons/lu";
import { MdOutlineModeComment } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormContext } from "@/context/formContext";
import { useAuth } from "@/context/AuthContext";
import { patientApi } from "@/lib/api";

function AppointmentPage() {
    const router = useRouter();
    const { formData } = useFormContext();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [appointmentData, setAppointmentData] = useState({
        fullname: formData.fullname || "",
        reason: "",
        additionalComments: "",
        appointmentDate: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setAppointmentData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!user) {
            setError("Authentication required. Please log in to book an appointment.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Submit to backend
            await patientApi.createAppointment({
                patient: user._id,
                appointmentDate: appointmentData.appointmentDate,
                appointmentTime: "09:00", // Default time or we could add a time picker
                appointmentType: "Consultation",
                reason: appointmentData.reason,
                isOnline: false,
                notes: appointmentData.additionalComments,
                doctor: "6446ec23f3e07c8a1c76b5e1" // This would be dynamic in a real app
            });
            
            // Redirect to submitted page
            router.push("/submitted");
        } catch (error) {
            console.error("Failed to book appointment:", error);
            setError("There was an error booking your appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row items-center  md:items-start justify-center">

            <div className="w-full md:w-1/2 px-6 min-h-screen flex flex-col items-center justify-center">

                <section className="text-start w-full max-w-[600px]">
                    <h2 className="text-xl mb-2">Hello!!</h2>
                    <p className="text-gray-700 mb-4 dark:text-gray-300">Get started with Appointments.</p>
                    
                    {error && (
                        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                    
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="fullname" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
                                Full Name:
                            </label>
                            <div className="flex items-center border px-3 py-1  rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                                <span className="flex items-center justify-center  text-gray-400">
                                    <LuSquarePen className="w-4 h-4" />
                                </span>
                                <Input id="fullname" type="text"
                                    placeholder="Enter your name" 
                                    value={appointmentData.fullname}
                                    onChange={handleChange}
                                    required/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reason" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
                                Reason for appointment:
                            </label>
                            <div className="flex items-center border px-3 py-1  rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                                <span className="flex items-center justify-center text-gray-400">
                                    <LuChartBarIncreasing className="w-4 h-4" />
                                </span>
                                <Input id="reason" type="text"
                                    placeholder="Enter your reason" 
                                    value={appointmentData.reason}
                                    onChange={handleChange}
                                    required/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="additionalComments" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
                                Additional comments:
                            </label>
                            <div className="flex items-center border px-3 py-1  rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                                <span className="flex items-center justify-center text-gray-400">
                                    <MdOutlineModeComment className="w-4 h-4" />
                                </span>
                                <Input id="additionalComments" type="text"
                                    placeholder="Enter your comments" 
                                    value={appointmentData.additionalComments}
                                    onChange={handleChange}/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="appointmentDate" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
                                Select Date:
                            </label>
                            <div className="flex items-center border px-3 py-1  rounded-md focus-within:ring-1 focus-within:ring-gray-50">
                                <span className="flex items-center justify-center text-gray-400">
                                    <LuCalendarDays className="w-4 h-4" />
                                </span>
                                <Input id="appointmentDate" type="date"
                                    value={appointmentData.appointmentDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full font-semibold cursor-pointer py-5 sm:py-6 rounded-md transition-all mt-3"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit and Continue"}
                        </Button>
                    </form>
                </section>
            </div>
            <div className="hidden md:block lg:w-1/2">
                <Image
                    height={400}
                    width={400}
                    className="w-full h-screen object-cover sticky top-0"
                    src="/doctor.jpeg"
                    alt="Doctor"
                />
            </div>
        </div>
    );
}

export default AppointmentPage;