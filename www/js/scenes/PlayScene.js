class PlayScene
{
    constructor(player1Name, player1SpriteSrc, player2Name, player2SpriteSrc, aiOptions)
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = false;
        this.stageAreaContainer = null;
        this.playAreaContainer = null;
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
            "<div id='stageAreaContainer' class='sceneInnerContainer'>" +
                "<svg id='scoreboardSVG' viewBox='0 0 1280 800' preserveAspectRatio='none' class='position-absolute w-100 h-100'>" +
                    "<rect x='344' y='156' width='280' height='44' rx='16' ry='16' fill='black' />" +
                    "<path id='player1TextPath' d='M360 192 l248 0' />" +
                    "<text><textPath id='player1Text' class='playerText' href='#player1TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                    "<rect x='656' y='156' width='280' height='44' rx='16' ry='16' fill='black' />" +
                    "<path id='player2TextPath' d='M672 192 l248 0' />" +
                    "<text><textPath id='player2Text' class='playerText' href='#player2TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                    "<g id='prizeBoard'></g>" +
                    "<g id='player1Sprite'></g>" +
                    "<g id='player2Sprite'><use width='160' height='228' href='#male2Look2' transform='scale(-1, 1) translate(-928, 276)' /></g>" +
                "</svg>" +
                "<div id='stageAreaUI' class='uiArea'></div>" +
            "</div>" +
            // "<div id='playAreaContainer' class='container-fluid sceneInnerContainer' style='display:none;'>" +
                // "<div id='playAreaMain' class='row mainArea'>" +
                    // "<div class='col'>" +
                        // "<div id='playArea' class='p-0 h-100 position-relative'>" +
                            // "<img id='rebusPuzzle' />" +
                        // "</div>" +
                    // "</div>" +
                // "</div>" +
                // "<div id='playAreaText' class='row textArea'></div>" +
            // "</div>";
            "";
        
        // var puzzleNode = document.getElementById("rebusPuzzle");
        // puzzleNode.src = PuzzleManager.SelectPuzzle();
        
        // var prizePool = PrizeManager.GeneratePrizePool(11, 2, 2);
        // var playArea = document.getElementById("playArea");
        // for (var rowIndex = 0; rowIndex < 5; ++rowIndex)
        // {
            // var row = document.createElement("div");
            // row.classList.add("row", "h-20", "m-0");
            // playArea.appendChild(row);
            // for (var colIndex = 0; colIndex < 5; ++colIndex)
            // {
                // var id = rowIndex * 5 + colIndex;
                // var puzzlePanel = new PuzzlePanel(prizePool[id], id);
                // row.appendChild(puzzlePanel.GetDOM());
                // this.puzzlePanels.push(puzzlePanel);
            // }
        // }
        
        var prizeBoard = document.getElementById("prizeBoard");
        var player1Left = 350;
        var y = 216;
        var prizeHeight = 28;
        var prizeWidth = 288;
        var stroke = 4;
        var player2Left = player1Left + prizeWidth + stroke;
        for (var index = 0; index < 8; ++index, y += prizeHeight)
        {
            var prizeBottom = y + index * stroke;
            prizeBoard.innerHTML += "" +
                "<rect id='player1Prize" + index + "' x=" + player1Left + " y=" + prizeBottom + " width=" + prizeWidth + " height=" + prizeHeight + " style='fill:#55ffff; stroke-width:" + stroke + "; stroke:black;' />" +
                "<path id='player1Prize" + index + "TextPath' d='M" + (player1Left + stroke) + " " + (prizeBottom + prizeHeight - stroke) + " l" + (prizeWidth - stroke * 2) + " 0' />" +
                "<text><textPath class='scoreboardPrizeText' id='player1Prize" + index + "Text' href='#player1Prize" + index + "TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                "<rect id='player2Prize" + index + "' x=" + player2Left + " y=" + prizeBottom + " width=" + prizeWidth + " height=" + prizeHeight + " style='fill:#55ffff; stroke-width:" + stroke + "; stroke:black;' />" +
                "<path id='player2Prize" + index + "TextPath' d='M" + (player2Left + stroke) + " " + (prizeBottom + prizeHeight - stroke) + " l" + (prizeWidth - stroke * 2) + " 0' />" +
                "<text><textPath class='scoreboardPrizeText' id='player2Prize" + index + "Text' href='#player2Prize" + index + "TextPath' text-anchor='middle' startOffset='50%'></textPath></text>";
        }
        
        this.setPlayerName(this.player1Name, 1);
        this.setPlayerName(this.player2Name, 2);
        
        this.player1Avatar = new Avatar("male", 1, "JAMES");
        this.setPlayerSprite(this.player1Avatar.SetState("idle"), 1);
        setTimeout((function() {
            this.setPlayerSprite(this.player1Avatar.SetState("look"), 1);
        }).bind(this), 5000);
        
        this.addPrizeToPlayer(new Prize("ONE", 1200), 1);
        this.addPrizeToPlayer(new Prize("TWO", 1200), 1);
        this.addPrizeToPlayer(new Prize("THREE", 1200), 1);
        this.addPrizeToPlayer(new Prize("FOUR", 1200), 1);
        this.addPrizeToPlayer(new Prize("FIVE", 1200), 1);
        this.addPrizeToPlayer(new Prize("SIX", 1200), 1);
        this.addPrizeToPlayer(new Prize("SEVEN", 1200), 1);
        this.addPrizeToPlayer(new Prize("EIGHT", 1200), 1);
        this.addPrizeToPlayer(new Prize("NINE", 1200), 1);
        this.addPrizeToPlayer(new Prize("TEN", 1200), 1);
    }
    
    setPlayerName(name, playerNumber)
    {
        var playerText = document.getElementById("player" + playerNumber + "Text");
        playerText.innerHTML = name.toUpperCase();
        this.adjustTextLength(playerText, 248);
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
            prizeText.innerHTML = prize.name;
            this.adjustTextLength(prizeText, 280);
        }
        else
        {
            // If longer than 8, prizes actually wrap around to the other player's side.
            // For example, player 1's 9th prize, would go into the final slot of player 2.
            var opponentNumber = playerNumber == 1 ? 2 : 1;
            var opponentSlot = 7 - (this.claimedPrizes[playerNumber - 1].length - 9);
            
            var prizeDomName = "player" + opponentNumber + "Prize" + opponentSlot;
            var prizeRect = document.getElementById(prizeDomName);
            prizeRect.style.fill = "black";
            prizeRect.style.stroke = "white";
            var prizeText = document.getElementById(prizeDomName + "Text");
            prizeText.innerHTML = prize.name;
            this.adjustTextLength(prizeText, 280);
        }
    }
    
    setPlayerSprite(href, playerNumber)
    {
        if (playerNumber == 1)
        {
            document.getElementById("player1Sprite").innerHTML = "<use width='160' height='228' href='#" + href + "' transform='translate(352, 276)' />";
        }
        else
        {
            document.getElementById("player2Sprite").innerHTML = "<use width='160' height='228' href='#" + href + "' transform='scale(-1, 1) translate(-928, 276)' />";
        }
    }
    
    adjustTextLength(element, width)
    {
        if (element.getComputedTextLength() > width)
        {
            element.setAttribute("textLength", width + "px");
            element.setAttribute("lengthAdjust", "spacingAndGlyphs");
        }
        else
        {
            element.removeAttribute("textLength");
            element.removeAttribute("lengthAdjust");
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
        var p1Update = this.player1Avatar.UpdateAnimation(deltaTime);
        if (p1Update != null)
        {
            if (p1Update == Animation.END_EVENT_NAME)
                console.log("Animation finished");
            else
                this.setPlayerSprite(p1Update, 1);
        }
    }
}
