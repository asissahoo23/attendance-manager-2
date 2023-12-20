let subjects = [];
let attendanceData = {};

document.addEventListener('DOMContentLoaded', () => {
    subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

    updateSubjectList();
    updateSummaryList();
});

function addSubject() {
    const subjectInput = document.getElementById('subjectInput');
    const subject = subjectInput.value.trim();

    if (subject === '') {
        alert('Please enter a subject.');
        return;
    }

    subjects.push(subject);
    localStorage.setItem('subjects', JSON.stringify(subjects));

    updateSubjectList();
    subjectInput.value = '';
}

function markAttendance() {
    const attendanceDate = document.getElementById('attendanceDate').value;

    if (!attendanceDate) {
        alert('Please select a date.');
        return;
    }

    for (const subject of subjects) {
        const hasClasses = confirm(`Do you have classes for ${subject} on ${attendanceDate}?`);

        if (hasClasses) {
            const totalClasses = prompt(`How many classes do you have for ${subject} on ${attendanceDate}?`);
            
            if (!isNaN(totalClasses) && totalClasses !== null) {
                const attendedClasses = prompt(`How many classes did you attend for ${subject} on ${attendanceDate}?`);
                
                if (!isNaN(attendedClasses) && attendedClasses !== null) {
                    attendanceData[subject] = attendanceData[subject] || {};
                    attendanceData[subject][attendanceDate] = {
                        total: parseInt(totalClasses, 10),
                        attended: parseInt(attendedClasses, 10),
                    };
                }
            }
        }
    }

    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

    updateSummaryList();
}

function updateSubjectList() {
    const subjectListDiv = document.getElementById('subjectList');
    subjectListDiv.innerHTML = '<strong>Subjects:</strong><br>';

    subjects.forEach(subject => {
        subjectListDiv.innerHTML += `- ${subject}<br>`;
    });
}

function updateSummaryList() {
    const summaryListDiv = document.getElementById('summaryList');
    summaryListDiv.innerHTML = '<strong>Attendance Summary:</strong><br>';

    subjects.forEach(subject => {
        const totalClasses = calculateTotalClasses(subject);
        const percentAttendance = calculatePercentAttendance(subject);

        summaryListDiv.innerHTML += `- ${subject}: ${percentAttendance}% (${totalClasses.total} TOTAL CLASSES AND ATTENDED CLASSES IS ${totalClasses.attended})<br>`;
    });
}

function calculateTotalClasses(subject) {
    const subjectAttendance = attendanceData[subject] || {};
    const total = Object.values(subjectAttendance).reduce((total, attendance) => total + attendance.total, 0);
    const attended = Object.values(subjectAttendance).reduce((total, attendance) => total + attendance.attended, 0);

    return { total, attended };
}

function calculatePercentAttendance(subject) {
    const totalPossibleClasses = subjects.length; // Assuming 1 class per day per subject
    const totalClasses = calculateTotalClasses(subject);
    return ((totalClasses.attended / totalClasses.total) * 100).toFixed(2);
}
