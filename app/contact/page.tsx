"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

// Translation dictionary
const translations = {
  en: {
    about: "About",
    services: "Services",
    contact: "Contact",
    visitCenter: "Visit Our Center",
    onlineTools: "Online Tools",
    ourServices: "Our Services",
    helpingYou: "Helping You, Every Step of the Way",
    needAssistance: "Need Assistance?",
    youCan: "You can:",
    callUsAt: "Call us at:",
    orVisit: "Or visit our center today!",
    contactUs: "Contact Us",
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved.",
    loading: "Loading...",
    jansevakendra: "Janseva Kendra (Private)"
  },
  gu: {
    about: "અમારા વિશે",
    services: "સેવાઓ",
    contact: "સંપર્ક કરો",
    visitCenter: "અમારા કેન્દ્રની મુલાકાત લો",
    onlineTools: "ઓનલાઈન સાધનો",
    ourServices: "અમારી સેવાઓ",
    helpingYou: "દરેક પગલે તમારી સાથે",
    needAssistance: "સહાયની જરૂર છે?",
    youCan: "તમે કરી શકો છો:",
    callUsAt: "અમને કૉલ કરો:",
    orVisit: "અથવા આજે જ અમારા કેન્દ્રની મુલાકાત લો!",
    contactUs: "સંપર્ક કરો",
    quickLinks: "ઝડપી લિંક્સ",
    followUs: "અમને ફોલો કરો",
    allRightsReserved: "બધા અધિકારો સુરક્ષિત છે.",
    loading: "લોડ થઈ રહ્યું છે...",
    jansevakendra: "જનસેવા કેન્દ્ર (પ્રાઇવેટ)"
  }
};

export default function Contact() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      if (!formRef.current) return;

      const result = await emailjs.sendForm(
        'service_p4pu1qg', // EmailJS service ID (updated)
        'template_v7pqny9', // EmailJS template ID (updated)
        formRef.current,
        'pLWzh8vWeSYlxU9lQ' // EmailJS public key
      );

      if (result.text === 'OK') {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message. We will get back to you soon!'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us through any of the following methods.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-primary mb-6">Send us a Message</h2>
            {submitStatus.type && (
              <div className={`mb-4 p-4 rounded-md ${
                submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {submitStatus.message}
              </div>
            )}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="service">Service Related</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              {/* Hidden time field */}
              <input
                type="hidden"
                name="time"
                value={new Date().toLocaleString()}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-secondary transition-colors duration-200 font-semibold ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-primary mb-6">Direct Contact</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600 mt-1">
                      <a href="tel:+916355390372" className="hover:text-primary">+91 63553 90372</a><br />
                      <a href="tel:+919727202545" className="hover:text-primary">+91 97272 02545</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">
                      <a href="mailto:jansevakarjan@gmail.com" className="hover:text-primary">jansevakarjan@gmail.com</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600 mt-1">
                      Jansevakendra<br />
                      karjan, Vadodara, Gujarat<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-primary mb-6">Business Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Saturday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-primary mb-6">Follow Us</h2>
              <a
                href="https://www.instagram.com/janseva_kendra_private/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z" />
                </svg>
                <span>@janseva_kendra_private</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-primary/30 mt-12 rounded-t-xl shadow-inner">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t.contactUs}</h3>
              <p className="text-gray-300">Email: <a href="mailto:jansevakarjan@gmail.com" className="underline hover:text-primary">jansevakarjan@gmail.com</a></p>
              <p className="text-gray-300">Phone: <a href="tel:+916355390372" className="underline hover:text-primary">+91 63553 90372</a></p>
              <p className="text-gray-300">Phone: <a href="tel:+919727202545" className="underline hover:text-primary">+91 97272 02545</a></p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t.quickLinks}</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-primary underline">{t.about}</Link></li>
                <li><Link href="/services" className="text-gray-300 hover:text-primary underline">{t.services}</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-primary underline">{t.contact}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t.followUs}</h3>
              <div className="flex space-x-4 mt-2">
                <a href="https://www.instagram.com/janseva_kendra_private/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary flex items-center transition-colors duration-200">
                  <svg className="h-6 w-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z" />
                  </svg>
                  <span>@janseva_kendra_private</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 flex justify-between items-center">
            <p className="text-gray-400">&copy; 2025 Janseva Kendra (Private). {t.allRightsReserved}</p>
            <button
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors duration-200"
            >
              {language === 'en' ? 'ગુજરાતી' : 'English'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 
