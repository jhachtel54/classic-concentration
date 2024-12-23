class StageScene
{
    constructor()
    {
        this.avatars = ["male1", "male2", "male3", "male4", "female1", "female2", "female3", "female4"];
        this.currentAvatar = 0;
        this.playerCreationState = "1";
        this.playerAvatars = [null, null];
        this.claimedPrizes = [[], []];
        this.playScene = null;
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
        //this.clearFreePanels();
    }
    
    buildDOM(parentElement)
    {
        this.stageScene = document.createElement("div");
        this.stageScene.id = "stageScene";
        this.stageScene.classList.add("sceneInnerContainer");
        parentElement.appendChild(this.stageScene);
        
        this.stageScene.innerHTML = "" +
            "<svg id='scoreboardSVG' viewBox='0 0 1280 800' preserveAspectRatio='none' class='position-absolute w-100 h-100'>" +
                "<rect x='344' y='156' width='280' height='44' rx='16' ry='16' fill='black' />" +
                "<path id='player0TextPath' d='M360 192 l248 0' />" +
                "<text><textPath id='player0Text' class='playerText' href='#player0TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                "<rect x='656' y='156' width='280' height='44' rx='16' ry='16' fill='black' />" +
                "<path id='player1TextPath' d='M672 192 l248 0' />" +
                "<text><textPath id='player1Text' class='playerText' href='#player1TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                "<g id='prizeBoard'></g>" +
                "<g id='player0Sprite'></g>" +
                "<g id='player1Sprite'></g>" +
            "</svg>" +
            "<div id='stageAreaUI' class='uiArea'>" +
                "<div id='characterSelectDialog' class='position-absolute'>" +
                    "<div class='position-absolute'>" +
                        "<div class='position-absolute container-fluid'>" +
                            "<div class='row h-15'>" +
                                "<div class='col-2'></div>" +
                                "<div id='characterSelectTitle' class='col text-center m-auto'>PLAYER 1</div>" +
                                "<div class='col-2'></div>" +
                            "</div>" +
                            "<div class='row h-50'>" +
                                "<div id='prevAvatarButton' class='col-2 text-end m-auto' style='font-size:8rem;'>🡄</div>" +
                                "<div class='col h-100'>" +
                                    "<svg id='characterSelectAvatar' viewBox='0 0 160 228' class='w-100 h-100'>" +
                                        "<use width='160' height='228' href='#male1Idle' />" +
                                    "</svg>" +
                                "</div>" +
                                "<div id='nextAvatarButton' class='col-2 text-begin m-auto' style='font-size:8rem;'>🡆</div>" +
                            "</div>" +
                            "<div class='row h-5'></div>" +
                            "<div class='row h-10'>" +
                                "<div class='col-1'></div>" +
                                "<div class='col-4'>NAME</div>" +
                                "<input id='playerNameTextBox' type='text' class='col' />" +
                                "<div class='col-1'></div>" +
                            "</div>" +
                            "<div class='row h-5'></div>" +
                            "<div class='row h-10'>" +
                                "<div class='col d-flex justify-content-between text-center' style='font-size:3.25rem; margin:0px 2%;'>" +
                                    "<div id='characterSelectButton1' class='m-auto characterSelectButton'>ADD PLAYER 2</div>" +
                                    "<div id='characterSelectButton2' class='m-auto characterSelectButton'>ADD AI PLAYER</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='row h-5'></div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div id='resultText' class='text-center'></div>" +
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
                "<rect id='player0Prize" + index + "' x=" + player1Left + " y=" + prizeBottom + " width=" + prizeWidth + " height=" + prizeHeight + " style='fill:#55ffff; stroke-width:" + stroke + "; stroke:black;' />" +
                "<path id='player0Prize" + index + "TextPath' d='M" + (player1Left + stroke) + " " + (prizeBottom + prizeHeight - stroke) + " l" + (prizeWidth - stroke * 2) + " 0' />" +
                "<text><textPath class='scoreboardPrizeText' id='player0Prize" + index + "Text' href='#player0Prize" + index + "TextPath' text-anchor='middle' startOffset='50%'></textPath></text>" +
                "<rect id='player1Prize" + index + "' x=" + player2Left + " y=" + prizeBottom + " width=" + prizeWidth + " height=" + prizeHeight + " style='fill:#55ffff; stroke-width:" + stroke + "; stroke:black;' />" +
                "<path id='player1Prize" + index + "TextPath' d='M" + (player2Left + stroke) + " " + (prizeBottom + prizeHeight - stroke) + " l" + (prizeWidth - stroke * 2) + " 0' />" +
                "<text><textPath class='scoreboardPrizeText' id='player1Prize" + index + "Text' href='#player1Prize" + index + "TextPath' text-anchor='middle' startOffset='50%'></textPath></text>";
        }
        
        var prevAvatarButton = document.getElementById("prevAvatarButton");
        prevAvatarButton.addEventListener("click", this.selectPrevAvatar.bind(this));
        var nextAvatarButton = document.getElementById("nextAvatarButton");
        nextAvatarButton.addEventListener("click", this.selectNextAvatar.bind(this));
        var characterSelectButton1 = document.getElementById("characterSelectButton1");
        characterSelectButton1.addEventListener("click", this.onClickedDialogButton.bind(this));
        var characterSelectButton1 = document.getElementById("characterSelectButton2");
        characterSelectButton2.addEventListener("click", this.onClickedDialogButton.bind(this));
        
        // DEBUG!!!
        // this.setPlayerName("JAMES", 0);
        // this.setPlayerName("HAILEY", 1);
        // this.playerAvatars[0] = new Avatar("male", 1, "JAMES");
        // this.playerAvatars[1] = new Avatar("female", 2, "HAILEY");
        // this.setPlayerSprite(this.playerAvatars[0].SetState("idle"), 1);
        // this.setPlayerSprite(this.playerAvatars[1].SetState("idle"), 2);
        // document.getElementById("characterSelectDialog").style.display = "none";
        
        // // TODO: START THE GAME (check the playerCreationState)
        // setTimeout(function() {
            // this.playScene = new PlayScene(this, "JAMES", "HAILEY");
            // addScene(this.playScene, false);
        // }.bind(this), 1000);
    }
    
    GetDOM()
    {
        return this.stageScene;
    }
    
    setPlayerName(name, playerNumber)
    {
        var playerText = document.getElementById("player" + playerNumber + "Text");
        playerText.innerHTML = name.toUpperCase();
        this.adjustTextLength(playerText, 248);
    }
    
    addPrizeToBoard(playerNumber, prize)
    {
        var opponentNumber = playerNumber == 0 ? 1 : 0;
        if (this.claimedPrizes[playerNumber].length <= 8)
        {
            var prizeDomName = "player" + playerNumber + "Prize" + (this.claimedPrizes[playerNumber].length - 1);
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
            var opponentSlot = 7 - (this.claimedPrizes[playerNumber].length - 9);
            
            var prizeDomName = "player" + opponentNumber + "Prize" + opponentSlot;
            var prizeRect = document.getElementById(prizeDomName);
            prizeRect.style.fill = "black";
            prizeRect.style.stroke = "white";
            var prizeText = document.getElementById(prizeDomName + "Text");
            prizeText.innerHTML = prize.name;
            this.adjustTextLength(prizeText, 280);
        }
        
        setTimeout(function() {
            this.startAnimation("look", opponentNumber, function() {
                this.startAnimation("cheer", playerNumber, this.returnToPlayArea.bind(this));
            }.bind(this));
        }.bind(this), 333);
    }
    
    setPlayerSprite(href, playerNumber)
    {
        if (playerNumber == 0)
        {
            document.getElementById("characterSelectAvatar").innerHTML = "<use width='160' height='228' href='#" + href + "' />";
        }
        else if (playerNumber == 1)
        {
            document.getElementById("player0Sprite").innerHTML = "<use width='160' height='228' href='#" + href + "' transform='translate(352, 276)' />";
        }
        else
        {
            document.getElementById("player1Sprite").innerHTML = "<use width='160' height='228' href='#" + href + "' transform='scale(-1, 1) translate(-928, 276)' />";
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
    
    startAnimation(animationName, playerNumber, onEnd)
    {
        this.setPlayerSprite(this.playerAvatars[playerNumber].SetState(animationName, onEnd), playerNumber + 1);
    }
    
    selectPrevAvatar()
    {
        --this.currentAvatar;
        if (this.currentAvatar < 0)
            this.currentAvatar = this.avatars.length - 1;
        this.setPlayerSprite(this.avatars[this.currentAvatar] + "Idle", 0);
    }
    
    selectNextAvatar()
    {
        ++this.currentAvatar;
        if (this.currentAvatar >= this.avatars.length)
            this.currentAvatar = 0;
        this.setPlayerSprite(this.avatars[this.currentAvatar] + "Idle", 0);
    }
    
    resetCharacterSelectDialog()
    {
        playerNameTextBox.value = "";
        this.currentAvatar = 0;
        this.setPlayerSprite(this.avatars[this.currentAvatar] + "Idle", 0);
    }
    
    onClickedDialogButton(evt)
    {
        var playerNameTextBox = document.getElementById("playerNameTextBox");
        
        var sprite = this.avatars[this.currentAvatar];
        var gender = sprite.substr(0, sprite.length - 1);
        var spriteNumber = sprite[sprite.length - 1];
        
        if (this.playerCreationState == "1")
        {
            if (playerNameTextBox.value.length == 0)
                return;
            
            this.setPlayerName(playerNameTextBox.value.toUpperCase(), 0);
            this.playerAvatars[0] = new Avatar(gender, spriteNumber, playerNameTextBox.value.toUpperCase());
            this.setPlayerSprite(this.playerAvatars[0].SetState("idle"), 1);
            
            this.resetCharacterSelectDialog();
            if (evt.target.id == "characterSelectButton1")
            {
                this.playerCreationState = "2";
                document.getElementById("characterSelectTitle").innerHTML = "PLAYER 2";
            }
            else
            {
                this.playerCreationState = "3";
                document.getElementById("characterSelectTitle").innerHTML = "AI PLAYER";
            }
            document.getElementById("characterSelectButton1").innerHTML = "BACK";
            document.getElementById("characterSelectButton2").innerHTML = "START GAME";
        }
        else
        {
            if (evt.target.id == "characterSelectButton1")
            {
                this.resetCharacterSelectDialog();
                this.playerCreationState = "1";
                document.getElementById("characterSelectButton1").innerHTML = "ADD PLAYER 2";
                document.getElementById("characterSelectButton2").innerHTML = "ADD AI PLAYER";
                document.getElementById("characterSelectTitle").innerHTML = "PLAYER 1";
            }
            else if (playerNameTextBox.value.length > 0)
            {
                this.setPlayerName(playerNameTextBox.value.toUpperCase(), 1);
                this.playerAvatars[1] = new Avatar(gender, spriteNumber, playerNameTextBox.value.toUpperCase());
                this.setPlayerSprite(this.playerAvatars[1].SetState("idle"), 2);
                document.getElementById("characterSelectDialog").style.display = "none";
                
                // TODO: START THE GAME (check the playerCreationState)
                setTimeout(function() {
                    var player1Name = document.getElementById("player0Text").innerHTML;
                    var player2Name = playerNameTextBox.value.toUpperCase();
                    this.playScene = new PlayScene(this, player1Name, player2Name);
                    addScene(this.playScene, false);
                }.bind(this), 1000);
            }
        }
    }
    
    AwardPrizeToPlayer(playerNumber, prize)
    {
        this.claimedPrizes[playerNumber].push(prize);
        setTimeout(function() {
            this.addPrizeToBoard(playerNumber, prize);
        }.bind(this), 800);
    }
    
    returnToPlayArea()
    {
        switchScene(this.playScene.GetDOM().id, false);
        this.setPlayerSprite(this.playerAvatars[0].SetState("idle"), 1);
        this.setPlayerSprite(this.playerAvatars[1].SetState("idle"), 2);
        document.getElementById("resultText").innerHTML = "";
        setTimeout(function() {
            this.playScene.ClearSelected();
        }.bind(this), 1000);
    }
    
    PlayerGuess(playerNumber, guess)
    {
        var opponentNumber = playerNumber == 0 ? 1 : 0;
        if (PuzzleManager.CheckAnswer(guess))
        {
            setTimeout(function() {
                this.startAnimation("look", opponentNumber, function() {
                    document.getElementById("resultText").innerHTML = "<< CORRECT ANSWER >>";
                    this.startAnimation("cheer", playerNumber, this.returnToPlayArea.bind(this));
                }.bind(this));
            }.bind(this), 1000);
        }
        else
        {
            setTimeout(function() {
                this.startAnimation("look", opponentNumber, function() {
                    document.getElementById("resultText").innerHTML = "<< WRONG ANSWER >>";
                    this.startAnimation("wrong", playerNumber, this.returnToPlayArea.bind(this));
                }.bind(this));
            }.bind(this), 1000);
        }
    }

    Update(deltaTime)
    {
        // Only bother updating if we have our avatars initialized
        if (this.playerAvatars[1] == null)
            return;
        
        this.playerAvatars.forEach((avatar, playerNumber) => {
            var update = avatar.UpdateAnimation(deltaTime);
            if (update != null && update != Animation.END_EVENT_NAME)
                this.setPlayerSprite(update, playerNumber + 1);
        }, this);
    }
}
