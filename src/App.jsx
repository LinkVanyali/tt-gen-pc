import React, { useState, useEffect } from 'react';
import { Download, Check } from 'lucide-react';

// Schedule definitions
const MONDAY_SCHEDULE = [
 { id: 'homeroom', name: 'Homerooms', startTime: '07:50', endTime: '08:30', duration: '40 min' },
 { id: 1, name: 'Lesson 1', startTime: '08:35', endTime: '09:10', duration: '35 min' },
 { id: 2, name: 'Lesson 2', startTime: '09:15', endTime: '09:50', duration: '35 min' },
 { id: 3, name: 'Lesson 3', startTime: '09:55', endTime: '10:30', duration: '35 min' },
 { id: 'utility', name: 'Meeting/Utility', startTime: '10:30', endTime: '10:55', duration: '25 min' },
 { id: 'break1', name: 'Break', startTime: '10:55', endTime: '11:15', duration: '20 min' },
 { id: 4, name: 'Lesson 4', startTime: '11:15', endTime: '11:55', duration: '35 min' },
 { id: 5, name: 'Lesson 5', startTime: '12:00', endTime: '12:35', duration: '35 min' },
 { id: 'break2', name: 'Break', startTime: '12:40', endTime: '13:10', duration: '30 min' },
 { id: 6, name: 'Lesson 6', startTime: '13:10', endTime: '13:50', duration: '40 min' },
 { id: 7, name: 'Lesson 7', startTime: '13:55', endTime: '14:35', duration: '40 min' }
];

const REGULAR_SCHEDULE = [
  { id: 1, name: 'Lesson 1', startTime: '07:50', endTime: '08:35', duration: '45 min' },
  { id: 2, name: 'Lesson 2', startTime: '08:40', endTime: '09:25', duration: '45 min' },
  { id: 3, name: 'Lesson 3', startTime: '09:30', endTime: '10:15', duration: '45 min' },
  { id: 'utility', name: 'Utility', startTime: '10:15', endTime: '10:45', duration: '30 min' },
  { id: 'break1', name: 'Break', startTime: '10:45', endTime: '11:05', duration: '20 min' },
  { id: 4, name: 'Lesson 4', startTime: '11:05', endTime: '11:50', duration: '45 min' },
  { id: 5, name: 'Lesson 5', startTime: '11:55', endTime: '12:35', duration: '40 min' },
  { id: 'break2', name: 'Break', startTime: '12:35', endTime: '13:05', duration: '30 min' },
  { id: 6, name: 'Lesson 6', startTime: '13:05', endTime: '13:45', duration: '40 min' },
  { id: 7, name: 'Lesson 7', startTime: '13:50', endTime: '14:35', duration: '45 min' },
];

const FRIDAY_SCHEDULE = [
  { id: 1, name: 'Lesson 1', startTime: '07:50', endTime: '08:25', duration: '35 min' },
  { id: 2, name: 'Lesson 2', startTime: '08:30', endTime: '09:05', duration: '35 min' },
  { id: 3, name: 'Lesson 3', startTime: '09:10', endTime: '09:45', duration: '35 min' },
  { id: 'break1', name: 'Break', startTime: '09:45', endTime: '10:15', duration: '30 min' },
  { id: 4, name: 'Lesson 4', startTime: '10:15', endTime: '10:55', duration: '35 min' },
  { id: 5, name: 'Lesson 5', startTime: '11:00', endTime: '11:35', duration: '35 min' },
  { id: 'break2', name: 'Break', startTime: '11:35', endTime: '12:05', duration: '30 min' },
  { id: 6, name: 'Lesson 6', startTime: '12:05', endTime: '12:40', duration: '35 min' },
  { id: 7, name: 'Lesson 7', startTime: '12:45', endTime: '13:20', duration: '35 min' },
  { id: 'assembly', name: 'Assembly', startTime: '13:20', endTime: '14:35', duration: '75 min' },
];

//create storage key for persistent data using localstorage
const STORAGE_KEY = 'savedSchedules';

//sets the sechedules below to the default schedules structure
const DEFAULT_SCHEDULES = {
  monday: MONDAY_SCHEDULE,
  friday: FRIDAY_SCHEDULE,
  regular: REGULAR_SCHEDULE
};

//function to actually sav data to localstorage
const saveToLocalStorage = (schedules) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

//function to actually save data to localstorage
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULES;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return DEFAULT_SCHEDULES;
  }
};

// Helper function to get schedule based on day and use local storage
const getScheduleForDate = (date) => {
  const schedules = loadFromLocalStorage();
  const dayOfWeek = new Date(date).getDay();
  
  if (dayOfWeek === 1) return schedules.monday;
  if (dayOfWeek === 5) return schedules.friday;
  return schedules.regular;
};

//function to update schedules in localstorage
const updateSchedule = (dayType, newSchedule) => {
  const currentSchedules = loadFromLocalStorage();
  const updatedSchedules = {
    ...currentSchedules,
    [dayType]: newSchedule
  };
  saveToLocalStorage(updatedSchedules);
};

// Helper function for formatting class names (add this outside the component)
const formatClassName = (input) => {
  // Split by spaces and capitalize each word
  return input
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

function App() {
  const [schedules, setSchedules] = useState(() => loadFromLocalStorage());
  const [saveStatus, setSaveStatus] = useState({ text: 'All changes saved', showTick: true });

  const [timetable, setTimetable] = useState(() => {
  const saved = localStorage.getItem('timetableTemplates');
  if (saved) {
    return JSON.parse(saved);
  }
  const days = {};
  for (let day = 1; day <= 7; day++) {
    days[day] = {};
    REGULAR_SCHEDULE.forEach(Lesson => {
      days[day][Lesson.id] = '';
    });
  }
  return days;
});

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [dateAssignments, setDateAssignments] = useState([]);

 useEffect(() => {
  localStorage.setItem('timetableTemplates', JSON.stringify(timetable));
  setSaveStatus({ text: 'Saving...', showTick: false });
  
  // Add a delay before showing "saved" status
  const saveTimer = setTimeout(() => {
    setSaveStatus({ text: 'All changes saved', showTick: true });
  }, 1000); // 1 second delay

  return () => clearTimeout(saveTimer); // Cleanup timeout
 }, [timetable]);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const generateWeekdays = (start, end) => {
    const dates = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);
    let currentDayNumber = 1;
    let currentWeek = [];
    let weekNumber = 1;

    // Adjust start date to Monday if it's not already
    const startDayOfWeek = currentDate.getDay();
    if (startDayOfWeek !== 1) {
      if (startDayOfWeek === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() - (startDayOfWeek - 1));
      }
    }

    while (currentDate <= endDate) {
      if (isWeekday(currentDate)) {
        const dayInfo = {
          date: currentDate.toISOString().split('T')[0],
          dayNumber: currentDayNumber,
          dayOfWeek: currentDate.getDay(),
          dayName: new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long' }),
          weekNumber: weekNumber
        };
        
        currentWeek.push(dayInfo);
        currentDayNumber = currentDayNumber === 7 ? 1 : currentDayNumber + 1;
        
        if (currentDate.getDay() === 5 || currentDate >= endDate) {
          if (currentWeek.length > 0) {
            dates.push(...currentWeek);
            currentWeek = [];
            weekNumber++;
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

// Event generation functions
  const handleDateRangeChange = (field, value) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);

    if (newRange.startDate && newRange.endDate) {
      const weekdays = generateWeekdays(newRange.startDate, newRange.endDate);
      setDateAssignments(weekdays);
    }
  };

const updateDayNumber = (index, dayNumber) => {
  const confirmed = window.confirm(
    'This will update the day numbers for all subsequent dates. Continue?'
  );
  
  if (confirmed) {
    setDateAssignments(prev => {
      const newAssignments = [...prev];
      newAssignments[index] = { ...newAssignments[index], dayNumber };
      
      // Only update subsequent days if not setting to "no schedule"
      if (dayNumber !== 0) {
        for (let i = index + 1; i < newAssignments.length; i++) {
          const nextDayNumber = newAssignments[i-1].dayNumber === 7 ? 1 : newAssignments[i-1].dayNumber + 1;
          newAssignments[i] = { ...newAssignments[i], dayNumber: nextDayNumber };
        }
      }
      return newAssignments;
    });
  }
};
  
const generateAndDownload = () => {
  let csvContent = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private\n';
  
  dateAssignments.forEach(assignment => {
    if (assignment.dayNumber === 0) return;
    
    const daySchedule = timetable[assignment.dayNumber];
    if (daySchedule) {
      addSessionToCSV({
        className: `Day ${assignment.dayNumber}`,
        date: assignment.date,
        startTime: '00:00',
        endTime: '23:59',
        description: `Day ${assignment.dayNumber}`,
        isAllDay: true
      });

      const schedule = getScheduleForDate(assignment.date);
      
      schedule.forEach(period => {
        let className = '';
        let description = '';

        if (typeof period.id === 'number') {
          className = daySchedule[period.id];
          description = `Session ${period.id}`;
        } else if (period.id === 'break1' || period.id === 'break2') {
          className = daySchedule[period.id] || 'Break';
          description = 'Break Time';
        } else if (period.id === 'utility') {
          className = daySchedule[period.id] || 'Meeting/Utility';
          description = 'Meeting/Utility Session';
        } else if (assignment.dayOfWeek === 1) {
          if (period.id === 'homeroom') {
            className = 'PD';
            description = 'Professional Development';
          } else if (period.id === 'meetings') {
            className = 'Meetings';
            description = 'Staff Meetings';
          }
        } else if (assignment.dayOfWeek === 5 && period.id === 'assembly') {
          className = 'Assembly';
          description = 'School Assembly';
        }

        if (className) {
          addSessionToCSV({
            className,
            date: assignment.date,
            startTime: period.startTime,
            endTime: period.endTime,
            description,
            isAllDay: false
          });
        }
      });
    }
  });

  function addSessionToCSV({ className, date, startTime, endTime, description, isAllDay }) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
    
    const formatTime = (time24h) => {
      const [hours, minutes] = time24h.split(':');
      const date = new Date(2000, 0, 1, hours, minutes);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    const row = [
      className,
      formattedDate,
      isAllDay ? '' : formatTime(startTime),
      formattedDate,
      isAllDay ? '' : formatTime(endTime),
      isAllDay ? 'TRUE' : 'FALSE',
      description,
      '',
      'FALSE'
    ].map(field => `"${field}"`).join(',');

    csvContent += row + '\n';
  }

  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school-timetable.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
  }
};
 
// Call this when you need to update a schedule
const handleScheduleUpdate = (dayType, newSchedule) => {
  setSchedules(prev => {
    const updated = {
      ...prev,
      [dayType]: newSchedule
    };
    saveToLocalStorage(updated);
    return updated;
  });
};

// Add this new function near your other handlers
const handleClearCalendar = () => {
  const confirmed = window.confirm(
    'This will clear all timetable entries. Are you sure you want to continue?'
  );
  
  if (confirmed) {
    // Create empty timetable structure
    const emptyTimetable = {};
    for (let day = 1; day <= 7; day++) {
      emptyTimetable[day] = {};
      REGULAR_SCHEDULE.forEach(Lesson => {
        emptyTimetable[day][Lesson.id] = '';
      });
    }
    
    // Reset states
    setTimetable(emptyTimetable);
    setDateRange({ startDate: '', endDate: '' });
    setDateAssignments([]);
  }
};

return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">School Timetable Generator</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                {saveStatus.text}
                {saveStatus.showTick && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
              <button
                onClick={handleClearCalendar}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Calendar
              </button>
            </div>
          </div>
          
          {/* Timetable Grid */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2">Lesson</th>
                  <th className="border border-gray-200 p-2">Time</th>
                  {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <th key={day} className="border border-gray-200 p-2">
                      Day {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REGULAR_SCHEDULE.map(Lesson => (
                  <tr key={Lesson.id} className={typeof Lesson.id === 'string' ? 'bg-gray-50' : ''}>
                    <td className="border border-gray-200 p-2 font-medium">{Lesson.name}</td>
                    <td className="border border-gray-200 p-2 text-sm">
                      {Lesson.startTime} - {Lesson.endTime}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <td key={`${day}-${Lesson.id}`} className="border border-gray-200 p-1">
                      <input
                        type="text"
                        value={timetable[day][Lesson.id] || ''}
                        onChange={(e) => {
                          const newTimetable = { ...timetable };
                          // Format and validate input
                          const formattedValue = formatClassName(e.target.value);
                          // Optional: Limit length to prevent overly long names
                          newTimetable[day][Lesson.id] = formattedValue.slice(0, 30);
                          setTimetable(newTimetable);
                        }}
                        onKeyDown={(e) => {
                          // Vertical navigation (existing)
                          if (e.key === 'Enter' || e.key === 'ArrowDown') {
                            const nextInput = e.target.closest('td').parentElement.nextElementSibling?.querySelector('input');
                            if (nextInput) {
                              nextInput.focus();
                              e.preventDefault();
                            }
                          } else if (e.key === 'ArrowUp') {
                            const prevInput = e.target.closest('td').parentElement.previousElementSibling?.querySelector('input');
                            if (prevInput) {
                              prevInput.focus();
                              e.preventDefault();
                            }
                          }
                          // Horizontal navigation (new)
                          else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                            const currentCell = e.target.closest('td');
                            const currentIndex = Array.from(currentCell.parentElement.children).indexOf(currentCell);
                            const targetIndex = e.key === 'ArrowLeft' ? currentIndex - 1 : currentIndex + 1;
                            
                            if (targetIndex >= 0 && targetIndex < 8) { // 8 is total columns (1 for lesson name + 7 days)
                              const nextInput = currentCell.parentElement.children[targetIndex].querySelector('input');
                              if (nextInput) {
                                nextInput.focus();
                                e.preventDefault();
                              }
                            }
                          }
                        }}
                        onBlur={(e) => {
                          // Clean up value on blur (remove extra spaces, etc)
                          const newTimetable = { ...timetable };
                          const cleanValue = formatClassName(e.target.value);
                          if (cleanValue !== e.target.value) {
                            newTimetable[day][Lesson.id] = cleanValue;
                            setTimetable(newTimetable);
                          }
                        }}
                        onPaste={(e) => {
                          // Handle pasted content
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const formattedText = formatClassName(pastedText);
                          const newTimetable = { ...timetable };
                          newTimetable[day][Lesson.id] = formattedText;
                          setTimetable(newTimetable);
                        }}
                        className="w-full p-1 border rounded 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          hover:bg-gray-50 transition-colors duration-150
                          invalid:border-red-500 invalid:ring-red-500"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength="30"
                        placeholder={`Day ${day}`}
                      />
                    </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Date Range Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
            </div>
          </div>

          {/* Date Assignments Table */}
          {dateAssignments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Date Assignments</h3>
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead className="sticky top-0 bg-white">
                    <tr>
                      <th className="border border-gray-200 p-2">Week</th>
                      <th className="border border-gray-200 p-2">Day</th>
                      <th className="border border-gray-200 p-2">Date</th>
                      <th className="border border-gray-200 p-2">Schedule Type</th>
                      <th className="border border-gray-200 p-2">Day Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateAssignments.map((assignment, index) => {
                      const isFirstInWeek = index === 0 || assignment.weekNumber !== dateAssignments[index - 1].weekNumber;
                      const scheduleType = assignment.dayOfWeek === 1 ? 'Monday' : 
                                         assignment.dayOfWeek === 5 ? 'Friday' : 'Regular';
                      
                      return (
                        <tr 
                          key={assignment.date}
                          className={`${isFirstInWeek ? 'border-t-4 border-gray-300' : ''}`}
                        >
                          <td className="border border-gray-200 p-2 text-center">
                            {isFirstInWeek ? `Week ${assignment.weekNumber}` : ''}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {assignment.dayName}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {new Date(assignment.date).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {scheduleType}
                          </td>
                          <td className="border border-gray-200 p-2">
                            <select
                              value={assignment.dayNumber}
                              onChange={(e) => updateDayNumber(index, parseInt(e.target.value))}
                              className="w-full p-1 border rounded"
                            >
                              <option value={0}>No Schedule</option>
                              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                <option key={day} value={day}>Day {day}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={generateAndDownload}
            className="mt-6 flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={dateAssignments.length === 0}
          >
            <Download size={20} />
            <span>Generate Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
