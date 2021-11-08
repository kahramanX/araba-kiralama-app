import turkey from "../api/il-api.js";

let provinces = turkey;

let neredenBox = document.querySelector(".nereden-search-box");


function eventListeners() {
    neredenBox.addEventListener("click", whenClickedSearchBox);
}

eventListeners();

function whenClickedSearchBox(e) {
    if (e.target.className == "nereden-search-box") {
        
        e.target.children[2].remove();

        createSelectTag();
    }
}
//    <option value="">${element.il}</option>

function createSelectTag() {
    let selectSection = document.querySelector(".select-section");

    let selectElement = `<label for="provinces">İl seçin</label>
    <select name="provinces" id="provinces">
        ${addProvinces()}
    </select>`;

    selectSection.innerHTML = selectElement;
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
    let getSelectedProvince = document.querySelectorAll("option")

        let arr = [];
    getSelectedProvince.forEach((element, i) => {

        arr.push(element.selected)

    })
    console.log(arr)
    
    console.log(getSelectedProvince)
}