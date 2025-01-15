/* 页面显示 */
function displayFriendQuest() {
    chrome.storage.local.get(['friendQuestInfo', 'activityMap', 'friendQuestDaily'], function(result) {
        let fqInfoAll = result.friendQuestInfo || {}; // 确保存在数据，防止为 undefined
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
            let countS = dataSend.length; // 发任务总数
            let sumLevelS = 0; // 发任务总等级
            let countR = dataReceive.length; // 收任务总数
            let sumLevelR = 0; // 收任务总等级
            // 按用户分类
            const personStats = {};
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
            
                // 累加等级
                sumLevelS += levelS;
            
                // 按用户分类
                if (!personStats[person]) {
                    personStats[person] = {
                        countS: 0,
                        sumLevelS: 0,
                        countR: 0,
                        sumLevelR: 0
                    };
                }
                personStats[person].countS += 1;
                personStats[person].sumLevelS += levelS;
            });
            // 收任务统计
            dataReceive.forEach(entry => {
                const lrMatch = entry[0].match(/L(\d+)(E)?/); // 提取 L 后面的数字和 E
                let levelR = parseInt(lrMatch[1], 10);
                if (lrMatch[2]) { // 如果有 E 等级乘3
                    levelR *= 3;
                }
                const person = entry[4]; // 用户id
            
                // 累加等级
                sumLevelR += levelR;
            
                // 按用户分类
                if (!personStats[person]) {
                    personStats[person] = {
                        countS: 0,
                        sumLevelS: 0,
                        countR: 0,
                        sumLevelR: 0
                    };
                }
                personStats[person].countR += 1; // 条目数加一
                personStats[person].sumLevelR += levelR; // a 列的和加上
            });
    
            // 显示表格
            let fqStats = Object.entries(personStats).map(([name, stats]) => [
                name, 
                stats.countS, 
                stats.sumLevelS, 
                stats.countR, 
                stats.sumLevelR
            ]);
    
            // 按照 sumLevelR 降序排列
            fqStats.sort((a, b) => {
                return b[1] - a[1]; // 进行降序比较
            });
            let fqStasTitle = ['id', '发任务数', '发任务等级', '收任务数', '收任务等级'];
            let fqStasTotal = ['总计', countS, sumLevelS, countR, sumLevelR];
            fqStats.unshift(fqStasTotal);
            displayMatrixBody([fqStasTotal, []], 'shortTableFqStats');
            displayMatrixBody(fqStats, 'tableFqStats');
            currentFqStats = fqStats;

            /* 每日统计 */
            let fqDailyMap = [['日期', '昨日活跃度', '发任务数', '发任务等级', '转化率', '收任务数', '收任务等级', '收发比']];
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
                if (activityMap[date]) {
                    let countS = Object.keys(fqDaily[date].fqSend).length; // 发任务总数
                    let sumLevelS = 0; // 发任务总等级
                    let countR = Object.keys(fqDaily[date].fqReceive).length; // 收任务总数
                    let sumLevelR = 0; // 收任务总等级
                    Object.values(fqDaily[date].fqSend).forEach(entry => {
                        const lsMatch = entry[0].match(/L(\d+)(E)?/); // 提取 L 后面的数字和 E
                        let levelS = parseInt(lsMatch[1], 10);
                        if (lsMatch[2]) { // 如果有 E 等级乘3
                            levelS *= 3;
                        }
                        // 累加等级
                        sumLevelS += levelS;
                    });
                    Object.values(fqDaily[date].fqReceive).forEach(entry => {
                        const lrMatch = entry[0].match(/L(\d+)(E)?/); // 提取 L 后面的数字和 E
                        let levelR = parseInt(lrMatch[1], 10);
                        if (lrMatch[2]) { // 如果有 E 等级乘3
                            levelR *= 3;
                        }
                        // 累加等级
                        sumLevelR += levelR;
                    });
                    let changeRate = sumLevelS / activityMap[date];
                    let rsRate = sumLevelR / sumLevelS;
                    const daylyRow = [date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"), activityMap[date], countS, sumLevelS, changeRate.toFixed(3), countR, sumLevelR, rsRate.toFixed(3)];
                    fqDailyMap.push(daylyRow);
                }
            });
            displayMatrix(fqDailyMap, 'tableFqDaily');
        }
    });
}

const defaltTitleFqStats = ['id', '发任务数', '发任务等级', '收任务数', '收任务等级'];
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
        const aValue = a[colIndex];
        const bValue = b[colIndex];
        if (aValue === bValue) return 0;
        return (currentSortOrder[colIndex] ? aValue > bValue : aValue < bValue) ? 1 : -1;
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
    document.getElementById('detailFq').addEventListener('click', function () {
        if (document.getElementById('detailFlag').textContent == 1) {
            document.getElementById('detailFq').textContent = '展开详情';
            document.getElementById('shortTableFqStats').style.display = "block";
            document.getElementById('tableFqStats').style.display = "none";
            document.getElementById('detailFlag').textContent = 0;
        } else {
            document.getElementById('detailFq').textContent = '收起详情';
            document.getElementById('shortTableFqStats').style.display = "none";
            document.getElementById('tableFqStats').style.display = "block";
            document.getElementById('detailFlag').textContent = 1;
        }
    });
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
});

/* 接收网页传回的数据 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'friendQuest') {
        let fqInfo = request.fqInfo;
        let activity = request.activity;
        console.log('本次提取活跃度:', activity, '友谊任务信息：', fqInfo);   // 在控制台打出结果
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

/* 刷新任务 */
document.getElementById('updateFq').addEventListener('click', function () {
    updateFriendQuest();
});