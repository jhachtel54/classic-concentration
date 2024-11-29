class Prize
{
    constructor(name, panelString, value)
    {
        this.name = name;
        this.panelString = panelString;
        this.value = value;
    }
}

class PrizeManager
{
	static blankPrize = new Prize("", "", -1);
	static wildPrize = new Prize("WILD", "WILD", 0);
	static potentialPrizes = [
		new Prize("COOKWARE", "COOKWARE", 1200),
		new Prize("BLENDER", "BLENDER", 1700),
		new Prize("TRIP TO SINGAPORE", "SINGAPORE", 7524),
		new Prize("KNIVES", "KNIVES", 543),
		new Prize("TRIP TO LONDON", "LONDON", 10161),
		new Prize("TRIP TO THE BAHAMAS", "BAHAMAS", 7984),
		new Prize("TRIP TO TAHITI", "TAHITI", 7846),
		new Prize("TRIP TO VANCOUVER", "VANCOUVER", 7720),
		new Prize("GAS GRILL", "GAS GRILL", 5200),
		new Prize("SHOES", "SHOES", 700),
		new Prize("CAR STEREO", "CAR STEREO", 1600),
		new Prize("WEIGHTED BLANKET", "WEIGHTED\nBLANKET", 362),
		new Prize("KITCHEN TABLE", "KITCHEN\nTABLE", 3100),
		new Prize("HATS", "HATS", 260),
		new Prize("DIAMOND EARRINGS", "DIAMOND\nEARRINGS", 1440),
		new Prize("GOLD NECKLACE", "NECKLACE", 3540),
		new Prize("SOFA", "SOFA", 3600),
		new Prize("HOME THEATER", "HOME THEATER", 6195),
		new Prize("OVEN", "OVEN", 7300),
		new Prize("GLASSWARE", "GLASSWARE", 160),
		new Prize("KITCHEN HUTCH", "KITCHEN HUTCH", 3100),
		new Prize("MINK COAT", "MINK COAT", 14995),
		new Prize("MACBOOK PRO", "MACBOOK PRO", 1600),
		new Prize("BED", "BED", 8995),
		new Prize("DIAMOND RING", "RING", 8400),
		new Prize("BICYCLE", "BICYCLE", 1900),
		new Prize("OFFICE DESK", "OFFICE DESK", 1240),
		new Prize("RECLINER", "RECLINER", 1800),
		new Prize("GOPRO CAMERA", "GOPRO CAMERA", 340),
		new Prize("PILLOWS", "PILLOWS", 280),
		new Prize("AIR FRYER", "AIR FRYER", 1000),
		new Prize("TELESCOPE", "TELESCOPE", 2400),
		new Prize("PLAYSTATION 5", "PS5", 500),
		new Prize("VACUUM", "VACUUM", 1050),
		new Prize("TOASTER", "TOASTER", 129	),
		new Prize("NINTENDO SWITCH", "SWITCH", 350),
		new Prize("GOLD CHAIN", "GOLD CHAIN", 3720),
		new Prize("IPHONE 16 PRO", "IPHONE", 1000),
		new Prize("DINNERWARE SET", "DINNERWARE", 550),
		new Prize("WATCH", "WATCH", 8500),
		new Prize("OLED TV", "OLED TV", 2300),
		new Prize("TEA SET", "TEA SET", 260),
		new Prize("XBOX SERIES X", "XBOX", 500),
		new Prize("ATV", "ATV", 7000),
		new Prize("SHIRTS", "SHIRTS", 365),
		new Prize("RUG", "RUG", 4995),
		new Prize("FOX FUR VEST", "FOX FUR VEST", 2995),
		new Prize("VANITY AND MIRROR SET", "VANITY", 750),
		new Prize("BED SHEETS", "BED SHEETS", 1960),
		new Prize("GOLD BRACELET", "GOLD BRACELET", 2700),
		new Prize("BOOTS", "BOOTS", 700),
	];
	
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