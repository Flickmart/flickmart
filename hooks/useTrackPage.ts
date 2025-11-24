import { analytics } from "@/utils/analytics";
import { useEffect } from "react";


type OptionsType = {
    pageName: string;
    category: string;
    title: string,
    url: string,
    path: string,

}
export function useTrackPage({pageName, category, title, url, path}: OptionsType){
    useEffect(() => {
        analytics.page(category, pageName, {
            title,
            url,
            path
        });
    }, [title, category]);
}