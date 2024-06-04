const API_URL = '/api/properties';

export async function createProperty(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function getPropertyById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return await response.json();
}

export async function getProperties({ page = 1, limit = 10, filters = {}, sort = '' }) {
    const query = new URLSearchParams({
        page,
        limit,
        ...filters,
        sort,
    }).toString();
    const response = await fetch(`${API_URL}?${query}`);
    return await response.json();
}

export async function updateProperty(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function deleteProperty(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
}
