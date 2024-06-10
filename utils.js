import db from "./db.json" assert {type: 'json'};

const searchByHelper = (episodes, helperName) => episodes.filter(episode => episode.description.includes(helperName))

const searchBySeason = (season) => season === "all"
    ? db.reduce((acc, seasonEpisodes) => acc.concat(seasonEpisodes), [])
    : db[season-1];

const query = (season, helperName) => {
    const seasonEpisodes = searchBySeason(season);
    const foundEpisodes = searchByHelper(seasonEpisodes, helperName);
    return foundEpisodes;
}

const result = query(2, "Dizzy");
console.log("Result is...");
console.log(result.length);
console.log(result);