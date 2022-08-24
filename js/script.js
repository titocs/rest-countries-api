// Button Dark Mode
const darkModeButton = document.getElementById("dark-mode-button");

// Search
var searchValue = document.getElementById("search-country");

// Filter Text
var filterText = document.getElementById("filter-text");

// Filter Button
const filterRegionButton = document.getElementById("filter-region");
const dropdownFilter = document.getElementById("dropdown-filter");
const listDropdownFilter = document.querySelectorAll(".list-filter");

// Country List Wrapper
var countryWrapper = document.getElementById("country-wrapper");

// loader
const loader = document.querySelector(".loader");

const loading = function(){
    loader.classList.remove("hidden");
}

function reverseString(s){
    return s.split("").reverse().join("");
}

function splitAt(dataString){
    var newString = "";
    var result;
    var counter = 1;
    for(var i=dataString.length-1; i>=0; i--){
        newString += dataString[i];
        if(counter % 3 === 0){
            if(counter === dataString.length){
                continue;
            }
            newString += ",";
        }
        counter += 1;
    }
    result = reverseString(newString);
    return result;
}

function checkDarkMode(){
    // kalo sebelumnya udah diaktifin dark modenya
    if(sessionStorage.getItem("darkMode") !== null){
        document.querySelector("html").classList.add("dark");
        darkModeButton.classList.remove("not-dark");
    }
}

function insertCountry(imageCountry, nameCountry, populationCountry, regionCountry, capitalCountry){
    return `
        <div class="flag-container shadow-[0px_0px_13px_0px_rgba(0,0,0,0.15)] rounded-md overflow-hidden transition duration-500 dark:bg-dark-mode-element hover:cursor-pointer" data-region="${regionCountry}">
            <a href="detail.html">
                <div class="h-36">
                    <img class="w-full h-full object-cover" src="${imageCountry}" alt="">
                </div>

                <div class="px-5 py-6 mb-4">
                    <h1 class="font-extrabold text-lg mb-3 font-nunito transition duration-300 dark:text-white">${nameCountry}</h1>
                    <p class="font-semibold transition duration-300 dark:text-white lg:text-sm">Population: <span class="font-light">${populationCountry}</span></p>
                    <p class="font-semibold transition duration-300 dark:text-white lg:text-sm">Region: <span class="font-light">${regionCountry}</span></p>
                    <p class="font-semibold transition duration-300 dark:text-white lg:text-sm">Capital: <span class="font-light">${capitalCountry}</span></p>
                </div>
            </a>
        </div>
    `;
}

function generateFirstData(){
    loader.classList.remove("hidden");
    var xhr = new XMLHttpRequest();
    var cards = '';
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            loader.classList.add("hidden");
            var resultResponse = xhr.responseText;
            var finalResult = JSON.parse(resultResponse);
            for(var i=0; i<finalResult.length; i++){
                var imageCountry = finalResult[i]["flags"]["png"];
                var nameCountry = finalResult[i]["name"]["official"];

                var populationCountry = finalResult[i]["population"].toString();
                populationCountry = splitAt(populationCountry);

                var regionCountry = finalResult[i]["region"];
                var capitalCountry = finalResult[i]["capital"][0];
                cards += insertCountry(imageCountry, nameCountry, populationCountry, regionCountry, capitalCountry);
            }
            countryWrapper.innerHTML = cards;
        }
    }
    xhr.open('GET', `https://restcountries.com/v3.1/currency/dollar`, true);
    xhr.send();
}

function checkPreviousData(){
    if(sessionStorage.getItem("filter-text") !== null){
        filterText.innerText = sessionStorage.getItem("filter-text");
        var newFilterText = filterText.innerText.toLowerCase();
        var xhr = new XMLHttpRequest();
        var cards = '';
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                var resultResponse = xhr.responseText;
                var finalResult = JSON.parse(resultResponse);
                for(var i=0; i<finalResult.length; i++){
                    var imageCountry = finalResult[i]["flags"]["png"];
                    var nameCountry = finalResult[i]["name"]["official"];

                    var populationCountry = finalResult[i]["population"].toString();
                    populationCountry = splitAt(populationCountry);

                    var regionCountry = finalResult[i]["region"];
                    var capitalCountry = finalResult[i]["capital"][0];
                    cards += insertCountry(imageCountry, nameCountry, populationCountry, regionCountry, capitalCountry);
                }
                countryWrapper.innerHTML = cards;
            }
        }
        xhr.open('GET', `https://restcountries.com/v3.1/region/${newFilterText}`, true);
        xhr.send();
    }
}

filterRegionButton.addEventListener("click", () => {
    dropdownFilter.classList.toggle("hidden");
})

darkModeButton.addEventListener("click", () => {
    if(darkModeButton.classList.contains("not-dark")){
        darkModeButton.classList.remove("not-dark");
        document.querySelector("html").classList.add("dark");
        if(typeof (Storage) !== 'undefined'){
            sessionStorage.setItem("darkMode", true);
        }
        else{
            alert("Browser not support Web Storage");
        }
    }
    else{
        darkModeButton.classList.add("not-dark");
        document.querySelector("html").classList.remove("dark");
        if(typeof (Storage) !== 'undefined'){
            sessionStorage.removeItem("darkMode");
        }
        else{
            alert("Browser not support Web Storage");
        }
    }
})

searchValue.addEventListener("keyup", () => {
    var inputUser = searchValue.value;
    if(inputUser === ''){
        generateFirstData();
    }
    var xhr = new XMLHttpRequest();
    var cards = '';
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            var resultResponse = xhr.responseText;
            var finalResult = JSON.parse(resultResponse);
            for(var i=0; i<finalResult.length; i++){
                var imageCountry = finalResult[i]["flags"]["png"];
                var nameCountry = finalResult[i]["name"]["official"];

                var populationCountry = finalResult[i]["population"].toString();
                populationCountry = splitAt(populationCountry);

                var regionCountry = finalResult[i]["region"];
                var capitalCountry = finalResult[i]["capital"][0];
                cards += insertCountry(imageCountry, nameCountry, populationCountry, regionCountry, capitalCountry);
            }
            countryWrapper.innerHTML = cards;
        }
    }
    xhr.open('GET', `https://restcountries.com/v3.1/name/${inputUser}`, true);
    xhr.send();
})

generateFirstData();
checkDarkMode();
checkPreviousData();

document.addEventListener("click", function(e){
    if(e.target.parentElement.parentElement.parentElement.classList.contains("flag-container")){
        var countryName = e.target.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild.innerText;
        if(typeof (Storage) !== 'undefined'){
            sessionStorage.setItem("officialCountryName", countryName);
        }
        else{
            alert("Browser tidak mendukung Web Storage");
        }
    }
});

// Hide when click outside Filter Region button
document.addEventListener("click", (e) => {
    if(!filterRegionButton.contains(e.target)){
        dropdownFilter.classList.add("hidden");
    }
});

listDropdownFilter.forEach(i => {
    i.addEventListener("click", () => {
        loader.classList.remove("hidden");
        filterText.innerText = i.innerText;
        sessionStorage.setItem("filter-text", filterText.innerText);
        if(i.innerText === "- Select Region -"){
            filterText.innerText = "Filter by region";
            generateFirstData();
            return;
        }
        var xhr = new XMLHttpRequest();
        var cards = '';
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                loader.classList.add("hidden");
                var resultResponse = xhr.responseText;
                var finalResult = JSON.parse(resultResponse);
                for(var j=0; j<finalResult.length; j++){
                    // Only data at index 4 (Asia Region) that return undefined value
                    if(j === 4){
                        continue;
                    }
                    var imageCountry = finalResult[j]["flags"]["png"];
                    var nameCountry = finalResult[j]["name"]["official"];

                    var populationCountry = finalResult[j]["population"].toString();
                    populationCountry = splitAt(populationCountry);

                    var regionCountry = finalResult[j]["region"];
                    var capitalCountry = finalResult[j]["capital"][0];
                    cards += insertCountry(imageCountry, nameCountry, populationCountry, regionCountry, capitalCountry);
                }
                countryWrapper.innerHTML = cards;
            }
        }
        xhr.open('GET', `https://restcountries.com/v3.1/region/${i.textContent}`, true);
        xhr.send();
    });
})

// listDropdownFilter.forEach(i => {
//     i.addEventListener("click", () => {
//         console.log(this.i);
//     });
// })

// for(let i=0; i<listDropdownFilter.length; i++){
//     listDropdownFilter[i].addEventListener("click", function(){
//         // countryWrapper.innerHTML = '';
        
//         const flagContainer = document.querySelectorAll(".flag-container");
//         var newCards = ``;
//         // console.log(flagContainer[0].getAttribute("data-region"));
//         // if(flagContainer[i].getAttribute("data-region") === listDropdownFilter[i].innerText){
            
//         // }
//         flagContainer.forEach(el => {
//             if(el.getAttribute("data-region") === listDropdownFilter[i].innerText){
//                 newCards += el;
//             }
//         })
//         countryWrapper.innerHTML = newCards;
//     });
// }