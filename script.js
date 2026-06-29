// Create map
const map = L.map("map").setView([9.42,78.30],9);

// OpenStreetMap
L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:'© OpenStreetMap'
}
).addTo(map);

const sidebar=document.getElementById("sidebar");
const toggleBtn=document.getElementById("toggleBtn");
const searchBox=document.getElementById("searchBox");
const siteList=document.getElementById("siteList");

let allSites=[];
let markers=[];

fetch("sites.json")
.then(r=>r.json())
.then(data=>{

allSites=data;

loadSites(allSites);

});

function loadSites(list){

siteList.innerHTML="";

markers.forEach(m=>map.removeLayer(m));

markers=[];

list.forEach(site=>{

const marker=L.marker([site.lat,site.lng]).addTo(map);

marker.bindPopup(`
<b>Site ${site.id}</b><br>
${site.name}<br><br>

Latitude : ${site.lat}<br>
Longitude : ${site.lng}<br><br>

<a href="https://www.google.com/maps?q=${site.lat},${site.lng}" target="_blank">
📍 Open Google Maps
</a>
`);

markers.push(marker);

const li=document.createElement("li");

li.innerHTML=`
<span class="siteNo">${site.id}</span>
${site.name}
`;

li.onclick=()=>{

map.flyTo(
[site.lat,site.lng],
15,
{
duration:1.5
}
);

marker.openPopup();

};

siteList.appendChild(li);

});

}

searchBox.addEventListener("keyup",()=>{

const value=searchBox.value.toLowerCase();

const filtered=allSites.filter(site=>

site.name.toLowerCase().includes(value)

||

site.id.toString().includes(value)

);

loadSites(filtered);

});

toggleBtn.onclick=()=>{

sidebar.classList.toggle("hide");

setTimeout(()=>{

map.invalidateSize();

},300);

};
