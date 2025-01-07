class BonusScene
{
    constructor()
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = true;
        this.countdown = 35000;
        this.started = false;
        this.countdownElement = null;
        this.numMatches = 0;
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
    }
    
    buildDOM(parentElement)
    {
        this.scene = document.createElement("div");
        this.scene.id = "bonusScene";
        this.scene.classList.add("sceneInnerContainer");
        this.scene.innerHTML = "" +
            "<div class='uiArea'>" +
                "<div class='container-fluid h-100 p-0'>" +
                    "<div id='bonusAreaMain' class='row' style='background-color:black;'>" +
                        "<div class='col-1' style='background-color:black;'></div>" +
                        "<div class='col-10' style='background-color:#ff5555;'>" +
                            "<div class='container-fluid h-100 p-0'>" +
                                "<div class='row h-100'>" +
                                    "<div class='col-7'>" +
                                        "<div class='h-100 position-relative' style='padding: 1vh 0vw;'>" +
                                            "<div id='bonusArea' class='p-0 h-100 position-relative'></div>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='col-5' style='padding:1vh 1vw;'>" +
                                        "<div class='container-fluid h-100 p-0'>" +
                                            "<div class='row h-50' style='padding:1vh 0vw;'>" +
                                                "<img id='bonusImage' src='img/Bonus-Round.png' />" +
                                            "</div>" +
                                            "<div class='row h-50' style='padding:1vh 0vw;'>" +
                                                "<div class='h-100 w-100' style='background-color:#55ff55; padding:1vh 0.5vw;'>" +
                                                    "<div id='countdown'>" +
                                                        "<span id='countdownText'>35</span>" +
                                                    "</div>" +
                                                "</div>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                        "<div class='col-1' style='background-color:black'></div>" +
                    "</div>" +
                    // "<div id='playAreaText' class='row'><div class='col text-center'>CONTESTANTS GET READY TO PLAY</div></div>" +
                    // "<div id='playAreaSolveRow' class='row'>" +
                        // "<div class='col'></div>" +
                        // "<div id='solveButtons' class='col-2 d-flex justify-content-between' style='visibility:hidden;'>" +
                            // "<div id='solveButton'><div><span>SOLVE</span></div></div>" +
                            // "<div id='yesSolveButton' style='display:none;'><div><span>YES</span></div></div>" +
                            // "<div id='noSolveButton' style='display:none;'><div><span>NO</span></div></div>" +
                        // "</div>" +
                        // "<div class='col'></div>" +
                    // "</div>" +
                "</div>" +
            "</div>";
            
        parentElement.appendChild(this.scene);
        
        // this.playAreaText = document.getElementById("playAreaText").firstChild;
        // this.solveButtons = document.getElementById("solveButtons");
        // this.solveButton = document.getElementById("solveButton");
        // this.solveButton.addEventListener("click", this.onSolveClicked.bind(this));
        
        // var puzzleNode = document.getElementById("rebusPuzzle");
        // puzzleNode.src = PuzzleManager.SelectPuzzle();
        
        this.countdownElement = document.getElementById("countdownText");
        
        var prizePool = PrizeManager.GenerateCarPool();
        var bonusArea = document.getElementById("bonusArea");
        for (var rowIndex = 0; rowIndex < 5; ++rowIndex)
        {
            var row = document.createElement("div");
            row.classList.add("row", "h-20", "m-0");
            bonusArea.appendChild(row);
            for (var colIndex = 0; colIndex < 3; ++colIndex)
            {
                var id = rowIndex * 3 + colIndex;
                var puzzlePanel = new PuzzlePanel(prizePool[id], id);
                var panelDOM = puzzlePanel.GetDOM();
                row.appendChild(panelDOM);
                panelDOM.addEventListener("click", this.onPanelClicked.bind(this));
                this.puzzlePanels.push(puzzlePanel);
            }
        }
    }
    
    GetDOM()
    {
        return this.scene;
    }
    
    // startNextRound()
    // {
        // this.playAreaText.innerHTML = this.playerNames[this.activePlayer] + " SELECT ANY TWO PANELS OR SOLVE THE PUZZLE";
        // this.enableSelecting();
        
        // if (this.activePlayer == 1 && this.ai)
        // {
            // if (!this.ai.WantsToSolvePuzzle())
                // this.ai.QueueNextChoices(this.puzzlePanels);
        // }
    // }

    onPanelClicked(evt)
    {
        if (!this.canSelect || this.countdown < 0)
            return;
        
        this.started = true;
        var id = evt.target.id;
        var number = id.split("-")[1];
        this.performSelect(number);
    }

    performSelect(id)
    {
        AudioPlayer.Play("select");
        this.canSelect = false;
        
        if (this.selectionsThisRound.length > 0 && this.puzzlePanels[id].id == this.selectionsThisRound[this.selectionsThisRound.length - 1].id)
        {
            this.canSelect = true;
            return;
        }
        
        this.puzzlePanels[id].Select();
        this.selectionsThisRound.push(this.puzzlePanels[id]);
        
        if (this.selectionsThisRound.length == 2)
        {
            // this.playAreaText.innerHTML = "";
            if (this.selectionsThisRound[0].prize.name == this.selectionsThisRound[1].prize.name)
            {
                // It's a match!
                setTimeout(function() {
                    this.clearSelected();
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
        else
        {
            this.canSelect = true;
        }
    }

    clearSelected()
    {
        ++this.numMatches;
        this.selectionsThisRound.forEach(panel => {
            panel.Clear(true);
            this.puzzlePanels[panel.id] = null;
        });
        this.selectionsThisRound = [];
        
        if (this.numMatches < 7)
        {
            this.canSelect = true;
        }
        else
        {
            this.canSelect = false;
        }
        
        // this.playAreaText.innerHTML = this.playerNames[this.activePlayer] + " LOOK AT THESE PUZZLE PIECES";
        // setTimeout(function() {
            // this.changeActivePlayer(this.activePlayer);
        // }.bind(this), 1667);
    }

    resetSelected()
    {
        AudioPlayer.Play("reset");
        this.selectionsThisRound.forEach(panel => {
            panel.Reset();
        });
        this.selectionsThisRound = [];
        this.canSelect = true;
    }
    
    ShowAnswer()
    {
        // this.stopUpdating = true;
        
        // this.solveButtons.style.visibility = "hidden";
        // this.puzzlePanels.forEach(panel => {
            // if (panel != null)
                // panel.Clear();
        // });
        // if (this.activePlayer == 2)
            // this.playAreaText.innerHTML = PuzzleManager.GetAnswer() + "<br>NO ONE SOLVED IT... TAP ANYWHERE TO CONTINUE</br>";
        // else
            // this.playAreaText.innerHTML = PuzzleManager.GetAnswer() + "<br>" + this.playerNames[this.activePlayer] + " SOLVED IT! TAP ANYWHERE TO CONTINUE";
        
        // this.playScene.addEventListener("click", function() {
            // addScene(new TitleScene(false), true);
        // });
    }

    Update(deltaTime)
    {
        if (this.started)
        {
            this.countdown -= deltaTime;
            this.countdownElement.innerHTML = ("" + Math.ceil(this.countdown / 1000)).padStart(2, '0');
            if (this.countdown <= 0)
                this.started = false;
        }
    }
}
