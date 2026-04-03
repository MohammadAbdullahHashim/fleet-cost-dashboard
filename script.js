// --- Static Fleet Data (5-10 vehicles) ---
const vehicles = [
    { id: 1, model: "Tesla Model 3", battery: 78, status: "Available" },
    { id: 2, model: "Nissan Leaf", battery: 42, status: "Charging" },
    { id: 3, model: "Ford Mustang Mach-E", battery: 95, status: "On Trip" },
    { id: 4, model: "Chevrolet Bolt EV", battery: 23, status: "Charging" },
    { id: 5, model: "Audi e-tron", battery: 61, status: "Available" },
    { id: 6, model: "Hyundai Kona Electric", battery: 87, status: "Available" },
    { id: 7, model: "BMW i3", battery: 34, status: "Charging" },
    { id: 8, model: "Volkswagen ID.4", battery: 52, status: "On Trip" }
];

// --- Helper function to render fleet overview ---
function renderFleet() {
    const container = document.getElementById('vehicle-list');
    if (!container) return;

    container.innerHTML = '';
    vehicles.forEach(vehicle => {
        // Normalize status for CSS class (replace spaces with hyphen)
        const statusClass = vehicle.status.replace(/\s+/g, '-');
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <h3>${vehicle.model}</h3>
            <p><strong>ID:</strong> ${vehicle.id}</p>
            <p><strong>Battery:</strong> ${vehicle.battery}%</p>
            <p><strong>Status:</strong> <span class="status ${statusClass}">${vehicle.status}</span></p>
        `;
        container.appendChild(card);
    });
}

// --- Helper function to populate vehicle dropdown ---
function populateVehicleDropdown() {
    const select = document.getElementById('vehicle-select');
    if (!select) return;

    // Clear existing options except the first placeholder
    while (select.options.length > 1) {
        select.remove(1);
    }

    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.model} (ID: ${vehicle.id})`;
        select.appendChild(option);
    });
}

// --- Cost calculation function (pure, testable) ---
function calculateCost(hours) {
    // Input validation: must be a non-negative number
    const parsed = parseFloat(hours);
    if (isNaN(parsed) || parsed < 0) {
        return null; // Indicates invalid input
    }
    const POWER_RATE_KW = 7.5;
    const COST_PER_KWH = 0.15;
    const totalCost = parsed * POWER_RATE_KW * COST_PER_KWH;
    return parseFloat(totalCost.toFixed(2));
}

// --- Event handler for the calculator form ---
function handleCostCalculation(event) {
    event.preventDefault();

    const vehicleSelect = document.getElementById('vehicle-select');
    const hoursInput = document.getElementById('charging-hours');
    const resultDiv = document.getElementById('cost-result');

    const selectedVehicleId = parseInt(vehicleSelect.value);
    const hours = hoursInput.value;

    // Validate vehicle selection
    if (isNaN(selectedVehicleId)) {
        resultDiv.textContent = 'Please select a vehicle.';
        resultDiv.className = 'cost-result error';
        return;
    }

    // Validate hours input via the calculation function
    const cost = calculateCost(hours);
    if (cost === null) {
        resultDiv.textContent = 'Please enter a valid number of hours (non-negative).';
        resultDiv.className = 'cost-result error';
        return;
    }

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    resultDiv.textContent = `Estimated cost to charge ${selectedVehicle.model} for ${hours} hour(s): $${cost}`;
    resultDiv.className = 'cost-result success';
}

// --- Initialization when DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    renderFleet();
    populateVehicleDropdown();

    const form = document.getElementById('cost-form');
    if (form) {
        form.addEventListener('submit', handleCostCalculation);
    }
});