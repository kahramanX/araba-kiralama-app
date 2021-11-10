import turkey from "../api/il-api.js";

let neredenBox = document.querySelector(".nereden-search-box");
//let selectSection = document.querySelector(".select-section");
let provinceSection = document.querySelector(".province-section");
let districtSection = document.querySelector(".district-section");

eventListeners();

function eventListeners() {
    neredenBox.addEventListener("click", whenClickedSearchBox);
}

function whenClickedSearchBox(e) {
    if (e.target.className == "nereden-search-box") {

        //e.target.children[2].remove();
        let willDeletedPTag = document.querySelector(".nereden-search-box .delete-after");
        willDeletedPTag.remove();

        createSelectTagForProvinces();
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

    select.addEventListener("change", createSelectTagForDistricts)
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

/* function findSelectedProvince() {
    let selectTag = document.querySelector("#provinces"); // select elementinin id'si

    let selectValue = selectTag.value;

    addDistrict(selectValue);
    //console.log(selectValue);
} */

function createSelectTagForDistricts() {

    let selectElement = `<label for="districts">İlçe seçin</label>
    <select name="districts" id="districts">
        ${addDistrict()}
    </select>`;

    districtSection.innerHTML = selectElement;
}

function addDistrict() {
    let selectTag = document.querySelector("#provinces"); // select elementinin id'si

    let province = selectTag.value;

    let arr = [];

    turkey.filter((el) => {

        if (el.il.includes(province)) {

            let districts = el.ilceler;

            for (let i = 0; i < districts.length; i++) {

                let selectedDistrict = `<option value="${districts[i]}">${districts[i]}</option>`;

                console.log(selectedDistrict);
                arr.push(selectedDistrict);
            }
        }
    });

    console.log(arr);
    return arr;
}