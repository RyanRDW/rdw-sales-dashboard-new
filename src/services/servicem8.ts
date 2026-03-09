'use server';

import { getAccessToken } from './auth';

export async function apiRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any, params?: any) {
  const accessToken = await getAccessToken();
  const baseUrl = process.env.SM8_API_BASE;

  try {
    const url = new URL(`${baseUrl}/${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
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

export async function getJob(uuid: string) {
  const jobs = await apiRequest('job.json', 'GET', null, { $filter: `uuid eq '${uuid}'` });
  return jobs[0];
}
