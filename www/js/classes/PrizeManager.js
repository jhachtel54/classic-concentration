class Prize
{
    constructor(name, value, debugColor)
    {
        this.name = name;
        this.value = value;
        this.debugColor = debugColor;
    }
}

class PrizeManager
{
    static blankPrize = new Prize("", -1);
    static wildPrize = new Prize("WILD", 0, "blue");
    // static wildPrize = new Prize("WILD", 0);
    static doubleWildPrize = new Prize("$1200", 1200);
    
    static potentialPrizes = [
        new Prize("COOKWARE", 1200, "black"),
        new Prize("BLENDER", 1700, "green"),
        new Prize("TRIP TO SINGAPORE", 7524, "gray"),
        new Prize("KNIVES", 543, "white"),
        new Prize("TRIP TO LONDON", 10161, "maroon"),
        new Prize("TRIP TO THE BAHAMAS", 7984, "red"),
        new Prize("TRIP TO TAHITI", 7846, "purple"),
        new Prize("TRIP TO VANCOUVER", 7720, "fuchsia"),
        new Prize("GAS GRILL", 5200, "olive"),
        new Prize("VANITY AND MIRROR SET", 750, "yellow"),
        new Prize("CAR STEREO", 1600, "teal"),
    ]
    
    // static potentialPrizes = [
        // new Prize("COOKWARE", 1200),
        // new Prize("BLENDER", 1700),
        // new Prize("TRIP TO SINGAPORE", 7524),
        // new Prize("KNIVES", 543),
        // new Prize("TRIP TO LONDON", 10161),
        // new Prize("TRIP TO THE BAHAMAS", 7984),
        // new Prize("TRIP TO TAHITI", 7846),
        // new Prize("TRIP TO VANCOUVER", 7720),
        // new Prize("GAS GRILL", 5200),
        // new Prize("SHOES", 700),
        // new Prize("CAR STEREO", 1600),
        // new Prize("WEIGHTED BLANKET", 362),
        // new Prize("KITCHEN TABLE", 3100),
        // new Prize("HATS", 260),
        // new Prize("DIAMOND EARRINGS", 1440),
        // new Prize("GOLD NECKLACE", 3540),
        // new Prize("SOFA", 3600),
        // new Prize("HOME THEATER", 6195),
        // new Prize("OVEN", 7300),
        // new Prize("GLASSWARE", 160),
        // new Prize("KITCHEN HUTCH", 3100),
        // new Prize("MINK COAT", 14995),
        // new Prize("MACBOOK PRO", 1600),
        // new Prize("BED", 8995),
        // new Prize("DIAMOND RING", 8400),
        // new Prize("BICYCLE", 1900),
        // new Prize("OFFICE DESK", 1240),
        // new Prize("RECLINER", 1800),
        // new Prize("GOPRO CAMERA", 340),
        // new Prize("PILLOWS", 280),
        // new Prize("AIR FRYER", 1000),
        // new Prize("TELESCOPE", 2400),
        // new Prize("PLAYSTATION 5", 500),
        // new Prize("VACUUM", 1050),
        // new Prize("TOASTER", 129),
        // new Prize("NINTENDO SWITCH", 350),
        // new Prize("GOLD CHAIN", 3720),
        // new Prize("IPHONE 16 PRO", 1000),
        // new Prize("DINNERWARE SET", 550),
        // new Prize("WATCH", 8500),
        // new Prize("OLED TV", 2300),
        // new Prize("TEA SET", 260),
        // new Prize("XBOX SERIES X", 500),
        // new Prize("ATV", 7000),
        // new Prize("SHIRTS", 365),
        // new Prize("RUG", 4995),
        // new Prize("FOX FUR VEST", 2995),
        // new Prize("VANITY AND MIRROR SET", 750),
        // new Prize("BED SHEETS", 1960),
        // new Prize("GOLD BRACELET", 2700),
        // new Prize("BOOTS", 700),
    // ];
    
    static GeneratePrizePool(numPrizes, numMatches, numWilds)
    {
        var totalNumber = numPrizes * numMatches + numWilds;
        var squareRoot = Math.floor(Math.sqrt(totalNumber));
        var numBlanks = (squareRoot + 1) * (squareRoot + 1) - totalNumber;
        
        var prizePool = [];
        for (var i = 0; i < numWilds; ++i)
            prizePool.push(PrizeManager.wildPrize);
        for (var i = 0; i < numBlanks; ++i)
            prizePool.push(PrizeManager.blankPrize);
        
        var selected = [];
        while (selected.length < numPrizes)
        {
            var index = Math.floor(Math.random() * PrizeManager.potentialPrizes.length);
            if (!selected.includes(index))
            {
                for (var i = 0; i < numMatches; ++i)
                    prizePool.push(PrizeManager.potentialPrizes[index]);
                selected.push(index);
            }
        }
        
        let currentIndex = prizePool.length;
        while (currentIndex != 0)
        {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            --currentIndex;
            [prizePool[currentIndex], prizePool[randomIndex]] = [prizePool[randomIndex], prizePool[currentIndex]];
        }
        
        return prizePool;
    }
};