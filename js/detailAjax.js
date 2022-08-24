// Loader, for waiting response from AJAX
const loader = document.querySelector(".loader");

// Button Dark Mode
const darkModeButton = document.getElementById("dark-mode-button");

const loading = function(){
    loader.classList.remove("hidden");
}

function checkDarkMode(){
    // if previously dark mode is active
    if(sessionStorage.getItem("darkMode") !== null){
        document.querySelector("html").classList.add("dark");
        darkModeButton.classList.remove("not-dark");
    }
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

function generateFirstData(imageCountry, mainNameCountry, nativeName, populationCountry, regionCountry, subRegion, capitalCountry, topLevelDomain, currenciesCountry, languagesCountry){
    const detailWrapper = document.getElementById("detail-wrapper");
    detailWrapper.innerHTML = `
        <div class="h-44 mb-7 md:w-[430px] md:h-52 lg:w-[510px] lg:h-[273px] border-black">
            <img class="w-full h-full object-cover" src="${imageCountry}" alt="flag">
        </div>
        <div class="mb-5 lg:flex-grow">
            <h1 class="font-extrabold text-lg mb-3 font-nunito transition duration-300 dark:text-white">${mainNameCountry}</h1>
            <div class="flex flex-col gap-7 mb-7 lg:flex-row lg:gap-11">
                <section>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Native Name: <span class="font-light">${nativeName}</span></p>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Population: <span class="font-light">${populationCountry}</span></p>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Region: <span class="font-light">${regionCountry}</span></p>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Sub Region: <span class="font-light">${subRegion}</span></p>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Capital: <span class="font-light">${capitalCountry}</span></p>
                </section>
                
                <section>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Top Level Domain: <span class="font-light">${topLevelDomain}</span></p>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Currencies: <span class="font-light">${currenciesCountry}</span></p>
                    <p class="font-semibold text-sm duration-300 dark:text-white lg:text-xs lg:leading-5">Languages: <span class="font-light">${languagesCountry}</span></p>
                </section>
            </div>
            <div class="">
                <h2 class="font-semibold mb-3 transition duration-300 dark:text-white lg:text-sm">Border Countries: </h2>
                <ul class="flex gap-2">
                    <li class="text-sm p-1 px-6 shadow-[0px_0px_13px_0px_rgba(0,0,0,0.15)] transition duration-300 dark:bg-dark-mode-element dark:text-white lg:text-xs">France</li>
                    <li class="text-sm p-1 px-6 shadow-[0px_0px_13px_0px_rgba(0,0,0,0.15)] transition duration-300 dark:bg-dark-mode-element dark:text-white lg:text-xs">Germany</li>
                    <li class="text-sm p-1 px-6 shadow-[0px_0px_13px_0px_rgba(0,0,0,0.15)] transition duration-300 dark:bg-dark-mode-element dark:text-white lg:text-xs">Netherlands</li>
                </ul>
            </div>
        </div>
    `;
}

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

checkDarkMode();

window.addEventListener("load", function(){
    loader.classList.remove("hidden");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            loader.classList.add("hidden");
            var resultResponse = xhr.responseText;
            var finalResult = JSON.parse(resultResponse);
            
            for(var j=0; j<finalResult.length; j++){
                var nameCountry = finalResult[j]["name"]["official"];
                if(nameCountry === sessionStorage.getItem("officialCountryName")){
                    var imageCountry = finalResult[j]["flags"]["png"];
                    var mainNameCountry = finalResult[j]["name"]["common"];
                    
                    // Native Name
                    var nativeName = Object.values(finalResult[j]["name"]["nativeName"]);
                    nativeName = nativeName[0]["common"];

                    var populationCountry = finalResult[j]["population"].toString();
                    populationCountry = splitAt(populationCountry);

                    var regionCountry = finalResult[j]["region"];
                    var subRegion = finalResult[j]["subregion"];
                    var capitalCountry = finalResult[j]["capital"][0];

                    var topLevelDomain = finalResult[j]["tld"][0];

                    // currencies
                    var currenciesCountry = Object.values(finalResult[j]["currencies"]);
                    currenciesCountry = currenciesCountry[0]["name"];

                    // Language
                    var languagesCountry = Object.values(finalResult[j]["languages"]);
                    languagesCountry = languagesCountry.toString().split(",");
                    languagesCountry = languagesCountry.toString().replaceAll(",", ", ");
                    
                    generateFirstData(imageCountry, mainNameCountry, nativeName, populationCountry, regionCountry, subRegion, capitalCountry, topLevelDomain, currenciesCountry, languagesCountry);
                    sessionStorage.removeItem("officialCountryName");
                }
            }
        }
    }
    xhr.open('GET', `https://restcountries.com/v3.1/all`, true);
    xhr.send();
});