const END_RESULT = {
    title: "Some episode title",
    episodeNumberInSeason: 42,
    location: "Brazil",
    description: "Stuff stuff bla bla bla",
    isPartOfDoubleEpisode: true,
}

const SEASON_EPISODE_COUNT = {
    1: 52,
    2: 52,
    3: 40,
    4: 40,
    5: 40,
    6: 40,
    7: 40,
    8: 26,
};

const cleanupString = (str) => str.replace("\n", " ");

const getAllDescriptions = () => {
    const result = [];
    const nodeList = document.getElementsByClassName("shortSummaryText");
    for (let i = 0; i < nodeList.length; i++) {
        result.push(cleanupString(nodeList[i].textContent));
    }
    return result;
}

const getAllRelevantHeaders = () => {
    const result = [];
    const nodeList = document.getElementsByClassName("module-episode-list-row");
    for (let i = 0; i < nodeList.length; i++) {
        // First td is "No. in season"
        const episodeNumber = nodeList[i].getElementsByTagName("td")[0].textContent
        // Second td is "Title"
        const title = nodeList[i].getElementsByTagName("td")[1].textContent
        // Third td is "Location"
        const location = nodeList[i].getElementsByTagName("td")[2].innerText.trim();
        result.push({
            episodeNumber,
            title,
            location,
            isPartOfDoubleEpisode: false,
        });
    }

    return result;
}

// TODO: This seems to be working fine! It's adding an extra element to the end due to
// result[currentSeason - 1] = []; running at the very end, but it's easily fixable.
// At the very least, a last result.pop() should do it. Ugly, but it works. Looking for speed here,
// since this is a one-time thing.
const compileJson = () => {
    const descriptions = getAllDescriptions();
    // TODO: need to add season number here as well...
    const headers = getAllRelevantHeaders();
    const result = [];
    let currentSeason = 1;
    let episodesSeenThisSeason = 0;
    let seasonData = [];
    result[currentSeason - 1] = [];
    headers.forEach((currentHeader, idx) => {
        const description = descriptions[idx];
        const epData = {
            ...currentHeader,
            season: currentSeason,
            description,
        };
        episodesSeenThisSeason++;
        if (currentHeader.episodeNumber.includes("–")) {
            // If it's part of a double episode, duplicate the item into 2 episodes.
            const [ep1, ep2] = currentHeader.episodeNumber.split("–");
            epData.isPartOfDoubleEpisode = true,
            seasonData = seasonData.concat([
                { ...epData, episodeNumber: ep1 },
                { ...epData, episodeNumber: ep2 }
            ]);
            episodesSeenThisSeason++;
        } else {
            seasonData.push(epData);
        }

        if (episodesSeenThisSeason === SEASON_EPISODE_COUNT[currentSeason]) {
            result[currentSeason - 1] = result[currentSeason - 1].concat(seasonData);
            currentSeason++;
            episodesSeenThisSeason = 0;
            seasonData = [];
            result[currentSeason - 1] = [];
        }
    })

    return result;
}
