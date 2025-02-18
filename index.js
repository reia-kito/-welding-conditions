'use strict';


const chart = document.getElementById("chart");
const ctx = chart.getContext("2d");

const chartLine = document.getElementById("chartLine");
const ctx2 = chartLine.getContext("2d");
ctx2.strokeStyle = 'gray';

//グラフ線
ctx2.strokeStyle = "#dad4db";
ctx2.beginPath()
ctx2.moveTo(0,0);
ctx2.lineTo(0,400);
ctx2.moveTo(0,0);
ctx2.lineTo(1000,0);
ctx2.stroke();// 描画する


//ファイル読み込み
const X = XLSX;
const excelData = [];

function loadFile(e) {
    let files = e.target.files;
    let f = files[0];

    let reader = new FileReader();
    reader.onload = function (e) {
        let data = e.target.result;
        let wb;
        let arr = fixdata(data);
        wb = X.read(btoa(arr), {
            type: 'base64',
            cellDates: true,
        });

        let output = "";
        output = to_json(wb);
        for(const data of output["入力欄"]){
            excelData.push(data)
        };
        selectBox(excelData);
    };

    reader.readAsArrayBuffer(f);
}

//Excelファイル読み込みイベント
document.getElementById("excelFile").addEventListener("change",(e) => loadFile(e));


//セレクトボックス
function selectBox(e) {
    excelData.forEach((e) => {
        const option = document.createElement('option');
        option.innerText = `${e["ロボット"]} ${e["Prg"]} ${e["打点"]}`;
        document.getElementById("robotSelect").appendChild(option);
    })
}

// ファイルの読み込み
function fixdata(data) {
    let result = "";
    let l = 0;
    let w = 10240;
    result += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return result;
}

// jsonに変換
function to_json(workbook) {
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
        const roa = X.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            {
                raw: true,
            });
        if (roa.length > 0) {
            result[sheetName] = roa;
        }
    });
    return result;
}

//セレクトボックス変更イベント
document.getElementById("robotSelect").addEventListener("change",(e) => {
    const index = document.getElementById("robotSelect").selectedIndex;
    canvasClear();
    draw(index);
});


let stepY = 30;
let stepX = 1;

//サイズ変更
document.getElementById("xValue").addEventListener("change", () => {
    if (document.getElementById("xValue").value === "小") {
        stepX = 0.5;
    } else if (document.getElementById("xValue").value === "中") {
        stepX = 1;
    } else {
        stepX = 1.5;
    }
    const index = document.getElementById("robotSelect").selectedIndex;
    canvasClear();
    draw(index);
});

document.getElementById("yValue").addEventListener("change", () => {
    if (document.getElementById("yValue").value === "小") {
        stepY = 20;
    } else if (document.getElementById("yValue").value === "中") {
        stepY = 30;
    } else {
        stepY = 40;
    }
    const index = document.getElementById("robotSelect").selectedIndex;
    canvasClear();
    draw(index);
});




function draw(index) {
const selectData = excelData[index];
//プレ通電
const compression = selectData["プレ通電予圧"];
document.getElementById("compression").value = selectData["プレ通電予圧"];

const allowablePressurePr = selectData["プレ通電加圧力(N)"];
document.getElementById("allowablePressurePr").value = selectData["プレ通電加圧力(N)"];

const upSlopePr = selectData["プレ通電アップスロープ"];
document.getElementById("upSlopePr").value = selectData["プレ通電アップスロープ"];

const energizationTimePr = selectData["プレ通電通電時間"];
document.getElementById("energizationTimePr").value = selectData["プレ通電通電時間"];

const downSlope = selectData["プレ通電ダウンスロープ"];
document.getElementById("downSlope").value = selectData["プレ通電ダウンスロープ"];

const electricCurrentPr = selectData["プレ通電電流(KA)"];
document.getElementById("electricCurrentPr").value = selectData["プレ通電電流(KA)"];

const interval = selectData["プレ通電インターバル"];
document.getElementById("interval").value = selectData["プレ通電インターバル"];


//本通電1
const allowablePressure1 = selectData["本通電1加圧力(N)"];
document.getElementById("allowablePressure1").value = selectData["本通電1加圧力(N)"];

const slope1 = selectData["本通電1アップスロープ"];
document.getElementById("slope1").value = selectData["本通電1アップスロープ"];

const energizationTime1 = selectData["本通電1通電時間"];
document.getElementById("energizationTime1").value = selectData["本通電1通電時間"];

const electricCurrent1 = selectData["本通電1電流(kA)"];
document.getElementById("electricCurrent1").value = selectData["本通電1電流(kA)"];


//本通電2
const slope2 = selectData["スロープ本通電2"];
document.getElementById("slope2").value = selectData["スロープ本通電2"];

const energizationTime2 = selectData["本通電2通電時間"];
document.getElementById("energizationTime2").value = selectData["本通電2通電時間"];

const electricCurrent2 = selectData["本通電2電流(kA)"];
document.getElementById("electricCurrent2").value = selectData["本通電2電流(kA)"];


//本通電3
const slope3 = selectData["本通電3スロープ"];
document.getElementById("slope3").value = selectData["本通電3スロープ"];

const energizationTime3 = selectData["本通電3通電時間"];
document.getElementById("energizationTime3").value = selectData["本通電3通電時間"];

const electricCurrent3 = selectData["本通電3電流(kA)"];
document.getElementById("electricCurrent3").value = selectData["本通電3電流(kA)"];


//本通電4
const slope4 = selectData["本通電4スロープ"];
document.getElementById("slope4").value = selectData["本通電4スロープ"];

const energizationTime4 = selectData["本通電4通電時間"];
document.getElementById("energizationTime4").value = selectData["本通電4通電時間"];

const electricCurrent4 = selectData["本通電4電流(kA)"];
document.getElementById("electricCurrent4").value = selectData["本通電4電流(kA)"];


//本通電5
const slope5 = selectData["本通電5スロープ"];
document.getElementById("slope5").value = selectData["本通電5スロープ"];

const energizationTime5 = selectData["本通電5通電時間"];
document.getElementById("energizationTime5").value = selectData["本通電5通電時間"];

const electricCurrent5 = selectData["本通電5電流(kA)"];
document.getElementById("electricCurrent5").value = selectData["本通電5電流(kA)"];


//本通電6
const slope6 = selectData["本通電6スロープ"];
document.getElementById("slope6").value = selectData["本通電6スロープ"];

const energizationTime6 = selectData["本通電6通電時間"];
document.getElementById("energizationTime6").value = selectData["本通電6通電時間"];

const electricCurrent6 = selectData["本通電6電流(kA)"];
document.getElementById("electricCurrent6").value = selectData["本通電6電流(kA)"];


//本通電7
const slope7 = selectData["本通電7スロープ"];
document.getElementById("slope7").value = selectData["本通電7スロープ"];

const energizationTime7 = selectData["本通電7通電時間"];
document.getElementById("energizationTime7").value = selectData["本通電7通電時間"];

const electricCurrent7 = selectData["本通電7電流(kA)"];
document.getElementById("electricCurrent7").value = selectData["本通電7電流(kA)"];


//本通電8
const slope8 = selectData["本通電8スロープ"];
document.getElementById("slope8").value = selectData["本通電8スロープ"];

const energizationTime8 = selectData["本通電8通電時間"];
document.getElementById("energizationTime8").value = selectData["本通電8通電時間"];

const electricCurrent8 = selectData["本通電8電流(kA)"];
document.getElementById("electricCurrent8").value = selectData["本通電8電流(kA)"];


//本通電9
const slope9 = selectData["本通電9スロープ"];
document.getElementById("slope9").value = selectData["本通電9スロープ"];

const energizationTime9 = selectData["本通電9通電時間"];
document.getElementById("energizationTime9").value = selectData["本通電9通電時間"];

const electricCurrent9 = selectData["本通電9電流(kA)"];
document.getElementById("electricCurrent9").value = selectData["本通電9電流(kA)"];


//本通電10
const slope10 = selectData["本通電10スロープ"];
document.getElementById("slope10").value = selectData["本通電10スロープ"];

const energizationTime10 = selectData["本通電10通電時間"];
document.getElementById("energizationTime10").value = selectData["本通電10通電時間"];

const electricCurrent10 = selectData["本通電10電流(kA)"];
document.getElementById("electricCurrent10").value = selectData["本通電10電流(kA)"];


//本通電11
const slope11 = selectData["本通電11スロープ"];
document.getElementById("slope11").value = selectData["本通電11スロープ"];

const energizationTime11 = selectData["本通電11通電時間"];
document.getElementById("energizationTime11").value = selectData["本通電11通電時間"];

const electricCurrent11 = selectData["本通電11電流(kA)"];
document.getElementById("electricCurrent11").value = selectData["本通電11電流(kA)"];


//共通
const downSlopeB = selectData["共通ダウンスロープ"];
document.getElementById("downSlopeB").value = selectData["共通ダウンスロープ"];

const retentionTime = selectData["共通保持時間"];
document.getElementById("retentionTime").value = selectData["共通保持時間"];

// //プレ通電
// const compression = document.getElementById("compression").value;
// const allowablePressurePr = document.getElementById("allowablePressurePr").value;
// const upSlopePr = document.getElementById("upSlopePr").value;
// const energizationTimePr = document.getElementById("energizationTimePr").value;
// const downSlope = document.getElementById("downSlope").value;
// const electricCurrentPr = document.getElementById("electricCurrentPr").value;
// const interval = document.getElementById("interval").value;

// //本通電1
// const allowablePressure1 = document.getElementById("allowablePressure1").value;
// const slope1 = document.getElementById("slope1").value;
// const energizationTime1 = document.getElementById("energizationTime1").value;
// const electricCurrent1 = document.getElementById("electricCurrent1").value;

// //本通電2
// const slope2 = document.getElementById("slope2").value;
// const energizationTime2 = document.getElementById("energizationTime2").value;
// const electricCurrent2 = document.getElementById("electricCurrent2").value;

// //本通電3
// const slope3 = document.getElementById("slope3").value;
// const energizationTime3 = document.getElementById("energizationTime3").value;
// const electricCurrent3 = document.getElementById("electricCurrent3").value;

// //本通電4
// const slope4 = document.getElementById("slope4").value;
// const energizationTime4 = document.getElementById("energizationTime4").value;
// const electricCurrent4 = document.getElementById("electricCurrent4").value;

// //本通電5
// const slope5 = document.getElementById("slope5").value;
// const energizationTime5 = document.getElementById("energizationTime5").value;
// const electricCurrent5 = document.getElementById("electricCurrent5").value;

// //本通電6
// const slope6 = document.getElementById("slope6").value;
// const energizationTime6 = document.getElementById("energizationTime6").value;
// const electricCurrent6 = document.getElementById("electricCurrent6").value;

// //本通電7
// const slope7 = document.getElementById("slope7").value;
// const energizationTime7 = document.getElementById("energizationTime7").value;
// const electricCurrent7 = document.getElementById("electricCurrent7").value;

// //本通電8
// const slope8 = document.getElementById("slope8").value;
// const energizationTime8 = document.getElementById("energizationTime8").value;
// const electricCurrent8 = document.getElementById("electricCurrent8").value;

// //本通電9
// const slope9 = document.getElementById("slope9").value;
// const energizationTime9 = document.getElementById("energizationTime9").value;
// const electricCurrent9 = document.getElementById("electricCurrent9").value;

// //共通
// const downSlopeB = document.getElementById("downSlopeB").value;
// const retentionTime = document.getElementById("retentionTime").value;

//ms[2] で使う
const prMax = Number(upSlopePr) > Number(downSlope) ? Number(upSlopePr) : Number(downSlope);

    const ms = [
        0,//1
        Number(compression),//2
        Number(compression),//3
        Number(compression) + Number(prMax),//4
        Number(compression) + Number(prMax) + Number(energizationTimePr),//5
        Number(compression) + Number(prMax) + Number(energizationTimePr),//6
        Number(compression) + Number(prMax) + Number(energizationTimePr),//7
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval),//8
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval),//9
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1),//10
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1),//11
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1),//12
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2),//13
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2),//14
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2),//15
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3),//16
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3),//17
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3),//18
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4),//19
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4),//20
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4),//21
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5),//22
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5),//23
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5),//24
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6),//25
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6),//26
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6),//27
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7),//28
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7),//29
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7),//30
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8),//31
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8),//32
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8),//33
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9),//34
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9),//35
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9),//36
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10),//37
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10) + Number(energizationTime10),//38
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10) + Number(energizationTime10),//39
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10) + Number(energizationTime10) + Number(slope11),//40
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10) + Number(energizationTime10) + Number(slope11) + Number(energizationTime11),//41
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10) + Number(energizationTime10) + Number(slope11) + Number(energizationTime11),//42
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10) + Number(energizationTime10) + Number(slope11) + Number(energizationTime11) + Number(downSlopeB),//43共通
        Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(slope10) + Number(energizationTime10) + Number(slope11) + Number(energizationTime11) + Number(downSlopeB) + Number(retentionTime),//44共通
        // Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(downSlopeB),//37共通
        // Number(compression) + Number(prMax) + Number(energizationTimePr) + Number(interval) + Number(slope1) + Number(energizationTime1)+ Number(slope2) + Number(energizationTime2) + Number(slope3) + Number(energizationTime3) + Number(slope4) + Number(energizationTime4) + Number(slope5) + Number(energizationTime5) + Number(slope6) + Number(energizationTime6) + Number(slope7) + Number(energizationTime7) + Number(slope8) + Number(energizationTime8) + Number(slope9) + Number(energizationTime9) + Number(downSlopeB) + Number(retentionTime),//38共通
    ];

    
    const kA = [
        0,//1
        0,//2
        0,//3
        Number(electricCurrentPr),//4
        Number(electricCurrentPr),//5
        Number(electricCurrentPr),//6
        Number(electricCurrentPr),//7
        Number(electricCurrentPr),//8
        Number(electricCurrentPr),//9
        Number(electricCurrent1),//10
        Number(electricCurrent1),//11
        Number(electricCurrent1),//12
        Number(electricCurrent2),//13
        Number(electricCurrent2),//14
        Number(electricCurrent2),//15
        Number(electricCurrent3),//16
        Number(electricCurrent3),//17
        Number(electricCurrent3),//18
        Number(electricCurrent4),//19
        Number(electricCurrent4),//20
        Number(electricCurrent4),//21
        Number(electricCurrent5),//22
        Number(electricCurrent5),//23
        Number(electricCurrent5),//24
        Number(electricCurrent6),//25
        Number(electricCurrent6),//26
        Number(electricCurrent6),//27
        Number(electricCurrent7),//28
        Number(electricCurrent7),//29
        Number(electricCurrent7),//30
        Number(electricCurrent8),//31
        Number(electricCurrent8),//32
        Number(electricCurrent8),//33
        Number(electricCurrent9),//34
        Number(electricCurrent9),//35
        Number(electricCurrent9),//36
        Number(electricCurrent10),//37
        Number(electricCurrent10),//38
        Number(electricCurrent10),//39
        Number(electricCurrent11),//40
        Number(electricCurrent11),//41
        Number(electricCurrent11),//42
    ];
    
    
    //中身
    ctxDraw(ms, kA);   
    //縦線
    verticalDraw(ms, kA);
    //x軸表示
    xms(ms);
}

//中身描写
function ctxDraw(ms, kA) {
    ctx.beginPath();
    for(let i = 0; i < ms.length; i++) {
    ctx.moveTo(ms[i] * stepX, kA[i] * stepY);//1
    ctx.lineTo(ms[i + 1] * stepX, kA[i + 1] * stepY);
    }
    ctx.stroke();// 描画する
}

//縦線描写
function verticalDraw(ms, kA) {
    ctx.beginPath();
    for(let i = 0; i < ms.length; i++) {
        ctx.moveTo(ms[i] * stepX, kA[i] * stepY);//1
        ctx.lineTo(ms[i] * stepX, 0);
        }
    ctx.stroke();
}

//グラフクリア
function canvasClear() {
    const canvas = document.getElementById('chart');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//x軸表示
function xms(ms) {
    const x = document.getElementById("x");
    x.innerText = Array.from(new Set(ms)).filter(e => e === e);
}

