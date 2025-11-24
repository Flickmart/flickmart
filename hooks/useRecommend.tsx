'use client';
import { useAction, useQuery } from 'convex/react';
import  { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';

import { RecommendationResponse } from 'recombee-api-client';
import { fetchRecommendations } from '@/utils/helpers';

export function useRecommend(scenario: string, count?: number){
    const recommendations = useAction(api.recommend.recommendItems)
    const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)
    const user = useQuery(api.users.current, {})
    const [fetched, setFetched] = useState(false)

    useEffect(()=>{
        if (user && !fetched) {
            fetchRecommendations(scenario, recommendations, count).then(data=> {
                setRecommendation(data)
                // Set Fetched to true so recommendation
                setFetched(true)
            })  
        }
    },[user])

    return recommendation
}