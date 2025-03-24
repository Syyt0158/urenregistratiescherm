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
    
    const currentDate = new Date();
    let currentMonday = getMondayOfWeek(currentDate);
    let currentWeek = getISOWeekNumber(currentDate);

    selectedWeek.textContent = `Week ${currentWeek}`;
    let weekDates = getWeekDates(currentMonday);
    updateDayHeaders(weekDates);
    loadStoredData(currentWeek);
    updateGoToTodayButton();

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
});

document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("table");
    if (!table) return;

    table.querySelector("thead tr").insertAdjacentHTML("beforeend", "<th>Tot.</th>");

    const getWeek = () => document.getElementById("selected-week").textContent.split(" ")[1];

    const updateTotal = (row) => {
        const total = [...row.querySelectorAll('input[type="number"]')]
            .reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
        row.querySelector(".total-hours").textContent = total;
        const totals = JSON.parse(localStorage.getItem(`totals_week_${getWeek()}`)) || {};
        totals[row.dataset.index] = total;
        localStorage.setItem(`totals_week_${getWeek()}`, JSON.stringify(totals));
    };

    const loadTotals = () => {
        const totals = JSON.parse(localStorage.getItem(`totals_week_${getWeek()}`)) || {};
        document.querySelectorAll("tbody tr").forEach((row, i) => {
            row.dataset.index = i;
            row.insertAdjacentHTML("beforeend", row.querySelector(".total-hours") ? "" : '<td class="total-hours">0</td>');
            row.querySelector(".total-hours").textContent = totals[i] || 0;
        });
    };

    document.querySelectorAll("tbody tr").forEach(row => {
        row.insertAdjacentHTML("beforeend", '<td class="total-hours">0</td>');
        row.querySelectorAll('input[type="number"]').forEach(input =>
            input.addEventListener("input", () => updateTotal(row))
        );
    });

    new MutationObserver(loadTotals).observe(document.getElementById("selected-week"), { childList: true });

    loadTotals();
    let projects = []
    const token = localStorage.getItem('token')
    const url = 'https://selinay.clockwise.info/api/v2/hourregistration/projects/week/202512'

    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } })
        .then((resp) => resp.json())
        .then((resp) => projects = resp)
});

