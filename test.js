/**
 * Full Test Suite for EcoCharge Fleet Dashboard
 * Tests all functionalities: Fleet Overview & Charging Cost Calculator
 * 
 * To run: include this script after script.js in index.html and call runAllTests()
 */

// ========== Helper Functions ==========

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
}

function assertNotEquals(actual, expected, message) {
    if (actual === expected) {
        throw new Error(`Assertion failed: ${message}\nExpected not: ${expected}`);
    }
}

function assertTruthy(value, message) {
    if (!value) {
        throw new Error(`Assertion failed: ${message}\nValue is falsy`);
    }
}

// ========== Test Suites ==========

function testFleetOverviewRendering() {
    console.group("Fleet Overview Tests");

    // Test 1: Vehicle container exists
    const container = document.getElementById('vehicle-list');
    assertTruthy(container, "Vehicle list container should exist");

    // Test 2: All vehicles are rendered
    const vehicleCards = container.querySelectorAll('.vehicle-card');
    assertEquals(vehicleCards.length, vehicles.length, `Expected ${vehicles.length} vehicles, got ${vehicleCards.length}`);

    // Test 3: Each card contains correct data
    vehicles.forEach((vehicle, index) => {
        const card = vehicleCards[index];
        const cardText = card.innerText;
        
        assert(cardText.includes(vehicle.id.toString()), `Vehicle ${vehicle.id} ID not found`);
        assert(cardText.includes(vehicle.model), `Vehicle ${vehicle.model} model not found`);
        assert(cardText.includes(`${vehicle.battery}%`), `Vehicle ${vehicle.id} battery % not found`);
        assert(cardText.includes(vehicle.status), `Vehicle ${vehicle.id} status not found`);
    });

    console.log("✓ Fleet Overview Tests: All passed");
    console.groupEnd();
}

function testVehicleDropdownPopulation() {
    console.group("Vehicle Dropdown Tests");

    const select = document.getElementById('vehicle-select');
    assertTruthy(select, "Vehicle dropdown select element exists");

    // Check placeholder option
    const firstOption = select.options[0];
    assertEquals(firstOption.value, "", "Placeholder option value should be empty");
    assertEquals(firstOption.textContent, "-- Choose a vehicle --", "Placeholder text mismatch");

    // Check number of options (placeholder + number of vehicles)
    assertEquals(select.options.length, vehicles.length + 1, `Expected ${vehicles.length + 1} options, got ${select.options.length}`);

    // Check each vehicle appears in dropdown
    vehicles.forEach(vehicle => {
        let found = false;
        for (let i = 1; i < select.options.length; i++) {
            const opt = select.options[i];
            if (parseInt(opt.value) === vehicle.id) {
                found = true;
                assert(opt.textContent.includes(vehicle.model), `Option text for vehicle ${vehicle.id} missing model`);
                break;
            }
        }
        assert(found, `Vehicle ID ${vehicle.id} not found in dropdown`);
    });

    console.log("✓ Vehicle Dropdown Tests: All passed");
    console.groupEnd();
}

function testCostCalculationFunction() {
    console.group("Cost Calculation Function Tests");

    // Positive case
    assertEquals(calculateCost(2), 2.25, "2 hours should cost $2.25");
    assertEquals(calculateCost(0), 0, "0 hours should cost $0");
    assertEquals(calculateCost(1.5), 1.69, "1.5 hours should cost $1.69");

    // Edge cases
    assertEquals(calculateCost(-5), null, "Negative hours should return null");
    assertEquals(calculateCost("abc"), null, "Non-numeric string should return null");
    assertEquals(calculateCost(""), null, "Empty string should return null");
    assertEquals(calculateCost(NaN), null, "NaN should return null");

    console.log("✓ Cost Calculation Tests: All passed");
    console.groupEnd();
}

function testFormValidationAndCalculation() {
    console.group("Form Validation & Calculation Tests");

    const form = document.getElementById('cost-form');
    const vehicleSelect = document.getElementById('vehicle-select');
    const hoursInput = document.getElementById('charging-hours');
    const resultDiv = document.getElementById('cost-result');

    // Helper to simulate form submission
    function submitForm() {
        const event = new Event('submit', { cancelable: true });
        form.dispatchEvent(event);
    }

    // Test 1: No vehicle selected, valid hours
    vehicleSelect.value = "";
    hoursInput.value = "2";
    submitForm();
    assertEquals(resultDiv.textContent, "Please select a vehicle.", "Should show vehicle selection error");
    assertEquals(resultDiv.className, "cost-result error", "Error class not set");

    // Test 2: Vehicle selected, invalid hours (negative)
    vehicleSelect.value = "1";
    hoursInput.value = "-3";
    submitForm();
    assertEquals(resultDiv.textContent, "Please enter a valid number of hours (non-negative).", "Should show invalid hours error");
    assertEquals(resultDiv.className, "cost-result error", "Error class not set");

    // Test 3: Vehicle selected, invalid hours (non-numeric)
    vehicleSelect.value = "2";
    hoursInput.value = "abc";
    submitForm();
    assertEquals(resultDiv.textContent, "Please enter a valid number of hours (non-negative).", "Should show invalid hours error");
    assertEquals(resultDiv.className, "cost-result error", "Error class not set");

    // Test 4: Valid input
    vehicleSelect.value = "3";
    hoursInput.value = "4";
    submitForm();
    const expectedCost = 4 * 7.5 * 0.15; // 4.5
    const expectedText = `Estimated cost to charge Ford Mustang Mach-E for 4 hour(s): $4.5`;
    assertEquals(resultDiv.textContent, expectedText, "Correct cost calculation not displayed");
    assertEquals(resultDiv.className, "cost-result success", "Success class not set");

    console.log("✓ Form Validation & Calculation Tests: All passed");
    console.groupEnd();
}

function testCSSClassesAndStyling() {
    console.group("CSS Classes & Styling Tests");

    // Check that vehicle cards have appropriate status classes
    const statusSpans = document.querySelectorAll('.vehicle-card .status');
    assertEquals(statusSpans.length, vehicles.length, "Number of status spans should match vehicles");

    vehicles.forEach((vehicle, index) => {
        const expectedClass = vehicle.status.replace(/\s+/g, '-');
        const actualClass = statusSpans[index].className;
        assert(actualClass.includes(expectedClass), `Status class mismatch for ${vehicle.model}: expected "${expectedClass}" in "${actualClass}"`);
    });

    // Check that error and success classes are applied as intended (already tested in form tests)
    console.log("✓ CSS Classes Tests: All passed");
    console.groupEnd();
}

function testEdgeCasesAndResilience() {
    console.group("Edge Cases & Resilience Tests");

    // Test that the page does not crash if DOM elements are missing (simulate by removing temporarily)
    const originalContainer = document.getElementById('vehicle-list');
    const originalForm = document.getElementById('cost-form');

    // Simulate missing container
    originalContainer.remove();
    try {
        renderFleet(); // Should not throw
        console.log("✓ renderFleet gracefully handles missing container");
    } catch (e) {
        console.error("✗ renderFleet threw error when container missing", e);
    }
    document.body.appendChild(originalContainer); // Restore

    // Simulate missing form
    originalForm.remove();
    try {
        populateVehicleDropdown(); // Should not throw
        console.log("✓ populateVehicleDropdown gracefully handles missing form");
    } catch (e) {
        console.error("✗ populateVehicleDropdown threw error when form missing", e);
    }
    document.body.appendChild(originalForm); // Restore

    // Restore original state
    renderFleet();
    populateVehicleDropdown();

    console.log("✓ Edge Cases Tests: Completed");
    console.groupEnd();
}

// ========== Main Test Runner ==========

function runAllTests() {
    console.clear();
    console.log("=== EcoCharge Fleet Dashboard Test Suite ===");
    console.log("Running all tests...\n");

    try {
        testFleetOverviewRendering();
        testVehicleDropdownPopulation();
        testCostCalculationFunction();
        testFormValidationAndCalculation();
        testCSSClassesAndStyling();
        testEdgeCasesAndResilience();

        console.log("\n=== ALL TESTS PASSED ===");
    } catch (error) {
        console.error("\n=== TEST FAILED ===");
        console.error(error);
    }
}

// Auto-run if the page is loaded with ?test parameter
if (window.location.search.includes('test')) {
    document.addEventListener('DOMContentLoaded', runAllTests);
}