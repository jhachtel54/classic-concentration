class PlayScene
{
    constructor()
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = false;
        this.ai = new AIPlayer(0.8, 3);
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
        this.clearFreePanels();
    }
    
    buildDOM(parentElement)
    {
        var playAreaContainer = document.createElement("div");
        playAreaContainer.id = "playAreaContainer";
        playAreaContainer.classList.add("row", "h-85");
        parentElement.appendChild(playAreaContainer);
        
        var colDiv = document.createElement("div");
        colDiv.classList.add("col");
        playAreaContainer.appendChild(colDiv);
        
        var playArea = document.createElement("div");
        playArea.id = "playArea";
        playArea.classList.add("p-0", "h-100", "position-relative");
        playArea.addEventListener("click", this.onPlayAreaClicked.bind(this));
        colDiv.appendChild(playArea);
        
        var puzzleNode = document.createElement("img");
        puzzleNode.id = "rebusPuzzle";
        puzzleNode.src = PuzzleManager.SelectPuzzle();
        playArea.appendChild(puzzleNode);
        
        var prizePool = PrizeManager.GeneratePrizePool(11, 2, 2);
        
        for (var rowIndex = 0; rowIndex < 5; ++rowIndex)
        {
            var row = document.createElement("div");
            row.classList.add("row", "h-20", "m-0");
            playArea.appendChild(row);
            for (var colIndex = 0; colIndex < 5; ++colIndex)
            {
                var id = rowIndex * 5 + colIndex;
                var puzzlePanel = new PuzzlePanel(prizePool[id], id);
                row.appendChild(puzzlePanel.GetDOM());
                this.puzzlePanels.push(puzzlePanel);
            }
        }
        
        var playText = document.createElement("div");
        playText.id = "playText";
        playText.classList.add("row", "h-15");
        parentElement.appendChild(playText);
    }
    
    clearFreePanels()
    {
        setTimeout((function() {
            this.puzzlePanels.forEach(panel => {
                if (panel.prize.value == PrizeManager.blankPrize.value)
                {
                    panel.Clear();
                    this.ai.AddAmountSeen(PuzzleManager.GetWeight(panel.id));
                    this.puzzlePanels[panel.id] = null;
                }
            });
            this.enableSelecting();
            // this.ai.QueueNextChoices(this.puzzlePanels);
        }).bind(this), 1000);
    }

    onPlayAreaClicked(evt)
    {
        if (!this.canSelect)
            return;
        
        var id = evt.target.id;
        var number = id.split("-")[1];
        this.performSelect(number);
    }

    performSelect(id)
    {
        this.canSelect = false;
        
        if (this.selectionsThisRound.length > 0 && this.puzzlePanels[id].id == this.selectionsThisRound[this.selectionsThisRound.length - 1].id)
            return;
        
        this.puzzlePanels[id].Select();
        this.selectionsThisRound.push(this.puzzlePanels[id]);
        this.ai.AddPanelToMemory(this.puzzlePanels[id]);
        
        if (this.selectionsThisRound.length == 2)
        {
            // Neither are wild
            if (this.selectionsThisRound[0].prize.value != PrizeManager.wildPrize.value &&
                this.selectionsThisRound[1].prize.value != PrizeManager.wildPrize.value)
            {
                // this.canSelect = false;
                if (this.selectionsThisRound[0].prize.name == this.selectionsThisRound[1].prize.name)
                {
                    setTimeout(this.clearSelected.bind(this), 1000);
                }
                else
                {
                    setTimeout(this.resetSelected.bind(this), 1000);
                }
            }
            
            // Only one is wild
            else if (this.selectionsThisRound[0].prize.value != this.selectionsThisRound[1].prize.value)
            {
                // this.canSelect = false;
                setTimeout((function() {
                    var notWildPanel = this.selectionsThisRound[0].prize.value != PrizeManager.wildPrize.value ? this.selectionsThisRound[0] : this.selectionsThisRound[1];
                    this.selectMatch(notWildPanel);
                }).bind(this), 250);
            }
            
            // Both are wild
            else
            {
                this.enableSelecting();
            }
        }
        
        // This should only hit if two wilds were picked
        else if (this.selectionsThisRound.length == 3)
        {
            // this.canSelect = false;
            setTimeout((function() {
                this.selectMatch(this.selectionsThisRound[2]);
            }).bind(this), 250);
        }
        
        // Delay selections maybe? At least for AI
        else
        {
            this.enableSelecting();
        }
    }

    clearSelected()
    {
        this.selectionsThisRound.forEach(panel => {
            panel.Clear();
            this.ai.AddAmountSeen(PuzzleManager.GetWeight(panel.id));
            this.ai.RemovePanelFromMemory(panel.id);
            this.puzzlePanels[panel.id] = null;
        });
        this.selectionsThisRound = [];
        this.enableSelecting();
    }

    resetSelected()
    {
        this.selectionsThisRound.forEach(panel => {
            panel.Reset();
        });
        this.selectionsThisRound = [];
        this.enableSelecting();
    }

    selectMatch(notWildPanel)
    {
        for (var index = 0; index < this.puzzlePanels.length; ++index)
        {
            if (this.puzzlePanels[index] == null)
                continue;
            
            if (this.puzzlePanels[index].prize.name == notWildPanel.prize.name && this.puzzlePanels[index].id != notWildPanel.id)
            {
                this.puzzlePanels[index].Select();
                this.selectionsThisRound.push(this.puzzlePanels[index]);
                setTimeout(this.clearSelected.bind(this), 1000);
            }
        }
    }

    enableSelecting()
    {
        setTimeout((function() {
            this.canSelect = true;
        }).bind(this), 250);
    }

    Update(deltaTime)
    {
        //if (this.canSelect)
        //{
        //    if (aiChoices.length == 0)
        //    {
        //        if (this.ai.WantsToSolvePuzzle())
        //        {
        //            console.log("AI can solve!");
        //            this.canSelect = false;
        //        }
        //        else
        //        {
        //            this.ai.QueueNextChoices(this.puzzlePanels);
        //        }
        //    }
        //    else
        //    {
        //        performSelect(aiChoices[0]);
        //        aiChoices.shift();
        //        if (aiChoices.length == 0)
        //        {
        //            console.log("AI done picking this round!");
        //        }
        //    }
        //}
    }
}
