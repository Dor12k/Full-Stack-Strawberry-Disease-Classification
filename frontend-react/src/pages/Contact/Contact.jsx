


// File name: Contact.jsx
import React, { useState } from 'react'
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    // Optional: clear the form after a delay
    setTimeout(() => {
      setForm({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="w-full min-h-screen  bg-slate-50 dark:bg-[#1f1f1f] dark:text-white py-12 px-4 md:px-16">

      <h2 className="text-4xl font-bold mb-6 text-center ">Contact Me</h2>
      <p className="text-center text-xl text-gray-600 dark:text-gray-400 mb-12">
        Feel free to reach out for opportunities or collaborations!
      </p>

      {/* Contact Info */}
      <div className="grid md:grid-cols-3 gap-8 mb-12 text-center text-xl">
        <div>
          <Mail className="mx-auto mb-2" />
          <p>strawberry@strawberry.com</p>
        </div>
        <div>
          <Phone className="mx-auto mb-2" />
          <p>+972-54-123-4567</p>
        </div>
        <div>
          <MapPin className="mx-auto mb-2" />
          <p>Tel Aviv, Israel</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-6 mb-12">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          <Github className="hover:text-blue-500 transition" />
        </a>
        <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">
          <Linkedin className="hover:text-blue-500 transition" />
        </a>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto grid gap-6">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="p-3 rounded-md border dark:border-gray-600 bg-white dark:bg-[#2b2b2b]"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="p-3 rounded-md border dark:border-gray-600 bg-white dark:bg-[#2b2b2b]"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          className="p-3 rounded-md border dark:border-gray-600 bg-white dark:bg-[#2b2b2b]"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Send Message
        </button>
        {submitted && (
          <p className="text-green-600 text-center mt-2">
            ✅ Your message has been sent (demo).
          </p>
        )}
      </form>
    </div>
  )
}

export default Contact
