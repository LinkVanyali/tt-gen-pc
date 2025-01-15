import React, { useState } from 'react';
import { Download } from 'lucide-react';

// Schedule definitions
const MONDAY_SCHEDULE = [
  { id: 'homeroom', name: 'Homerooms', startTime: '07:50', endTime: '08:15', duration: '25 min' },
  { id: 'lines', name: 'Lines', startTime: '08:15', endTime: '08:30', duration: '15 min' },
  { id: 1, name: 'Period 1', startTime: '08:35', endTime: '09:10', duration: '35 min' },
  { id: 2, name: 'Period 2', startTime: '09:15', endTime: '09:50', duration: '35 min' },
  { id: 3, name: 'Period 3', startTime: '09:55', endTime: '10:30', duration: '35 min' },
  { id: 'meetings', name: 'Meetings', startTime: '10:30', endTime: '10:55', duration: '25 min' },
  { id: 'break1', name: 'Break', startTime: '10:55', endTime: '11:15', duration: '20 min' },
  { id: 4, name: 'Period 4', startTime: '11:15', endTime: '11:55', duration: '35 min' },
  { id: 5, name: 'Period 5', startTime: '12:00', endTime: '12:35', duration: '35 min' },
  { id: 'break2', name: 'Break', startTime: '12:40', endTime: '13:10', duration: '30 min' },
  { id: 6, name: 'Period 6', startTime: '13:10', endTime: '13:50', duration: '40 min' },
  { id: 7, name: 'Period 7', startTime: '13:55', endTime: '14:35', duration: '40 min' },
];

const REGULAR_SCHEDULE = [
  { id: 1, name: 'Period 1', startTime: '07:50', endTime: '08:35', duration: '45 min' },
  { id: 2, name: 'Period 2', startTime: '08:40', endTime: '09:25', duration: '45 min' },
  { id: 3, name: 'Period 3', startTime: '09:30', endTime: '10:15', duration: '45 min' },
  { id: 'utility', name: 'Utility', startTime: '10:15', endTime: '10:45', duration: '30 min' },
  { id: 'break1', name: 'Break', startTime: '10:45', endTime: '11:05', duration: '20 min' },
  { id: 4, name: 'Period 4', startTime: '11:05', endTime: '11:50', duration: '45 min' },
  { id: 5, name: 'Period 5', startTime: '11:55', endTime: '12:35', duration: '40 min' },
  { id: 'break2', name: 'Break', startTime: '12:35', endTime: '13:05', duration: '30 min' },
  { id: 6, name: 'Period 6', startTime: '13:05', endTime: '13:45', duration: '40 min' },
  { id: 7, name: 'Period 7', startTime: '13:50', endTime: '14:35', duration: '45 min' },
];

const FRIDAY_SCHEDULE = [
  { id: 1, name: 'Period 1', startTime: '07:50', endTime: '08:25', duration: '35 min' },
  { id: 2, name: 'Period 2', startTime: '08:30', endTime: '09:05', duration: '35 min' },
  { id: 3, name: 'Period 3', startTime: '09:10', endTime: '09:45', duration: '35 min' },
  { id: 'break1', name: 'Break', startTime: '09:45', endTime: '10:15', duration: '30 min' },
  { id: 4, name: 'Period 4', startTime: '10:15', endTime: '10:55', duration: '35 min' },
  { id: 5, name: 'Period 5', startTime: '11:00', endTime: '11:35', duration: '35 min' },
  { id: 'break2', name: 'Break', startTime: '11:35', endTime: '12:05', duration: '30 min' },
  { id: 6, name: 'Period 6', startTime: '12:05', endTime: '12:40', duration: '35 min' },
  { id: 7, name: 'Period 7', startTime: '12:45', endTime: '13:20', duration: '35 min' },
  { id: 'assembly', name: 'Assembly', startTime: '13:20', endTime: '14:35', duration: '75 min' },
];

// Helper function to get schedule based on day
const getScheduleForDate = (date) => {
  const dayOfWeek = new Date(date).getDay();
  if (dayOfWeek === 1) return MONDAY_SCHEDULE;
  if (dayOfWeek === 5) return FRIDAY_SCHEDULE;
  return REGULAR_SCHEDULE;
};

function App() {
  const [timetable, setTimetable] = useState(() => {
    const days = {};
    for (let day = 1; day <= 7; day++) {
      days[day] = {};
      REGULAR_SCHEDULE.forEach(period => {
        if (typeof period.id === 'number') {
          days[day][period.id] = 'Test Class ' + period.id;
        }
      });
    }
    return days;
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [dateAssignments, setDateAssignments] = useState([]);

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
    setDateAssignments(prev => prev.map((assignment, i) => 
      i === index ? { ...assignment, dayNumber } : assignment
    ));
  };

const generateICalEvent = (className, date, period) => {
  const eventDate = date.replace(/-/g, '');
  const startDateTime = `${eventDate}T${period.startTime.replace(':', '')}00`;
  const endDateTime = `${eventDate}T${period.endTime.replace(':', '')}00`;
  
  return `BEGIN:VEVENT\r\nUID: ${date}-${period.id}@schooltimetable\r\nDTSTAMP: ${new Date().toISOString().replace(/[-:.]/g, '').slice(0,15)}Z\r\nDTSTART: ${startDateTime}\r\nDTEND: ${endDateTime}\r\nSUMMARY: ${className}\r\nDESCRIPTION: Period ${period.id}\r\nEND:VEVENT`;
};

const generateAndDownload = () => {
  let csvContent = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private\n';
  
  dateAssignments.forEach(assignment => {
    const daySchedule = timetable[assignment.dayNumber];
    if (daySchedule) {
      const schedule = getScheduleForDate(assignment.date);
      schedule.forEach(period => {
        let className;
        if (assignment.dayOfWeek === 1 && period.id === 'homeroom') {
          className = 'Homerooms/PD';
        } else if (assignment.dayOfWeek === 1 && period.id === 'lines') {
          className = 'Lines';
        } else if (assignment.dayOfWeek === 5 && period.id === 'assembly') {
          className = 'Assembly';
        } else {
          className = typeof period.id === 'number' ? daySchedule[period.id] : '';
        }
        if ((className && typeof period.id === 'number') || 
            (assignment.dayOfWeek === 1 && (period.id === 'homeroom' || period.id === 'lines')) ||
            (assignment.dayOfWeek === 5 && period.id === 'assembly')) {
          // Format date as MM/DD/YYYY
          const formattedDate = new Date(assignment.date).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          });
          
          // Convert 24h time to 12h time with AM/PM
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
            className,                     // Subject
            formattedDate,                // Start Date
            formatTime(period.startTime),  // Start Time
            formattedDate,                // End Date
            formatTime(period.endTime),    // End Time
            'FALSE',                      // All Day Event
            `Period ${period.id}`,        // Description
            '',                           // Location
            'FALSE'                       // Private
          ].map(field => `"${field}"`).join(',');

          csvContent += row + '\n';
        }
      });
    }
  });

  try {
    console.log('Generated CSV content:', csvContent);
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

return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">School Timetable Generator</h2>
          
          {/* Timetable Grid */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2">Period</th>
                  <th className="border border-gray-200 p-2">Time</th>
                  {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <th key={day} className="border border-gray-200 p-2">
                      Day {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REGULAR_SCHEDULE.map(period => (
                  <tr key={period.id} className={typeof period.id === 'string' ? 'bg-gray-50' : ''}>
                    <td className="border border-gray-200 p-2 font-medium">{period.name}</td>
                    <td className="border border-gray-200 p-2 text-sm">
                      {period.startTime} - {period.endTime}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                      <td key={`${day}-${period.id}`} className="border border-gray-200 p-1">
                        <input
                          type="text"
                          value={typeof period.id === 'number' ? (timetable[day][period.id] || '') : ''}
                          onChange={(e) => {
                            if (typeof period.id === 'number') {
                              const newTimetable = { ...timetable };
                              newTimetable[day][period.id] = e.target.value;
                              setTimetable(newTimetable);
                            }
                          }}
                          className="w-full p-1 border rounded"
                          disabled={typeof period.id !== 'number'}
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
