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

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    var playArea = document.getElementById('playArea');
    var container = document.createElement("div");
    container.classList.add("container", "p-0", "h-100");
    playArea.appendChild(container);
	for (var rowIndex = 0; rowIndex < 5; ++rowIndex)
	{
		var row = document.createElement("div");
		row.classList.add("row", "h-20", "m-0");
		container.appendChild(row);
		for (var colIndex = 0; colIndex < 5; ++colIndex)
		{
			var col = document.createElement("div");
			col.classList.add("col", "puzzlePanel");
			row.appendChild(col);
			
			var inner = document.createElement("div");
			inner.classList.add("puzzlePanelInner");
			col.appendChild(inner);
			
			var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
			svg.setAttribute('viewBox','0 0 108 60');
			svg.setAttribute('preserveAspectRatio','none');
			svg.classList.add("puzzlePanelInnerSVG");
			svg.innerHTML = "<path d=\"M20 12 L88 12 Q88 18 96 18 L96 42 Q88 42 88 48 L20 48 Q20 42 12 42 L12 18 Q20 18 20 12 z\" style=\"fill:#ff5555;\" />";
			inner.appendChild(svg);
			
            var textContainer = document.createElement("div");
            textContainer.classList.add("d-flex", "align-items-center", "justify-content-center", "puzzlePanelInnerText");
            inner.appendChild(textContainer);
			
            var number = document.createElement("p");
            number.classList.add("mb-1");
            number.innerHTML = "" + (rowIndex * 5 + colIndex + 1);
            textContainer.appendChild(number);
		}
	}
}
