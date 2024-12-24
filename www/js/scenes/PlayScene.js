class PlayScene
{
    constructor(stageScene, player1Name, player2Name, ai)
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = false;
        this.stageScene = stageScene;
        this.playerNames = [player1Name, player2Name];
        this.ai = ai;
        this.aiDelay = 750;
        this.aiTimer = 0;
        this.activePlayer = -1;
    }
    
    init(parentElement)
    {
        AudioPlayer.Stop("intro");
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
                        "<div id='solveButtons' class='col-2 d-flex justify-content-between' style='visibility:hidden;'>" +
                            "<div id='solveButton'><div><span>SOLVE</span></div></div>" +
                            "<div id='yesSolveButton' style='display:none;'><div><span>YES</span></div></div>" +
                            "<div id='noSolveButton' style='display:none;'><div><span>NO</span></div></div>" +
                        "</div>" +
                        "<div class='col'></div>" +
                    "</div>" +
                "</div>" +
            "</div>";
            
        parentElement.appendChild(this.playScene);
        
        this.playAreaText = document.getElementById("playAreaText").firstChild;
        this.solveButtons = document.getElementById("solveButtons");
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
        if (this.activePlayer == playerNumber)
            AudioPlayer.Play("prompt");
        else
            this.activePlayer = playerNumber;
        this.solveButtons.style.visibility = "visible";
        
        var remainingPanels = this.puzzlePanels.filter(panel => { return panel != null; });
        if (remainingPanels.length > 3)
        {
            this.startNextRound();
        }
        else
        {
            remainingPanels.forEach(panel => { panel.Clear(); });
            this.startFinalRound();
        }
    }
    
    startNextRound()
    {
        this.playAreaText.innerHTML = this.playerNames[this.activePlayer] + " SELECT ANY TWO PANELS OR SOLVE THE PUZZLE";
        this.enableSelecting();
        
        if (this.activePlayer == 1 && this.ai)
        {
            if (!this.ai.WantsToSolvePuzzle())
                this.ai.QueueNextChoices(this.puzzlePanels);
        }
    }
    
    startFinalRound()
    {
        this.isInFinalRound = true;
        this.wrongFinalAnswers = 0;
        this.playAreaText.innerHTML = this.playerNames[this.activePlayer] + " CAN YOU SOLVE THE PUZZLE?";
        this.solveButton.style.display = "none";
        
        var yesButton = document.getElementById("yesSolveButton");
        yesButton.style.display = "flex";
        var noButton = document.getElementById("noSolveButton");
        noButton.style.display = "flex";
        
        yesButton.addEventListener("click", this.onSolveClicked.bind(this));
        noButton.addEventListener("click", this.incorrectFinalAnswerGiven.bind(this));
    }
    
    incorrectFinalAnswerGiven()
    {
        ++this.wrongFinalAnswers;
        if (this.wrongFinalAnswers == 1)
        {
            this.activePlayer = this.activePlayer == 0 ? 1 : 0;
            this.playAreaText.innerHTML = this.playerNames[this.activePlayer] + " CAN YOU SOLVE THE PUZZLE?";
        }
        else
        {
            this.activePlayer = 2;
            this.ShowAnswer();
        }
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
        AudioPlayer.Play("select");
        this.solveButtons.style.visibility = "hidden";
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
                this.playAreaText.innerHTML = "";
                if (this.selectionsThisRound[0].prize.name == this.selectionsThisRound[1].prize.name)
                {
                    // It's a match!
                    setTimeout(function() {
                        switchScene(this.stageScene.GetDOM().id, false);
                        AudioPlayer.Play("transition");
                        this.stageScene.AwardPrizeToPlayer(this.activePlayer, this.selectionsThisRound[0].prize, false);
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
                    setTimeout(function() {
                        switchScene(this.stageScene.GetDOM().id, false);
                        AudioPlayer.Play("transition");
                        this.stageScene.AwardPrizeToPlayer(this.activePlayer, notWildPanel.prize, false);
                    }.bind(this), 1000);
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
                setTimeout(function() {
                    switchScene(this.stageScene.GetDOM().id, false);
                    AudioPlayer.Play("transition");
                    this.stageScene.AwardPrizeToPlayer(this.activePlayer, this.selectionsThisRound[2].prize, true);
                }.bind(this), 1000);
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
        if (this.isInFinalRound)
        {
            this.incorrectFinalAnswerGiven();
            return;
        }
        
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
        AudioPlayer.Play("reset");
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
                AudioPlayer.Play("select");
                this.puzzlePanels[index].Select();
                this.selectionsThisRound.push(this.puzzlePanels[index]);
            }
        }
    }

    enableSelecting()
    {
        if (this.activePlayer == 1 && this.ai != null)
            this.canSelect = false;
        else
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
            switchScene(this.stageScene.GetDOM().id, false);
            AudioPlayer.Play("transition");
            this.stageScene.PlayerGuess(this.activePlayer, results.input1.toUpperCase().trim());
        }
    }
    
    ShowAnswer()
    {
        this.stopUpdating = true;
        
        this.solveButtons.style.visibility = "hidden";
        this.puzzlePanels.forEach(panel => {
            if (panel != null)
                panel.Clear();
        });
        if (this.activePlayer == 2)
            this.playAreaText.innerHTML = PuzzleManager.GetAnswer() + "<br>NO ONE SOLVED IT<br>PRESS ANYWHERE TO CONTINUE</br>";
        else
            this.playAreaText.innerHTML = PuzzleManager.GetAnswer() + "<br>" + this.playerNames[this.activePlayer] + " SOLVED IT! PRESS ANYWHERE TO CONTINUE";
        
        this.playScene.addEventListener("click", function() {
            addScene(new TitleScene(false), true);
        });
    }

    Update(deltaTime)
    {
        if (this.stopUpdating)
            return;
        
        if (this.ai && this.ai.choicesQueue.length > 0)
        {
            this.aiTimer += deltaTime;
            if (this.aiTimer > this.aiDelay)
            {
                this.performSelect(this.ai.choicesQueue.shift());
                this.aiTimer = 0;
            }
        }
        else if (this.ai && this.activePlayer == 1 && this.ai.WantsToSolvePuzzle())
        {
            this.aiTimer += deltaTime;
            if (this.aiTimer > this.aiDelay)
            {
                var aiTypingPrefix = this.playerNames[1] + ": ";
                var answer = PuzzleManager.GetAnswer();
                if (this.solveButtons.style.visibility == "visible")
                {
                    this.solveButtons.style.visibility = "hidden";
                    this.playAreaText.innerHTML = aiTypingPrefix;
                    this.aiDelay = (this.aiDelay * 4) / answer.length;
                }
                else if (this.playAreaText.innerHTML.length == answer.length + aiTypingPrefix.length)
                {
                    switchScene(this.stageScene.GetDOM().id, false);
                    AudioPlayer.Play("transition");
                    this.stageScene.PlayerGuess(this.activePlayer, answer);
                }
                else
                {
                    this.playAreaText.innerHTML += answer[this.playAreaText.innerHTML.length - aiTypingPrefix.length];
                    // If the next character is a space, add that too
                    if (answer[this.playAreaText.innerHTML.length - aiTypingPrefix.length] == " ")
                        this.playAreaText.innerHTML += " ";
                    // If we have finished typing, return the delay speed to the original value
                    if (this.playAreaText.innerHTML.length == answer.length + aiTypingPrefix.length)
                    {
                        this.aiDelay = this.aiDelay * answer.length * 0.25;
                    }
                }
                this.aiTimer = 0;
            }
        }
    }
}
