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
 
var lastTimestamp = 0;
var currentScene = null;
var sceneContainer = null;

function onDeviceReady()
{
    window.screen.orientation.lock("landscape");
    sceneContainer = document.getElementById("sceneContainer");
    addScene(new TitleScene(), true);
    // addScene(new StageScene(), true);
    
    window.requestAnimationFrame((timestamp) => update(timestamp));
    
    // console.log(findForegroundPixelsInRegions(document.getElementById("puzzle13"), [255, 255, 255], 5, 5));
}

function addScene(newScene, replaceAllScenes)
{
    if (replaceAllScenes && currentScene != null)
    {
        while (sceneContainer.firstChild)
            sceneContainer.removeChild(sceneContainer.lastChild);
    }
    newScene.init(sceneContainer);
    currentScene = newScene;
}

function switchScene(sceneName)
{
    var scene = document.getElementById(sceneName);
    if (scene != null)
    {
        scene.style.display = "block";
        currentScene.style.display = "none";
        currentScene = scene;
    }
}

function update(timestamp)
{
    // In milliseconds
    var deltaTime = timestamp - lastTimestamp;
    
    if (currentScene != null)
        currentScene.Update(deltaTime);
    
    // Final stuff
    lastTimestamp = timestamp;
    window.requestAnimationFrame((timestamp) => update(timestamp));
}
