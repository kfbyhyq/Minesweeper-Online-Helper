/* 页面显示 */
function displayFriendQuest() {
    chrome.storage.local.get(['friendQuestInfo', 'activityMap', 'friendQuestDaily', 'contactsList'], function(result) {
        let fqInfoAll = result.friendQuestInfo || {}; // 确保存在数据，防止为 undefined
        let contactsList = result.contactsList || {};
        // 获取当前月份
        const currentDate = new Date();
        const dateMinus2 = new Date(currentDate);
        dateMinus2.setUTCDate(currentDate.getUTCDate() - 2);  // 每个月前两天划给上一个月
        const newMonth = dateMinus2.getUTCFullYear() + String(dateMinus2.getUTCMonth() + 1).padStart(2, '0');
        if (fqInfoAll[newMonth]) {
            /* 所有任务 */
            // 对任务id排序
            const fqSendSortedKeys = Object.keys(fqInfoAll[newMonth].fqSend).sort().reverse();
            // 按顺序合并表格
            const fqSendMap = fqSendSortedKeys.map(key => fqInfoAll[newMonth].fqSend[key]);
            const sendTitle = ["等级", "任务", "进度", "奖励", "发送到", "失效"];
            fqSendMap.unshift(sendTitle);
            console.log('发任务汇总：', fqSendMap);
            displayMatrix(fqSendMap, 'tableFqs');
            // 对任务id排序
            const fqReceiveSortedKeys = Object.keys(fqInfoAll[newMonth].fqReceive).sort().reverse();
            // 按顺序合并表格
            const fqReceiveMap = fqReceiveSortedKeys.map(key => fqInfoAll[newMonth].fqReceive[key]);
            const ReceiveTitle = ["等级", "任务", "进度", "奖励", "发送自", "失效"];
            fqReceiveMap.unshift(ReceiveTitle);
            console.log('收任务汇总：', fqReceiveMap);
            displayMatrix(fqReceiveMap, 'tableFqr');
    
            /* 统计 */
            const dataSend = fqSendMap.slice(1);
            const dataReceive = fqReceiveMap.slice(1);
            // let countS = dataSend.length; // 发任务总数
            let countS = 0;
            let selectedCountS = 0;
            let sumLevelS = 0; // 发任务总等级
            let selectedLevelS = 0;
            let sumChangeRate = 0; // 总转化率（新增）
            // let countR = dataReceive.length; // 收任务总数
            let countR = 0;
            let selectedCountR = 0;
            let sumLevelR = 0; // 收任务总等级
            let selectedLevelR = 0;
            let sumRsRate = 0; // 总收发比（新增）
            let selectedRsRate = 0;
            let sumActivity = 0; // 总活跃（用于计算转化率）
            
            /* 每日统计 */
            let fqDailyMap = [['日期', '昨日活跃度', '发任务数', 'E数', '发任务等级', '转化率', '收任务数', '收任务等级', '收发比']];
            let activityMap = result.activityMap || {}; // 确保存在数据，防止为 undefined
            // 当前UTC时间
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            const lastAct = activityMap[newDate];
            if (lastAct) {
                document.getElementById('lastActNew').placeholder = lastAct;
            }
            // delete activityMap['20241015'];
            // activityMap['20241017'] = 303; // 修改数据用
            // chrome.storage.local.set({ activityMap: activityMap });
            let fqDaily = result.friendQuestDaily || {}; // 确保存在数据，防止为 undefined

            const dates = Object.keys(fqDaily).sort().reverse();
            // 按顺序遍历
            dates.forEach(date => {
                if (date.includes(newMonth) && (date.slice(-2) == '04' || activityMap[date])) {
                    if (activityMap[date]) {
                        sumActivity += activityMap[date];
                    }
                    let countS = Object.keys(fqDaily[date].fqSend).length; // 发任务总数
                    let dailyLevelS = 0; // 发任务总等级
                    let countR = Object.keys(fqDaily[date].fqReceive).length; // 收任务总数
                    let dailyLevelR = 0; // 收任务总等级
                    let eNum = 0; // E的个数（新增）
                    Object.values(fqDaily[date].fqSend).forEach(entry => {
                        const lsMatch = entry[0].match(/L(\d+)(E)?/); // 提取 L 后面的数字和 E
                        let levelS = parseInt(lsMatch[1], 10);
                        if (lsMatch[2]) { // 如果有 E 等级乘3
                            eNum++;
                            levelS *= 3;
                        }
                        // 累加等级
                        dailyLevelS += levelS;
                    });
                    if (date.slice(-2) == '04') {
                        activityMap[date] = dailyLevelS;
                    }
                    Object.values(fqDaily[date].fqReceive).forEach(entry => {
                        const lrMatch = entry[0].match(/L(\d+)(E)?/); // 提取 L 后面的数字和 E
                        let levelR = parseInt(lrMatch[1], 10);
                        if (lrMatch[2]) { // 如果有 E 等级乘3
                            levelR *= 3;
                        }
                        // 累加等级
                        dailyLevelR += levelR;
                    });
                    let changeRate = dailyLevelS / activityMap[date];
                    let rsRate = dailyLevelR / dailyLevelS;
                    const daylyRow = [date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"), activityMap[date], countS, eNum, dailyLevelS, changeRate.toFixed(3), countR, dailyLevelR, rsRate.toFixed(3)];
                    fqDailyMap.push(daylyRow);
                }
            });
            // 按用户分类
            const personStats = {};
            const fqContactFlag = document.getElementById('fqContactFlag').textContent;
            // 发任务统计
            dataSend.forEach(entry => {
                const lsMatch = entry[0].match(/L(\d+)(E)?/); // 提取 L 后面的数字和 E
                let levelS = parseInt(lsMatch[1], 10);
                if (lsMatch[2]) { // 如果有 E 等级乘3
                    levelS *= 3;
                }
                let person = entry[4]; // 用户id
                if (person === undefined) {
                    person = '待发送';
                }
            
                // 按用户分类
                if (!personStats[person]) {
                    var personValid = 1;
                    if (fqContactFlag == 1) {
                        personValid = 0;
                        for (let id in contactsList) {
                            if (person.includes(contactsList[id][0])) {
                                personValid = 1;
                                break;
                            }
                        }
                    } else if (fqContactFlag == 2) {
                        personValid = 1;
                        for (let id in contactsList) {
                            if (person.includes(contactsList[id][0])) {
                                personValid = 0;
                                break;
                            }
                        }
                    }
                    personStats[person] = {
                        countS: 0,
                        sumLevelS: 0,
                        countR: 0,
                        sumLevelR: 0,
                        valid: personValid
                    };
                }
                countS++;
                sumLevelS += levelS;
                if (personStats[person].valid == 1) {
                    selectedCountS++;
                    // 累加等级
                    selectedLevelS += levelS;
                
                    personStats[person].countS += 1;
                    personStats[person].sumLevelS += levelS;
                }
            });
            // 收任务统计
            dataReceive.forEach(entry => {
                const lrMatch = entry[0].match(/L(\d+)(E)?/); // 提取 L 后面的数字和 E
                let levelR = parseInt(lrMatch[1], 10);
                if (lrMatch[2]) { // 如果有 E 等级乘3
                    levelR *= 3;
                }
                const person = entry[4]; // 用户id
            
                // 按用户分类
                if (!personStats[person]) {
                    var personValid = 1;
                    if (fqContactFlag == 1) {
                        personValid = 0;
                        for (let id in contactsList) {
                            if (person.includes(contactsList[id][0])) {
                                personValid = 1;
                                break;
                            }
                        }
                    } else if (fqContactFlag == 2) {
                        personValid = 1;
                        for (let id in contactsList) {
                            if (person.includes(contactsList[id][0])) {
                                personValid = 0;
                                break;
                            }
                        }
                    }
                    personStats[person] = {
                        countS: 0,
                        sumLevelS: 0,
                        countR: 0,
                        sumLevelR: 0,
                        valid: personValid
                    };
                }
                countR++;
                sumLevelR += levelR;
                if (personStats[person].valid == 1) {
                    selectedCountR++;
                    // 累加等级
                    selectedLevelR += levelR;
                
                    personStats[person].countR += 1; // 条目数加一
                    personStats[person].sumLevelR += levelR; // a 列的和加上
                }
            });
    
            // 显示表格
            // let fqStats = Object.entries(personStats).map(([name, stats]) => [
            //     name, 
            //     stats.countS, 
            //     stats.sumLevelS, 
            //     stats.countR, 
            //     stats.sumLevelR,
            //     (stats.sumLevelR / stats.sumLevelS).toFixed(3)
            // ]);
            let fqStats = Object.entries(personStats).map(([name, stats]) => {
                    if (stats.valid == 1) {
                        return [
                            name,
                            stats.countS,
                            stats.sumLevelS,
                            stats.countR,
                            stats.sumLevelR,
                            stats.sumLevelS > 0 ? (stats.sumLevelR / stats.sumLevelS).toFixed(3) : 'Inf'
                        ];
                    } else {
                        return null;
                    }
            })
            .filter(entry => entry != null);
    
            // 按照 sumLevelR 降序排列
            fqStats.sort((a, b) => {
                return b[1] - a[1]; // 进行降序比较
            });

            sumChangeRate = sumLevelS / sumActivity;
            if (sumLevelS > 0) {
                sumRsRate = (sumLevelR / sumLevelS).toFixed(3);
            } else {
                sumRsRate = 'Inf';
            }
            if (selectedLevelS > 0) {
                selectedRsRate = (selectedLevelR / selectedLevelS).toFixed(3);
            } else {
                selectedRsRate = 'Inf';
            }
            let fqStasTitle = ['id', '发任务数', '发任务等级', '总转化率（新增）', '收任务数', '收任务等级', '总收发比（新增）'];
            let fqStasTotalNew = ['总计', countS, sumLevelS, sumChangeRate.toFixed(3), countR, sumLevelR, sumRsRate];
            displayMatrixBody([fqStasTotalNew, []], 'shortTableFqStats');
            displayMatrix(fqDailyMap, 'tableFqDaily');
            let fqStasTotal = ['总计', countS, selectedLevelS, countR, selectedLevelR, selectedRsRate];
            fqStats.unshift(fqStasTotal);
            displayMatrixBody(fqStats, 'tableFqStats');
            currentFqStats = fqStats;
        }
    });
}

const defaltTitleFqStats = ['id', '发任务数', '发任务等级', '收任务数', '收任务等级', '收发比'];
let currentSortOrder = [true, true, true, true, true]; // 用于跟踪每列的排序状态
let currentFqStats = []; // 用于存储当前显示的数据

/* 处理矩阵并显示为表格 不动表头 */
function displayMatrixBody(matrix, tableId, width = 0, editable = []) {
    
    let rows = matrix.length;
    let cols = matrix[0].length;
    if (width) {
        cols = width;
    }

    const table = document.getElementById(tableId);    // 定位表格

    /* 表格主体 */
    let tbody = table.querySelector('tbody'); // 获取表格主体
    tbody.innerHTML = ''; // 清空tbody
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

function sortTable(colIndex) {
    const titleFqStats = document.querySelector('#tableFqStats thead').rows[0].cells;
    // 切换当前列的排序顺序
    if (currentSortOrder[colIndex]) {
        currentSortOrder[colIndex] = false; // false为降序
        titleFqStats[colIndex].textContent = defaltTitleFqStats[colIndex] + '▼';
    } else {
        currentSortOrder[colIndex] = true; // true为升序
        titleFqStats[colIndex].textContent = defaltTitleFqStats[colIndex] + '▲';
    }
    for (let i = 0; i < titleFqStats.length; i++) {
        if (i != colIndex) {
            currentSortOrder[i] = true; // 默认设置为升序
            titleFqStats[i].textContent = defaltTitleFqStats[i];
        }
    }
    const totalRow = currentFqStats.shift();
    // currentFqStats = currentFqStats.slice(1);
    currentFqStats.sort((a, b) => {
        var aValue = a[colIndex];
        var bValue = b[colIndex];
        if (aValue === bValue) {
            return 0;
        }
        if (currentSortOrder[colIndex]) {
            if (aValue === 'Inf') {
                return 1;
            } else {
                aValue = Number(aValue);
            }
            if (bValue === 'Inf') {
                return -1;
            } else {
                bValue = Number(bValue);
            }
            return (aValue > bValue) ? 1 : -1;
        } else {
            if (aValue === 'Inf') {
                return -1;
            } else {
                aValue = Number(aValue);
            }
            if (bValue === 'Inf') {
                return 1;
            } else {
                bValue = Number(bValue);
            }
            return (aValue > bValue) ? -1 : 1;
        }
        // return (currentSortOrder[colIndex] ? aValue > bValue : aValue < bValue) ? 1 : -1;
    });
    currentFqStats.unshift(totalRow);

    displayMatrixBody(currentFqStats, 'tableFqStats'); // 重新渲染排序后的表格
}

document.addEventListener('DOMContentLoaded', function() {
    displayFriendQuest();

    const headers = document.querySelectorAll('th[data-index]');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const index = parseInt(header.getAttribute('data-index'));
            sortTable(index);
        });
    });
    // 展开和收起用户分类表
    document.getElementById('detailFq').addEventListener('click', function () {
        if (document.getElementById('detailFlag').textContent == 1) {
            document.getElementById('detailFq').textContent = '展开详情';
            document.getElementById('shortTableFqStats').style.display = "table";
            document.getElementById('tableFqStats').style.display = "none";
            document.getElementById('detailFlag').textContent = 0;
            document.getElementById('fqShowContact').style.display = "none";
        } else {
            document.getElementById('detailFq').textContent = '收起详情';
            document.getElementById('shortTableFqStats').style.display = "none";
            document.getElementById('tableFqStats').style.display = "table";
            document.getElementById('detailFlag').textContent = 1;
            document.getElementById('fqShowContact').style.display = "inline";
        }
    });
    // 手动修改昨日活跃度
    document.getElementById('updateLastAct').addEventListener('click', function () {
        const lastActNew = document.getElementById('lastActNew').value;
        if (lastActNew) {
            chrome.storage.local.get(['activityMap'], function(result) {
                let activityMap = result.activityMap || {};
                const currentDate = new Date();
                const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
                activityMap[newDate] = lastActNew;
                chrome.storage.local.set({ activityMap: activityMap });
                displayFriendQuest();
            });
        }
    });
    // 只看和不看好友
    document.getElementById('fqShowContact').addEventListener('click', function () {
        const fqContactFlag = document.getElementById('fqContactFlag');
        if (fqContactFlag.textContent == 0) {
            fqContactFlag.textContent = 1;
            document.getElementById('fqShowContact').textContent = '不看好友';
            displayFriendQuest();
        } else if (fqContactFlag.textContent == 1) {
            fqContactFlag.textContent = 2;
            document.getElementById('fqShowContact').textContent = '查看全部';
            displayFriendQuest();
        } else {
            fqContactFlag.textContent = 0;
            document.getElementById('fqShowContact').textContent = '只看好友';
            displayFriendQuest();
        }
    });
});

/* 接收网页传回的数据 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const timeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    if (request.action === 'friendQuest') {
        let fqInfo = request.fqInfo;
        let activity = request.activity;
        console.log(timeStr, '提取活跃度:', activity, '友谊任务信息：', fqInfo);   // 在控制台打出结果
        chrome.storage.local.get(['friendQuestInfo', 'activityMap', 'friendQuestDaily'], function(result) {
            let fqInfoAll = result.friendQuestInfo || {}; // 确保存在数据，防止为 undefined
            let activityMap = result.activityMap || {}; // 确保存在数据，防止为 undefined
            let fqDaily = result.friendQuestDaily || {}; // 确保存在数据，防止为 undefined

            // 当前UTC时间
            const currentDate = new Date();
            const newMonth = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0');
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 日期+1
            const nextDateObj = new Date(currentDate);
            nextDateObj.setUTCDate(currentDate.getUTCDate() + 1);  // 增加一天
            const nextDate = nextDateObj.getUTCFullYear() + String(nextDateObj.getUTCMonth() + 1).padStart(2, '0') + String(nextDateObj.getUTCDate()).padStart(2, '0');

            if (!activityMap[nextDate]) {
                activityMap[nextDate] = activity;
            } else if (activityMap[nextDate] < activity) {
                activityMap[nextDate] = activity;
            }
            if (!fqDaily[newDate]) {
                fqDaily[newDate] = {'fqSend': {}, 'fqReceive': {}};
            }
            if (!fqInfoAll[newMonth]) {
                fqInfoAll[newMonth] = {'fqSend': {}, 'fqReceive': {}}
            }
            if (fqInfo[newMonth]) {
                for (const id in fqInfo[newMonth].fqSend) {
                    if (!fqInfoAll[newMonth].fqSend.hasOwnProperty(id)) { 
                        fqDaily[newDate].fqSend[id] = fqInfo[newMonth].fqSend[id];
                    }
                    fqInfoAll[newMonth].fqSend[id] = fqInfo[newMonth].fqSend[id];
                }
                for (const id in fqInfo[newMonth].fqReceive) {
                    if (!fqInfoAll[newMonth].fqReceive.hasOwnProperty(id)) { 
                        fqDaily[newDate].fqReceive[id] = fqInfo[newMonth].fqReceive[id];
                    }
                    fqInfoAll[newMonth].fqReceive[id] = fqInfo[newMonth].fqReceive[id];
                }
            }
            // fqInfoAll[newMonth].fqSend = { ...fqInfoAll[newMonth].fqSend, ...fqInfo[newMonth].fqSend };
            // fqInfoAll[newMonth].fqReceive = { ...fqInfoAll[newMonth].fqReceive, ...fqInfo[newMonth].fqReceive };
            // 保存更新后的数据
            chrome.storage.local.set({ friendQuestInfo: fqInfoAll });
            chrome.storage.local.set({ activityMap: activityMap });
            chrome.storage.local.set({ friendQuestDaily: fqDaily });
            console.log('友谊任务信息汇总:', fqInfoAll);   // 在控制台打出结果
        });
        document.getElementById('flagFq').textContent = 1;   // 设置成功标记
        document.getElementById('flagFqAll').textContent = 1;   // 设置成功标记
        setTimeout(() => {
            displayFriendQuest();
        }, 10);
    }
});

/* 刷新友谊任务（第一页） */
function updateFriendQuest() {
    document.getElementById('flagFq').textContent = 0;
    chrome.tabs.create({ url: 'https://minesweeper.online/cn/friend-quests', active: false }, function (tabFq) {
        const ti0 = tabFq.id;
        recur(ti0, 1);

        function recur(tabId, i) {
            var maxI = 50;
            var t0 = 200;
            setTimeout(() => {
                extract(tabId);
                const flag = document.getElementById('flagFq').textContent;
                if (flag == 1 || i > maxI) {
                    chrome.tabs.remove(tabId, function() {});
                } else {
                    recur(tabId, i + 1);
                }
            }, i * t0);
        }

        function extract(tabId) {
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    const currentDate = new Date();
                    const newMonth = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0');
                    var fqInfo = {[newMonth]: {'fqSend': {}, 'fqReceive': {}}};
                    let questSending;
                    let questReceived;
                    let questSent;
                    try {
                        let tableList = document.querySelectorAll("#QuestsBlock .table.table-bordered");
    
                        tableList.forEach(table => {
                            if (table.querySelector("thead > tr > th:nth-child(4)").textContent == '奖励' 
                            || table.querySelector("thead > tr > th:nth-child(4)").textContent == 'Reward') {
                                questSending = table;
                            } else if (table.querySelector("thead > tr > th:nth-child(6)").textContent == '发送自' 
                            || table.querySelector("thead > tr > th:nth-child(6)").textContent == 'Sent by') {
                                questReceived = table;
                            } else {
                                questSent = table;
                            }
                        });

                        if (questSending) {
                            Array.from(questSending.getElementsByTagName('tr')).forEach(tr => {
                                const id = tr.id;
                                const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                if (id) {
                                    fqInfo[newMonth].fqSend[id] = tdValues; // 将id作为键，td中的内容存入数组
                                }
                            });
                        }
                        if (questReceived) {
                            Array.from(questReceived.getElementsByTagName('tr')).forEach(tr => {
                                const id = tr.id;
                                const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                if (id) {
                                    fqInfo[newMonth].fqReceive[id] = tdValues; // 将id作为键，td中的内容存入数组
                                }
                            });
                        }
                        if (questSent) {
                            Array.from(questSent.getElementsByTagName('tr')).forEach(tr => {
                                const id = tr.id;
                                const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                if (id) {
                                    fqInfo[newMonth].fqSend[id] = tdValues; // 将id作为键，td中的内容存入数组
                                }
                            });
                        }

                        let activity;
                        const activityP = document.querySelector("#QuestsBlock > p");
                        if (activityP) {
                            activity = parseInt(activityP.textContent.match(/\d+$/)[0], 10);
                        }

                        if (activity !== undefined) {
                            console.log(activity, fqInfo);
                            chrome.runtime.sendMessage({ action: 'friendQuest', fqInfo: fqInfo, activity: activity });
                        }
                    } catch (e) {
                        console.error('错误页面', e);
                    }
                }
            });
        }
    });
}

/* 刷新友谊任务（全部） */
function updateFriendQuestAll() {
    document.getElementById('flagFqAll').textContent = 0;
    chrome.tabs.create({ url: 'https://minesweeper.online/cn/friend-quests', active: false }, function (tabFq) {
        const ti0 = tabFq.id;
        var t1 = 1000;
        var flag;
        var count = 1;
        var countMax = 60;
        extractFqAll(ti0);
        intervalFqAll = setInterval(() => {
            flag = document.getElementById('flagFqAll').textContent;
            if (flag == 1 || count > countMax) {
                clearInterval(intervalFqAll);
                chrome.tabs.remove(ti0, function() {});
            } else {
                count++;
            }
        }, t1);

        function extractFqAll(tabId) {
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    const currentDate = new Date();
                    const newMonth = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0');
                    var fqInfo = {[newMonth]: {'fqSend': {}, 'fqReceive': {}}};
                    var t0 = 100;
                    try {
                        startFqAllQuery = setInterval(() => {
                            let activityP = document.querySelector("#QuestsBlock > p");
                            if (activityP) {
                                clearInterval(startFqAllQuery);
                                let activity = parseInt(activityP.textContent.match(/\d+$/)[0], 10);
                                const questsBlock = document.querySelector("#QuestsBlock");
                                var ti = [[0, 0, 0], [0, 0, 0]]; // tableIndex
                                var fqsiFlag = 0;
                                var fqrFlag = 0;
                                var fqsdFlag = 0;
                                for (let i = 0; i < questsBlock.children.length; i++) {
                                    const ele = questsBlock.children[i];
                                    var currentTable;
                                    if (ele.classList.contains('table-bordered')) { // 检查是否为 table
                                        if (ele.querySelector("thead > tr > th:nth-child(4)").textContent == '奖励' 
                                        || ele.querySelector("thead > tr > th:nth-child(4)").textContent == 'Reward') {
                                            ti[0][0] = i + 1;
                                            currentTable = 0;
                                        } else if (ele.querySelector("thead > tr > th:nth-child(6)").textContent == '发送自' 
                                        || ele.querySelector("thead > tr > th:nth-child(6)").textContent == 'Sent by') {
                                            ti[0][1] = i + 1;
                                            currentTable = 1;
                                        } else if (ele.querySelector("thead > tr > th:nth-child(6)").textContent == '发送到' 
                                        || ele.querySelector("thead > tr > th:nth-child(6)").textContent == 'Sent to') {
                                            ti[0][2] = i + 1;
                                            currentTable = 2;
                                        }
                                        // 检查下一个元素是否为 link
                                        if (i + 1 < questsBlock.children.length) {
                                            const nextEle = questsBlock.children[i + 1];
                                            if (nextEle.classList.contains('pagination')) {
                                                ti[1][currentTable] = i + 2;
                                                i++; // 跳过已处理的 link
                                            }
                                        }
                                    }
                                }
                                console.log(ti);
                                var t0 = 100;
                                if (ti[0][0] > 0) { // 待发送任务
                                    if (ti[1][0] > 0) { // 翻页
                                        var sipn = 1;
                                        sipInterval = setInterval(() => {
                                            let sipSet = document.querySelector(`#QuestsBlock > ul:nth-child(${ti[1][0]})`);
                                            let sipActive = sipSet.querySelector("li.page.active");
                                            if (sipActive.textContent == sipn) { // 当前页码等于录入页码
                                                let questSending = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][0]})`);
                                                Array.from(questSending.getElementsByTagName('tr')).forEach(tr => {
                                                    const id = tr.id;
                                                    const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                                    if (id) {
                                                        fqInfo[newMonth].fqSend[id] = tdValues; // 将id作为键，td中的内容存入数组
                                                    }
                                                });
                                                sipn++;
                                                const sipLastDisabled = sipSet.querySelector("li.last.disabled");
                                                if (sipLastDisabled) { // 没有下一页说明到达最后一页
                                                    clearInterval(sipInterval);
                                                    // console.log('待发送提取完成');
                                                    fqsiFlag = 1;
                                                } else { // 否则翻页
                                                    const sipNext = sipSet.querySelector("li.next");
                                                    sipNext.click();
                                                }
                                            } else if (sipActive.textContent < sipn) { // 页码落后于录入页码就翻页
                                                const sipNext = sipSet.querySelector("li.next");
                                                sipNext.click();
                                            } else if (sipActive.textContent > sipn) { // 页码领先于录入页码就回到第一页
                                                const sipFirst = sipSet.querySelector("li.first");
                                                sipFirst.click();
                                            }
                                        }, t0);
                                    } else {
                                        let questSending = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][0]})`);
                                        Array.from(questSending.getElementsByTagName('tr')).forEach(tr => {
                                            const id = tr.id;
                                            const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                            if (id) {
                                                fqInfo[newMonth].fqSend[id] = tdValues; // 将id作为键，td中的内容存入数组
                                            }
                                        });
                                        fqsiFlag = 1;
                                    }
                                } else {
                                    fqsiFlag = 1;
                                }
                                if (ti[0][1] > 0) { // 接收到的任务
                                    if (ti[1][1] > 0) { // 翻页
                                        var rpn = 1;
                                        rpInterval = setInterval(() => {
                                            let rpSet = document.querySelector(`#QuestsBlock > ul:nth-child(${ti[1][1]})`);
                                            let rpActive = rpSet.querySelector("li.page.active");
                                            if (rpActive.textContent == rpn) { // 当前页码等于录入页码
                                                let questReceived = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][1]})`);
                                                Array.from(questReceived.getElementsByTagName('tr')).forEach(tr => {
                                                    const id = tr.id;
                                                    const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                                    if (id) {
                                                        fqInfo[newMonth].fqReceive[id] = tdValues; // 将id作为键，td中的内容存入数组
                                                    }
                                                });
                                                rpn++;
                                                const rpLastDisabled = rpSet.querySelector("li.last.disabled");
                                                if (rpLastDisabled) { // 没有下一页说明到达最后一页
                                                    clearInterval(rpInterval);
                                                    // console.log('接收提取完成');
                                                    fqrFlag = 1;
                                                } else { // 否则翻页
                                                    const rpNext = rpSet.querySelector("li.next");
                                                    rpNext.click();
                                                }
                                            } else if (rpActive.textContent < rpn) { // 页码落后于录入页码就翻页
                                                const rpNext = rpSet.querySelector("li.next");
                                                rpNext.click();
                                            } else if (rpActive.textContent > rpn) { // 页码领先于录入页码就回到第一页
                                                const rpFirst = rpSet.querySelector("li.first");
                                                rpFirst.click();
                                            }
                                        }, t0);
                                    } else {
                                        let questReceived = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][1]})`);
                                        Array.from(questReceived.getElementsByTagName('tr')).forEach(tr => {
                                            const id = tr.id;
                                            const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                            if (id) {
                                                fqInfo[newMonth].fqReceive[id] = tdValues; // 将id作为键，td中的内容存入数组
                                            }
                                        });
                                        fqrFlag = 1;
                                    }
                                } else {
                                    fqrFlag = 1;
                                }
                                if (ti[0][2] > 0) { // 已发送任务
                                    if (ti[1][2] > 0) { // 翻页
                                        var sdpn = 1;
                                        sdpInterval = setInterval(() => {
                                            let sdpSet = document.querySelector(`#QuestsBlock > ul:nth-child(${ti[1][2]})`);
                                            let sdpActive = sdpSet.querySelector("li.page.active");
                                            if (sdpActive.textContent == sdpn) { // 当前页码等于录入页码
                                                let questSent = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][2]})`);
                                                Array.from(questSent.getElementsByTagName('tr')).forEach(tr => {
                                                    const id = tr.id;
                                                    const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                                    if (id) {
                                                        fqInfo[newMonth].fqSend[id] = tdValues; // 将id作为键，td中的内容存入数组
                                                    }
                                                });
                                                sdpn++;
                                                const sdpLastDisabled = sdpSet.querySelector("li.last.disabled");
                                                if (sdpLastDisabled) { // 没有下一页说明到达最后一页
                                                    clearInterval(sdpInterval);
                                                    // console.log('已发送提取完成');
                                                    fqsdFlag = 1;
                                                } else { // 否则翻页
                                                    const sdpNext = sdpSet.querySelector("li.next");
                                                    sdpNext.click();
                                                }
                                            } else if (sdpActive.textContent < sdpn) { // 页码落后于录入页码就翻页
                                                const sdpNext = sdpSet.querySelector("li.next");
                                                sdpNext.click();
                                            } else if (sdpActive.textContent > sdpn) { // 页码领先于录入页码就回到第一页
                                                const sdpFirst = sdpSet.querySelector("li.first");
                                                sdpFirst.click();
                                            }
                                        }, t0);
                                    } else {
                                        let questSent = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][2]})`);
                                        Array.from(questSent.getElementsByTagName('tr')).forEach(tr => {
                                            const id = tr.id;
                                            const tdValues = Array.from(tr.getElementsByTagName('td')).map(td => td.innerText); // 获取每个td中的内容
                                            if (id) {
                                                fqInfo[newMonth].fqSend[id] = tdValues; // 将id作为键，td中的内容存入数组
                                            }
                                        });
                                        fqsdFlag = 1;
                                    }
                                } else {
                                    fqsdFlag = 1;
                                }
                                checkQueryOver = setInterval(() => {
                                    if (fqsiFlag && fqrFlag && fqsdFlag) {
                                        clearInterval(checkQueryOver);
                                        console.log(activity, fqInfo);
                                        chrome.runtime.sendMessage({ action: 'friendQuest', fqInfo: fqInfo, activity: activity });
                                    } else {
                                        // console.log(fqsiFlag, fqrFlag, fqsdFlag)
                                    }
                                }, t0);
                            }
                        }, t0);
                    } catch (e) {
                        console.error('错误页面', e);
                    }
                }
            });
        }
    });
}

/* 刷新任务 */
document.getElementById('updateFq').addEventListener('click', function () {
    updateFriendQuest();
});
document.getElementById('updateFqAll').addEventListener('click', function () {
    updateFriendQuestAll();
});