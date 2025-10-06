type LoadParams<K> = {
  endpoint: string;
  method?: 'GET' | 'POST';
  body?: K;
  auth?: boolean;
};

type HttpError = {
  error: string;
  message: string;
};

const URL = "http://localhost:8000/api/"


const load = async <K, T>({ endpoint, method = 'GET', body, auth = true }: LoadParams<K>): Promise<T | undefined> => {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (auth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${URL}${endpoint}`, {
      method,
      body: JSON.stringify(body),
      headers
    });

    if (!res.ok) {
      const errorData: HttpError = await res.json();

      if (res.status === 401) {
        localStorage.removeItem('token');
      }

      alert(`${errorData.error}. ${errorData.message}`);
      return;
    }

    return await res.json() as T;

  } catch {
    alert('Network error');
  }


}

export default load;