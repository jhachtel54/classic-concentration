/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 var puzzlePanels = [];

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

class PuzzlePanel
{
    constructor(prize, id)
    {
        this.prize = prize;
        this.id = id;
        
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
        svg.innerHTML = "<path d=\"M20 12 L88 12 Q88 18 96 18 L96 42 Q88 42 88 48 L20 48 Q20 42 12 42 L12 18 Q20 18 20 12 z\" style=\"fill:#ff5555;\" />";
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
        this.selectedDom.classList.add("puzzlePanelSelected");
        this.dom.appendChild(this.selectedDom);
        
        var prizeText = document.createElement("p");
        prizeText.id = "puzzlePanelPrizeText-" + id;
        prizeText.classList.add("mb-1");
        prizeText.innerHTML = this.prize.panelString;
        this.selectedDom.appendChild(prizeText);
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

function onPlayAreaClicked(evt)
{
    var id = evt.target.id;
    var number = id.split("-")[1];
    puzzlePanels[number].Select();
}

function onDeviceReady()
{
    var playArea = document.getElementById('playArea');
    var container = document.createElement("div");
    container.id = "rebusPuzzle";
    container.classList.add("container", "p-0", "h-100");
    container.style.backgroundImage = "url('img/Stage.png')";
    container.addEventListener("click", onPlayAreaClicked);
    playArea.appendChild(container);
    
    var prizePool = PrizeManager.GeneratePrizePool(11, 2, 2);
    
	for (var rowIndex = 0; rowIndex < 5; ++rowIndex)
	{
		var row = document.createElement("div");
		row.classList.add("row", "h-20", "m-0");
		container.appendChild(row);
		for (var colIndex = 0; colIndex < 5; ++colIndex)
		{
            var id = rowIndex * 5 + colIndex;
            var puzzlePanel = new PuzzlePanel(prizePool[id], id);
            row.appendChild(puzzlePanel.GetDOM());
            puzzlePanels.push(puzzlePanel);
		}
	}
}
