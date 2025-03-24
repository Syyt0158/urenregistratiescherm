document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const weekList = document.getElementById("week-list");
    const selectedWeek = document.getElementById("selected-week");
    const arrow = document.querySelector(".arrow");
    const dayHeaders = document.querySelectorAll("th");
    const inputFields = document.querySelectorAll('table input[type="number"]');
    const goToTodayBtn = document.getElementById("go-to-today");
    const prevWeekBtn = document.getElementById("prev-week");
    const nextWeekBtn = document.getElementById("next-week");
    const tableBody = document.querySelector("tbody");

    const currentDate = new Date();
    let currentMonday = getMondayOfWeek(currentDate);
    let currentWeek = getISOWeekNumber(currentDate);

    selectedWeek.textContent = `Week ${currentWeek}`;
    let weekDates = getWeekDates(currentMonday);
    updateDayHeaders(weekDates);
    loadStoredData(currentWeek);
    updateGoToTodayButton();

    // Helper functions
    function getMondayOfWeek(date) {
        const day = date.getDay();
        const diff = (day === 0 ? -6 : 1) - day;
        const monday = new Date(date);
        monday.setDate(date.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    }

    function getWeekDates(monday) {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
    }

    function updateDayHeaders(weekDates) {
        dayHeaders.forEach((header, index) => {
            if (index > 0) {
                const date = weekDates[index - 1];
                const today = new Date();
                header.innerHTML = `${date.getDate()}<br>${["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"][index - 1]}`;
                header.classList.toggle("current-day", date.toDateString() === today.toDateString());
            }
        });
    }

    function getISOWeekNumber(date) {
        const tempDate = new Date(date);
        tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
        const firstThursday = new Date(tempDate.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() + 3 - (firstThursday.getDay() + 6) % 7);
        return Math.ceil(((tempDate - firstThursday) / 86400000 + 1) / 7);
    }

    function loadStoredData(weekNumber) {
        const savedData = JSON.parse(localStorage.getItem(`week_${weekNumber}`)) || [];
        inputFields.forEach((input, index) => {
            input.value = savedData[index] !== undefined ? savedData[index] : "";
        });
    }

    function saveDataForWeek(weekNumber) {
        const hoursData = Array.from(inputFields).map(input => input.value ? parseInt(input.value) : null);
        localStorage.setItem(`week_${weekNumber}`, JSON.stringify(hoursData));
    }

    function updateGoToTodayButton() {
        const today = new Date();
        if (getISOWeekNumber(today) === currentWeek) {
            goToTodayBtn.textContent = today.toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        } else {
            goToTodayBtn.textContent = currentMonday.toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }
    }

    // Week dropdown logic
    for (let i = 1; i <= 52; i++) {
        let weekItem = document.createElement("li");
        let startDate = getMondayOfWeek(new Date(currentDate.getFullYear(), 0, 4 + (i - 1) * 7));
        let endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        weekItem.textContent = `Week ${i} (${startDate.toLocaleDateString("nl-NL")} - ${endDate.toLocaleDateString("nl-NL")})`;
        weekItem.dataset.week = i;

        weekItem.addEventListener("click", function () {
            saveDataForWeek(currentWeek);
            currentWeek = parseInt(this.dataset.week);
            updateWeekView();
        });
        weekList.appendChild(weekItem);
    }

    dropdownBtn.addEventListener("click", function () {
        weekList.classList.toggle("show");
        arrow.classList.toggle("rotate");
    });

    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target)) {
            weekList.classList.remove("show");
            arrow.classList.remove("rotate");
        }
    });

    inputFields.forEach(input => {
        input.addEventListener("input", function () {
            saveDataForWeek(currentWeek);
        });
    });

    goToTodayBtn.addEventListener("click", function () {
        saveDataForWeek(currentWeek);
        currentMonday = getMondayOfWeek(currentDate);
        currentWeek = getISOWeekNumber(currentDate);
        updateWeekView();
    });

    prevWeekBtn.addEventListener("click", function () {
        saveDataForWeek(currentWeek);
        currentWeek = Math.max(1, currentWeek - 1);
        updateWeekView();
    });

    nextWeekBtn.addEventListener("click", function () {
        saveDataForWeek(currentWeek);
        currentWeek = Math.min(52, currentWeek + 1);
        updateWeekView();
    });

    function updateWeekView() {
        selectedWeek.textContent = `Week ${currentWeek}`;
        currentMonday = getMondayOfWeek(new Date(currentDate.getFullYear(), 0, 4 + (currentWeek - 1) * 7));
        weekDates = getWeekDates(currentMonday);
        updateDayHeaders(weekDates);
        loadStoredData(currentWeek);
        updateGoToTodayButton();
    }

    // Total column logic
    const table = document.querySelector("table");
    if (table) {
        table.querySelector("thead tr").insertAdjacentHTML("beforeend", "<th>Tot.</th>");

        const getWeek = () => document.getElementById("selected-week").textContent.split(" ")[1];

        function updateTotal(row) {
            const total = [...row.querySelectorAll('input[type="number"]')]
                .reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
            row.querySelector(".total-hours").textContent = total;
        
            // Sla de totalen en individuele uren correct op in localStorage
            const weekKey = `week_data_${getWeek()}`;
            const weekData = JSON.parse(localStorage.getItem(weekKey)) || {};
            const rowIndex = row.dataset.index;
            
            weekData[rowIndex] = {
                total: total,
                hours: [...row.querySelectorAll('input[type="number"]')].map(input => input.value || "")
            };
        
            localStorage.setItem(weekKey, JSON.stringify(weekData));
        }
        
        function updateTotal(row) {
            const total = [...row.querySelectorAll('input[type="number"]')]
                .reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
            row.querySelector(".total-hours").textContent = total;
        
            // Sla de totalen en individuele uren correct op in localStorage
            const weekKey = `week_data_${getWeek()}`;
            const weekData = JSON.parse(localStorage.getItem(weekKey)) || {};
            const rowIndex = row.dataset.index;
            
            weekData[rowIndex] = {
                total: total,
                hours: [...row.querySelectorAll('input[type="number"]')].map(input => input.value || "")
            };
        
            localStorage.setItem(weekKey, JSON.stringify(weekData));
        }
        
        function loadTotals() {
            const weekKey = `week_data_${getWeek()}`;
            const weekData = JSON.parse(localStorage.getItem(weekKey)) || {};
            document.querySelectorAll("tbody tr").forEach((row, i) => {
                row.dataset.index = i;
                if (!row.querySelector(".total-hours")) {
                    row.insertAdjacentHTML("beforeend", '<td class="total-hours">0</td>');
                }
                row.querySelector(".total-hours").textContent = weekData[i]?.total || 0;
                
                // Herstel ingevoerde uren per dag
                row.querySelectorAll('input[type="number"]').forEach((input, day) => {
                    input.value = weekData[i]?.hours?.[day] || "";
                });
            });
        }
        
        function resetTable() {
            document.querySelectorAll("tbody tr").forEach(row => {
                row.querySelectorAll('input[type="number"]').forEach(input => input.value = "");
                row.querySelector(".total-hours").textContent = "0";
            });
        }
        
        function displayProjects(projects) {
            projects.forEach((projectData, index) => {
                const path = projectData.path || [];
                const row = document.createElement("tr");
                const klant = path.find(item => item.type === 'customer');
                const project = path.find(item => item.type === 'project');
        
                row.innerHTML = `
                    <td class="klant"><strong>${klant ? klant.name : 'Onbekend Klant'}</strong><br><span class="project">Project: ${project ? project.name : 'Onbekend Project'}</span></td>
                    ${[...Array(7)].map((_, day) => `<td><input type="number" min="0" step="1" data-project="${index}" data-day="${day}" /></td>`).join('')}
                    <td class="total-hours">0</td>
                `;
        
                tableBody.appendChild(row);
        
                // Voeg event listeners toe voor de inputs om totalen direct bij te werken
                row.querySelectorAll('input[type="number"]').forEach(input =>
                    input.addEventListener("input", () => updateTotal(row))
                );
            });
        
            // Zorg ervoor dat alle rijen correct worden geladen, inclusief de onderste rij
            loadTotals();
        }
        
        // Zorg ervoor dat de gegevens correct worden geladen bij het wisselen van weken
        new MutationObserver(() => {
            loadTotals();
        }).observe(document.getElementById("selected-week"), { childList: true });
        
        document.addEventListener("DOMContentLoaded", () => {
            loadTotals();
        });
        
    }

    // Fetch API logic (voor projectdata)
    let projects = [];
    const token = localStorage.getItem('token');
    const url = 'https://selinay.clockwise.info/api/v2/hourregistration/projects/week/202512';

    if (token) {
        console.log("Fetching data from API...");

        fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("API Response:", data);
                projects = data;
                
                // Toon de projecten op de pagina
                displayProjects(projects);  // Functie aanroepen om de projecten weer te geven
            })
            .catch((error) => console.error("Fetch error:", error));
    } else {
        console.log("No token found");
    }

    // Functie om de projecten in de HTML weer te geven
    function displayProjects(projects) {
        projects.forEach((projectData, index) => {
            const path = projectData.path || [];

            // Voeg klanten en projecten toe aan de lijst op basis van hun niveau
            const row = document.createElement("tr");
            const klant = path.find(item => item.type === 'customer');
            const project = path.find(item => item.type === 'project');

            row.innerHTML = `
                <td class="klant"><strong>${klant ? klant.name : 'Onbekend Klant'}</strong><br><span class="project">Project: ${project ? project.name : 'Onbekend Project'}</span></td>
                <td><input type="number" min="0" step="1" data-project="${index}" data-day="0" /></td>
                <td><input type="number" min="0" step="1" data-project="${index}" data-day="1" /></td>
                <td><input type="number" min="0" step="1" data-project="${index}" data-day="2" /></td>
                <td><input type="number" min="0" step="1" data-project="${index}" data-day="3" /></td>
                <td><input type="number" min="0" step="1" data-project="${index}" data-day="4" /></td>
                <td><input type="number" min="0" step="1" data-project="${index}" data-day="5" /></td>
                <td><input type="number" min="0" step="1" data-project="${index}" data-day="6" /></td>
                <td class="total-hours">0</td>
            `;

            tableBody.appendChild(row);
        });
    }
});
