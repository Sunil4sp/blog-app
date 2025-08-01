import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ContactUs = () => {
    const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Here you can add axios or fetch to send data to the backend
        console.log('Form submitted:', form);
        // Clear form
        try {
            const res = await axios.post('http://localhost:8000/contact', form);
            console.log('Server response:', res.data);
            setForm({ name: '', email: '', subject: '', message: '' });
            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting contact form:', err);
        }
    };

    return (
        <>
        <div className="md:container-sm px-10 space-x-4 mx-auto w-5/6">
            <Link to="/fetchAllBlogs">
                <button className="bg-sky-500 px-4 py-2 w-fit rounded-lg shadow-md hover:bg-sky-600 hover:font-bold hover:text-white">
                    <ArrowBackIcon /> Back
                </button>
                </Link>
        </div>
        <div className="md:container-sm px-10 space-x-4 bg-slate-50 mt-2 mx-auto flex flex-row justify-center border-0 bg-orange-50 w-5/6 ">
            <div className="basis-1/4 border-r-1">
                <div className="rounded-full p-8 flex flex-col grid justify-items-center">
                    CONTACT US 
                </div>
            </div>
            <div className="basis-3/4 border-l-2 font-mono p-4 flex flex-col bg-blue-50 text-black">
                <div className="text-sm grid grid-cols-1 gap-4 items-stretch">
                    {submitted && (
                    <p className="text-green-600 mb-4 text-center">Thank you for contacting us!</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded bg-white text-black"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded bg-white text-black"
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded bg-white text-black"
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full p-3 border rounded bg-white text-black"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded w-full"
                        >
                        Send Message
                        </button>
                    </form>   
                </div>
            </div>
    </div>
</> 
)}

export default ContactUs;