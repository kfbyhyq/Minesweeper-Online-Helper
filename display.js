/* 接收网页传回的数据 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'eventQuest') {
        let eqInfo = request.eqInfo;
        console.log('活动任务信息:', eqInfo);   // 在控制台打出结果
        chrome.storage.local.set({ eqInfo: eqInfo });     // 保存数据
        document.getElementById('updateEq').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        document.getElementById('flag4').textContent = 1;   // 设置成功标记

        const output = eqInfo.map(item => item + '<br>').join('');
        document.getElementById('eqInfo').innerHTML = output;
    } else if (request.action === 'sendGemsPrice') {
        let gemsPrice = request.gemsPrice;
        console.log('收到价格更新:', gemsPrice);   // 在控制台打出结果
        chrome.storage.local.set({ gemsPrice: gemsPrice });     // 保存数据
        /* 按日期保存 */
        chrome.storage.local.get(['gemsPriceMap'], function(result) {
            const gpMap = result.gemsPriceMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史价格：', gpMap);
            const currentDate = new Date();
            const newDate = currentDate.getFullYear() + String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
            // 更新数据
            gpMap[newDate] = gemsPrice;
        
            // 保存更新后的数据
            chrome.storage.local.set({ gemsPriceMap: gpMap });
        });
        document.getElementById('flag1').textContent = 1;   // 设置成功标记
        displayTables();
    } else if (request.action === 'sendTicketPrice') {
        let ticketPrice = request.ticketPrice;
        console.log('收到门票价格更新:', ticketPrice);   // 在控制台打出结果
        chrome.storage.local.set({ ticketPrice: ticketPrice });     // 保存数据
        /* 按日期保存 */
        chrome.storage.local.get(['ticketPriceMap'], function(result) {
            const tpMap = result.ticketPriceMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史门票价格：', tpMap);
            const currentDate = new Date();
            const newDate = currentDate.getFullYear() + String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
            // 更新数据
            tpMap[newDate] = ticketPrice;
        
            // 保存更新后的数据
            chrome.storage.local.set({ ticketPriceMap: tpMap });
        });
        document.getElementById('flag2').textContent = 1;   // 设置成功标记
        displayTables();
    } else if (request.action === 'sendStatistics') {
        let statistics = request.statistics;
        console.log('收到游戏数据更新：', statistics);
        chrome.storage.local.set({ statistics: statistics });
        /* 按日期保存 */
        chrome.storage.local.get(['statisticsMap'], function(result) {
            const stMap = result.statisticsMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史游戏数据：', stMap);
            const currentDate = new Date();
            const newDate = currentDate.getFullYear() + String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
            // 更新数据
            stMap[newDate] = statistics;
        
            // 保存更新后的数据
            chrome.storage.local.set({ statisticsMap: stMap });
        });
        document.getElementById('flag5').textContent = 1;   // 设置成功标记
        displayTables();
    } else if (request.action === 'sendPersonalData') {
        let personalData = request.personalData;
        console.log('收到资源数据更新:', personalData);   // 在控制台打出结果
        chrome.storage.local.set({ personalData: personalData });     // 保存数据
        /* 按日期保存 */
        chrome.storage.local.get(['personalDataMap'], function(result) {
            const pdMap = result.personalDataMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史资源数据：', pdMap);
            const currentDate = new Date();
            const newDate = currentDate.getFullYear() + String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
            // 更新数据
            pdMap[newDate] = personalData;
        
            // 保存更新后的数据
            chrome.storage.local.set({ personalDataMap: pdMap });
        });
        document.getElementById('flag3').textContent = 1;   // 设置成功标记
        displayTables();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    displayTables();
});

/* 页面显示 */
function displayTables() {
    var gemsPrice;
    var ticketPrice;
    var statistics;
    var personalData;
    var equip; // 装备数据
    var lm = 8; // 最大等级
    var tm = 10; // 多少种竞技场
    /* 读取数据 */
    chrome.storage.local.get(null, function(result) {
        /* 宝石 */
        gemsPrice = result.gemsPrice;
        console.log('宝石/场币/碎片价格:', gemsPrice);
        displayMatrix(gemsPrice, 'table1');
        /* 竞技场门票 */
        ticketPrice = result.ticketPrice;
        console.log('竞技场门票价格:', ticketPrice);
        displayMatrix(ticketPrice, 'table2');
        /* 游戏数据 */
        statistics = result.statistics;
        console.log('游戏数据:', statistics);
        displayMatrix(statistics, 'table5');
        /* 每日游戏数据 */
        const stMap = result.statisticsMap || {};
        console.log('历史游戏数据:', stMap);
        const dates = Object.keys(stMap);
        if (dates.length > 1) {
            dates.sort((a, b) => Number(b) - Number(a));
            var stDaily = [['日期', '总局数', '胜局数', '总耗时', '完成的任务', '完成的竞技场', '已解决3BV', '经验', '金币', '宝石', '竞技场门票', '活跃度', '活动物品', '竞技场币']];
            for (let i = 1; i < dates.length; i++) {
                const st1 = stMap[dates[i-1]];
                const st2 = stMap[dates[i]];
                var row = [dates[i-1].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")];
                for (let j = 0; j < st1[0].length; j++) {
                    row.push(st1[1][j] - st2[1][j]);
                }
                stDaily.push(row);
            }
            console.log('每日游戏数据:', stDaily);
            displayMatrix(stDaily, 'statisticDaily');    // 显示表格
        } else {
            document.getElementById('noStDaily').style.display = "block";
        }
        /* 读资源数据 */
        personalData = result.personalData;
        console.log('资源数据:', result.personalData);
        displayMatrix(personalData.slice(17, 19), 'table3-1');    // 显示总资源数
        displayMatrix(personalData.slice(0, 4), 'table3-2');    // 显示宝石和场币明细
        displayMatrix(personalData.slice(4, 16), 'table3-3');    // 显示门票明细
        equip = personalData.slice(20, 24);
        equip[0][8] = equip[0][9];
        equip[1][8] = equip[1][9];
        equip[0][9] = equip[0][10];
        equip[1][9] = equip[1][10];
        equip[0][10] = '';
        equip[1][10] = '';
        displayMatrix(equip, 'table3-4');    // 显示装备加成
        /* 完美装备花费 */
        var coin = 1000000;
        var gems = 5000;
        var ac = 10000;
        var perfect = [
            ['', '黄玉-金', '红宝石-铜', '蓝宝石-银', '紫水晶-镍', '缟玛瑙-钢', '海蓝宝石-铁', '祖母绿-钯', '石榴石-钛', '碧玉-锌', '钻石-铂'],
            ['估价', '', '', '', '', '', '', '', '', '', ''],
            ['宝石花费', '', '', '', '', '', '', '', '', '', ''],
            ['场币花费', '', '', '', '', '', '', '', '', '', ''],
            ['总花费', '', '', '', '', '', '', '', '', '', '']
        ];
        for (let i = 0; i < tm; i++) {
            perfect[1][i + 1] = coin + gems * gemsPrice[1][i] + ac * gemsPrice[3][i];
            perfect[2][i + 1] = (gems - personalData[1][i]) * gemsPrice[1][i];
            perfect[3][i + 1] = (ac - personalData[3][i]) * gemsPrice[3][i];
            perfect[4][i + 1] = coin + (gems - personalData[1][i]) * gemsPrice[1][i] + (ac - personalData[3][i]) * gemsPrice[3][i];
        }
        displayMatrix(perfect, 'table4');
        /* 竞技场收益 */
        var xL = [1, 3, 5, 10, 15, 20, 30, 40];
        var xType = [
            [500, 500, 500, 500, 500, 500, 500, 500, 1000, 2500], // 基础经验
            [50, 50, 50, 50, 50, 50, 50, 50, 100, 250], // 基础金币
            [10, 10, 10, 10, 10, 10, 10, 10, 20, 50] // 基础场币（升精英需要的功勋点也是这个数字）
        ];
        var hp2mc = 50; // 功勋点折算金币
        var hp2ex = 1000; // 每1000经验1功勋
        var acInd = [1, 5, 2, 0, 4, 9, 3, 8, 6, 7];
        var arenaValue = [
            ['类别', '价值', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
            ['速度', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['速度', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['速度NG', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['速度NG', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['盲扫', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['盲扫', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['效率', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['效率', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['高难度', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['高难度', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['随机难度', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['随机难度', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['硬核', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['硬核', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['硬核NG', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['硬核NG', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['耐力', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['耐力', '精英', 0, 0, 0, 0, 0, 0, 0, 0],
            ['噩梦', '估价', 0, 0, 0, 0, 0, 0, 0, 0],
            ['噩梦', '精英', 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        for (let t = 0; t < tm; t++) {
            for (let l = 0; l < lm; l++) {
                // arenaValue[3 * t + 1][l + 2] = xType[0][t] * xL[l] / hp2ex * hp2mc + xType[1][t] * xL[l] + xType[2][t] * xL[l] * gemsPrice[3][acInd[t]];
                var exCoe = parseFloat(equip[1][0].replace('%', '')) / 100;
                var mcCoe = parseFloat(equip[1][1].replace('%', '')) / 100;
                var acCoe = parseFloat(equip[1][7].replace('%', '')) / 100;
                arenaValue[2 * t + 1][l + 2] = (xType[0][t] * xL[l] * (1 + exCoe) / hp2ex * hp2mc + xType[1][t] * xL[l] * (1 + mcCoe) + xType[2][t] * xL[l] * gemsPrice[3][acInd[t]] * (1 + acCoe)) | 0;
                arenaValue[2 * t + 2][l + 2] = arenaValue[2 * t + 1][l + 2] * 2 - xType[2][t] * xL[l] * hp2mc;
                // arenaValue[3 * t + 3][l + 2] = ticketPrice[t + 1][l + 1];
            }
        }
        displayMatrix(arenaValue, 'tableArenaValue');
        for (let t = 0; t < tm; t++) {
            for (let l = 0; l < lm; l++) {
                /* 比较大小 设置颜色 */
                if (arenaValue[2 * t + 1][l + 2] > arenaValue[2 * t + 2][l + 2]) {
                    document.getElementById('tableArenaValue').rows[2 * t + 1].cells[l + 2].style.backgroundColor = "#b3eb9d"; // 最赚
                    document.getElementById('tableArenaValue').rows[2 * t + 2].cells[l + 2].style.backgroundColor = "#ddf196"; // 比卖掉赚
                } else {
                    document.getElementById('tableArenaValue').rows[2 * t + 2].cells[l + 2].style.backgroundColor = "#b3eb9d"; // 最赚
                    document.getElementById('tableArenaValue').rows[2 * t + 1].cells[l + 2].style.backgroundColor = "#ddf196"; // 比卖掉赚
                }
                if (arenaValue[2 * t + 1][l + 2] < ticketPrice[t + 1][l + 1]) {
                    document.getElementById('tableArenaValue').rows[2 * t + 1].cells[l + 2].style.backgroundColor = "#e4c79a"; // 卖掉赚
                }
                if (arenaValue[2 * t + 2][l + 2] < ticketPrice[t + 1][l + 1]) {
                    document.getElementById('tableArenaValue').rows[2 * t + 2].cells[l + 2].style.backgroundColor = "#e4c79a"; // 卖掉赚
                }
            }
        }
    });
}

/* 处理矩阵并显示为表格 */
function displayMatrix(matrix, tableId) {
    
    const rows = matrix.length;
    const cols = matrix[0].length;

    const table = document.getElementById(tableId);    // 定位表格
    table.innerHTML = ''; // 清空现有的表格内容

    /* 表格主体 */
    let tbody = table.createTBody();
    for (let i = 0; i < rows; i++) {
        let row = tbody.insertRow();
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell();
            const n = Number(matrix[i][j]);
            if (!isNaN(n) && matrix[i][j] !== '') {
                cell.textContent = num(n);
            } else {
                cell.textContent = matrix[i][j];
            }
        }
    }
}

function num(number) {
    var output = '';
    let n = parseInt(number)
    while (n >= 1000) {
        var text = n.toString().slice(-3);
        output = ' ' + text + output;
        n = parseInt(n / 1000);
    }
    output = n + output;
    return output;
}