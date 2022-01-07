// Türkiye il ve ilçelerini barındıran json dosyası çekiliyor
import turkey from "../api/il-api.js";

// element seçimi
let province = document.querySelector("#carProvince");
let district = document.querySelector("#carDistrict");

//Sayfa yüklendiğinde il seçimini de aynı anda ekliyor
addProvinces();

function addProvinces() {
    // illerin province elementine yazıldığı yer
    let arr = []
    turkey.forEach((element) => {

        let option = `<option value="${element.il}">${element.il}</option>`;

        province.innerHTML += option;
        arr.push(option)
    })
}

province.addEventListener("change", function (e) { // her il seçiminde, seçilen ile göre ilçe ekliyor

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

//ilçelerin eklenir
function addDistrict(newDistrict) {
    let arr = []
    newDistrict.forEach((element) => {

        let option = `<option value="${element}">${element}</option>`;

        district.innerHTML += option;
        arr.push(option)
    })
}