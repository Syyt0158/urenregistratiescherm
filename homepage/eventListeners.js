import { updateWeekView, getMondayOfWeek, getISOWeekNumber, loadStoredData, saveDataForWeek, updateGoToTodayButton, loadTotals } from './weekNavigation.js';
import { displayProjects, updateTotal } from './projectDisplay.js';

document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn"),
          weekList = document.getElementById("week-list"),
          selectedWeek = document.getElementById("selected-week"),
          arrow = document.querySelector(".arrow"),
          inputFields = document.querySelectorAll('table input[type="number"]'),
          goToTodayBtn = document.getElementById("go-to-today"),
          prevWeekBtn = document.getElementById("prev-week"),
          nextWeekBtn = document.getElementById("next-week"),
          tableBody = document.querySelector("tbody");

    const currentDate = new Date();
    let currentMonday = getMondayOfWeek(currentDate);
    let currentWeek = getISOWeekNumber(currentDate);

    selectedWeek.textContent = `Week ${currentWeek}`;
    updateWeekView(currentWeek, currentMonday, selectedWeek, inputFields, goToTodayBtn);

    // Handling week selection
    for (let i = 1; i <= 52; i++) {
        const weekItem = document.createElement("li");
        let startDate = getMondayOfWeek(new Date(currentDate.getFullYear(), 0, 4 + (i - 1) * 7));
        let endDate = new Date(startDate).setDate(startDate.getDate() + 6);
        weekItem.textContent = `Week ${i} (${new Date(startDate).toLocaleDateString("nl-NL")} - ${new Date(endDate).toLocaleDateString("nl-NL")})`;
        weekItem.dataset.week = i;
        weekItem.addEventListener("click", function () {
            saveDataForWeek(currentWeek, inputFields);
            currentWeek = +this.dataset.week;
            updateWeekView(currentWeek, currentMonday, selectedWeek, inputFields, goToTodayBtn);

            // **Sluit dropdown automatisch**
            weekList.classList.remove("show");
            arrow.classList.remove("rotate");
        });
        weekList.appendChild(weekItem);
    }

    // Dropdown button functionality
    dropdownBtn.addEventListener("click", () => {
        weekList.classList.toggle("show");
        arrow.classList.toggle("rotate");
    });

    // Close dropdown when clicking outside of it
    document.addEventListener("click", ({ target }) => {
        if (!dropdownBtn.contains(target) && !weekList.contains(target)) {
            weekList.classList.remove("show");
            arrow.classList.remove("rotate");
        }
    });

    // Input fields event to save data
    inputFields.forEach(input => input.addEventListener("input", () => saveDataForWeek(currentWeek, inputFields)));

    // "Go to Today" button event
    goToTodayBtn.addEventListener("click", function () {
        saveDataForWeek(currentWeek, inputFields);
        currentMonday = getMondayOfWeek(currentDate);
        currentWeek = getISOWeekNumber(currentDate);
        updateWeekView(currentWeek, currentMonday, selectedWeek, inputFields, goToTodayBtn);
    });

    // Navigation buttons for week change
    prevWeekBtn.addEventListener("click", () => {
        saveDataForWeek(currentWeek, inputFields);
        currentWeek = Math.max(1, currentWeek - 1);
        updateWeekView(currentWeek, currentMonday, selectedWeek, inputFields, goToTodayBtn);
    });

    nextWeekBtn.addEventListener("click", () => {
        saveDataForWeek(currentWeek, inputFields);
        currentWeek = Math.min(52, currentWeek + 1);
        updateWeekView(currentWeek, currentMonday, selectedWeek, inputFields, goToTodayBtn);
    });

    // Fetch and display projects
    fetch('https://selinay.clockwise.info/api/v2/hourregistration/projects/week/202512', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(data => displayProjects(data, tableBody))
      .catch(error => console.error("Fetch error:", error));

    // Table and total hours
    const table = document.querySelector("table");
    if (table) {
        table.querySelector("thead tr").insertAdjacentHTML("beforeend", "<th>Tot.</th>");
        new MutationObserver(() => loadTotals(selectedWeek)).observe(document.getElementById("selected-week"), { childList: true });
        loadTotals(selectedWeek);
        document.addEventListener("DOMContentLoaded", () => loadTotals(selectedWeek));
    }
});