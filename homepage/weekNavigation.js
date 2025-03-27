export function getMondayOfWeek(date) {
    const day = date.getDay(), diff = (day === 0 ? -6 : 1) - day;
    return new Date(date.setDate(date.getDate() + diff));
}

export function getWeekDates(monday) {
    return Array.from({ length: 7 }, (_, i) => new Date(monday).setDate(monday.getDate() + i));
}

export function updateDayHeaders(weekDates) {
    const today = new Date().toDateString(); // Huidige datum
    const dayHeaders = document.querySelectorAll("th");

    dayHeaders.forEach((header, i) => {
        if (i > 0 && i < 8) {
            const date = new Date(weekDates[i - 1]); // De datum van de dag in de week
            const dayOfWeek = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"][i - 1];
            header.innerHTML = `${date.getDate()}<br>${dayOfWeek}`;

            // Markeer de huidige dag
            if (date.toDateString() === today) {
                header.classList.add("current-day");
            } else {
                header.classList.remove("current-day");
            }
        }
    });
}

export function getISOWeekNumber(date) {
    return Math.ceil((new Date(date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)) - new Date(date.getFullYear(), 0, 4).setDate(3 - (new Date(date.getFullYear(), 0, 4).getDay() + 6) % 7)) / 86400000 / 7);
}

export function loadStoredData(weekNumber) {
    const storedData = localStorage.getItem(`week_${weekNumber}`);
    if (!storedData) return; // Stop als er geen data is

    const inputFields = document.querySelectorAll('table input[type="number"]');
    const parsedData = JSON.parse(storedData) || []; // Zorgt ervoor dat het geen null is

    inputFields.forEach((input, i) => {
        input.value = parsedData[i] ?? ""; // Gebruik ?? om null/undefined te vermijden
    });
}


export function saveDataForWeek(weekNumber, inputFields) {
    localStorage.setItem(`week_${weekNumber}`, JSON.stringify([...inputFields].map(input => +input.value || null)));
}

export function updateGoToTodayButton() {
    const today = new Date();
    const goToTodayBtn = document.getElementById("go-to-today");
    goToTodayBtn.textContent = today.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export function updateWeekView(currentWeek, currentMonday, selectedWeek, inputFields, goToTodayBtn) {
    selectedWeek.textContent = `Week ${currentWeek}`;
    currentMonday = getMondayOfWeek(new Date(new Date().getFullYear(), 0, 4 + (currentWeek - 1) * 7));
    updateDayHeaders(getWeekDates(currentMonday));
    loadStoredData(currentWeek);
    updateGoToTodayButton();
    loadTotals(selectedWeek);
}
    
export function loadTotals(selectedWeek) {
    const weekData = JSON.parse(localStorage.getItem(`week_data_${selectedWeek.textContent.split(" ")[1]}`)) || {};
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row, i) => {
        row.dataset.index = i;
        // row.querySelector(".total-hours") || row.insertAdjacentHTML("beforeend", '<td class="total-hours">0</td>');
        row.querySelector(".total-hours").textContent = weekData[i]?.total || 0;
        row.querySelectorAll('input[type="number"]').forEach((input, day) => input.value = weekData[i]?.hours?.[day] || "");
    });
}