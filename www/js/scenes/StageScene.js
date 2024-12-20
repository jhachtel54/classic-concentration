class StageScene
{
    constructor()
    {
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
        //this.clearFreePanels();
    }
    
    buildDOM(parentElement)
    {
        var stageAreaContainer = document.createElement("div");
        stageAreaContainer.id = "stageAreaContainer";
        stageAreaContainer.classList.add("sceneInnerContainer");
        parentElement.appendChild(stageAreaContainer);
        
        stageAreaContainer.innerHTML = "" +
            "<svg id='scoreboardSVG' viewBox='0 0 1280 800' preserveAspectRatio='none' class='position-absolute w-100 h-100'>" +
                "<rect x='344' y='156' width='280' height='44' rx='16' ry='16' fill='black' />" +
                "<path id='player1TextPath' d='M360 192 l248 0' />" +
                "<text><textPath id='player1Text' class='playerText' href='#player1TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                "<rect x='656' y='156' width='280' height='44' rx='16' ry='16' fill='black' />" +
                "<path id='player2TextPath' d='M672 192 l248 0' />" +
                "<text><textPath id='player2Text' class='playerText' href='#player2TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                "<g id='prizeBoard'></g>" +
                "<g id='player1Sprite'></g>" +
                "<g id='player2Sprite'></g>" +
            "</svg>" +
            "<div id='stageAreaUI' class='uiArea'>" +
                "<div class='position-absolute' style='left:30%; top:0px; width:40%; height:100%; background-color:#ff5555;'>" +
                    "<div class='position-absolute' style='left:5%; top:5%; width:90%; height:90%; background-color:#ffff55;'>" +
                        "<div class='position-absolute container-fluid' style='left:2%; top:2%; width:96%; height:96%; background-color:#ff5555;'>" +
                            "<div class='row h-25'>" +
                                "<div class='col-2'></div>" +
                                "<div class='col'>PLAYER 1</div>" +
                                "<div class='col-2'></div>" +
                            "</div>" +
                            "<div class='row h-50'>" +
                                "<div class='col-1 h-100'></div>" +
                                "<div class='col-1 h-100'><</div>" +
                                "<div class='col h-100'>" +
                                    "<svg viewBox='0 0 160 228' class='w-100 h-100'>" +
                                        "<use width='160' height='228' href='#male1Idle' />" +
                                    "</svg>" +
                                "</div>" +
                                "<div class='col-1 h-100'>></div>" +
                                "<div class='col-1 h-100'></div>" +
                            "</div>" +
                            "<div class='row h-25'>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>" +
        "";
        
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
        
        // this.setPlayerName(this.player1Name, 1);
        // this.setPlayerName(this.player2Name, 2);
        
        // this.player1Avatar = new Avatar("male", 1, "JAMES");
        // this.setPlayerSprite(this.player1Avatar.SetState("idle"), 1);
        // setTimeout((function() {
            // this.setPlayerSprite(this.player1Avatar.SetState("look"), 1);
        // }).bind(this), 5000);
        
        // this.addPrizeToPlayer(new Prize("ONE", 1200), 1);
        // this.addPrizeToPlayer(new Prize("TWO", 1200), 1);
        // this.addPrizeToPlayer(new Prize("THREE", 1200), 1);
        // this.addPrizeToPlayer(new Prize("FOUR", 1200), 1);
        // this.addPrizeToPlayer(new Prize("FIVE", 1200), 1);
        // this.addPrizeToPlayer(new Prize("SIX", 1200), 1);
        // this.addPrizeToPlayer(new Prize("SEVEN", 1200), 1);
        // this.addPrizeToPlayer(new Prize("EIGHT", 1200), 1);
        // this.addPrizeToPlayer(new Prize("NINE", 1200), 1);
        // this.addPrizeToPlayer(new Prize("TEN", 1200), 1);
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

    Update(deltaTime)
    {
        // var p1Update = this.player1Avatar.UpdateAnimation(deltaTime);
        // if (p1Update != null)
        // {
            // if (p1Update == Animation.END_EVENT_NAME)
                // console.log("Animation finished");
            // else
                // this.setPlayerSprite(p1Update, 1);
        // }
    }
}
