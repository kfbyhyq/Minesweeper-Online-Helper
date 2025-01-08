/* 接收网页传回的数据 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'eventQuest') { // 活动任务
        let eqInfo = request.eqInfo;
        console.log('活动任务信息:', eqInfo);   // 在控制台打出结果
        chrome.storage.local.set({ eqInfo: eqInfo });     // 保存数据
        document.getElementById('updateEq').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        document.getElementById('flag4').textContent = 1;   // 设置成功标记

        const output = eqInfo.map(item => item + '<br>').join('');
        document.getElementById('eqInfo').innerHTML = output;
    } else if (request.action === 'sendGemsPrice') { // 宝石场币
        let gemsPrice = request.gemsPrice;
        console.log('收到价格更新:', gemsPrice);
        chrome.storage.local.set({ gemsPrice: gemsPrice });
        /* 按日期保存 */
        chrome.storage.local.get(['gemsPriceMap'], function(result) {
            const gpMap = result.gemsPriceMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史价格：', gpMap);
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            gpMap[newDate] = gemsPrice;
        
            // 保存更新后的数据
            chrome.storage.local.set({ gemsPriceMap: gpMap });
        });
        document.getElementById('flag1').textContent = 1;
        setTimeout(() => {
            displayTables();
        }, 100);
    } else if (request.action === 'sendTicketPrice') { // 竞技场门票
        let tpNew = request.ticketPrice;
        let ticketPrice = request.ticketPrice;
        console.log('收到门票价格更新:', tpNew);
        /* 按日期保存 */
        chrome.storage.local.get(['ticketPrice', 'ticketPriceMap'], function(result) {
            let tpOld = result.ticketPrice;
            var typeMax = 10;    // 多少种竞技场
            var LMax = 8;       // 最大等级
            for (let t = 1; t <= typeMax; t++) {
                for (let L = 1; L <= LMax; L++) {
                    if (ticketPrice[t][L] == 0) {
                        ticketPrice[t][L] = tpOld[t][L]; // 票价为0说明没采集到，用原来的
                    }
                }
            }
            let tpMap = result.ticketPriceMap || {};
            console.log('历史门票价格：', tpMap);
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            tpMap[newDate] = ticketPrice;
        
            // 保存更新后的数据
            chrome.storage.local.set({ ticketPrice: ticketPrice });
            chrome.storage.local.set({ ticketPriceMap: tpMap });
        });
        document.getElementById('flag2').textContent = 1;   // 设置成功标记
        setTimeout(() => {
            displayTables();
        }, 100);
    } else if (request.action === 'sendEquipStats') {
        let equipStats = request.equipStats;
        console.log('收到装备加成：', equipStats);
        chrome.storage.local.set({ equipStats: equipStats });
        /* 按日期保存 */
        chrome.storage.local.get(['equipStatsMap'], function(result) {
            const equipStats = result.equipStatsMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            equipStats[newDate] = equipStats;
        
            // 保存更新后的数据
            chrome.storage.local.set({ equipStatsMap: equipStats });
        });
        document.getElementById('flagEquip').textContent = 1;   // 设置成功标记
        setTimeout(() => {
            displayTables();
        }, 100);
    } else if (request.action === 'sendStatistics') { // 游戏数据
        let statistics = request.statistics;
        console.log('收到游戏数据更新：', statistics);
        chrome.storage.local.set({ statistics: statistics });
        /* 按日期保存 */
        chrome.storage.local.get(['statisticsMap'], function(result) {
            const stMap = result.statisticsMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史游戏数据：', stMap);
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            stMap[newDate] = statistics;
        
            // 保存更新后的数据
            chrome.storage.local.set({ statisticsMap: stMap });
        });
        document.getElementById('flag5').textContent = 1;   // 设置成功标记
        setTimeout(() => {
            displayTables();
        }, 100);
    } else if (request.action === 'sendPersonalData') { // 个人数据
        let personalData = request.personalData;
        console.log('收到个人数据更新:', personalData);   // 在控制台打出结果
        chrome.storage.local.set({ personalData: personalData });     // 保存数据
        /* 按日期保存 */
        chrome.storage.local.get(['personalDataMap'], function(result) {
            const pdMap = result.personalDataMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史个人数据：', pdMap);
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            pdMap[newDate] = personalData;
        
            // 保存更新后的数据
            chrome.storage.local.set({ personalDataMap: pdMap });
        });
        document.getElementById('flag3').textContent = 1;   // 设置成功标记
        setTimeout(() => {
            displayTables();
        }, 100);
    } else if (request.action === 'personalEconomy') { // 游戏经济
        let personalEco = request.personalEco;
        console.log('收到财产估值更新：', personalEco);   // 在控制台打出结果
        chrome.storage.local.set({ personalEco: personalEco });     // 保存数据
        /* 按日期保存 */
        chrome.storage.local.get(['personalEcoMap'], function(result) {
            const peMap = result.personalEcoMap || {}; // 确保存在数据，防止为 undefined
            console.log('历史财产估值：', peMap);
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            peMap[newDate] = personalEco;
        
            // 保存更新后的数据
            chrome.storage.local.set({ personalEcoMap: peMap });
        });
        document.getElementById('flagPe').textContent = 1;   // 设置成功标记
        setTimeout(() => {
            displayTables();
        }, 100);
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
    var equipNew; // 使用装备也的装备加成情况
    var lm = 8; // 最大等级
    var tm = 10; // 多少种竞技场
    var hp2mc = 56.6; // 功勋点折算金币
    /* 读取数据 */
    chrome.storage.local.get(null, function(result) {
        /* 宝石 */
        if (result.gemsPrice) {
            gemsPrice = result.gemsPrice;
            console.log('宝石/场币/碎片价格:', gemsPrice);
            displayMatrix(gemsPrice, 'table1');
        }
        /* 竞技场门票 */
        if (result.ticketPrice) {
            ticketPrice = result.ticketPrice;
            console.log('竞技场门票价格:', ticketPrice);
            displayMatrix(ticketPrice, 'table2');
        }
        /* 游戏数据 */
        if (result.statistics) {
            statistics = result.statistics;
            console.log('游戏数据:', statistics);
            displayMatrix(statistics, 'table5');
        }
        /* 每日游戏数据 */
        if (result.statisticsMap) {
            const stMap = result.statisticsMap;
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
        }
        /* 读个人数据 */
        if (result.personalData) {
            personalData = result.personalData;
            console.log('个人数据:', result.personalData);
            displayMatrix(personalData.slice(17, 19), 'table3-1');    // 显示总资源数
            displayMatrix(personalData.slice(0, 4), 'table3-2');    // 显示宝石和场币明细
            if (personalData[15]) {
                displayMatrix(personalData.slice(4, 16), 'table3-3');    // 显示门票明细（有活动门票）
            } else {
                displayMatrix(personalData.slice(4, 15), 'table3-3');    // 显示门票明细
            }
            equip = personalData.slice(20, 24);
            equip[0][8] = equip[0][9];
            equip[1][8] = equip[1][9];
            equip[0][9] = equip[0][10];
            equip[1][9] = equip[1][10];
            equip[0].splice(10, 1);
            equip[1].splice(10, 1);
            if (result.equipStats) {
                equipNew = result.equipStats;
                var rank = personalData[24][1] / 100 | 0; // 军衔
                var questLevelMax = rank + 1 + +equip[1][6];
                equipNew[1][5] = (questLevelMax / 2 | 0) + '-' + questLevelMax;
                displayTextMatrix(equipNew, 'table3-4'); 
            }
            // displayMatrix(equip, 'table3-4');    // 显示装备加成
            // document.getElementById('tropNum').textContent = personalData[24][1];
            // document.getElementById('tropRank').textContent = personalData[24][3] || '暂无';
            let tableTrophy = personalData.slice(24, 28);
            tableTrophy[0][4] = '达成日期';
            let ipd = 0;
            const pdMap = result.personalDataMap;
            const pdDate = Object.keys(pdMap);
            pdDate.sort((a, b) => b.localeCompare(a)); // 降序排列
            let dnow = pdDate[0];
            tableTrophy[0][5] = dnow.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
            pdDate.forEach(date => {
                if (pdMap[date][24]) {
                    if (pdMap[date][24] && (pdMap[date][24][1] < pdMap[dnow][24][1])) {
                        const trophyNew = pdMap[date].slice(24, 28);
                        trophyNew[0][4] = '达成日期';
                        trophyNew[0][5] = date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                        tableTrophy = [...tableTrophy, ...trophyNew];
                        ipd++;
                        dnow = date;
                    } else {
                        tableTrophy[ipd*4][5] = date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                        dnow = date;
                    }
                }
            });
            displayMatrix(tableTrophy, 'tableTrophy', 10);
        }
        /* 财产估值 */
        if (result.personalEco) {
            personalEco = result.personalEco;
            console.log('财产估值:', personalEco);
            displayMatrix(personalEco, 'tablePe');
        }
        /* 每日财产估值 */
        if (result.personalEcoMap) {
            const peMap = result.personalEcoMap;
            console.log('历史财产估值:', peMap);
            const dates = Object.keys(peMap);
            if (dates.length > 1) {
                dates.sort((a, b) => Number(b) - Number(a));
                var peDaily = [['日期', '总财产', '装备', '金币', '宝石', '功勋点', '活动物品', '竞技场门票', '仓库', '装备碎片', '竞技场币', '代币']];
                for (let i = 1; i < dates.length; i++) {
                    const pe1 = peMap[dates[i-1]];
                    const pe2 = peMap[dates[i]];
                    var row = [dates[i-1].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")];
                    for (let j = 0; j < pe1[0].length; j++) {
                        var peData1 = pe1[1][j].toString();
                        var peData2 = pe2[1][j].toString();
                        var num1 = parseFloat(peData1.replace(/[MK]/, ''));
                        var num2 = parseFloat(peData2.replace(/[MK]/, ''));
                        if (peData1.endsWith('M')) {
                            num1 *= 1e6;
                        } else if (peData1.endsWith('K')) {
                            num1 *= 1e3;
                        }
                        if (peData2.endsWith('M')) {
                            num2 *= 1e6;
                        } else if (peData2.endsWith('K')) {
                            num2 *= 1e3;
                        }
                        var incru = num1 - num2;
                        var signIncru;
                        if (Math.abs(incru) >= 1e6) {
                            signIncru = incru / 1e6;
                            signIncru = signIncru.toFixed(2);
                            signIncru = signIncru + 'M';
                        } else if (Math.abs(incru) >= 1e3) {
                            signIncru = incru / 1e3;
                            signIncru = signIncru.toFixed(2);
                            signIncru = signIncru + 'K';
                        } else {
                            signIncru = incru.toString();
                        }
                        if (incru > 0) {
                            signIncru = '+' + signIncru;
                        }
                        signIncru = signIncru.replace('.00', '');
                        row.push(signIncru);
                    }
                    peDaily.push(row);
                }
                console.log('每日财产估值:', peDaily);
                displayTextMatrix(peDaily, 'peDaily');    // 显示表格
            } else {
                document.getElementById('noPeDaily').style.display = "block";
            }
        }
        /* 活动商店兑换参考 */
        var eventShop = [
            ['兑换项目', '所需活动点', '期望估价/活动点'],
            ['功勋点', 1, 0],
            ['功勋点（换代币）', 1, 0],
            ['宝石', 10, 0],
            ['初级门票包', 100, 0],
            ['中级门票包', 200, 0],
            ['高级门票包', 300, 0],
            ['40%史诗装备', 450, 0],
            ['45%史诗装备', 600, 0],
            ['50%史诗装备', 750, 0],
            ['55%史诗装备', 900, 0],
            ['60%史诗装备', 1200, 0],
            ['65%史诗装备', 1500, 0],
            ['70%传说装备', 2000, 0],
            ['75%传说装备', 3000, 0],
            ['80%传说装备', 4500, 0],
            ['85%传说装备', 6000, 0],
            ['90%传说装备', 10000, 0],
            ['95%传说装备', 15000, 0],
            ['完美装备', 20000, 0]
        ];
        eventShop[1][2] = hp2mc.toFixed(2);
        var token2mc = 150000; // 代币每点估价
        var tokenProb = [0.36, 0.3, 0.16, 0.085, 0.045, 0.025, 0.015, 0.01]; // 代币生成概率
        var token2hp = 5000; // 5000功勋生成一次代币
        var tokenAvg = 0; // 每次生成代币的平均点数
        for (let i = 0; i < tokenProb.length; i++) {
            tokenAvg += tokenProb[i] * (i + 1);
        }
        var hp2token2mc = tokenAvg * token2mc / token2hp;
        eventShop[2][2] = hp2token2mc.toFixed(2);
        var ticketProb = [0.14, 0.12, 0.06, 0.12, 0.12, 0.16, 0.1, 0.1, 0.04, 0.04]; // 各种类门票概率
        var tpProb = [[2, 3, 4], [4, 5, 6], [0.75, 0.2, 0.05]]; // 中级、高级门票包种类与概率
        var lowTp = 0; // 兑换初级门票包时每活动点的估价
        var midTp = 0; // 中级
        var highTp = 0; // 高级
        if (result.ticketPrice) {
            var tpLevelAvg = [0, 0, 0, 0, 0, 0, 0, 0]; // 每个等级门票的均价
            for (let l = 0; l < lm; l++) {
                tpLevelAvg[l] = 0;
                for (let t = 0; t < tm; t++) {
                    tpLevelAvg[l] += ticketPrice[t + 1][l + 1] * ticketProb[t];
                }
            }
            lowTp = tpLevelAvg[0];
            for (let i = 0; i < 3; i++) {
                midTp += tpLevelAvg[tpProb[0][i] - 1] * tpProb[2][i];
                highTp += tpLevelAvg[tpProb[1][i] - 1] * tpProb[2][i];
            }
            lowTp = lowTp / eventShop[4][1] * 5;
            midTp = midTp / eventShop[5][1] * 5;
            highTp = highTp / eventShop[6][1] * 5;
            eventShop[4][2] = lowTp.toFixed(2);
            eventShop[5][2] = midTp.toFixed(2);
            eventShop[6][2] = highTp.toFixed(2);
        }
        var uniqueEquipDis = [0, 0, 0, 0, 0, 0];
        var legendEquipDis = [0, 0, 0, 0, 0, 0];
        var perfectEquipDis = 0;
        if (result.gemsPrice) {
            var maxGp = Math.max(...gemsPrice[1]) / eventShop[3][1]; // 宝石价格取最贵的
            eventShop[3][2] = maxGp.toFixed(2);
            var partsNum = [
                ['40%', '45%', '50%', '55%', '60%', '65%'],
                [5, 7, 10, 15, 20, 28], // 史诗装备拆解的传说碎片数
                ['70%', '75%', '80%', '85%', '90%', '95%'],
                [5, 8, 13, 18, 36, 60] // 传说装备拆解的完美碎片数
            ]
            for (let i = 0; i < 6; i++) {
                uniqueEquipDis[i] = gemsPrice[5][2] * partsNum[1][i] / eventShop[i + 7][1];
                legendEquipDis[i] = gemsPrice[5][3] * partsNum[3][i] / eventShop[i + 13][1];
                eventShop[i + 7][2] = uniqueEquipDis[i].toFixed(2);
                eventShop[i + 13][2] = legendEquipDis[i].toFixed(2);
            }
            perfectEquipDis = gemsPrice[5][3] * 100 / eventShop[19][1]; // 完美装备按100个完美碎片算
            eventShop[19][2] = perfectEquipDis.toFixed(2);
        }
        displayMatrix(eventShop, 'tableEventShop');
        var tableEs = document.getElementById('tableEventShop');
        for (let i = 0; i < 2; i++) {
            tableEs.rows[i + 1].cells[0].style.backgroundColor = "#EAC476"; // 功勋标题颜色
        }
        tableEs.rows[3].cells[0].style.backgroundColor = "#B2D6B2"; // 宝石标题颜色
        for (let i = 0; i < 3; i++) {
            tableEs.rows[i + 4].cells[0].style.backgroundColor = "#A5CBE3"; // 门票包标题颜色
        }
        for (let i = 0; i < 6; i++) {
            tableEs.rows[i + 7].cells[0].style.backgroundColor = "#D689ED";  // 史诗装备标题颜色
            tableEs.rows[i + 13].cells[0].style.backgroundColor = "#FFA26C"; // 传说装备标题颜色
        }
        tableEs.rows[19].cells[0].style.backgroundColor = "#C83C3C"; // 完美装备标题颜色
        var rates = eventShop.slice(1).map(row => row[row.length - 1]);
        var levelColor = setLevelColor(rates, 1, 2); // 根据价值设置背景色
        for (let i = 1; i < eventShop.length; i++) {
            tableEs.rows[i].cells[2].style.backgroundColor = levelColor[i - 1];
        }

        /* 完美装备花费 */
        if (result.gemsPrice && result.personalData) {
            var coin = 1000000;
            var gems = 5000;
            var ac = 10000;
            var perfect = [
                ['', '黄玉-金(T)', '红宝石-铜(R)', '蓝宝石-银(S)', '紫水晶-镍(A)', '缟玛瑙-钢(O)', '海蓝宝石-铁(Q)', '祖母绿-钯(E)', '石榴石-钛(G)', '碧玉-锌(J)', '钻石-铂(D)'],
                ['估价', '', '', '', '', '', '', '', '', '', ''],
                ['宝石花费', '', '', '', '', '', '', '', '', '', ''],
                ['场币花费', '', '', '', '', '', '', '', '', '', ''],
                ['总花费', '', '', '', '', '', '', '', '', '', '']
            ];
            for (let t = 0; t < tm; t++) {
                perfect[1][t + 1] = coin + gems * gemsPrice[1][t] + ac * gemsPrice[3][t];
                perfect[2][t + 1] = (gems - personalData[1][t]) * gemsPrice[1][t];
                perfect[3][t + 1] = (ac - personalData[3][t]) * gemsPrice[3][t];
                perfect[4][t + 1] = coin + (gems - personalData[1][t]) * gemsPrice[1][t] + (ac - personalData[3][t]) * gemsPrice[3][t];
            }
            displayMatrix(perfect, 'table4');
            chrome.storage.local.set({ perfectValue: perfect });
            var levelColorPerfect1 = setLevelColor(perfect[1].slice(1));
            var levelColorPerfect2 = setLevelColor(perfect[4].slice(1));
            const tablePerfect = document.getElementById('table4');
            for (let i = 1; i <= tm; i++) {
                tablePerfect.rows[1].cells[i].style.backgroundColor = levelColorPerfect1[i - 1];
                tablePerfect.rows[4].cells[i].style.backgroundColor = levelColorPerfect2[i - 1];
            }
        }
        var perfectUpgrade = [
            ['', '经验', '金币', '宝石', '竞技场门票', '特殊加成', '碎片'],
            ['引擎', 'Q D', 'G D', 'O D', 'E D', '每日任务', 'R S D'],
            ['船体', 'A D', 'T D', 'J D', 'Q D', '赛季任务/任务等级', 'O G D'],
            ['鱼雷', 'E D', 'S D', 'R D', 'A D', '活跃度', 'T J D'],
            ['雷达', 'R D', 'A D', 'T D', 'J D', '活动物品', 'Q G D'],
            ['声呐', 'O D', 'E D', 'S D', 'R D', '竞技场币', 'T A D']
        ];
        // const tablePu = document.getElementById('perfectUpgrade');
        displayMatrix(perfectUpgrade, 'perfectUpgrade');

        /* 竞技场收益 */
        if (result.gemsPrice && result.ticketPrice) {
            var xL = [1, 2.5, 5, 10, 15, 20, 30, 40]; // 各等级的奖励倍率
            var elite = [1, 2.5, 5, 10, 12.5, 15, 20, 25] // 各等级升精英需要的功勋点倍率
            var xType = [1, 1, 1, 1, 1, 1, 1, 1, 2, 5]; // 竞技场收益基础值，配合系数coef使用
            var coef = [500, 50, 10, 1, 2]; // '经验系数', '金币系数', '场币系数', '升精英功勋点系数', '活跃度系数', '精英活动物品系数'
            var hp2ex = 1000; // 每1000经验1功勋
            var acInd = [1, 5, 2, 0, 4, 9, 3, 8, 6, 7];
            var gn = [ // 每种竞技场需要的局数
                [5, 10, 15, 20, 25, 30, 35, 40],
                [5, 10, 15, 20, 25, 30, 35, 40],
                [5, 10, 15, 20, 25, 30, 35, 40],
                [5, 10, 15, 20, 25, 30, 35, 40],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [10, 10, 10, 10, 10, 10, 10, 10],
                [5, 10, 15, 20, 25, 30, 35, 40],
                [5, 10, 15, 20, 25, 30, 35, 40],
                [25, 50, 75, 100, 125, 150, 175, 200],
                [5, 10, 15, 20, 25, 30, 35, 40]
            ];
            var ld = [ // 每种竞技场的难度下限
                [5, 6, 7, 10, 12, 15, 17, 20],
                [5, 6, 7, 10, 12, 15, 17, 20],
                [4, 5, 6, 7, 10, 12, 15, 17],
                [2, 3, 4, 5, 6, 7, 8, 10],
                [25, 50, 100, 200, 300, 500, 800, 1000],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [4, 5, 6, 7, 10, 12, 15, 17],
                [4, 5, 6, 7, 8, 10, 12, 15],
                [1, 1, 5, 5, 5, 10, 10, 10],
                [50, 50, 100, 100, 100, 150, 200, 200]
            ];
            var rd = [ // 每种竞技场的难度上限
                [10, 12, 15, 20, 25, 30, 35, 40],
                [10, 12, 15, 20, 25, 30, 35, 40],
                [8, 10, 12, 15, 20, 25, 30, 35],
                [4, 6, 8, 10, 12, 15, 18, 20],
                [50, 100, 200, 400, 600, 1000, 1200, 1500],
                [10, 25, 50, 75, 100, 150, 200, 250],
                [8, 10, 12, 15, 20, 25, 30, 35],
                [8, 10, 12, 15, 18, 20, 25, 30],
                [5, 10, 10, 15, 20, 20, 25, 30],
                [100, 150, 150, 200, 250, 250, 300, 400]
            ];
            var arenaValue = [
                ['收益', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0],
                ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            // var arenaValue = [
            //     ['类别', '估价/比市场价', 'L1', '', 'L2', '', 'L3', '', 'L4', '', 'L5', '', 'L6', '', 'L7', '', 'L8', ''],
            //     ['速度', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['速度', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['速度NG', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['速度NG', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['盲扫', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['盲扫', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['效率', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['效率', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['高难度', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['高难度', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['随机难度', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['随机难度', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['硬核', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['硬核', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['硬核NG', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['硬核NG', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['耐力', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['耐力', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['噩梦', '普通', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     ['噩梦', '精英', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // ];
            var arenaRate = [
                ['收益/开销', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0],
                ['普通', 0, 0, 0, 0, 0, 0, 0, 0],
                ['精英', 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            var arenaTimeRate = [
                ['净收益/时间', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0],
                ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0]
            ];
            var act2ep = 2.5; // 活跃度转化活动物品，可配置
            var ep2mc = 56.6; // 活动物品价值金币，可配置
            var effCoef = 0.75; // 效率相比标旗的速度衰减，可配置
            var nfCoef = 0.75; // 盲扫相比标旗的速度衰减，可配置
            var ratesAv = [];
            var ratesAt = [];
            if (result.configurableCoef) {
                act2ep = result.configurableCoef[0];
                ep2mc = result.configurableCoef[1];
                nfCoef = result.configurableCoef[2];
                effCoef = result.configurableCoef[3];
            }
            for (let t = 0; t < tm; t++) {
                for (let l = 0; l < lm; l++) {
                    // arenaValue[3 * t + 1][l + 2] = xType[t] * coef[0] * xL[l] / hp2ex * hp2mc + xType[t] * coef[1] * xL[l] + xType[t] * coef[2] * xL[l] * gemsPrice[3][acInd[t]];
                    var exCoe = parseFloat(equipNew[1][0].replace('x', '')); // 经验加成
                    var mcCoe = parseFloat(equipNew[1][1].replace('x', '')); // 金币加成
                    var acCoe = parseFloat(equipNew[1][6].replace('x', '')); // 场币加成
                    var actCoe = parseFloat(equipNew[1][7].replace('x', '')); // 活跃加成
                    var epCoe = parseFloat(equipNew[1][8].replace('x', '')); // 活动点加成
                    // 打竞技场的期望收益
                    // arenaValue[2 * t + 1][2 * l + 2] = (xType[t] * coef[0] * xL[l] * exCoe / hp2ex * hp2mc // 经验折算为功勋
                    //                                  + xType[t] * coef[1] * xL[l] * mcCoe // 金币
                    //                                  + xType[t] * coef[2] * xL[l] * acCoe * gemsPrice[3][acInd[t]] // 场币
                    //                                  + xType[t] * coef[3] * xL[l] * actCoe * hp2mc) | 0; // 活跃1:1折算为功勋
                    arenaValue[2 * t + 1][l + 1] = (xType[t] * coef[0] * xL[l] * exCoe / hp2ex * hp2mc // 经验折算为功勋
                                                 + xType[t] * coef[1] * xL[l] * mcCoe // 金币
                                                 + xType[t] * coef[2] * xL[l] * acCoe * gemsPrice[3][acInd[t]] // 场币
                                                 + xType[t] * coef[3] * xL[l] * actCoe * act2ep * ep2mc) | 0; // 活跃
                    // var rate = arenaValue[2 * t + 1][2 * l + 2] / ticketPrice[t + 1][l + 1];
                    // arenaValue[2 * t + 1][2 * l + 3] = rate.toFixed(2);
                    var rate = arenaValue[2 * t + 1][l + 1] / ticketPrice[t + 1][l + 1];
                    arenaRate[2 * t + 1][l + 1] = rate.toFixed(2);
                    // 打精英的期望收益比门票价格加功勋花费
                    // arenaValue[2 * t + 2][2 * l + 2] = (arenaValue[2 * t + 1][2 * l + 2] * 2
                    //                                  + xType[t] * coef[4] * xL[l] * epCoe * hp2mc) | 0; // 精英额外给活动点
                    arenaValue[2 * t + 2][l + 1] = (arenaValue[2 * t + 1][l + 1] * 2
                                                 + xType[t] * coef[4] * xL[l] * epCoe * ep2mc) | 0; // 精英额外给活动点
                    // var rateE = arenaValue[2 * t + 2][2 * l + 2] / (+ticketPrice[t + 1][l + 1] + xType[t] * coef[2] * elite[l] * hp2mc);
                    // arenaValue[2 * t + 2][2 * l + 3] = rateE.toFixed(2);
                    var rateE = arenaValue[2 * t + 2][l + 1] / (+ticketPrice[t + 1][l + 1] + xType[t] * coef[2] * elite[l] * hp2mc);
                    arenaRate[2 * t + 2][l + 1] = rateE.toFixed(2);
                    // arenaValue[3 * t + 3][l + 2] = ticketPrice[t + 1][l + 1];
                    ratesAv[2 * t * lm + 2 * l] = rate;
                    ratesAv[2 * t * lm + 2 * l + 1] = rateE;
                    // 打竞技场的期望时间（单位为难度）
                    var time = (ld[t][l] + rd[t][l]) / 2 * gn[t][l];
                    if (t == 2) {
                        time /= nfCoef;
                    } else if (t == 3) {
                        time /= effCoef;
                    }
                    var rateTime = (arenaValue[2 * t + 1][l + 1] - ticketPrice[t + 1][l + 1]) / time;
                    var rateTimeE = (arenaValue[2 * t + 2][l + 1] - ticketPrice[t + 1][l + 1] - xType[t] * coef[2] * elite[l] * hp2mc) / time / 2;
                    // var rateTime = time;
                    // var rateTimeE = time * 2;
                    arenaTimeRate[2 * t + 1][l + 1] = rateTime.toFixed(2);
                    arenaTimeRate[2 * t + 2][l + 1] = rateTimeE.toFixed(2);
                    ratesAt[2 * t * lm + 2 * l] = rateTime;
                    ratesAt[2 * t * lm + 2 * l + 1] = rateTimeE;
                }
            }
            displayMatrix(arenaValue, 'tableArenaValue');
            displayMatrix(arenaRate, 'tableArenaRate');
            displayMatrix(arenaTimeRate, 'tableArenaTimeRate');
            var levelColorAr = setLevelColor(ratesAv, 1, 3);
            var levelColorAtr = setLevelColor(ratesAt, 1, 3, 100, 0);
            const tableAv = document.getElementById('tableArenaValue');
            const tableAr = document.getElementById('tableArenaRate');
            const tableAtr = document.getElementById('tableArenaTimeRate');
            for (let t = 0; t < tm; t++) {
                for (let l = 0; l < lm; l++) {
                    /* 比较大小 设置颜色 */
                    if (arenaRate[2 * t + 1][l + 1] > arenaRate[2 * t + 2][l + 1]) { // 打精英不如打普通
                        // tableAv.rows[2 * t + 1].cells[2 * l + 3].style.backgroundColor = "#b3eb9d"; // 最赚
                        tableAv.rows[2 * t + 1].cells[l + 1].style.backgroundColor = "#b3eb9d"; // 最赚
                        // tableAv.rows[2 * t + 2].cells[2 * l + 3].style.backgroundColor = "#ddf196"; // 比卖掉赚
                        tableAv.rows[2 * t + 2].cells[l + 1].style.backgroundColor = "#ddf196"; // 比卖掉赚
                    // } else if (xType[t] * coef[2] * elite[l] * hp2mc > ticketPrice[t + 1][l + 1]) { // 升精英的花费不如买个新的
                    //     tableAv.rows[2 * t + 1].cells[2 * l + 3].style.backgroundColor = "#b3eb9d"; // 最赚
                    //     tableAv.rows[2 * t + 1].cells[2 * l + 2].style.backgroundColor = "#b3eb9d"; // 最赚
                    //     tableAv.rows[2 * t + 2].cells[2 * l + 3].style.backgroundColor = "#ddf196"; // 比卖掉赚
                    //     tableAv.rows[2 * t + 2].cells[2 * l + 2].style.backgroundColor = "#ddf196"; // 比卖掉赚
                    } else {
                        // tableAv.rows[2 * t + 2].cells[2 * l + 3].style.backgroundColor = "#b3eb9d"; // 最赚
                        tableAv.rows[2 * t + 2].cells[l + 1].style.backgroundColor = "#b3eb9d"; // 最赚
                        // tableAv.rows[2 * t + 1].cells[2 * l + 3].style.backgroundColor = "#ddf196"; // 比卖掉赚
                        tableAv.rows[2 * t + 1].cells[l + 1].style.backgroundColor = "#ddf196"; // 比卖掉赚
                    }
                    tableAr.rows[2 * t + 1].cells[l + 1].style.backgroundColor = levelColorAr[2 * t * lm + 2 * l]; // 色阶
                    tableAr.rows[2 * t + 2].cells[l + 1].style.backgroundColor = levelColorAr[2 * t * lm + 2 * l + 1]; // 色阶
                    tableAtr.rows[2 * t + 1].cells[l + 1].style.backgroundColor = levelColorAtr[2 * t * lm + 2 * l]; // 色阶
                    tableAtr.rows[2 * t + 2].cells[l + 1].style.backgroundColor = levelColorAtr[2 * t * lm + 2 * l + 1]; // 色阶
                    if (arenaRate[2 * t + 1][l + 1] <= 1) {
                        // tableAv.rows[2 * t + 1].cells[2 * l + 3].style.backgroundColor = "#e4c79a"; // 卖掉赚
                        tableAv.rows[2 * t + 1].cells[l + 1].style.backgroundColor = "#e4c79a"; // 卖掉赚
                    }
                    if (arenaRate[2 * t + 2][l + 1] <= 1) {
                        // tableAv.rows[2 * t + 2].cells[2 * l + 3].style.backgroundColor = "#e4c79a"; // 卖掉赚
                        tableAv.rows[2 * t + 2].cells[l + 1].style.backgroundColor = "#e4c79a"; // 卖掉赚
                    }
                }
            }
        }
    });
}

/* 处理矩阵并显示为表格 */
function displayMatrix(matrix, tableId, width = 0) {
    
    let rows = matrix.length;
    let cols = matrix[0].length;
    if (width) {
        cols = width;
    }

    const table = document.getElementById(tableId);    // 定位表格
    table.innerHTML = ''; // 清空现有的表格内容

    /* 表格主体 */
    let tbody = table.createTBody();
    for (let i = 0; i < rows; i++) {
        let row = tbody.insertRow();
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell();
            const integerPattern = /^[+-]?\d+$/;
            const strValue = String(matrix[i][j]).trim();
            if (integerPattern.test(strValue)) {
                cell.textContent = num(strValue);
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

/* 显示纯文本 */
function displayTextMatrix(matrix, tableId, width = 0) {
    
    let rows = matrix.length;
    let cols = matrix[0].length;
    if (width) {
        cols = width;
    }

    const table = document.getElementById(tableId);    // 定位表格
    table.innerHTML = ''; // 清空现有的表格内容

    /* 表格主体 */
    let tbody = table.createTBody();
    for (let i = 0; i < rows; i++) {
        let row = tbody.insertRow();
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell();
            cell.textContent = matrix[i][j].toString();
        }
    }
}

/* 根据值设置色阶 */
function setLevelColor(array, descend = false, colorNum = 2, maxSet = Infinity, minSet = -Infinity, firstColor = '#63BE7B', secondColor = '#FFEB84', thirdColor = '#F8696B') {
    var maxColor;
    var minColor;
    var medColor;
    if (colorNum == 2) {
        medColor = thirdColor;
        if (descend) {
            minColor = secondColor;
            maxColor = firstColor;
        } else {
            minColor = firstColor;
            maxColor = secondColor;
        }
    } else if (colorNum == 3) {
        medColor = secondColor;
        if (descend) {
            minColor = thirdColor;
            maxColor = firstColor;
        } else {
            minColor = firstColor;
            maxColor = thirdColor;
        }
    } else {
        console.log('色阶只能为2或3种！');
        return;
    }
    var minR = parseInt(minColor.slice(1, 3), 16);
    var minG = parseInt(minColor.slice(3, 5), 16);
    var minB = parseInt(minColor.slice(5, 7), 16);
    var medR = parseInt(medColor.slice(1, 3), 16);
    var medG = parseInt(medColor.slice(3, 5), 16);
    var medB = parseInt(medColor.slice(5, 7), 16);
    var maxR = parseInt(maxColor.slice(1, 3), 16);
    var maxG = parseInt(maxColor.slice(3, 5), 16);
    var maxB = parseInt(maxColor.slice(5, 7), 16);

    var min = Math.max(Math.min(...array), minSet);
    var max = Math.min(Math.max(...array), maxSet);
    var med = (min + max) / 2;
    var levelColor = array;
    if (colorNum == 2) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] > max) {
                array[i] = max;
            } else if (array[i] < min) {
                array[i] = min;
            }
            var iR = Math.round(minR + (maxR - minR) * (array[i] - min) / (max - min));
            var iG = Math.round(minG + (maxG - minG) * (array[i] - min) / (max - min));
            var iB = Math.round(minB + (maxB - minB) * (array[i] - min) / (max - min));
            var iRHex = iR.toString(16).padStart(2, '0');
            var iGHex = iG.toString(16).padStart(2, '0');
            var iBHex = iB.toString(16).padStart(2, '0');
            levelColor[i] = '#' + iRHex + iGHex + iBHex;
        }
    } else if (colorNum == 3) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] > max) {
                array[i] = max;
            } else if (array[i] < min) {
                array[i] = min;
            }
            if (array[i] > med) {
                var iR = Math.round(medR + (maxR - medR) * (array[i] - med) / (max - med));
                var iG = Math.round(medG + (maxG - medG) * (array[i] - med) / (max - med));
                var iB = Math.round(medB + (maxB - medB) * (array[i] - med) / (max - med));
                var iRHex = iR.toString(16).padStart(2, '0');
                var iGHex = iG.toString(16).padStart(2, '0');
                var iBHex = iB.toString(16).padStart(2, '0');
                levelColor[i] = '#' + iRHex + iGHex + iBHex;
            } else {
                var iR = Math.round(minR + (medR - minR) * (array[i] - min) / (med - min));
                var iG = Math.round(minG + (medG - minG) * (array[i] - min) / (med - min));
                var iB = Math.round(minB + (medB - minB) * (array[i] - min) / (med - min));
                var iRHex = iR.toString(16).padStart(2, '0');
                var iGHex = iG.toString(16).padStart(2, '0');
                var iBHex = iB.toString(16).padStart(2, '0');
                levelColor[i] = '#' + iRHex + iGHex + iBHex;
            }
        }
    }
    // console.log(levelColor);
    return(levelColor);
}