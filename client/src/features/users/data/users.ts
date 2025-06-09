"use client"
import { fetcher } from '@/lib/fetcher'
import useSWR from 'swr'
export const FetchUsers = () => {
    const { data, isLoading, error } =  useSWR('/users', fetcher)
    return {
        data,
        isLoading,
        error
    }
} 