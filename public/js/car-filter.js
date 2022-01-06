let miniBox = document.querySelectorAll(".mini-box");
let input = document.querySelectorAll(".mini-box>input");

let carContainer = document.querySelectorAll(".car-container");

for (let i = 0; i < miniBox.length; i++) {

    input[i].addEventListener("change", runAllInputs);

    miniBox[i].addEventListener("mouseOver", function () {

        miniBox[i].style.backgroundColor = "#FA737B";
        miniBox[i].style.color = "white";
        miniBox[i].style.cursor = "pointer";

    })

    function runAllInputs() {

        if (input[i].checked == true) {
            console.log("eşit mi? ")
            console.log(miniBox[i].dataset.carBodyType == carContainer[i].dataset.carBodyType);

            miniBox[i].style.backgroundColor = "#FA737B";
            miniBox[i].style.color = "white";

            if (miniBox[i].dataset.carBodyType == carContainer[i].dataset.carBodyType) {

                console.log("olduuuuu");

            }

        } else if (input[i].checked == false) {

            miniBox[i].style.backgroundColor = "white";
            miniBox[i].style.color = "rgb(100, 100, 100)";
        }
    }

}