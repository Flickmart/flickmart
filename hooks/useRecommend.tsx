'use client';
import { useAction, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import type { RecommendationResponse } from 'recombee-api-client';
import { api } from '@/convex/_generated/api';
import { fetchRecommendations } from '@/utils/helpers';
import { scenarios } from '@/utils/constants';

export function useRecommend(scenario: string, count?: number) {
  const recommendations = useAction(api.recommend.recommendItems);
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const user = useQuery(api.users.current, {});
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const anonId = localStorage.getItem('anonId');
    if (user  && !fetched) {
      scenarios.map(scenario => localStorage.removeItem(scenario))
      fetchRecommendations(scenario, recommendations, count).then((data) => {
        setRecommendation(data);
        // Set Fetched to true so recommendation
        setFetched(true);
      });
    } else if (!user && anonId && !fetched) {

      const scenarioRecommendations = localStorage.getItem(scenario);

      if (scenarioRecommendations) {
        const { data, expiresAt } = JSON.parse(scenarioRecommendations);

        if (expiresAt > Date.now()) {
          let result = data as RecommendationResponse
          setRecommendation(result);
          setFetched(true);
          return;
        }
      }
        
        
      fetchRecommendations(scenario, recommendations, count, anonId).then((data) => {
        // If it's first time recommending to anon users, cache to local storage
        localStorage.setItem(scenario, JSON.stringify({
          data: scenarioRecommendations? data: {...data,  recomms: data?.recomms?.sort(() => Math.random() - 0.5)}, // if scenarioRecommendations is null, it's first time recommending so we shuffle before setting
          expiresAt: Date.now() + 30 * 60 * 1000 ,// 10 mins
        }));
        
        setRecommendation(data);
        // Set Fetched to true so recommendation
        setFetched(true);
      });
    }
  }, [user]);

  return recommendation;
}
