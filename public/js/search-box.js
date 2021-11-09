import turkey from "../api/il-api.js";

let provinces = turkey;

let neredenBox = document.querySelector(".nereden-search-box");
//let selectSection = document.querySelector(".select-section");
let provinceSection = document.querySelector(".province-section");
let districtSection = document.querySelector(".district-section");



function eventListeners() {
    neredenBox.addEventListener("click", whenClickedSearchBox);
}

eventListeners();

function whenClickedSearchBox(e) {
    if (e.target.className == "nereden-search-box") {

        //e.target.children[2].remove();
        let willDeletedPTag = document.querySelector(".nereden-search-box>.delete-after");
        willDeletedPTag.remove();

        createSelectTagForProvinces();
        createSelectTagForDistricts();
    }
}

function createSelectTagForProvinces() {

    let selectElement = `<label for="provinces">İl seçin</label>
    <select name="provinces" id="provinces">
        ${addProvinces()}
    </select>`;

    provinceSection.innerHTML = selectElement;

    // Bundan sonraki kısım, selected olan option elementini seçmek için
    let select = document.querySelector("select");

    select.addEventListener("change", findSelectedProvince)
}

function addProvinces() {
    let arr = [];

    for (let i = 0; i < turkey.length; i++) {

        let element = `<option value="${turkey[i].il}">${turkey[i].il}</option>`;

        arr.push(element);
    }

    //Buradaki join(), array'den html'e eklenen html kodların arasındaki virgülü kaldırır. Yerine boşluk koyar, ancak bu html de gözükmez
    return arr.join("");
}


function findSelectedProvince() {
    let selectTag = document.querySelector("#provinces"); // select elementinin id'si

    let selectValue = selectTag.value;

    addDistrict(selectValue);
    //console.log(selectValue);
}





function createSelectTagForDistricts() {

    let selectElement = `<label for="districts">İlçe seçin</label>
    <select name="districts" id="districts">
        ${addDistrict()}
    </select>`;

    districtSection.innerHTML = selectElement;
}

function addDistrict(province) {

    //let arr2 = [];

   let arrayed = turkey.filter((el) => {
        if (el.il.includes(province)) {
            let selectedDistrict = el.ilceler;

            return selectedDistrict
        }

    });

    console.log(arrayed)
    return arrayed;
}