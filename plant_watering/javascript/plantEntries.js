"use strict";

//constructor for PlantEntry object that represents a plant entry
function PlantEntry(name, cycleLength) {
	this.name = name;
	this.cycleLength = cycleLength;
	this.lastWater = new Date();
}

//using session storage to retrieve entry list 
if (sessionStorage.getItem("entryList") == null) {
	//creating default opening state with 3 plants listed
	sessionStorage.setItem("entryList", 
		JSON.stringify([
			new PlantEntry("Plant 1", 32), 
			new PlantEntry("Plant 2", 7), 
			new PlantEntry("Plant 4", 5)]));
}
const entryList = JSON.parse(sessionStorage.getItem("entryList"));
entryList.forEach(entry => entry.lastWater = new Date(entry.lastWater));

//converts form info to a new plant entry and adds to entry list
function submitNewEntry() {
	const form = document.getElementById("plantForm");
	const newEntry = new PlantEntry(
		form["plantName"].value.slice(0, 9), 
		parseInt(form["cycleLength"].value));
	entryList.push(newEntry);
	sessionStorage.setItem("entryList", JSON.stringify(entryList));
}

//renders plant entries on the index page. 
function renderEntries() {
	const parent = document.getElementById("entries");
	const fragment = document.createDocumentFragment();

	if (entryList.length > 0) {
		for (let i = 0; i < entryList.length; i++) {
			const entry = entryList[i];

			const entryBox = document.createElement("div");
			entryBox.classList.add("entry", "box");
			entryBox.innerHTML = 
				`<div class = "smallimage green">
					<img src="images/idlePlant.png" style="width:80px;position:relative;top:10px;">
					<button class="delete" onclick="deleteEntry(${i});">
						<img src="images/delete_icon.png" style="position:relative; right:2px; top:1px;">
					</button>
				</div>
				<div class = "textInfo">
					<p class="textDom midgreen">${entry.name}</p>
					<p class="textSub">Next Water:</p>
					<div class="dateBox brown">
						<p class="textDom2" id="${i}">${getDateString(nextWater(entry))}</p>
					</div>
					<p class="textSub">(every ${entry.cycleLength} days)</p>	
				</div>
				<button class="watering" onclick="waterEntry(${i});">
					<img src="images/water_icon.png" style="position:relative; bottom:2px;">
				</button>`;
			fragment.appendChild(entryBox);
		}
	} else {
		const noPlantImage = document.createElement("img");
		noPlantImage.src = "images/idlePlant.png";
		noPlantImage.style = "position:relative; width:100px; top:20px;"
		fragment.appendChild(noPlantImage);
	}
	//appending fragment to document
	parent.appendChild(fragment);
}

//retrieves the next watering date for a plant entry
function nextWater(entry) {
	return new Date(entry.lastWater.getTime() + entry.cycleLength * 86400000);
}

//turns the date into a displayable string, eg. Nov. 13
function getDateString(date) {
	const dates = 
		["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
	return dates[date.getMonth()] + " " + date.getDate();
}

//waters a plant entry and updates the page with new next watering date. 
function waterEntry(i) {
	const entry = entryList[i];
	entry.lastWater = nextWater(entry);
	sessionStorage.setItem("entryList", JSON.stringify(entryList));
	document.getElementById(i).innerHTML = getDateString(nextWater(entry));
}

//deletes a plant entry
function deleteEntry(i) {
	entryList.splice(i, 1);
	sessionStorage.setItem("entryList", JSON.stringify(entryList));
	location.reload();
}