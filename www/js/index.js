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
    var playArea = document.getElementById('playArea');//.classList.add('ready');
	for (var rowIndex = 0; rowIndex < 5; ++rowIndex)
	{
		var row = document.createElement("div");
		row.classList.add("row");
		row.classList.add("h-20");
		playArea.appendChild(row);
		for (var colIndex = 0; colIndex < 5; ++colIndex)
		{
			var col = document.createElement("div");
			col.classList.add("col");
			col.classList.add("puzzlePanel");
			row.appendChild(col);
			
			var inner = document.createElement("div");
			inner.classList.add("puzzlePanelInner");
			inner.classList.add("text-center");
			col.appendChild(inner);
			
			var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
			svg.setAttributeNS('http://www.w3.org/2000/svg','viewBox','0 0 100 100');
			svg.setAttributeNS('http://www.w3.org/2000/svg','preserveAspectRatio','none');
			svg.classList.add("puzzlePanelInnerSVG");
			inner.appendChild(svg);
			svg.innerHTML = "<path d=\"M0 0 l100 0 l0 100 l-100 0 z\" style=\"fill:black;\" />";
			
			// var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
			// svg.setAttributeNS('http://www.w3.org/2000/svg','viewBox','0 0 100 100');
			// svg.classList.add("puzzlePanelInnerSVG");
			// inner.appendChild(svg);
			// svg.innerHTML = "<path d=\"M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z\"/>";//"<path=\"M0 0 L463 0 L463 214 L0 214 Z\" style=\"fill:black\">";
		}
	}
}
