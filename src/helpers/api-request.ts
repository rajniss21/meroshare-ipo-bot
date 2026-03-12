import { APIRequestContext, APIResponse } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFilePath = 'playwright/.auth/user.json';
const apiUrl = process.env.API_URL;

async function readAuthData() {
  try {
    const filePath = path.join(process.cwd(), authFilePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const authData = JSON.parse(data);

    //!Find the access token in the localStorage array - might need to adjust this if the structure of the auth file changes
    const accessToken = authData.origins[0].localStorage.find(
      (item: { name: string }) => item.name === 'access_token'
    ).value;

    return accessToken;
  } catch (error) {
    console.error('Error reading auth file:', error);
    throw error;
  }
}

const postRequest = async <T>(
  request: APIRequestContext,
  url: string,
  attributes: T
): Promise<T> => {
  const accessToken = await readAuthData();

  return request
    .post(url, {
      //! Adjust headers as needed, especially if your API requires additional headers
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
      },
      data: {
        ...attributes,
      },
    })
    .then((res) => res.json() as Promise<T>);
};

const getRequest = async <T>(request: APIRequestContext, url: string): Promise<T> => {
  const accessToken = await readAuthData();

  const res = await request.get(url, {
    //! Adjust headers as needed, especially if your API requires additional headers
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${accessToken}`,
    },
  });

  const data = (await res.json()) as T;
  return data;
};

export async function postApi<T>(
    request: APIRequestContext,
    serviceType: string,
    attributes: T
): Promise<T> {
    try {
        return postRequest<T>(request, `${apiUrl}/${serviceType}`, attributes);
    } catch (error) {
        console.error(`Error creating resource: ${error}`);
        throw error;
    }
}

export async function getApi<T>(request: APIRequestContext, serviceType: string): Promise<T> {
    try {
        return await getRequest<T>(request, `${apiUrl}/${serviceType}`);
    } catch (error) {
        console.error(`Error getting resource:`, error);
        throw error;
    }
}
