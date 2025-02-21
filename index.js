'use strict';

const chart = document.getElementById("chart");
const ctx = chart.getContext("2d");


const chartText = document.getElementById("chartText");
const ctx3 = chartText.getContext("2d");

//グラフ外線描画
(() => {
    const chartLine = document.getElementById("chartLine");
    const ctx2 = chartLine.getContext("2d");
    ctx2.strokeStyle = 'gray';
    ctx2.strokeStyle = "#dad4db";
    ctx2.beginPath()
    ctx2.moveTo(0,0);
    ctx2.lineTo(0,400);
    ctx2.moveTo(0,0);
    ctx2.lineTo(1500,0);
    ctx2.stroke();
})();


//ファイル読み込み
const X = XLSX;
const excelData = [];

const loadFile = e => {
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


//セレクトボックス ロボットPrg打点の組み合わせのドロップダウン
const selectBox = () => {
    excelData.forEach((e,i) => {
        const option = document.createElement('option');
        option.innerText = `${i} ・ ${e["ロボット"]} ${e["Prg"]} ${e["打点"]}`;
        document.getElementById("robotSelect").appendChild(option);
    })
}

// ファイルの読み込み
const fixdata = data => {
    let result = "";
    let l = 0;
    let w = 10240;
    result += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return result;
}

// jsonに変換
const to_json = workbook => {
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
let stepX = 1.5;
// let stepY = 30;
// let stepX = 1;

//ms cyc 変換用
const cyc = [0, 18, 34, 50, 68, 84, 100, 118, 134, 150, 168, 184, 200, 218, 234, 250, 268, 284, 300, 318,
    334, 350, 368, 384, 400, 418, 434, 450, 468, 484, 500, 518, 534, 550, 568, 584, 600, 618, 634, 650,
    668, 684, 700, 718, 734, 750, 768, 784, 800, 818, 834, 850, 868, 884, 900, 918, 934, 950, 968, 984, 1000
]

//ms cyc　切替イベント　再描画
let flag = "ms";
document.getElementById("msOrCyc").addEventListener('change', e => {
    flag = document.getElementById("msOrCyc").value;
    const index = document.getElementById("robotSelect").selectedIndex;
    canvasClear();
    draw(index);
});


const draw = index => {

const selectData = excelData[index];

const getVal = (id, columnName) => document.getElementById(id).value = selectData[columnName];
//プレ通電
const compression = selectData["プレ通電予圧"];
getVal("compression", "プレ通電予圧");
getVal("allowablePressurePr","プレ通電加圧力(N)");

const upSlopePr = selectData["プレ通電アップスロープ"];
getVal("upSlopePr", "プレ通電アップスロープ");

const energizationTimePr = selectData["プレ通電通電時間"];
getVal("energizationTimePr", "プレ通電通電時間");

const downSlope = selectData["プレ通電ダウンスロープ"];
getVal("downSlope", "プレ通電ダウンスロープ");

const electricCurrentPr = selectData["プレ通電電流(KA)"];
getVal("electricCurrentPr", "プレ通電電流(KA)");

const interval = selectData["プレ通電インターバル"];
getVal("interval", "プレ通電インターバル");


//本通電1
getVal("allowablePressure1", "本通電1加圧力(N)");

const slope1 = selectData["本通電1アップスロープ"];
getVal("slope1", "本通電1アップスロープ");

const energizationTime1 = selectData["本通電1通電時間"];
getVal("energizationTime1", "本通電1通電時間");

const electricCurrent1 = selectData["本通電1電流(kA)"];
getVal("electricCurrent1", "本通電1電流(kA)");


//本通電2
const slope2 = selectData["スロープ本通電2"];
getVal("slope2", "スロープ本通電2");

const energizationTime2 = selectData["本通電2通電時間"];
getVal("energizationTime2", "本通電2通電時間");

const electricCurrent2 = selectData["本通電2電流(kA)"];
getVal("electricCurrent2", "本通電2電流(kA)");

//本通電3～11まとめてgetVal ～本通電2までは列名違いでループしない
for(let i = 3; i <= 11; i++) {
    getVal(`slope${i}`, `本通電${i}スロープ`);
    getVal(`energizationTime${i}`, `本通電${i}通電時間`);
    getVal(`electricCurrent${i}`, `本通電${i}電流(kA)`);
}
//本通電3
const slope3 = selectData["本通電3スロープ"];
const energizationTime3 = selectData["本通電3通電時間"];
const electricCurrent3 = selectData["本通電3電流(kA)"];

//本通電4
const slope4 = selectData["本通電4スロープ"];
const energizationTime4 = selectData["本通電4通電時間"];
const electricCurrent4 = selectData["本通電4電流(kA)"];

//本通電5
const slope5 = selectData["本通電5スロープ"];
const energizationTime5 = selectData["本通電5通電時間"];
const electricCurrent5 = selectData["本通電5電流(kA)"];

//本通電6
const slope6 = selectData["本通電6スロープ"];
const energizationTime6 = selectData["本通電6通電時間"];
const electricCurrent6 = selectData["本通電6電流(kA)"];

//本通電7
const slope7 = selectData["本通電7スロープ"];
const energizationTime7 = selectData["本通電7通電時間"];
const electricCurrent7 = selectData["本通電7電流(kA)"];

//本通電8
const slope8 = selectData["本通電8スロープ"];
const energizationTime8 = selectData["本通電8通電時間"];
const electricCurrent8 = selectData["本通電8電流(kA)"];

//本通電9
const slope9 = selectData["本通電9スロープ"];
const energizationTime9 = selectData["本通電9通電時間"];
const electricCurrent9 = selectData["本通電9電流(kA)"];

//本通電10
const slope10 = selectData["本通電10スロープ"];
const energizationTime10 = selectData["本通電10通電時間"];
const electricCurrent10 = selectData["本通電10電流(kA)"];

//本通電11
const slope11 = selectData["本通電11スロープ"];
const energizationTime11 = selectData["本通電11通電時間"];
const electricCurrent11 = selectData["本通電11電流(kA)"];

//共通
const downSlopeB = selectData["共通ダウンスロープ"];
getVal("downSlopeB", "共通ダウンスロープ");

const retentionTime = selectData["共通保持時間"];
getVal("retentionTime", "共通保持時間");

//ms[3] で使う
let prMax = Number(upSlopePr) > Number(downSlope) ? Number(upSlopePr) : Number(downSlope);

        let ms = [
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
        ];
        const msCopy =  [...ms];
        if(flag === "cyc") {
            prMax = cyc[Number(upSlopePr)] > cyc[Number(downSlope)] ? cyc[Number(upSlopePr)] : cyc[Number(downSlope)];
            
            ms = [
                0,//1
                cyc[Number(compression)],//2
                cyc[Number(compression)],//3
                cyc[Number(compression)] + Number(prMax),//4
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)],//5
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)],//6
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)],//7
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)],//8
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)],//9
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)],//10
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)],//11
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] ,//12
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)],//13
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)],//14
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)],//15
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)],//16
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)],//17
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)],//18
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)],//19
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)],//20
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)],//21
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)],//22
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)],//23
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)],//24
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)],//25
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)],//26
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)],//27
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)],//28
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)],//29
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)],//30
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)],//31
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)],//32
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)],//33
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)],//34
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)],//35
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)],//36
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)],//37
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)] + cyc[Number(energizationTime10)],//38
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)] + cyc[Number(energizationTime10)],//39
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)] + cyc[Number(energizationTime10)] + cyc[Number(slope11)],//40
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)] + cyc[Number(energizationTime10)] + cyc[Number(slope11)] + cyc[Number(energizationTime11)],//41
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)] + cyc[Number(energizationTime10)] + cyc[Number(slope11)] + cyc[Number(energizationTime11)],//42
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)] + cyc[Number(energizationTime10)] + cyc[Number(slope11)] + cyc[Number(energizationTime11)] + cyc[Number(downSlopeB)],//43共通
                cyc[Number(compression)] + Number(prMax) + cyc[Number(energizationTimePr)] + cyc[Number(interval)] + cyc[Number(slope1)] + cyc[Number(energizationTime1)] + cyc[Number(slope2)] + cyc[Number(energizationTime2)] + cyc[Number(slope3)] + cyc[Number(energizationTime3)] + cyc[Number(slope4)] + cyc[Number(energizationTime4)] + cyc[Number(slope5)] + cyc[Number(energizationTime5)] + cyc[Number(slope6)] + cyc[Number(energizationTime6)] + cyc[Number(slope7)] + cyc[Number(energizationTime7)] + cyc[Number(slope8)] + cyc[Number(energizationTime8)] + cyc[Number(slope9)] + cyc[Number(energizationTime9)] + cyc[Number(slope10)] + cyc[Number(energizationTime10)] + cyc[Number(slope11)] + cyc[Number(energizationTime11)] + cyc[Number(downSlopeB)] + cyc[Number(retentionTime)],//44共通
            ];
        }
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

    ctxDraw(ms, kA)
    ctx3Draw(ms, kA)
    verticalDraw(ms, kA);
    xms(ms, msCopy);
}

//グラフ内線描画　draw内使用
const ctxDraw = (ms, kA) => {
    ctx.beginPath();
    for(let i = 0; i < ms.length; i++) {
        ctx.strokeStyle = "#4feff1";
        ctx.moveTo(ms[i] * stepX, kA[i] * stepY);//1
        ctx.lineTo(ms[i + 1] * stepX, kA[i + 1] * stepY);
    }
    ctx.stroke();
}

//グラフ内value表示　draw内使用
const ctx3Draw = (ms, kA) => {
    ctx3.beginPath();
    for(let i = 1; i < ms.length; i = i + 3) {
        ctx3.font = "15px serif";
        if(kA[i] !== 0) ctx3.fillText(kA[i], ms[i] * stepX, 395 - (kA[i] * stepY));
    }
    ctx3.stroke();
}

//グラフ縦線描写　draw内使用
const verticalDraw = (ms, kA) => {
    ctx.beginPath();
    for(let i = 0; i < ms.length; i++) {
        ctx.moveTo(ms[i] * stepX, kA[i] * stepY);//1
        ctx.lineTo(ms[i] * stepX, 0);
        }
    ctx.stroke();
}


//x軸value表示
const xms = (ms, msCopy) => {
    const xArray = Array.from(new Set(ms)).filter(e => e === e);
    const msCopyArray = Array.from(new Set(msCopy)).filter(e => e === e);
    let toggle = -30;
    document.getElementById("innerX").remove();

    const p = document.createElement("p");
    p.setAttribute("id", "innerX");
    document.getElementById("outerX").appendChild(p);

    xArray.forEach((e,i) => {
        const value = document.createElement("h6");
        flag === "cyc" ? value.innerText = msCopyArray[i] : value.innerText = e;
        value.setAttribute("id", i);
        document.getElementById("innerX").appendChild(value);
        document.getElementById(i).style.position = "absolute";
        document.getElementById(i).style.left = (e * stepX) + "px";
        document.getElementById(i).style.font = "15px serif";
    
    if(xArray[i] < xArray[i - 1] + 20) {
        toggle = toggle + 20;
        document.getElementById(i).style.top =  toggle + "px";
    } else {
        toggle = -30;
        document.getElementById(i).style.top =  toggle + "px";
    }
    });

    toggle = 0;
}

//グラフクリア
const canvasClear = () => {
    const chart = document.getElementById('chart');
    const chartText = document.getElementById('chartText');
    ctx.clearRect(0, 0, chart.width, chart.height);
    ctx3.clearRect(0, 0, chartText.width, chartText.height);
}


//table表示非表示
const tableHidden = () => {
    const table = document.getElementById("tableDiv");
    table.style.display === "block" || table.style.display === "" ? table.style.display = "none" : table.style.display = "block";
}

document.getElementById("hiddenButton").addEventListener('click',tableHidden);


//ユーザーinput要素のvalue変更したら再描画
Array.from(document.getElementsByClassName("changeInput")).forEach((e,i) => e.addEventListener("change" , () => {
    Array.from(document.getElementsByClassName("changeInput"))[i].value = e.value;
    const index = document.getElementById("robotSelect").selectedIndex;
    excelData[index][e.name] = Number(e.value);
    canvasClear();
    draw(index)
}));

