class BonusScene
{
    constructor(player)
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = true;
        this.countdown = 35000;
        this.started = false;
        this.countdownElement = null;
        this.numMatches = 0;
        this.player = player;
    }
    
    init(parentElement)
    {
        this.countdown += loadNumericalValue("bonusMilliseconds");
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
                    "<div id='bonusAreaText' class='row'><div class='col text-center'></div></div>" +
                "</div>" +
            "</div>";
            
        parentElement.appendChild(this.scene);
        
        this.bonusAreaText = document.getElementById("bonusAreaText").firstChild;
        this.bonusAreaText.innerHTML = this.player.name + "<br>TAP ANY PANEL TO BEGIN";

        this.countdownElement = document.getElementById("countdownText");
        this.countdownElement.innerHTML = this.countdown / 1000;
        
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

    onPanelClicked(evt)
    {
        if (!this.canSelect || this.countdown < 0)
            return;
        
        var id = evt.target.id;
        var number = id.split("-")[1];
        this.performSelect(number);
    }

    performSelect(id)
    {
        if (this.started)
        {
            AudioPlayer.Play("select");
        }
        else
        {
            this.started = true;
            this.bonusAreaText.innerHTML = this.player.name;
            AudioPlayer.Play("start");
        }

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
            if (this.selectionsThisRound[0].prize.name == this.selectionsThisRound[1].prize.name)
            {
                // It's a match!
                if (this.incrementAndCheckWin() == false)
                {
                    setTimeout(function() {
                        this.startNextRound();
                    }.bind(this), 250);
                }
            }
            else
            {
                // Not a match
                setTimeout(function() {
                    this.resetSelected();
                }.bind(this), 250);
            }
        }
        else
        {
            this.canSelect = true;
        }
    }

    incrementAndCheckWin()
    {
        ++this.numMatches;
        if (this.numMatches < 7)
            return false;

        var winningPrize = this.selectionsThisRound[0].prize;
        this.canSelect = false;
        this.started = false;
        AudioPlayer.Play("correct");
        window.localStorage.setItem("bonusMilliseconds", 0);
        this.puzzlePanels.forEach(panel => {
            if (panel != null)
                panel.Clear(true);
        });
        this.ShowResult(winningPrize.name);
    }

    clearSelected()
    {
        this.selectionsThisRound.forEach(panel => {
            panel.Clear(true);
            this.puzzlePanels[panel.id] = null;
        });
    }

    startNextRound()
    {
        this.clearSelected();
        this.selectionsThisRound = [];
        this.canSelect = true;
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
    
    ShowResult(prizeName)
    {
        var prizeString;
        if (prizeName == null)
        {
            prizeString = this.player.name + " DID NOT WIN A CAR";
        }
        else
        {
            prizeString = this.player.name + " WON A BRAND NEW " + prizeName + "!";
        }

        prizeString += "<br>TAP ANYWHERE TO CONTINUE";
        this.bonusAreaText.innerHTML = prizeString;
        
        setTimeout(function() {
            this.scene.addEventListener("click", function() {
                addScene(new TitleScene(false), true);
            });
        }.bind(this), 1);
    }

    Update(deltaTime)
    {
        if (this.started)
        {
            this.countdown -= deltaTime;
            var seconds = ("" + Math.ceil(this.countdown / 1000)).padStart(2, '0');
            if (seconds != this.countdownElement.innerHTML)
            {
                this.countdownElement.innerHTML = seconds;
                AudioPlayer.Play("tick");
            }
            if (this.countdown <= 0)
            {
                // We've lost
                this.canSelect = false;
                this.started = false;
                AudioPlayer.Play("wrong");
                var bonusMilliseconds = loadNumericalValue("bonusMilliseconds") + 5000;
                window.localStorage.setItem("bonusMilliseconds", bonusMilliseconds);
                this.ShowResult(null);
            }
        }
    }
}
