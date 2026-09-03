import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const AxiosAPIService = (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
) => {
    return axiosInstance({
        url,
        method,
        data,
    })
}

const FetchAPIService = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers?: Record<string, string>,
    revalidateValue?: number,
    cacheOption?: RequestCache
) => {

    const response = await fetch(url, {
        next: {
            revalidate: revalidateValue,
        },
        cache: cacheOption,
        method,
        headers
    })
    return response.json();

}

export {
    AxiosAPIService,
    FetchAPIService
}