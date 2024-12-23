class OptionsScene
{
    constructor()
    {
    }
    
    init(parentElement)
    {
        this.buildDOM(parentElement);
    }
    
    buildDOM(parentElement)
    {
        this.rootElement = document.createElement("div");
        this.rootElement.id = "optionsScene";
        this.rootElement.classList.add("sceneInnerContainer");
        this.rootElement.innerHTML = "" +
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
                            "<div id='optionsListContainer' class='container-fluid h-100 p-0'></div>" +
                        "</div>" +
                        "<div class='col-1'></div>" +
                    "</div>" +
                "</div>" +
                "<div id='optionsListButtons' class='container-fluid'>" +
                    "<div class='row h-100 w-100'>" +
                        "<div id='saveButton' class='col'><div><span>SAVE & EXIT</span></div></div>" +
                        "<div id='cancelButton' class='col'><div><span>CANCEL</span></div></div>" +
                        "<div id='defaultsButton' class='col'><div><span>RESTORE DEFAULTS</span></div></div>" +
                    "</div>" +
                "</div>" +
            "</div>" +
        "";
        
        parentElement.appendChild(this.rootElement);
        
        var optionsListContainer = document.getElementById("optionsListContainer");
        this.sfxOption = new OptionsRange(optionsListContainer, "SFX VOLUME", 0, 100, 0, true);
        this.vibrationOption = new OptionsRadio(optionsListContainer, "VIBRATION", ["ON", "OFF"], "OFF", true);
        this.aiOption = new OptionsRadio(optionsListContainer, "AI DIFFICULTY", ["EASY", "NORMAL", "HARD", "CUSTOM"], "EASY", false);
        this.logicOption = new OptionsRange(optionsListContainer, "LOGIC LEVEL", 0, 100, 10, true);
        this.memoryOption = new OptionsRange(optionsListContainer, "MEMORY LEVEL", 0, 12, 1, true);
        this.parentalOption = new OptionsRadio(optionsListContainer, "PARENTAL CONTROLS", ["ON", "OFF"], "ON", true);
        
        this.aiOption.AddEventListener("change", this.UpdateAIRanges.bind(this));
        
        var saveButton = document.getElementById("saveButton");
        saveButton.addEventListener("click", this.SaveAndExit.bind(this));
        var cancelButton = document.getElementById("cancelButton");
        cancelButton.addEventListener("click", this.Cancel.bind(this));
        var defaultsButton = document.getElementById("defaultsButton");
        defaultsButton.addEventListener("click", this.RestoreDefaults.bind(this));
    }
    
    GetDOM()
    {
        return this.rootElement;
    }
    
    Update(deltaTime)
    {
    }
    
    UpdateAIRanges(value)
    {
        switch(value)
        {
            case "EASY":
                this.logicOption.SetEnabled(false);
                this.logicOption.SetValue(0);
                this.memoryOption.SetEnabled(false);
                this.memoryOption.SetValue(1);
                break;
            case "NORMAL":
                this.logicOption.SetEnabled(false);
                this.logicOption.SetValue(20);
                this.memoryOption.SetEnabled(false);
                this.memoryOption.SetValue(3);
                break;
            case "HARD":
                this.logicOption.SetEnabled(false);
                this.logicOption.SetValue(40);
                this.memoryOption.SetEnabled(false);
                this.memoryOption.SetValue(5);
                break;
            case "CUSTOM":
                this.logicOption.SetEnabled(true);
                this.memoryOption.SetEnabled(true);
                break;
        };
    }
    
    SaveAndExit()
    {
        // TODO: SAVE!!!!!
        switchScene("titleScene", true);
    }
    
    Cancel()
    {
        switchScene("titleScene", true);
    }
    
    RestoreDefaults()
    {
        this.sfxOption.SetValue(100);
        this.vibrationOption.SetValue("OFF");
        this.aiOption.SetValue("EASY");
        this.parentalOption.SetValue("ON");
    }
}

class OptionsRange
{
    constructor(parentElement, label, min, max, value, disabled)
    {
        this.rootElement = document.createElement("div");
        this.rootElement.classList.add("row", "optionsListItem");
        
        this.labelElement = document.createElement("div");
        this.labelElement.classList.add("col-4", "m-auto", "p-0");
        this.labelElement.innerHTML = label;
        this.rootElement.appendChild(this.labelElement);
        
        var fillerElement = document.createElement("div");
        fillerElement.classList.add("col-1");
        this.rootElement.appendChild(fillerElement);
        
        var containerElement = document.createElement("div");
        containerElement.classList.add("col", "container-fluid", "h-100", "p-0");
        this.rootElement.appendChild(containerElement);
        
        var innerRowElement = document.createElement("div");
        innerRowElement.classList.add("row", "h-100");
        containerElement.appendChild(innerRowElement);
        
        fillerElement = document.createElement("div");
        fillerElement.classList.add("col-10", "m-auto");
        innerRowElement.appendChild(fillerElement);
        
        this.rangeElement = document.createElement("input");
        this.rangeElement.type = "range";
        this.rangeElement.min = min;
        this.rangeElement.max = max;
        this.rangeElement.value = value;
        this.rangeElement.classList.add("optionsListItemRange");
        fillerElement.appendChild(this.rangeElement);
        
        fillerElement = document.createElement("div");
        fillerElement.classList.add("col-1");
        innerRowElement.appendChild(fillerElement);
        
        this.valueElement = document.createElement("div");
        this.valueElement.classList.add("col-1", "m-auto", "text-center");
        this.valueElement.innerHTML = value;
        innerRowElement.appendChild(this.valueElement);
        
        this.SetEnabled(!disabled);
        
        parentElement.appendChild(this.rootElement);
        
        this.rangeElement.addEventListener("input", this.onChange.bind(this));
    }
    
    onChange(evt)
    {
        this.valueElement.innerHTML = this.rangeElement.value;
    }
    
    GetValue()
    {
        return this.rangeElement.value;
    }
    
    SetEnabled(enabled)
    {
        if (enabled)
            this.rootElement.classList.remove("optionsListItemDisabled");
        else
            this.rootElement.classList.add("optionsListItemDisabled");
        
        this.rangeElement.disabled = !enabled;
    }
    
    SetValue(value)
    {
        this.rangeElement.value = value;
        this.valueElement.innerHTML = value;
    }
}

class OptionsRadio
{
    constructor(parentElement, label, options, value, disabled)
    {
        this.rootElement = document.createElement("div");
        this.rootElement.classList.add("row", "optionsListItem");
        
        this.labelElement = document.createElement("div");
        this.labelElement.classList.add("col-4", "m-auto", "p-0");
        this.labelElement.innerHTML = label;
        this.rootElement.appendChild(this.labelElement);
        
        var fillerElement = document.createElement("div");
        fillerElement.classList.add("col-1");
        this.rootElement.appendChild(fillerElement);
        
        this.optionsListRadio = document.createElement("div");
        this.optionsListRadio.classList.add("col", "d-flex", "justify-content-evenly", "text-center", "optionsListItemRadio");
        this.rootElement.appendChild(this.optionsListRadio);
        
        this.valueElements = [];
        options.forEach((option) => {
            var element = document.createElement("div");
            element.classList.add("optionsListItemRadioItem", "h-100", "d-flex", "justify-content-center", "align-items-center");
            if (option == value)
                element.classList.add("optionsListItemRadioItemSelected");
            element.innerHTML = option;
            element.addEventListener("click", this.onChange.bind(this));
            this.optionsListRadio.appendChild(element);
            this.valueElements.push(element);
        });
        
        this.SetEnabled(!disabled);
        
        parentElement.appendChild(this.rootElement);
        
        this.value = value;
        this.onChangeDelegates = [];
    }
    
    onChange(evt)
    {
        if (this.disabled || evt.target.innerHTML == this.value)
            return;
        
        this.SetValue(evt.target.innerHTML);
    }
    
    GetValue()
    {
        return this.value;
    }
    
    SetValue(value)
    {
        this.valueElements.forEach((element) => {
            if (element.innerHTML != value)
                element.classList.remove("optionsListItemRadioItemSelected");
            else
                element.classList.add("optionsListItemRadioItemSelected");
        });
        
        this.value = value;
        this.onChangeDelegates.forEach((delegate) => {
            delegate(this.value);
        });
    }
    
    SetEnabled(enabled)
    {
        if (enabled)
        {
            this.rootElement.classList.remove("optionsListItemDisabled");
            this.optionsListRadio.classList.remove("optionsListItemRadioDisabled");
        }
        else
        {
            this.rootElement.classList.add("optionsListItemDisabled");
            this.optionsListRadio.classList.add("optionsListItemRadioDisabled");
        }
        
        this.disabled = !enabled;
    }
    
    AddEventListener(type, delegate)
    {
        if (type == "change")
        {
            this.onChangeDelegates.push(delegate);
        }
    }
    
    RemoveEventListener(type, delegate)
    {
        if (type == "change")
        {
            for (var index = 0; index < this.onChangeDelegates.length; ++index)
            {
                if ("" + delegate == "" + this.onChangeDelegates[index])
                {
                    this.onChangeDelegates.splice(index, 1);
                }
            }
        }
    }
}
