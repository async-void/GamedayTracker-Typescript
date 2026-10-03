export async function getScoreboard(season: number, week: number, seasonType: number): Promise<any> {

    const noParams = !season && !week && !seasonType;
    const url = noParams ? `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard` : `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?season=${season}&week=${week}&seasontype=${seasonType}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch scoreboard data: ${response.status} ${response.statusText}`);
    }
    return response.json();
}