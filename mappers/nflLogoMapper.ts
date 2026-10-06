export class nflLogoMapper {
    private static readonly map: Record<string, string> = {
        ARI: "https://cdn.discordapp.com/attachments/1556937690803347567/1556937949617070080/ARI.png?backend=b2&ex=6ac5faf5&is=6ac4a975&hm=9f8d43a3989f58dda5cb4823fc7fbc82124226691c1045e5596998b067aceb20&",
        ATL: "<:falcons:1556214355035426907>",
        BAL: "<:ravens:1556214369132613632>",
        BUF: "<:bills:1556214340443570236>",
        CAR: "<:panthers:1556214364900556801>",
        CHI: "<:bears:1556214336685478009>",
        CIN: "<:bengals:1556214337914536046>",
        CLE: "<:browns:1556214344436686909>",
        DAL: "<:cowboys:1556214349285036052>",
        DEN: "<:denver:1556214350296121345>",
        DET: "<:detroit:1556214351524790282>",
        GB: "<:packers:1556214363885412373>",
        HOU: "<:texans:1556214360119050321>",
        IND: "<:colts:1556214348479733770>",
        JAX: "<:jaguars:1556214360710455327>",
        KC: "<:chiefs:1556214347615838308>",
        LAC: "<:chargers:1556214346676310086>",
        LAR: "https://imgur.com/fvtTMi1.png",
        LV: "<:raiders:1556214366427156501>",
        MIA: "<:dolphins:1556214352619511889>",
        MIN: "<:vikings:1556214375071879169>",
        NE: "<:patriots:1556214365806526586>",
        NO: "<:saints:1556214370198093824>",
        NYG: "<:giants:1556214358424555540>",
        NYJ: "<:jets:1556214361666752572>",
        PHI: "<:eagles:1556214353638719568>",
        PIT: "<:steelers:1556214371829424208>",
        SEA: "<:seattle:1556214370835365948>",
        SF: "<:sf:1556214334567227483>",
        TB: "<:buccaneers:1556214345921462383>",
        TEN: "<:titans:1556214372811018291>",
        WSH: "<:washington:1556214376510398514>",
        NFL: "<:nfl:1556214357145161788>",
        AFC: "<:afc:1556214336173908031>",
        NFC: "<:nfc:1556214362522263624>",
        Win: "<:win:1464980029585752218>",
        Loss: "<:loss:1464981155601317951>",
        default: "<:nfl:1556214357145161788>"
    };

    static get(abbr: string): string {
        const key = abbr.toUpperCase();
        return this.map[key] ?? this.map.default;
    }

     static has(abbr: string): boolean {
        return abbr.toUpperCase() in this.map;
    }
}