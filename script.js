const coordonnesAPI = "http://api.open-notify.org/iss-now.json";

let map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let marker = L.marker([0,0]).addTo(map);

let latitude = null;
let longitude = null;

async function getAPI(url){
    const response = await fetch(url);
    if(response.ok){
        return response.json();
    }else{console.log("il y a une erreur de récupération")}
}

async function getLocation (){

        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
        const data = await getAPI(url);
        let localisation = document.getElementById("localisation");
        let previousLocalisation = localisation.innerText;
        let newLocalisation = data.countryName;
        if(!previousLocalisation.includes(newLocalisation)){
            localisation.textContent = newLocalisation;
            let flag = document.createElement("img");
            flag.innerHTML=`<span><img src="https://flagsapi.com/${data.countryCode}/flat/16.png"></span>`;
            localisation.append(flag);
        }else{
            localisation.textContent = previousLocalisation;
        }


}

async function getCoordinates (){
    const data = await getAPI(coordonnesAPI);
    if(data && data.iss_position){
        longitude = data.iss_position.longitude;
        latitude = data.iss_position.latitude;
        let lon = document.getElementById("long");
        let lat= document.getElementById("lat");
        if(lon && lat){
            lon.textContent=longitude;
            lat.textContent=latitude;
        }
        marker.setLatLng([latitude, longitude]);
    }
}

function init(){
    setInterval(async function () {
        await getCoordinates();
        await getLocation();
    },1000)
}
init()