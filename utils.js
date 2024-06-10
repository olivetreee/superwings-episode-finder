import db from "./db.json" with {type: 'json'};

const buildWordANDQuery = helpers => helpers.map(helper => `(?=.*${helper})`).join();

const searchByHelper = (episodes, helperNames) => {
    const helpersRegex = new RegExp(buildWordANDQuery(helperNames));
    return episodes.filter(episode => helpersRegex.test(episode.description))
}

const searchBySeason = (season) => season === "all"
    ? db.reduce((acc, seasonEpisodes) => acc.concat(seasonEpisodes), [])
    : db[season-1];

const dbQuery = (season, helperName) => {
    const seasonEpisodes = searchBySeason(season);
    const foundEpisodes = searchByHelper(seasonEpisodes, helperName);
    return foundEpisodes;
}

window.dbQuery = dbQuery;

console.log("HELLO!!");
// const result = query(2, "Dizzy");
// console.log("Result is...");
// console.log(result.length);
// console.log(result);
