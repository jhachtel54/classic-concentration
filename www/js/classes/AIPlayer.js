class AIPlayer
{
    constructor(options)
    {
        this.logicLevel = options.logicLevel;
        this.memoryLevel = options.memoryLevel;
        this.puzzleSeenPercent = 0;
        this.panelsRemembered = [];
        this.matchesRemembered = [];
        this.choicesQueue = [];
    }
    
    static RememberedPanel = class
    {
        constructor(id, prizeName)
        {
            this.id = id;
            this.prizeName = prizeName;
        }
    };
    
    // Add how much more of the puzzle the AI can "see".
    AddAmountSeen(amountInPercent)
    {
        this.puzzleSeenPercent += amountInPercent;
    }
    
    // If the AI does not have any more matches memorized and has seen more than the threshold, it will want to solve.
    WantsToSolvePuzzle()
    {
        if (this.matchesRemembered.length > 0)
            return false;
        return this.puzzleSeenPercent >= this.logicLevel;
    }
    
    // Add panel to the AI's memory if it is new and determine if they have found a match.
    // The AI is not allowed to remember more than its memory level between the two arrays.
    AddPanelToMemory(gamePanel)
    {
        // Check to see if the number of matches in memory already match our threshold, returning early if so
        if (this.matchesRemembered.length == this.memoryLevel)
            return;
        
        // Check to see if we already have this panel in our matches, returning early if so
        for (var index = 0; index < this.matchesRemembered.length; ++index)
        {
            if (this.matchesRemembered[index][0] == gamePanel.id || this.matchesRemembered[index][1] == gamePanel.id)
                return;
        }
        
        // Iterate through our unmatched memorized panels.
        // If this panel is already in our list, return early.
        // If this panel is a match to one of these panels, move them to our matches, reduce the array of non-matches if necessary, then return.
        for (var index = 0; index < this.panelsRemembered.length; ++index)
        {
            if (this.panelsRemembered[index].id == gamePanel.id)
            {
                return;
            }
            else if (this.panelsRemembered[index].prizeName == gamePanel.prize.name)
            {
                this.matchesRemembered.push([this.panelsRemembered[index].id, gamePanel.id]);
                this.panelsRemembered.splice(index, 1);
                while (this.matchesRemembered.length + this.panelsRemembered.length > this.memoryLevel)
                    this.panelsRemembered.shift();
                return;
            }
        }
        
        // This is a new panel and does not match a previously memorized one.
        // Add to our list, and if the size of both arrays exceeds the threshold, remove the oldest one non-match.
        this.panelsRemembered.push(new AIPlayer.RememberedPanel(gamePanel.id, gamePanel.prize.name));
        if (this.matchesRemembered.length + this.panelsRemembered.length > this.memoryLevel)
            this.panelsRemembered.shift();
    }
    
    // Remove a panel (and its match if any) from the AI's memory.
    RemovePanelFromMemory(id)
    {
        for (var index = 0; index < this.matchesRemembered.length; ++index)
        {
            if (this.matchesRemembered[index][0] == id || this.matchesRemembered[index][1] == id)
            {
                this.matchesRemembered.splice(index, 1);
                return;
            }
        }
        
        for (var index = 0; index < this.panelsRemembered.length; ++index)
        {
            if (this.panelsRemembered[index].id == id)
            {
                this.panelsRemembered.splice(index, 1);
                return;
            }
        }
    }
    
    // Returns an array of two or three ids.
    // If the AI knows a match already, it will return that pair.
    // Otherwise it will pick a random panel not already memorized.
    // If the random panel is a match to a memorized panel, it will pick that second.
    // Otherwise it will pick another panel at random.
    // If both panels are wild, then it'll pick another panel at random.
    QueueNextChoices(panels)
    {
        // Return a known match
        if (this.matchesRemembered.length > 0)
        {
            this.choicesQueue = this.matchesRemembered.splice(0, 1)[0];
            return;
        }
        
        // Strip out memorizedPanels from the possible choices
        var randomPool = [];
        for (var index = 0; index < panels.length; ++index)
        {
            var panel = panels[index];
            if (panel == null)
                continue;
            
            var found = false;
            this.panelsRemembered.every(remembered => {
                if (panel.id == remembered.id)
                {
                    found = true;
                    return false;
                }
                return true;
            });
            
            if (!found)
                randomPool.push(panel);
        }
        
        // Randomize our first pick
        var randomIndex = Math.floor(Math.random() * randomPool.length);
        var firstPanel = randomPool.splice(randomIndex, 1)[0];
        var isFirstPickWild = firstPanel.prize.name == PrizeManager.wildPrize.name;
        
        // Look for a remembered match, and pick it if there is one (skip this step if wild)
        if (!isFirstPickWild)
        {
            for (var index = 0; index < this.panelsRemembered.length; ++index)
            {
                if (firstPanel.prize.name == this.panelsRemembered[index].prizeName)
                {
                    this.choicesQueue = [firstPanel.id, this.panelsRemembered[index].id];
                    return;
                }
            }
        }
        
        // Randomize our second pick
        randomIndex = Math.floor(Math.random() * randomPool.length);
        var secondPanel = randomPool.splice(randomIndex, 1)[0];
        
        // If we did not pick two wilds, return our choices now
        if (!isFirstPickWild || secondPanel.prize.name != PrizeManager.wildPrize.name)
        {
            this.choicesQueue = [firstPanel.id, secondPanel.id];
            return;
        }
        
        // Since we did pick two wilds, pick a random third panel
        randomIndex = Math.floor(Math.random() * randomPool.length);
        var thirdPanel = randomPool.splice(randomIndex, 1)[0];
        this.choicesQueue = [firstPanel.id, secondPanel.id, thirdPanel.id];
    }
}
