class OptionsScene
{
    constructor()
    {
        this.splashTime = 0;
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
    }
    
    buildDOM(parentElement)
    {
        parentElement.innerHTML = "" +
            "<div id='optionsContainer' class='sceneInnerContainer'>" +
                "<div class='uiArea'>" +
                    "<div class='container-fluid h-100 p-0'>" +
                        "<div class='row h-20'>" +
                            "<div class='col-1 h-100'></div>" +
                            "<div class='col h-100'>" +
                                "<img id='optionsBanner' src='/img/Options.png' />" +
                            "</div>" +
                            "<div class='col-1 h-100'></div>" +
                        "</div>" +
                        "<div class='row h-10'></div>" +
                        "<div class='row h-70'>" +
                            "<div class='col-1'></div>" +
                            "<div class='col'>" +
                                "<div class='container-fluid h-100 p-0'>" +
                                    "<div class='row optionsListItem'>" +
                                        "<div class='col col-4'>SFX VOLUME</div>" +
                                        "<div class='col-1'></div>" +
                                        "<div class='col'>SFX VOLUME</div>" +
                                    "</div>" +
                                    "<div class='row optionsListItemDisabled'>" +
                                        "<div class='col col-4'>VIBRATION</div>" +
                                        "<div class='col-1'></div>" +
                                        "<div class='col d-flex justify-content-evenly text-center' style='background-color:red;'>" +
                                            "<div class='optionsListItemDisabledUnselected'>ON</div>" +
                                            "<div class='optionsListItemDisabledSelected'>OFF</div>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row optionsListItem'>" +
                                        "<div class='col col-4'>AI DIFFICULTY</div>" +
                                        "<div class='col-1'></div>" +
                                        "<div class='col d-flex justify-content-between text-center' style='background-color:red;'>" +
                                            "<div class='optionsListItemSelected'>EASY</div>" +
                                            "<div class='optionsListItemUnselected'>NORMAL</div>" +
                                            "<div class='optionsListItemUnselected'>HARD</div>" +
                                            "<div class='optionsListItemUnselected'>CUSTOM</div>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row optionsListItemDisabled'>" +
                                        "<div class='col col-4'>LOGIC LEVEL</div>" +
                                        "<div class='col-1'></div>" +
                                        "<div class='col'>LOGIC LEVEL</div>" +
                                    "</div>" +
                                    "<div class='row optionsListItemDisabled'>" +
                                        "<div class='col col-4'>MEMORY LEVEL</div>" +
                                        "<div class='col-1'></div>" +
                                        "<div class='col'>MEMORY LEVEL</div>" +
                                    "</div>" +
                                    "<div class='row optionsListItemDisabled'>" +
                                        "<div class='col col-4'>PARENTAL CONTROLS</div>" +
                                        "<div class='col-1'></div>" +
                                        "<div class='col d-flex justify-content-evenly text-center' style='background-color:red;'>" +
                                            "<div class='optionsListItemDisabledSelected'>ON</div>" +
                                            "<div class='optionsListItemDisabledUnselected'>OFF</div>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='row optionsListButtons' style='background-color:red;'>" +
                                        "<div class='col'>SAVE & EXIT</div>" +
                                        "<div class='col'>CANCEL</div>" +
                                        "<div class='col'>RESTORE DEFAULTS</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='col-1'></div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>" +
        "";
    }
    
    Update(deltaTime)
    {
    }
}