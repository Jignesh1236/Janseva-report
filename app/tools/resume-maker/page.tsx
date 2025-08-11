"use client";
import React, { useState, useRef } from 'react';
import Navigation from '../../components/Navigation';
import { Translations } from '../../types/translations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';

// Translation dictionary (will add specific resume maker translations later)
const translations: Record<string, Translations> = {
  en: {
    about: "About", services: "Services", contact: "Contact", visitCenter: "Visit Our Center", onlineTools: "Online Tools", ourServices: "Our Services", helpingYou: "Helping You, Every Step of the Way", needAssistance: "Need Assistance?", youCan: "You can:", callUsAt: "Call us at:", orVisit: "Or visit our center today!", contactUs: "Contact Us", quickLinks: "Quick Links", followUs: "Follow Us", allRightsReserved: "All rights reserved.", loading: "Loading...", jansevakendra: "Jansevakendra", photoCropTool: "ID Card Photo Crop Tool", uploadFront: "Upload Front Side Image", uploadBack: "Upload Back Side Image", cropFront: "Crop Front Side", cropBack: "Crop Back Side", download: "Download Combined Image", reset: "Reset", instructions: "Upload the front and back images of your ID card and crop them. The tool will then combine them for download.", uploadImageInstruction: "Please upload an image.", cropImageInstruction: "Adjust the crop box and click 'Crop'.", frontSide: "Front Side", backSide: "Back Side", combinedPreview: "Combined Cropped Image Preview", cropBothSides: "Please crop both sides to see the combined preview and download.",
    resumeMakerTool: "Professional Resume Maker",
    personalInformation: "Personal Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    linkedinPortfolio: "LinkedIn/Portfolio URL",
    summaryObjective: "Summary/Objective",
    summaryPlaceholder: "Write a brief summary or objective for your resume.",
    workExperience: "Work Experience",
    jobTitle: "Job Title",
    company: "Company",
    location: "Location",
    startDate: "Start Date",
    endDate: "End Date",
    responsibilities: "Responsibilities/Achievements",
    addExperience: "Add Experience",
    education: "Education",
    degree: "Degree/Diploma",
    institution: "Institution",
    graduationDate: "Graduation Date",
    addEducation: "Add Education",
    skills: "Skills",
    skillName: "Skill Name",
    addSkill: "Add Skill",
    generateResume: "Generate Resume"
  },
  gu: {
    about: "અમારા વિશે", services: "સેવાઓ", contact: "સંપર્ક કરો", visitCenter: "અમારા કેન્દ્રની મુલાકાત લો", onlineTools: "ઓનલાઈન સાધનો", ourServices: "અમારી સેવાઓ", helpingYou: "દરેક પગલે તમારી સાથે", needAssistance: "સહાયની જરૂર છે?", youCan: "તમે કરી શકો છો:", callUsAt: "અમને કૉલ કરો:", orVisit: "અથવા આજે જ અમારા કેન્દ્રની મુલાકાત લો!", contactUs: "સંપર્ક કરો", quickLinks: "ઝડપી લિંક્સ", followUs: "અમને ફોલો કરો", allRightsReserved: "બધા અધિકારો સુરક્ષિત છે.", loading: "લોડ થઈ રહ્યું છે...", jansevakendra: "જનસેવાકેન્દ્ર", photoCropTool: "આઈડી કાર્ડ ફોટો ક્રોપ ટૂલ", uploadFront: "ફ્રન્ટ સાઈડ ઇમેજ અપલોડ કરો", uploadBack: "બેક સાઈડ ઇમેજ અપલોડ કરો", cropFront: "ફ્રન્ટ સાઈડ ક્રોપ કરો", cropBack: "બેક સાઈડ ક્રોપ કરો", download: "કમ્બાઈન્ડ ઇમેજ ડાઉનલોડ કરો", reset: "રીસેટ કરો", instructions: "તમારા આઈડી કાર્ડની ફ્રન્ટ અને બેક ઇમેજ અપલોડ કરો અને ક્રોપ કરો. ટૂલ પછી તેમને ડાઉનલોડ કરવા માટે કમ્બાઈન્ડ કરશે.", uploadImageInstruction: "કૃપા કરીને એક ઇમેજ અપલોડ કરો.", cropImageInstruction: "ક્રોપ બોક્સને એડજસ્ટ કરો અને 'ક્રોપ' પર ક્લિક કરો.", frontSide: "ફ્રન્ટ સાઈડ", backSide: "બેક સાઈડ", combinedPreview: "ક્રોપ કરેલ કમ્બાઈન્ડ ઇમેજ પ્રિવ્યૂ", cropBothSides: "કમ્બાઈન્ડ પ્રિવ્યૂ અને ડાઉનલોડ જોવા માટે બંને બાજુ ક્રોપ કરો.",
    resumeMakerTool: "વ્યાવસાયિક રિઝ્યુમ મેકર",
    personalInformation: "વ્યક્તિગત માહિતી",
    fullName: "પૂરું નામ",
    email: "ઇમેઇલ",
    phone: "ફોન નંબર",
    linkedinPortfolio: "લિંક્ડઇન/પોર્ટફોલિયો URL",
    summaryObjective: "સારાંશ/ઉદ્દેશ્ય",
    summaryPlaceholder: "તમારા રિઝ્યુમ માટે સંક્ષિપ્ત સારાંશ અથવા ઉદ્દેશ્ય લખો.",
    workExperience: "કાર્ય અનુભવ",
    jobTitle: "પદ",
    company: "કંપની",
    location: "સ્થાન",
    startDate: "શરૂઆત તારીખ",
    endDate: "અંત તારીખ",
    responsibilities: "જવાબદારીઓ/સિદ્ધિઓ",
    addExperience: "અનુભવ ઉમેરો",
    education: "શિક્ષણ",
    degree: "ડિગ્રી/ડિપ્લોમા",
    institution: "સંસ્થા",
    graduationDate: "ગ્રેજ્યુએશન તારીખ",
    addEducation: "શિક્ષણ ઉમેરો",
    skills: "કુશળતા",
    skillName: "કુશળતાનું નામ",
    addSkill: "કુશળતા ઉમેરો",
    generateResume: "રિઝ્યુમ બનાવો"
  }
};

export default function ResumeMaker() {
  const [language, setLanguage] = useState('en');
  const t = translations[language as keyof typeof translations];

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinPortfolio: ''
  });

  const [summary, setSummary] = useState('');
  const [workExperiences, setWorkExperiences] = useState<Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }>>([]);
  const [educationEntries, setEducationEntries] = useState<Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    percentage: string;
  }>>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // New state variables for additional sections
  const [achievements, setAchievements] = useState('');
  const [myTime, setMyTime] = useState('');
  const [trainingCourses, setTrainingCourses] = useState('');
  const [passions, setPassions] = useState('');

  // New state variable for Languages
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');

  const [personalDetails, setPersonalDetails] = useState({
    dateOfBirth: '',
    nationality: '',
    address: '',
    maritalStatus: '',
    gender: ''
  });

  // Add section order state
  const [sectionOrder, setSectionOrder] = useState({
    left: ['personalDetails', 'summary', 'workExperience', 'education'],
    right: ['skills', 'languages', 'achievements', 'trainingCourses', 'passions']
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
  };

  const handleAddExperience = () => {
    setWorkExperiences([...workExperiences, { jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '' }]);
  };

  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedExperiences = [...workExperiences];
    (updatedExperiences[index] as any)[name] = value;
    setWorkExperiences(updatedExperiences);
  };

  const handleAddEducation = () => {
    setEducationEntries([...educationEntries, { degree: '', institution: '', location: '', graduationDate: '', percentage: '' }]);
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEducation = [...educationEntries];
    (updatedEducation[index] as any)[name] = value;
    setEducationEntries(updatedEducation);
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Handle language input change
  const handleLanguageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLanguage(e.target.value);
  };

  // Handle add language
  const handleAddLanguage = () => {
    if (newLanguage.trim() !== '') {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  // Handle remove language
  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add drag end handler
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId as keyof typeof sectionOrder;
    const destColumn = destination.droppableId as keyof typeof sectionOrder;

    const newOrder = { ...sectionOrder };
    const [removed] = newOrder[sourceColumn].splice(source.index, 1);
    newOrder[destColumn].splice(destination.index, 0, removed);

    setSectionOrder(newOrder);
  };

  // Function to generate resume
  const generateResume = async () => {
    // Create a temporary div to hold the resume content
    const resumeDiv = document.createElement('div');
    resumeDiv.style.width = '210mm'; // A4 width
    resumeDiv.style.boxSizing = 'border-box';
    resumeDiv.style.padding = '15mm'; // Adjust padding as needed
    resumeDiv.style.backgroundColor = 'white';
    resumeDiv.style.position = 'absolute';
    resumeDiv.style.left = '-9999px';
    resumeDiv.style.top = '0';
    resumeDiv.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(resumeDiv);

    // Create the resume content
    resumeDiv.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px; font-family: 'Arial', sans-serif; font-size: 11px;">
        <!-- Header with improved styling -->
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 8px;">
          <h1 style="font-size: 24px; margin: 0; color: #1a202c; font-weight: 700;">${personalInfo.fullName}</h1>
          <div style="display: flex; gap: 15px; margin-top: 4px; font-size: 11px; color: #4a5568;">
            <span>${personalInfo.phone}</span>
            <span>${personalInfo.email}</span>
            ${personalInfo.linkedinPortfolio ? `<span>${personalInfo.linkedinPortfolio}</span>` : ''}
          </div>
        </div>

        <!-- Main Content Columns -->
        <div style="display: flex; gap: 20px;">
          <!-- Left Column -->
          <div style="flex: 2; display: flex; flex-direction: column; gap: 12px;">
            <!-- Personal Details -->
            <div>
              <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">Personal Details</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; color: #4a5568;">
                ${personalDetails.dateOfBirth ? `<div><strong>Date of Birth:</strong> ${personalDetails.dateOfBirth}</div>` : ''}
                ${personalDetails.nationality ? `<div><strong>Nationality:</strong> ${personalDetails.nationality}</div>` : ''}
                ${personalDetails.address ? `<div><strong>Address:</strong> ${personalDetails.address}</div>` : ''}
                ${personalDetails.maritalStatus ? `<div><strong>Marital Status:</strong> ${personalDetails.maritalStatus}</div>` : ''}
                ${personalDetails.gender ? `<div><strong>Gender:</strong> ${personalDetails.gender}</div>` : ''}
              </div>
            </div>

            <!-- Summary/Objective -->
            ${summary ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">${t.summaryObjective}</h2>
                <p style="font-size: 11px; color: #4a5568; line-height: 1.4;">${summary}</p>
              </div>
            ` : ''}

            <!-- Work Experience -->
            ${workExperiences.length > 0 ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">${t.workExperience}</h2>
                ${workExperiences.map(exp => `
                  <div style="margin-bottom: 8px; font-size: 11px; color: #4a5568;">
                    <h3 style="font-size: 12px; margin: 0; color: #1a202c; font-weight: 600;">${exp.jobTitle}</h3>
                    <p style="margin: 2px 0; font-style: italic;">${exp.company} - ${exp.location}</p>
                    <p style="margin: 2px 0; color: #666;">${exp.startDate} - ${exp.endDate}</p>
                    <ul style="margin-top: 4px; padding-left: 15px; line-height: 1.4;">
                      ${exp.responsibilities.split('\n').filter(item => item.trim() !== '').map(item => `<li>${item.trim()}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Education -->
            ${educationEntries.length > 0 ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">${t.education}</h2>
                ${educationEntries.map(edu => `
                  <div style="margin-bottom: 8px; font-size: 11px; color: #4a5568;">
                    <h3 style="font-size: 12px; margin: 0; color: #1a202c; font-weight: 600;">${edu.degree}</h3>
                    <p style="margin: 2px 0; font-style: italic; color: #4a5568;">${edu.institution} - ${edu.location}</p>
                    <div style="display: flex; gap: 10px; margin-top: 2px; color: #666; font-size: 11px;">
                      <span>${edu.graduationDate}</span>
                      ${edu.percentage ? `<span style="color: #2563eb; font-weight: 500;">${edu.percentage}</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Right Column -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
            <!-- Skills -->
            ${skills.length > 0 ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">${t.skills}</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${skills.map(skill => `
                    <span style="background-color: #e2e8f0; color: #1a202c; padding: 2px 8px; border-radius: 10px; font-size: 10px;">${skill}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Languages -->
            ${languages.length > 0 ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">Languages</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${languages.map(lang => `
                    <span style="background-color: #e2e8f0; color: #1a202c; padding: 2px 8px; border-radius: 10px; font-size: 10px;">${lang}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Achievements -->
            ${achievements ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">Achievements</h2>
                <ul style="list-style-type: disc; padding-left: 15px; font-size: 11px; color: #4a5568; line-height: 1.4;">
                  ${achievements.split('\n').filter(item => item.trim() !== '').map(item => `<li>${item.trim()}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Training / Courses -->
            ${trainingCourses ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">Training / Courses</h2>
                <ul style="list-style-type: disc; padding-left: 15px; font-size: 11px; color: #4a5568; line-height: 1.4;">
                  ${trainingCourses.split('\n').filter(item => item.trim() !== '').map(item => `<li>${item.trim()}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Passions -->
            ${passions ? `
              <div>
                <h2 style="font-size: 14px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #2563eb; padding-bottom: 3px; margin-bottom: 6px;">Passions</h2>
                <ul style="list-style-type: disc; padding-left: 15px; font-size: 11px; color: #4a5568; line-height: 1.4;">
                  ${passions.split('\n').filter(item => item.trim() !== '').map(item => `<li>${item.trim()}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    try {
      // Convert the resume div to canvas
      const canvas = await html2canvas(resumeDiv, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      pdf.save(`${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Clean up
      document.body.removeChild(resumeDiv);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navigation language={language} translations={t} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{t.resumeMakerTool}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a professional resume easily.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.personalInformation}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={personalInfo.fullName}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="linkedinPortfolio" className="block text-sm font-medium text-gray-700 mb-1">{t.linkedinPortfolio}</label>
                <input
                  type="text"
                  id="linkedinPortfolio"
                  name="linkedinPortfolio"
                  value={personalInfo.linkedinPortfolio}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Personal Details Section */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="text"
                  name="dateOfBirth"
                  value={personalDetails.dateOfBirth}
                  onChange={handlePersonalDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="e.g., 01/01/1990"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={personalDetails.nationality}
                  onChange={handlePersonalDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={personalDetails.address}
                  onChange={handlePersonalDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={personalDetails.maritalStatus}
                  onChange={handlePersonalDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={personalDetails.gender}
                  onChange={handlePersonalDetailsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary/Objective */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.summaryObjective}</h2>
            <textarea
              id="summary"
              name="summary"
              value={summary}
              onChange={handleSummaryChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder={t.summaryPlaceholder}
            ></textarea>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.workExperience}</h2>
            {workExperiences.map((experience, index) => (
              <div key={index} className="space-y-4 mb-6 p-4 border border-gray-200 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.jobTitle}</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={experience.jobTitle}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.company}</label>
                  <input
                    type="text"
                    name="company"
                    value={experience.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.location}</label>
                  <input
                    type="text"
                    name="location"
                    value={experience.location}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.startDate}</label>
                    <input
                      type="text"
                      name="startDate"
                      value={experience.startDate}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="e.g., 2018 - 2022 or Sep 2018"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.endDate}</label>
                    <input
                      type="text"
                      name="endDate"
                      value={experience.endDate}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="e.g., Present or Sep 2022"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.responsibilities}</label>
                  <textarea
                    name="responsibilities"
                    value={experience.responsibilities}
                    onChange={(e) => handleExperienceChange(index, e)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="List key responsibilities and achievements (one per line)"
                  ></textarea>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddExperience}
              className="mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-semibold"
            >
              {t.addExperience}
            </button>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.education}</h2>
             {educationEntries.map((education, index) => (
              <div key={index} className="space-y-4 mb-6 p-4 border border-gray-200 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.degree}</label>
                  <input
                    type="text"
                    name="degree"
                    value={education.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.institution}</label>
                  <input
                    type="text"
                    name="institution"
                    value={education.institution}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.location}</label>
                  <input
                    type="text"
                    name="location"
                    value={education.location}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.graduationDate}</label>
                  <input
                    type="text"
                    name="graduationDate"
                    value={education.graduationDate}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="e.g., 2022 or May 2022"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage/CGPA</label>
                  <input
                    type="text"
                    name="percentage"
                    value={education.percentage}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="e.g., 85% or 8.5 CGPA"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handleAddEducation}
               className="mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-semibold"
            >
              {t.addEducation}
            </button>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.skills}</h2>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={handleSkillInputChange}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder={t.skillName}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                onClick={handleAddSkill}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-semibold"
              >
                {t.addSkill}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-2 -mr-0.5 h-4 w-4 flex-shrink-0 text-primary hover:text-primary/80"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* New Sections Input */}
          <div className="space-y-6">
            {/* Achievements */}
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-4">Achievements</h2>
              <textarea
                id="achievements"
                name="achievements"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="List your key achievements (one per line)"
              ></textarea>
            </div>

            {/* My Time */}
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-4">My Time</h2>
              <textarea
                id="myTime"
                name="myTime"
                value={myTime}
                onChange={(e) => setMyTime(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Describe how you spend your time (one item per line)"
              ></textarea>
            </div>

            {/* Training / Courses */}
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-4">Training / Courses</h2>
              <textarea
                id="trainingCourses"
                name="trainingCourses"
                value={trainingCourses}
                onChange={(e) => setTrainingCourses(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="List your relevant training and courses (one per line)"
              ></textarea>
            </div>

            {/* Passions */}
            <div>
              <h2 className="text-2xl font-semibold text-primary mb-4">Passions</h2>
              <textarea
                id="passions"
                name="passions"
                value={passions}
                onChange={(e) => setPassions(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="List your passions (one per line)"
              ></textarea>
            </div>
          </div>

          {/* Languages Input */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Languages</h2>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newLanguage}
                onChange={handleLanguageInputChange}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Language Name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
              <button
                onClick={handleAddLanguage}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm font-semibold"
              >
                Add Language
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((language, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(index)}
                    className="ml-2 -mr-0.5 h-4 w-4 flex-shrink-0 text-primary hover:text-primary/80"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateResume}
              className="bg-primary text-white py-3 px-8 rounded-md hover:bg-secondary transition-colors duration-200 font-semibold"
            >
              {t.generateResume}
            </button>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Live Preview</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="max-w-[210mm] mx-auto bg-white p-4 border border-gray-200 rounded-lg">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {/* Left Column */}
                  <Droppable droppableId="left">
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ 
                          flex: 2, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '12px',
                          minHeight: '100px',
                          padding: '8px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px'
                        }}
                      >
                        {sectionOrder.left.map((sectionId, index) => {
                          switch (sectionId) {
                            case 'personalDetails':
                              return (personalDetails.dateOfBirth || personalDetails.nationality || personalDetails.address || personalDetails.maritalStatus || personalDetails.gender) && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided: DraggableProvided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          Personal Details
                                        </h2>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px', color: '#4a5568' }}>
                                          {personalDetails.dateOfBirth && <div><strong>Date of Birth:</strong> {personalDetails.dateOfBirth}</div>}
                                          {personalDetails.nationality && <div><strong>Nationality:</strong> {personalDetails.nationality}</div>}
                                          {personalDetails.address && <div><strong>Address:</strong> {personalDetails.address}</div>}
                                          {personalDetails.maritalStatus && <div><strong>Marital Status:</strong> {personalDetails.maritalStatus}</div>}
                                          {personalDetails.gender && <div><strong>Gender:</strong> {personalDetails.gender}</div>}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            case 'summary':
                              return summary && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided: DraggableProvided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {t.summaryObjective}
                                        </h2>
                                        <p style={{ fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>{summary}</p>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            case 'workExperience':
                              return workExperiences.length > 0 && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided: DraggableProvided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {t.workExperience}
                                        </h2>
                                        <div>
                                          {workExperiences.map((exp, i) => (
                                            <div key={i} style={{ marginBottom: '8px', fontSize: '11px', color: '#4a5568' }}>
                                              <h3 style={{ fontSize: '12px', margin: 0, color: '#1a202c', fontWeight: '600' }}>{exp.jobTitle}</h3>
                                              <p style={{ margin: '2px 0', fontStyle: 'italic' }}>{exp.company} - {exp.location}</p>
                                              <p style={{ margin: '2px 0', color: '#666' }}>{exp.startDate} - {exp.endDate}</p>
                                              {exp.responsibilities && (
                                                <ul style={{ marginTop: '4px', paddingLeft: '15px', lineHeight: '1.4' }}>
                                                  {exp.responsibilities.split('\n').filter(item => item.trim() !== '').map((item, j) => (
                                                    <li key={j}>{item.trim()}</li>
                                                  ))}
                                                </ul>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            case 'education':
                              return educationEntries.length > 0 && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided: DraggableProvided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {t.education}
                                        </h2>
                                        <div>
                                          {educationEntries.map((edu, i) => (
                                            <div key={i} style={{ marginBottom: '8px', fontSize: '11px', color: '#4a5568' }}>
                                              <h3 style={{ fontSize: '12px', margin: 0, color: '#1a202c', fontWeight: '600' }}>{edu.degree}</h3>
                                              <p style={{ margin: '2px 0', fontStyle: 'italic', color: '#4a5568' }}>{edu.institution} - {edu.location}</p>
                                              <div style={{ display: 'flex', gap: '10px', marginTop: '2px', color: '#666', fontSize: '11px' }}>
                                                <span>{edu.graduationDate}</span>
                                                {edu.percentage && <span style={{ color: '#2563eb', fontWeight: '500' }}>{edu.percentage}</span>}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            default:
                              return null;
                          }
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Right Column */}
                  <Droppable droppableId="right">
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '12px',
                          minHeight: '100px',
                          padding: '8px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px'
                        }}
                      >
                        {sectionOrder.right.map((sectionId, index) => {
                          switch (sectionId) {
                            case 'skills':
                              return skills.length > 0 && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {sectionId === 'skills' ? t.skills : ''}
                                        </h2>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                          {skills.map((skill, i) => (
                                            <span key={i} style={{ backgroundColor: '#e2e8f0', color: '#1a202c', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>{skill}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            case 'languages':
                              return languages.length > 0 && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {sectionId === 'languages' ? 'Languages' : ''}
                                        </h2>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                          {languages.map((lang, i) => (
                                            <span key={i} style={{ backgroundColor: '#e2e8f0', color: '#1a202c', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>{lang}</span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            case 'achievements':
                              return achievements && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {sectionId === 'achievements' ? 'Achievements' : ''}
                                        </h2>
                                        <ul style={{ listStyleType: 'disc', paddingLeft: '15px', fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>
                                          {achievements.split('\n').filter(item => item.trim() !== '').map((item, i) => (
                                            <li key={i}>{item.trim()}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            case 'trainingCourses':
                              return trainingCourses && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {sectionId === 'trainingCourses' ? 'Training / Courses' : ''}
                                        </h2>
                                        <ul style={{ listStyleType: 'disc', paddingLeft: '15px', fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>
                                          {trainingCourses.split('\n').filter(item => item.trim() !== '').map((item, i) => (
                                            <li key={i}>{item.trim()}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            case 'passions':
                              return passions && (
                                <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        cursor: 'grab',
                                        backgroundColor: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        marginBottom: '8px',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      <div>
                                        <h2 style={{ 
                                          fontSize: '14px', 
                                          fontWeight: 'bold', 
                                          color: '#1a202c', 
                                          borderBottom: '1px solid #2563eb', 
                                          paddingBottom: '3px', 
                                          marginBottom: '6px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px'
                                        }}>
                                          <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            style={{ cursor: 'grab' }}
                                          >
                                            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          {sectionId === 'passions' ? 'Passions' : ''}
                                        </h2>
                                        <ul style={{ listStyleType: 'disc', paddingLeft: '15px', fontSize: '11px', color: '#4a5568', lineHeight: '1.4' }}>
                                          {passions.split('\n').filter(item => item.trim() !== '').map((item, i) => (
                                            <li key={i}>{item.trim()}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            default:
                              return null;
                          }
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-primary/30 mt-12 rounded-t-xl shadow-inner">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">&copy; 2025 {t.jansevakendra}. All rights reserved.</p>
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