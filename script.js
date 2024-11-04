const spreadsheetId = '1QYGF_esetbXCsp6MGJ0O0JKulOidUY_OEsk5hidbfX0';
const apiKey = 'AIzaSyAsdBjMsZGM-NJ0g1N9DotI9NVJ37Ok4FA';
const range = 'Sheet1!A1:G';

async function fetchData() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`);
        const data = await response.json();

        return data.values || [];
    } catch (error) {
        console.error('Помилка:', error);
    }
}
document.getElementById('to-main-page').onclick = () => {
    window.location.href = 'index.html';
    setActiveButton('main');
};

document.getElementById('to-teacher-page').onclick = () => {
    window.location.href = 'teacher.html';
    setActiveButton('teacher');
};

function setActiveButton(activePage) {
    const mainButton = document.getElementById('to-main-page');
    const teacherButton = document.getElementById('to-teacher-page');

    if (activePage === 'main') {
        mainButton.classList.remove('inactive');
        teacherButton.classList.add('inactive');
    } else {
        teacherButton.classList.remove('inactive');
        mainButton.classList.add('inactive');
    }
}

window.onload = () => {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html') {
        setActiveButton('main');
    } else if (currentPage === 'teacher.html') {
        setActiveButton('teacher');
    }
};

function populateGroups(data) {
    const groupSelect = document.getElementById('group');
    const groups = [...new Set(data.map(row => row[1]))];
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
}

function populateTeachers(data) {
    const teacherSelect = document.getElementById('teacher');
    const teachers = [...new Set(data.map(row => row[5]))];
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher;
        option.textContent = teacher;
        teacherSelect.appendChild(option);
    });
}

function filterByDateAndGroup(data, group, date) {
    const dateParts = date.split('-');
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

    return data.filter(row => {
        const rowDate = row[0];
        const rowGroup = row[1];
        return rowGroup === group && rowDate === formattedDate;
    });
}
function filterByTeacherAndDate(data, teacher, date) {
    const dateParts = date.split('-');
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

    return data.filter(row => {
        const rowDate = row[0]; // Предполагается, что дата находится в первом столбце
        const rowTeacher = row[5]; // Предполагается, что фамилия преподавателя находится в шестом столбце
        return rowTeacher === teacher && rowDate === formattedDate;
    });
}

function filterByTeacher(data, teacher) {
    return data.filter(row => row[5] === teacher);
}

function displayData(rows, containerId) {
    const dataDiv = document.getElementById(containerId);
    dataDiv.innerHTML = '';

    if (rows.length > 0) {
        const table = document.createElement('table');
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        dataDiv.appendChild(table);
    } else {
        dataDiv.textContent = 'Немає данних для відображення';
    }
}

window.onload = async () => {
    const data = await fetchData();

    // Проверка на текущую страницу
    if (document.getElementById('group')) {
        populateGroups(data);

        document.getElementById('search').onclick = () => {
            const group = document.getElementById('group').value;
            const date = document.getElementById('date').value;
            const filteredData = filterByDateAndGroup(data, group, date);
            displayData(filteredData, 'data');
        };

        document.getElementById('to-teacher-page').onclick = () => {
            window.location.href = 'teacher.html';
        };
    }

    if (document.getElementById('teacher')) {
        populateTeachers(data);

        document.getElementById('search-teacher').onclick = () => {
            const teacher = document.getElementById('teacher').value;
            const date = document.getElementById('teacher-date').value;

            if (teacher && date) {
                const filteredData = filterByTeacherAndDate(data, teacher, date);
                displayData(filteredData, 'teacher-data');
            } else {
                alert("Будь ласка, виберіть як викладача, так і дату.");
            }
        };

        document.getElementById('to-main-page').onclick = () => {
            window.location.href = 'index.html';
        };
    }
};
