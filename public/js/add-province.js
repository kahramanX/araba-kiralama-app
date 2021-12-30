import turkey from "../api/il-api.js";

let province = document.querySelector("#province");
let district = document.querySelector("#district");

addProvinces();

function addProvinces() {

    let arr = []
    turkey.forEach((element) => {

        let option = `<option value="${element.il}">${element.il}</option>`;

        province.innerHTML += option;
        arr.push(option)
    })
}

province.addEventListener("change", function (e) {

    for (let i = 0; i < turkey.length; i++) {

        if (province.value == turkey[i].il) {

            // her il seçimi yapıldığında, ilçe (district) kısmını boşaltıyor
            //hemen ardından ilçe eklendiği için üst üste il seçiminde ilçelerin birbirine girmesini engelliyor
            district.innerHTML = "";

            let newDistrict = turkey[i].ilceler;

            addDistrict(newDistrict);
        }        
    }
})

function addDistrict(newDistrict) {
    let arr = []
    newDistrict.forEach((element) => {

        let option = `<option value="${element}">${element}</option>`;

        district.innerHTML += option;
        arr.push(option)
    })
}