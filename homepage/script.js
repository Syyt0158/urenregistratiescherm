document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn"),
          weekList = document.getElementById("week-list"),
          selectedWeek = document.getElementById("selected-week"),
          arrow = document.querySelector(".arrow"),
          dayHeaders = document.querySelectorAll("th"),
          inputFields = document.querySelectorAll('table input[type="number"]'),
          goToTodayBtn = document.getElementById("go-to-today"),
          prevWeekBtn = document.getElementById("prev-week"),
          nextWeekBtn = document.getElementById("next-week"),
          tableBody = document.querySelector("tbody");

    const currentDate = new Date();
    let currentMonday = getMondayOfWeek(currentDate);
    let currentWeek = getISOWeekNumber(currentDate);

    selectedWeek.textContent = `Week ${currentWeek}`;
    updateDayHeaders(getWeekDates(currentMonday));
    loadStoredData(currentWeek);
    updateGoToTodayButton();

    function getMondayOfWeek(date) {
        const day = date.getDay(), diff = (day === 0 ? -6 : 1) - day;
        return new Date(date.setDate(date.getDate() + diff));
    }

    function getWeekDates(monday) {
        return Array.from({ length: 7 }, (_, i) => new Date(monday).setDate(monday.getDate() + i));
    }

    function updateDayHeaders(weekDates) {
        const today = new Date().toDateString(); // Huidige datum

        dayHeaders.forEach((header, i) => {
            if (i > 0) {
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

    function getISOWeekNumber(date) {
        return Math.ceil((new Date(date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)) - new Date(date.getFullYear(), 0, 4).setDate(3 - (new Date(date.getFullYear(), 0, 4).getDay() + 6) % 7)) / 86400000 / 7);
    }

    function loadStoredData(weekNumber) {
        inputFields.forEach((input, i) => input.value = JSON.parse(localStorage.getItem(`week_${weekNumber}`))[i] || "");
    }

    function saveDataForWeek(weekNumber) {
        localStorage.setItem(`week_${weekNumber}`, JSON.stringify([...inputFields].map(input => +input.value || null)));
    }

    function updateGoToTodayButton() {
        const today = new Date();
        goToTodayBtn.textContent = getISOWeekNumber(today) === currentWeek ? today.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : currentMonday.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
    }

    for (let i = 1; i <= 52; i++) {
        const weekItem = document.createElement("li");
        let startDate = getMondayOfWeek(new Date(currentDate.getFullYear(), 0, 4 + (i - 1) * 7));
        let endDate = new Date(startDate).setDate(startDate.getDate() + 6);
        weekItem.textContent = `Week ${i} (${new Date(startDate).toLocaleDateString("nl-NL")} - ${new Date(endDate).toLocaleDateString("nl-NL")})`;
        weekItem.dataset.week = i;
        weekItem.addEventListener("click", function () {
            saveDataForWeek(currentWeek);
            currentWeek = +this.dataset.week;
            updateWeekView();
        });
        weekList.appendChild(weekItem);
    }

    dropdownBtn.addEventListener("click", () => (weekList.classList.toggle("show"), arrow.classList.toggle("rotate")));
    document.addEventListener("click", ({ target }) => target === dropdownBtn || (weekList.classList.remove("show"), arrow.classList.remove("rotate")));
    inputFields.forEach(input => input.addEventListener("input", () => saveDataForWeek(currentWeek)));
    
    goToTodayBtn.addEventListener("click", function () {
        saveDataForWeek(currentWeek);
        currentMonday = getMondayOfWeek(currentDate);
        currentWeek = getISOWeekNumber(currentDate);
        updateWeekView();
    });

    prevWeekBtn.addEventListener("click", () => (saveDataForWeek(currentWeek), currentWeek = Math.max(1, currentWeek - 1), updateWeekView()));
    nextWeekBtn.addEventListener("click", () => (saveDataForWeek(currentWeek), currentWeek = Math.min(52, currentWeek + 1), updateWeekView()));

    function updateWeekView() {
        selectedWeek.textContent = `Week ${currentWeek}`;
        currentMonday = getMondayOfWeek(new Date(currentDate.getFullYear(), 0, 4 + (currentWeek - 1) * 7));
        updateDayHeaders(getWeekDates(currentMonday));
        loadStoredData(currentWeek);
        updateGoToTodayButton();
    }

    const table = document.querySelector("table");
    if (table) {
        table.querySelector("thead tr").insertAdjacentHTML("beforeend", "<th>Tot.</th>");
        new MutationObserver(() => loadTotals()).observe(document.getElementById("selected-week"), { childList: true });
        loadTotals();
        document.addEventListener("DOMContentLoaded", loadTotals);
    }

    function loadTotals() {
        const weekData = JSON.parse(localStorage.getItem(`week_data_${selectedWeek.textContent.split(" ")[1]}`)) || {};
        document.querySelectorAll("tbody tr").forEach((row, i) => {
            row.dataset.index = i;
            row.querySelector(".total-hours") || row.insertAdjacentHTML("beforeend", '<td class="total-hours">0</td>');
            row.querySelector(".total-hours").textContent = weekData[i]?.total || 0;
            row.querySelectorAll('input[type="number"]').forEach((input, day) => input.value = weekData[i]?.hours?.[day] || "");
        });
    }

    function displayProjects(projects) {
        projects.forEach((projectData, index) => {
            const klant = projectData.path.find(item => item.type === 'customer');
            const project = projectData.path.find(item => item.type === 'project');
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="klant"><strong>${klant ? klant.name : 'Onbekend Klant'}</strong><br><span class="project">Project: ${project ? project.name : 'Onbekend Project'}</span></td>
                ${[...Array(7)].map((_, day) => `<td><input type="number" min="0" step="1" data-project="${index}" data-day="${day}" /></td>`).join('')}
                <td class="total-hours">0</td>
            `;
            tableBody.appendChild(row);
            row.querySelectorAll('input[type="number"]').forEach(input => input.addEventListener("input", () => updateTotal(row)));
        });
        loadTotals();
    }

    function updateTotal(row) {
        const total = [...row.querySelectorAll('input[type="number"]')].reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
        row.querySelector(".total-hours").textContent = total;
        const weekKey = `week_data_${selectedWeek.textContent.split(" ")[1]}`;
        const weekData = JSON.parse(localStorage.getItem(weekKey)) || {};
        weekData[row.dataset.index] = { total, hours: [...row.querySelectorAll('input[type="number"]')].map(input => input.value || "") };
        localStorage.setItem(weekKey, JSON.stringify(weekData));
    }

    fetch('https://selinay.clockwise.info/api/v2/hourregistration/projects/week/202512', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(data => displayProjects(data))
      .catch(error => console.error("Fetch error:", error));
});
