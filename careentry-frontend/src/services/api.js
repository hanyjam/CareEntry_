import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'https://api.careentry.ageisel.de';

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth
export const authService = {
  login: async (email, password) => {
    const response = await fetchWithAuth('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    const token = response.token;

    const decodedToken = jwtDecode(token);

    const user = {
      id: decodedToken.jti,
      email: decodedToken.username,
      vorname: decodedToken.firstName,
      nachname: decodedToken.lastName,
      role: decodedToken.roles?.includes('ROLE_DOCTOR') ? 'arzt' : 'patient',
    };
    
    return {
      token: token,
      user: user,
    };
  },

    register: async (userData) => {
    return fetchWithAuth('/user/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthday: userData.birthday,
        gender: userData.gender,
      }),
    });
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Patienten Service
export const patientenService = {
  getAll: async () => {
    return fetchWithAuth('/persons/patients');
  },
  
  getById: async (id) => {
    return fetchWithAuth(`/person/${id}`);
  },
  
  update: async (id, data) => {
    return fetchWithAuth(`/person/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

// Nachrichten Service
export const messagesService = {
  getAll: async () => {
    return fetchWithAuth('/messages');
  },
  
  send: async (messageData) => {
    return fetchWithAuth('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },
  
  markAsRead: async (messageId) => {
    return fetchWithAuth(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }
};

// Laborwerte Service
export const measurementsService = {
  getByUserId: async (userId) => {
    // ÄNDERE DEN ENDPOINT!
    const response = await fetchWithAuth(`/measurements?user_id=${userId}`);
    return response;
  },
  
  create: async (patientId, measurementData) => {
    const response = await fetchWithAuth(`/measurements`, {
      method: 'POST',
      body: JSON.stringify(measurementData),
    });
    return response.data;
  }
};


// Anamnese Service
export const anamneseService = {
  getByPatientId: async (patientId) => {
    return fetchWithAuth(`/anamnese?patient_id=${patientId}`);
  },
  
  submit: async (anamneseData) => {
    return fetchWithAuth('/anamnese', {
      method: 'POST',
      body: JSON.stringify(anamneseData),
    });
  }
};

// File Upload - TODO: Muss noch in API-Doku geprüft werden
export const uploadService = {
  uploadFile: async (file, patientId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId);

    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload fehlgeschlagen');
    }

    return await response.json();
  },
};