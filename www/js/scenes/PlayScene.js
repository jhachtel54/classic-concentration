class PlayScene
{
    constructor(player1Name, player1SpriteSrc, player2Name, player2SpriteSrc, aiOptions)
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = false;
        this.stageAreaContainer = null;
        this.playAreaContainer = null;
        this.scoreboardSVG = null;
        this.claimedPrizes = [[], []];
        this.player1Name = player1Name;
        this.player1SpriteSrc = player1SpriteSrc;
        this.player2Name = player2Name;
        this.player2SpriteSrc = player2SpriteSrc;
        if (aiOptions !== undefined && aiOptions != null)
            this.ai = new AIPlayer(aiOptions);
        else
            this.ai = null;
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
        //this.clearFreePanels();
    }
    
    buildDOM(parentElement)
    {
        parentElement.innerHTML = "" +
            "<div id='stageAreaContainer' class='container-fluid sceneInnerContainer'>" +
                "<div id='stageAreaMain' class='row mainArea'>" +
                    "<div class='col container-fluid'>" +
                        "<div class='row h-5'></div>" +
                        "<div class='row h-90'>" +
                            "<div class='col-2'></div>" +
                            "<div id='stage' class='col position-relative p-0'>" +
                                "<svg id='scoreboardSVG' viewBox='0 0 680 400' preserveAspectRatio='none' class='position-absolute w-100 h-100'>" +
                                    "<rect x='140' y='72' width='400' height='225' fill='white' />" +
                                    "<rect x='155' y='82' width='175' height='28' rx='10' ry='10' fill='black' />" +
                                    "<path id='player1TextPath' d='M165 105 l155 0' />" +
                                    "<text style='fill:#ff55ff; font-size:2em; font-weight:bold;'>" +
                                        "<textPath id='player1Text' href='#player1TextPath' text-anchor='middle' startOffset='50%'></textPath>" +
                                    "</text>" +
                                    "<rect x='350' y='82' width='175' height='28' rx='10' ry='10' fill='black' />" +
                                    "<path id='player2TextPath' d='M360 105 l155 0' />" +
                                    "<text style='fill:#ff55ff; font-size:2em; font-weight:bold;'>" +
                                        "<textPath id='player2Text' href='#player2TextPath' text-anchor='middle' startOffset='50%'></textPath>" +
                                    "</text>" +
                                "</svg>" +
                            "</div>" +
                            "<div class='col-2'></div>" +
                        "</div>" +
                    "<div class='row h-5'></div>" +
                    "</div>" +
                "</div>" +
                "<div id='stageAreaText' class='row textArea'></div>" +
            "</div>" +
            "<div id='playAreaContainer' class='container-fluid sceneInnerContainer' style='visibility:hidden;'>" +
                "<div id='playAreaMain' class='row mainArea'>" +
                    "<div class='col'>" +
                        "<div id='playArea' class='p-0 h-100 position-relative'>" +
                            "<img id='rebusPuzzle' />" +
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div id='playAreaText' class='row textArea'></div>" +
            "</div>";
        
        var puzzleNode = document.getElementById("rebusPuzzle");
        puzzleNode.src = PuzzleManager.SelectPuzzle();
        
        var prizePool = PrizeManager.GeneratePrizePool(11, 2, 2);
        var playArea = document.getElementById("playArea");
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
        
        this.scoreboardSVG = document.getElementById("scoreboardSVG");
        var player1Left = 156;
        var player2Left = 341;
        var y = 120;
        var prizeHeight = 18;
        var prizeWidth = 183;
        var stroke = 2;
        for (var index = 0; index < 8; ++index, y += prizeHeight)
        {
            var prizeBottom = y + index * stroke;
            this.scoreboardSVG.innerHTML += "" +
                "<rect id='player1Prize" + index + "' x=" + player1Left + " y=" + prizeBottom + " width=" + prizeWidth + " height=" + prizeHeight + " style='fill:#55ffff; stroke-width:" + stroke + "; stroke:black;' />" +
                "<path id='player1Prize" + index + "TextPath' d='M" + (player1Left + stroke) + " " + (prizeBottom + prizeHeight - stroke) + " l" + (prizeWidth - stroke) + " 0' />" +
                "<text style='fill:#ff55ff; font-size:1.5em; font-weight:bold;'>" +
                    "<textPath id='player1Prize" + index + "Text' href='#player1Prize" + index + "TextPath' text-anchor='middle' startOffset='50%'></textPath>" +
                "</text>" +
                "<rect id='player2Prize" + index + "' x=" + player2Left + " y=" + prizeBottom + " width=" + prizeWidth + " height=" + prizeHeight + " style='fill:#55ffff; stroke-width:" + stroke + "; stroke:black;' />" +
                "<path id='player2Prize" + index + "TextPath' d='M" + (player2Left + stroke) + " " + (prizeBottom + prizeHeight - stroke) + " l" + (prizeWidth - stroke) + " 0' />" +
                "<text style='fill:#ff55ff; font-size:1.5em; font-weight:bold;'>" +
                    "<textPath id='player2Prize" + index + "Text' href='#player2Prize" + index + "TextPath' text-anchor='middle' startOffset='50%'></textPath>" +
                "</text>";
        }
        
        this.setPlayerName(this.player1Name, 1);
        this.setPlayerName(this.player2Name, 2);
        this.scoreboardSVG.innerHTML += "" +
            "<image id='player1Sprite' width='100' height='140' href='" + this.player1SpriteSrc + "' x='160' y='162' />" +
            "<image id='player2Sprite' width='100' height='140' href='" + this.player2SpriteSrc + "' x='420' y='162' />";
    }
    
    setPlayerName(name, playerNumber)
    {
        var playerText = document.getElementById("player" + playerNumber + "Text");
        playerText.innerHTML = name.toUpperCase();
        if (playerText.getComputedTextLength() > 155)
        {
            playerText.setAttribute("textLength", "155px");
            playerText.setAttribute("lengthAdjust", "spacingAndGlyphs");
        }
    }
    
    addPrizeToPlayer(prize, playerNumber)
    {
        this.claimedPrizes[playerNumber - 1].push(prize);
        if (this.claimedPrizes[playerNumber - 1].length <= 8)
        {
            var prizeDomName = "player" + playerNumber + "Prize" + (this.claimedPrizes[playerNumber - 1].length - 1);
            var prizeRect = document.getElementById(prizeDomName);
            prizeRect.style.fill = "black";
            prizeRect.style.stroke = "white";
            var prizeText = document.getElementById(prizeDomName + "Text");
            prizeText.innerHTML = prize.panelString;
        }
        else
        {
            for (var index = 0; index < 7; ++index)
            {
                var prizeText = document.getElementById("player" + playerNumber + "Prize" + index + "Text");
                var nextPrizeText = document.getElementById("player" + playerNumber + "Prize" + (index + 1) + "Text");
                prizeText.innerHTML = nextPrizeText.innerHTML;
            }
            
            var lastPrizeText = document.getElementById("player" + playerNumber + "Prize7Text");
            lastPrizeText.innerHTML = prize.panelString;
        }
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
