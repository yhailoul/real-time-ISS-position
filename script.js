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

    const apiKey = "699843bf2719b391536714jiz51933c";
    const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${apiKey}`
    const data = await getAPI(url);
    let localisation = document.getElementById("localisation");
    let previousLocalisation = localisation.innerText;
    
    let newLocalisation = data.address.country;
    if(!previousLocalisation.includes(newLocalisation)){
        localisation.textContent = newLocalisation;
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
