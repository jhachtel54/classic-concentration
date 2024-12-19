class TitleScene
{
    static COPYRIGHT_TIME = 1500;
    static ABOUT_TIME = 3000;
    constructor()
    {
        this.splashTime = 0;
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
        var playButton = document.getElementById("playButton");
        playButton.addEventListener("click", this.onClickedPlay.bind(this));
    }
    
    buildDOM(parentElement)
    {
        parentElement.innerHTML = "" +
            "<div id='titleContainer' class='sceneInnerContainer'>" +
                "<div id='bannerContainer'>" +
                    "<div class='row h-100 w-100'>" +
                        "<div class='col-1'></div>" +
                        "<div id='titleBanner' class='col'></div>" +
                        "<div class='col-1'></div>" +
                    "</div>" +
                "</div>" +
                "<div class='uiArea'>" +
                    "<div id='copyrightText' class='titleText text-center'>Based on the television program<br>produced by Mark Goodson Productions.<br>Copyright 1988 The Concentration Company.<br>All Rights Reserved.</div>" +
                    "<div id='aboutText' class='titleText text-center' style='display:none;'>This mobile application was adapted<br>and developed by James Hachtel as<br>a Christmas present to his sister.<br>Merry Christmas, Hailey!</div>" +
                    "<div id='titleButtons' class='container-fluid' style='display:none;'>" +
                        "<div class='row h-100 w-100'>" +
                            "<div id='playButton' class='col'><div><span>PLAY</span></div></div>" +
                            "<div id='scoreButton' class='col'><div><span>HIGH SCORES</span></div></div>" +
                            "<div id='settingsButton' class='col'><div><span>SETTINGS</span></div></div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
            "</div>" +
        "";
    }
    
    Update(deltaTime)
    {
        if (this.splashTime != -1)
        {
            this.splashTime += deltaTime;
            if (this.splashTime >= TitleScene.COPYRIGHT_TIME && this.splashTime < TitleScene.ABOUT_TIME)
            {
                document.getElementById("copyrightText").style.display = "none";
                document.getElementById("aboutText").style.display = "block";
            }
            else if (this.splashTime >= TitleScene.ABOUT_TIME)
            {
                document.getElementById("copyrightText").style.display = "none";
                document.getElementById("aboutText").style.display = "none";
                document.getElementById("titleButtons").style.display = "block";
                this.splashTime = -1;
            }
        }
    }
    
    onClickedPlay()
    {
        addScene(new StageScene(/*"James", "img/Avatars/Male-01.png", "Hailey", "img/Avatars/Female-02.png", {
            logicLevel: 0.8,
            memoryLevel: 3
        }*/), true);
    }
}