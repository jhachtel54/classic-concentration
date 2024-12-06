class PlayScene
{
    constructor()
    {
        this.puzzlePanels = [];
        this.selectionsThisRound = [];
        this.canSelect = false;
        this.ai = new AIPlayer(0.8, 3);
        this.stageAreaContainer = null;
        this.playAreaContainer = null;
        this.player1Text = null;
        this.player2Text = null;
        this.scoreboardSVG = null;
        this.claimedPrizes = [[], []];
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
                            "<div class='col-1'></div>" +
                            "<div id='stage' class='col-10 position-relative p-0'>" +
                                "<svg id='scoreboardSVG' viewBox='0 0 680 400' preserveAspectRatio='none' class='position-absolute w-100 h-100'>" +
                                    "<rect x='140' y='72' width='400' height='225' fill='white' />" +
                                    "<rect x='155' y='82' width='175' height='28' rx='10' ry='10' fill='black' />" +
                                    "<path id='player1TextPath' d='M165 105 l155 0' style='fill:none;stroke:none;' />" +
                                    "<text style='fill:#ff55ff; font-size:2em;'>" +
                                        "<textPath id='player1Text' href='#player1TextPath' text-anchor='middle' startOffset='50%'></textPath>" +
                                    "</text>" +
                                    "<rect x='350' y='82' width='175' height='28' rx='10' ry='10' fill='black' />" +
                                    "<path id='player2TextPath' d='M360 105 l155 0' style='fill:none;stroke:none;' />" +
                                    "<text style='fill:#ff55ff; font-size:2em;'>" +
                                        "<textPath id='player2Text' href='#player2TextPath' text-anchor='middle' startOffset='50%'></textPath>" +
                                    "</text>" +
                                "</svg>" +
                            "</div>" +
                            "<div class='col-1'></div>" +
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
        
        this.player1Text = document.getElementById("player1Text");
        if (this.player1Text.getComputedTextLength() > 155)
        {
            this.player1Text.setAttribute("textLength", "155px");
            this.player1Text.setAttribute("lengthAdjust", "spacingAndGlyphs");
        }
        
        this.player2Text = document.getElementById("player2Text");
        if (this.player2Text.getComputedTextLength() > 155)
        {
            this.player2Text.setAttribute("textLength", "155px");
            this.player2Text.setAttribute("lengthAdjust", "spacingAndGlyphs");
        }
        
        this.scoreboardSVG = document.getElementById("scoreboardSVG");
        for (var index = 0, y = 120, prizeHeight = 18, stroke = 2; index < 8; ++index, y += prizeHeight)
        {
            var prize1SVG = document.createElementNS('http://www.w3.org/2000/svg','rect');
            setAttributes(prize1SVG, {
                id: "player1prize" + index,
                x: 156,
                y: y + (index * stroke),
                width: 183,
                height: prizeHeight,
                style: "fill:black; stroke-width:" + stroke + "; stroke:white;"
            });
            var prize2SVG = document.createElementNS('http://www.w3.org/2000/svg','rect');
            setAttributes(prize2SVG, {
                id: "player2prize" + index,
                x: 341,
                y: y + (index * stroke),
                width: 183,
                height: prizeHeight,
                style: "fill:#55ffff; stroke-width:" + stroke + "; stroke:black;"
            });
            this.scoreboardSVG.appendChild(prize1SVG);
            this.scoreboardSVG.appendChild(prize2SVG);
            
            var prize1SVGText = document.createElementNS('http://www.w3.org/2000/svg','text');
            setAttributes(prize1SVGText, {
                fill: "#ff55ff",
                style: "font-size:1.5em; font-weight:bold;",
                x: 158,
                y: y + (index * stroke) + prizeHeight - stroke
            });
            prize1SVGText.innerHTML = "DIAMOND RING";
            scoreboardSVG.appendChild(prize1SVGText);
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
