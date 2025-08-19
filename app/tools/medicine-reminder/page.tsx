
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate: string;
  notes: string;
  completed: boolean[];
}

interface Reminder {
  id: string;
  medicineName: string;
  time: string;
  date: string;
  taken: boolean;
}

export default function MedicineReminder() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id' | 'completed'>>({
    name: '',
    dosage: '',
    frequency: 'once',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  const frequencyOptions = [
    { value: 'once', label: 'Once daily', times: 1 },
    { value: 'twice', label: 'Twice daily', times: 2 },
    { value: 'thrice', label: 'Three times daily', times: 3 },
    { value: 'four', label: 'Four times daily', times: 4 },
    { value: 'custom', label: 'Custom', times: 0 }
  ];

  const defaultTimes = {
    once: ['08:00'],
    twice: ['08:00', '20:00'],
    thrice: ['08:00', '14:00', '20:00'],
    four: ['08:00', '12:00', '16:00', '20:00']
  };

  useEffect(() => {
    // Load medicines from localStorage
    const savedMedicines = localStorage.getItem('medicines');
    if (savedMedicines) {
      setMedicines(JSON.parse(savedMedicines));
    }

    // Generate today's reminders
    generateTodayReminders();
  }, []);

  useEffect(() => {
    // Save medicines to localStorage
    localStorage.setItem('medicines', JSON.stringify(medicines));
    generateTodayReminders();
  }, [medicines]);

  const generateTodayReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayReminders: Reminder[] = [];

    medicines.forEach(medicine => {
      const startDate = new Date(medicine.startDate);
      const endDate = medicine.endDate ? new Date(medicine.endDate) : new Date('2099-12-31');
      const currentDate = new Date(today);

      if (currentDate >= startDate && currentDate <= endDate) {
        medicine.times.forEach((time, index) => {
          todayReminders.push({
            id: `${medicine.id}-${index}`,
            medicineName: `${medicine.name} (${medicine.dosage})`,
            time: time,
            date: today,
            taken: false
          });
        });
      }
    });

    setReminders(todayReminders.sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleFrequencyChange = (frequency: string) => {
    const times = frequency in defaultTimes 
      ? defaultTimes[frequency as keyof typeof defaultTimes]
      : ['08:00'];
    
    setNewMedicine(prev => ({
      ...prev,
      frequency,
      times
    }));
  };

  const updateMedicineTime = (index: number, time: string) => {
    const newTimes = [...newMedicine.times];
    newTimes[index] = time;
    setNewMedicine(prev => ({ ...prev, times: newTimes }));
  };

  const addMedicineTime = () => {
    setNewMedicine(prev => ({
      ...prev,
      times: [...prev.times, '08:00']
    }));
  };

  const removeMedicineTime = (index: number) => {
    if (newMedicine.times.length > 1) {
      const newTimes = newMedicine.times.filter((_, i) => i !== index);
      setNewMedicine(prev => ({ ...prev, times: newTimes }));
    }
  };

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage) {
      alert('Please enter medicine name and dosage');
      return;
    }

    const medicine: Medicine = {
      ...newMedicine,
      id: Date.now().toString(),
      completed: new Array(newMedicine.times.length).fill(false)
    };

    setMedicines(prev => [...prev, medicine]);
    setNewMedicine({
      name: '',
      dosage: '',
      frequency: 'once',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const deleteMedicine = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(med => med.id !== id));
    }
  };

  const markReminderTaken = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, taken: !reminder.taken }
          : reminder
      )
    );
  };

  const getTodayStatus = () => {
    const total = reminders.length;
    const taken = reminders.filter(r => r.taken).length;
    return { total, taken, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
  };

  const status = getTodayStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medicine Reminder</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your medications and never miss a dose with smart reminders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Today's Reminders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Status */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Today's Progress</h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{status.percentage}%</div>
                  <div className="text-sm text-gray-500">{status.taken} of {status.total} taken</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${status.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Today's Reminders */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Medications</h2>
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                  <p>No medications scheduled for today</p>
                  <p className="text-sm">Add some medicines to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div 
                      key={reminder.id}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        reminder.taken 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => markReminderTaken(reminder.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              reminder.taken
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-purple-500'
                            }`}
                          >
                            {reminder.taken && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <div>
                            <div className={`font-medium ${reminder.taken ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                              {reminder.medicineName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reminder.time}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reminder.taken 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reminder.taken ? 'Taken' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Medicine Management */}
          <div className="space-y-6">
            {/* Add Medicine Button */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
              >
                + Add New Medicine
              </button>
            </div>

            {/* Add Medicine Form */}
            {showAddForm && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Medicine</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 500mg)"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={newMedicine.frequency}
                    onChange={(e) => handleFrequencyChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {frequencyOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>

                  {/* Times */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Times</label>
                    {newMedicine.times.map((time, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => updateMedicineTime(index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {newMedicine.times.length > 1 && (
                          <button
                            onClick={() => removeMedicineTime(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {newMedicine.frequency === 'custom' && (
                      <button
                        onClick={addMedicineTime}
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        + Add Time
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={newMedicine.startDate}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                      <input
                        type="date"
                        value={newMedicine.endDate}
                        onChange={(e) => setNewMedicine(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <textarea
                    placeholder="Notes (optional)"
                    value={newMedicine.notes}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />

                  <div className="flex space-x-3">
                    <button
                      onClick={addMedicine}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Add Medicine
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Medicine List */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">My Medicines</h3>
              {medicines.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No medicines added yet</p>
              ) : (
                <div className="space-y-3">
                  {medicines.map((medicine) => (
                    <div key={medicine.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{medicine.name}</div>
                          <div className="text-sm text-gray-500">{medicine.dosage}</div>
                          <div className="text-sm text-gray-500">
                            {medicine.times.join(', ')}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteMedicine(medicine.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Tips for Success</h3>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Set consistent times for medications</li>
                <li>• Enable browser notifications for reminders</li>
                <li>• Keep medicines in visible places</li>
                <li>• Use a pill organizer for weekly planning</li>
                <li>• Consult your doctor before changing dosages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
