import { useParams } from 'react-router-dom'

export function useOrgSlug() {
    return useParams().org
}

export function useChannelSlug() {
    return useParams().channel
}

export function useTicketCode() {
    return useParams().ticket
}
