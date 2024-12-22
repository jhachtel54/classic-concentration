class PlayScene
{
    constructor(stageScene, player1Name, player2Name, aiOptions)
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = false;
        this.stageScene = stageScene;
        this.playerNames = [player1Name, player2Name];
        if (aiOptions !== undefined && aiOptions != null)
            this.ai = new AIPlayer(aiOptions);
        else
            this.ai = null;
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
    }
    
    buildDOM(parentElement)
    {
        this.playScene = document.createElement("div");
        this.playScene.id = "playScene";
        this.playScene.classList.add("sceneInnerContainer");
        this.playScene.innerHTML = "" +
            "<div class='uiArea'>" +
                "<div class='container-fluid h-100 p-0'>" +
                    "<div id='playAreaMain' class='row'>" +
                        "<div class='col'></div>" +
                        "<div class='col-10'>" +
                            "<div class='h-100 position-relative' style='background-color:#ff5555; padding: 1vh 1vw;'>" +
                                "<div id='playArea' class='p-0 h-100 position-relative'>" +
                                    "<img id='rebusPuzzle' />" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                        "<div class='col'></div>" +
                    "</div>" +
                    "<div id='playAreaText' class='row'><div class='col text-center'>CONTESTANTS GET READY TO PLAY</div></div>" +
                    "<div id='playAreaSolveRow' class='row'>" +
                        "<div class='col'></div>" +
                        "<div id='solveButton' class='col-2' style='visibility:hidden;'><div><span>SOLVE</span></div></div>" +
                        "<div class='col'></div>" +
                    "</div>" +
                "</div>" +
            "</div>";
            
        parentElement.appendChild(this.playScene);
        
        this.playAreaText = document.getElementById("playAreaText").firstChild;
        this.solveButton = document.getElementById("solveButton");
        this.solveButton.addEventListener("click", this.onSolveClicked.bind(this));
        
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
                var panelDOM = puzzlePanel.GetDOM();
                row.appendChild(panelDOM);
                panelDOM.addEventListener("click", this.onPanelClicked.bind(this));
                this.puzzlePanels.push(puzzlePanel);
            }
        }
        
        setTimeout(function() {
            this.playAreaText.innerHTML = "LOOK AT THIS PUZZLE PIECE";
            this.clearFreePanels();
        }.bind(this), 1500);
    }
    
    GetDOM()
    {
        return this.playScene;
    }
    
    clearFreePanels()
    {
        this.puzzlePanels.forEach(panel => {
            if (panel.prize.value == PrizeManager.blankPrize.value)
            {
                panel.Clear();
                if (this.ai)
                    this.ai.AddAmountSeen(PuzzleManager.GetWeight(panel.id));
                this.puzzlePanels[panel.id] = null;
            }
        });
        
        setTimeout((function() {
            this.changeActivePlayer(0);
        }).bind(this), 1500);
    }
    
    changeActivePlayer(playerNumber)
    {
        this.activePlayer = playerNumber;
        this.playAreaText.innerHTML = this.playerNames[playerNumber] + " SELECT ANY TWO PANELS OR SOLVE THE PUZZLE";
        this.solveButton.style.visibility = "visible";
        this.enableSelecting();
        
        if (playerNumber == 1 && this.ai)
            this.ai.QueueNextChoices(this.puzzlePanels);
    }

    onPanelClicked(evt)
    {
        if (!this.canSelect)
            return;
        
        var id = evt.target.id;
        var number = id.split("-")[1];
        this.performSelect(number);
    }

    performSelect(id)
    {
        this.solveButton.style.visibility = "hidden";
        this.canSelect = false;
        
        if (this.selectionsThisRound.length > 0 && this.puzzlePanels[id].id == this.selectionsThisRound[this.selectionsThisRound.length - 1].id)
        {
            this.enableSelecting();
            return;
        }
        
        this.puzzlePanels[id].Select();
        this.selectionsThisRound.push(this.puzzlePanels[id]);
        if (this.ai)
            this.ai.AddPanelToMemory(this.puzzlePanels[id]);
        
        if (this.selectionsThisRound.length == 2)
        {
            // Neither are wild
            if (this.selectionsThisRound[0].prize.value != PrizeManager.wildPrize.value &&
                this.selectionsThisRound[1].prize.value != PrizeManager.wildPrize.value)
            {
                // // this.canSelect = false;
                // if (this.selectionsThisRound[0].prize.name == this.selectionsThisRound[1].prize.name)
                // {
                    // setTimeout(this.ClearSelected.bind(this), 1000);
                // }
                // else
                // {
                    // setTimeout(this.resetSelected.bind(this), 1000);
                // }
                
                this.playAreaText.innerHTML = "";
                if (this.selectionsThisRound[0].prize.name == this.selectionsThisRound[1].prize.name)
                {
                    // It's a match!
                    setTimeout(function() {
                        switchScene(this.stageScene.GetDOM().id, false);
                        this.stageScene.AwardPrizeToPlayer(this.activePlayer, this.selectionsThisRound[0].prize);
                    }.bind(this), 1000);
                }
                else
                {
                    // Not a match
                    setTimeout(function() {
                        this.resetSelected();
                    }.bind(this), 1000);
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

    ClearSelected()
    {
        this.selectionsThisRound.forEach(panel => {
            panel.Clear();
            if (this.ai)
            {
                this.ai.AddAmountSeen(PuzzleManager.GetWeight(panel.id));
                this.ai.RemovePanelFromMemory(panel.id);
            }
            this.puzzlePanels[panel.id] = null;
        });
        this.selectionsThisRound = [];
        
        this.playAreaText.innerHTML = this.playerNames[this.activePlayer] + " LOOK AT THESE PUZZLE PIECES";
        setTimeout(function() {
            this.changeActivePlayer(this.activePlayer);
        }.bind(this), 1667);
    }

    resetSelected()
    {
        this.selectionsThisRound.forEach(panel => {
            panel.Reset();
        });
        this.selectionsThisRound = [];
        this.changeActivePlayer(this.activePlayer == 0 ? 1 : 0);
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
                setTimeout(this.ClearSelected.bind(this), 1000);
            }
        }
    }

    enableSelecting()
    {
        this.canSelect = true;
    }
    
    onSolveClicked()
    {
        navigator.notification.prompt("What is the answer?", this.onSolveDialogResolve.bind(this), "Puzzle", ["OK", "Cancel"], "");
    }
    
    onSolveDialogResolve(results)
    {
        if (results.buttonIndex == 1)
        {
            alert(PuzzleManager.CheckAnswer(results.input1.toUpperCase()));
        }
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
