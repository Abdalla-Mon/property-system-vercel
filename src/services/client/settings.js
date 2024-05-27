const API_URL = '/api/settings';

// Helper function for fetching
async function fetchData(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });
    return await response.json();
}

// State
export async function createState(data) {
    return fetchData(`${API_URL}/states`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getStates() {
    return fetchData(`${API_URL}/states`);
}

export async function updateState(id, data) {
    return fetchData(`${API_URL}/states/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteState(id) {
    return fetchData(`${API_URL}/states/${id}`, {
        method: 'DELETE',
    });
}

// City
export async function createCity(data) {
    return fetchData(`${API_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getCities() {
    return fetchData(`${API_URL}/cities`);
}

export async function updateCity(id, data) {
    return fetchData(`${API_URL}/cities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteCity(id) {
    return fetchData(`${API_URL}/cities/${id}`, {
        method: 'DELETE',
    });
}

// District
export async function createDistrict(data) {
    return fetchData(`${API_URL}/districts`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getDistricts() {
    return fetchData(`${API_URL}/districts`);
}

export async function updateDistrict(id, data) {
    return fetchData(`${API_URL}/districts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteDistrict(id) {
    return fetchData(`${API_URL}/districts/${id}`, {
        method: 'DELETE',
    });
}

// Property Type
export async function createPropertyType(data) {
    return fetchData(`${API_URL}/property-types`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getPropertyTypes() {
    return fetchData(`${API_URL}/property-types`);
}

export async function updatePropertyType(id, data) {
    return fetchData(`${API_URL}/property-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deletePropertyType(id) {
    return fetchData(`${API_URL}/property-types/${id}`, {
        method: 'DELETE',
    });
}

// Unit Type
export async function createUnitType(data) {
    return fetchData(`${API_URL}/unit-types`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getUnitTypes() {
    return fetchData(`${API_URL}/unit-types`);
}

export async function updateUnitType(id, data) {
    return fetchData(`${API_URL}/unit-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteUnitType(id) {
    return fetchData(`${API_URL}/unit-types/${id}`, {
        method: 'DELETE',
    });
}

// Rent Agreement Type
export async function createRentAgreementType(data) {
    return fetchData(`${API_URL}/rent-agreement-types`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getRentAgreementTypes() {
    return fetchData(`${API_URL}/rent-agreement-types`);
}

export async function updateRentAgreementType(id, data) {
    return fetchData(`${API_URL}/rent-agreement-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteRentAgreementType(id) {
    return fetchData(`${API_URL}/rent-agreement-types/${id}`, {
        method: 'DELETE',
    });
}

// Property Expense Type
export async function createPropertyExpenseType(data) {
    return fetchData(`${API_URL}/property-expense-types`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getPropertyExpenseTypes() {
    return fetchData(`${API_URL}/property-expense-types`);
}

export async function updatePropertyExpenseType(id, data) {
    return fetchData(`${API_URL}/property-expense-types/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deletePropertyExpenseType(id) {
    return fetchData(`${API_URL}/property-expense-types/${id}`, {
        method: 'DELETE',
    });
}

// Bank
export async function createBank(data) {
    return fetchData(`${API_URL}/banks`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getBanks() {
    return fetchData(`${API_URL}/banks`);
}

export async function updateBank(id, data) {
    return fetchData(`${API_URL}/banks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteBank(id) {
    return fetchData(`${API_URL}/banks/${id}`, {
        method: 'DELETE',
    });
}
