import { loadTotals } from './weekNavigation.js';

export function displayProjects(projects, tableBody) {
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
    loadTotals(document.getElementById("selected-week"));
}

export function updateTotal(row) {
    const total = [...row.querySelectorAll('input[type="number"]')].reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
    row.querySelector(".total-hours").textContent = total;
    const weekKey = `week_data_${document.getElementById("selected-week").textContent.split(" ")[1]}`;
    const weekData = JSON.parse(localStorage.getItem(weekKey)) || {};
    weekData[row.dataset.index] = { total, hours: [...row.querySelectorAll('input[type="number"]')].map(input => input.value || "") };
    localStorage.setItem(weekKey, JSON.stringify(weekData));
}