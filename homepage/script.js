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
        let newMonday = getMondayOfWeek(new Date(currentDate.getFullYear(), 0, 4 + (currentWeek - 1) * 7));
        weekDates = getWeekDates(newMonday);
        updateDayHeaders(weekDates);
        loadStoredData(currentWeek);
    }
});
