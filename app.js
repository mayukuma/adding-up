'use strict';
//fsモジュールを読み込んで使えるように
const fs = require('fs');
//readlineモジュールを読み込んんで使えるように
const readline = require('readline');
//'./popu-pref.csv'をファイルとして読み込める状態に
const rs = fs.createReadStream('./popu-pref.csv');
//readlineモジュールにrsを設定
const rl =readline.createInterface({ input: rs, output: {} });
//./popu-pref.csvのデータを１行ずつ読み込み設定された関数を実行
const prefectureDataMap = new Map();// key: 都道府県 value: 集計データのオブジェクト
rl.on('line',lineString => {
    const columns = lineString.split(',');//データをカンマで区切る
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);//parseIntは文字列を数値へ
    if (year === 2010 || year === 2015){
       let value = prefectureDataMap.get(prefecture);
       if(!value){
           value = {popu10: 0,popu15: 0, change: null };
       }
       if (year === 2010){
           value.popu10 = popu;
       } else if (year === 2015){
           value.popu15 = popu;
       }
       prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    //変化率生産
    for (let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }//引き算の結果がーなら降順、＋なら昇順に並べ替え
    const rankingArray =Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const　rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key + '; ' +value.popu10 + '=>' +value.popu15 + ' 変化率:' + value.change
        ) ;
    })
    console.log(rankingStrings);
});