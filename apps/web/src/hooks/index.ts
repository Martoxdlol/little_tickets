import { useParams } from 'react-router-dom'

export function useOrgSlug() {
    return useParams().org
}
