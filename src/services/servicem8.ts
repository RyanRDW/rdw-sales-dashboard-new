'use server';

import axios from 'axios';
import { getAccessToken } from './auth';

export async function apiRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any, params?: any) {
  const accessToken = await getAccessToken();
  const baseUrl = process.env.SM8_API_BASE;

  try {
    const response = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data,
      params,
    });

    return response.data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Specific functions
export async function getJobs(filters?: any) {
  return apiRequest('job.json', 'GET', null, filters);
}

export async function getJobNotes(jobId: string, filters?: any) {
  return apiRequest(`note.json?job_uuid=${jobId}`, 'GET', null, filters);
}

export async function getStaff() {
  return apiRequest('staff.json');
}

export async function getJobActivities(filters?: any) {
  return apiRequest('jobactivity.json', 'GET', null, filters);
}

export async function getCompanies(filters?: any) {
  return apiRequest('company.json', 'GET', null, filters);
}

export async function getJobContacts(filters?: any) {
  return apiRequest('jobcontact.json', 'GET', null, filters);
}