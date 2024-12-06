class PuzzlePanel
{
    constructor(prize, id)
    {
        this.prize = prize;
        this.id = id;
        
        var isWild = prize.value == PrizeManager.wildPrize.value;
        
        this.dom = document.createElement("div");
        this.dom.id = "puzzlePanel-" + id;
        this.dom.classList.add("col", "puzzlePanel");
        
        this.unselectedDom = document.createElement("div");
        this.unselectedDom.id = "puzzlePanelUnselected-" + id;
        this.unselectedDom.classList.add("puzzlePanelUnselected");
        this.dom.appendChild(this.unselectedDom);
        
        var inner = document.createElement("div");
        inner.classList.add("puzzlePanelInner");
        this.unselectedDom.appendChild(inner);
        
        var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 108 60');
        svg.setAttribute('preserveAspectRatio','none');
        svg.classList.add("puzzlePanelInnerSVG");
        if (!isWild)
            svg.innerHTML = "<path d=\"M20 12 L88 12 Q88 18 96 18 L96 42 Q88 42 88 48 L20 48 Q20 42 12 42 L12 18 Q20 18 20 12 z\" style=\"fill:#ff5555;\" />";
        else
            svg.innerHTML = "<path d=\"M20 12 L88 12 Q88 18 96 18 L96 42 Q88 42 88 48 L20 48 Q20 42 12 42 L12 18 Q20 18 20 12 z\" style=\"fill:#5555ff;\" />";
        inner.appendChild(svg);
        
        var textContainer = document.createElement("div");
        textContainer.id = "puzzlePanelInnerText-" + id;
        textContainer.classList.add("d-flex", "align-items-center", "justify-content-center", "puzzlePanelInnerText");
        inner.appendChild(textContainer);
        
        var number = document.createElement("p");
        number.id = "puzzlePanelNumber-" + id;
        number.classList.add("mb-1");
        number.innerHTML = "" + (id + 1);
        textContainer.appendChild(number);
        
        this.selectedDom = document.createElement("div");
        this.selectedDom.id = "puzzlePanelSelected-" + id;
        this.selectedDom.classList.add(!isWild ? "puzzlePanelSelected" : "puzzlePanelSelectedWild");
        this.dom.appendChild(this.selectedDom);
        
        if (!isWild)
        {
            var prizeText = document.createElement("p");
            prizeText.id = "puzzlePanelPrizeText-" + id;
            prizeText.classList.add("mb-1");
            prizeText.innerHTML = this.prize.panelString;
            this.selectedDom.appendChild(prizeText);
        }
        else
        {
            var wildSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
            wildSVG.setAttribute('viewBox', '0 0 108 60');
            wildSVG.setAttribute('preserveAspectRatio', 'none');
            wildSVG.classList.add("puzzlePanelInnerSVG");
            
            // wildSVG.innerHTML = "<path id=\"stripe\" d=\"M0 30 L108 0 L108 30 L 0 60 z\" style=\"fill:black;\" /><text x=\"0\" y=\"108\" fill=\"#ff5555\"><textPath href=\"stripe\">WiLD!</textPath></text>";
            
            var wildStripe = document.createElementNS('http://www.w3.org/2000/svg','path');
            wildStripe.setAttribute("id", wildPathId);
            wildStripe.setAttribute("d", "M0 30 L108 0 L108 30 L 0 60 z");
            wildStripe.setAttribute("style", "fill:black;");
            wildSVG.appendChild(wildStripe);
            
            var wildPath = document.createElementNS('http://www.w3.org/2000/svg','path');
            var wildPathId = "wildPath" + id
            wildPath.setAttribute("id", wildPathId);
            wildPath.setAttribute("d", "M0 54 L108 24");
            wildPath.setAttribute("style", "fill:none;stroke:none;");
            wildSVG.appendChild(wildPath);
            
            var wildText = document.createElementNS('http://www.w3.org/2000/svg','text');
            wildText.setAttribute("style", "fill:#ff5555;");
            
            var wildTextPath = document.createElementNS('http://www.w3.org/2000/svg','textPath');
            wildTextPath.setAttribute("href", "#" + wildPathId);
            wildTextPath.setAttribute("startOffset", "10%");
            wildTextPath.setAttribute("textLength", "85%");
            wildTextPath.innerHTML = this.prize.panelString;
            wildText.appendChild(wildTextPath);
            wildSVG.appendChild(wildText);
            
            this.selectedDom.appendChild(wildSVG);
        }
    }
    
    GetDOM()
    {
        return this.dom;
    }
    
    Reset()
    {
        this.selectedDom.style.display = "none";
        this.unselectedDom.style.display = "block";
    }
    
    Select()
    {
        this.unselectedDom.style.display = "none";
        this.selectedDom.style.display = "flex";
    }
    
    Clear()
    {
        this.dom.style.visibility = "hidden";
    }
}
