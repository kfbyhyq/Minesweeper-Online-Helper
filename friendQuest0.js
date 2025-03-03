document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonFq');
    const buttonFqAll = document.getElementById('buttonFqAll');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/') && tab1[0].url.includes('friend-quests')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                // chrome.storage.local.get(['friendQuestInfo'], function(result) {
                //     let fqInfo = result.friendQuestInfo;
                // });
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        // if (window.location.href !== 'https://minesweeper.online/cn/friend-quests') {
                        //     window.alert('错误页面');
                        //     return;
                        // }
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
    
                            let activity = 0;
                            const activityP = document.querySelector("#QuestsBlock > p");
                            if (activityP) {
                                activity = parseInt(activityP.textContent.match(/\d+$/)[0], 10);
                            }
    
                            console.log(activity, fqInfo);
                            chrome.runtime.sendMessage({ action: 'friendQuest', fqInfo: fqInfo, activity: activity });
                        } catch (error) {
                            console.log(error);
                            window.alert('错误页面', error);
                        }
                        
                        function saveAsTxt(dataArray, filename) {
                            const txt = dataArray.map(item => item + '\n').join('');
                            const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(() => {
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);
                            }, 0);
                        }
                    }
                });
            });
            
            buttonFqAll.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            buttonFqAll.style.cursor = 'pointer'; // 鼠标指针样式
            buttonFqAll.addEventListener('click', function () {
                buttonFqAll.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        const currentDate = new Date();
                        const newMonth = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0');
                        var fqInfo = {[newMonth]: {'fqSend': {}, 'fqReceive': {}}};
                        try {
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
                                                // console.log(fqInfo)
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
                                                // console.log(fqInfo)
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
                                            let questSending = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][2]})`);
                                            Array.from(questSending.getElementsByTagName('tr')).forEach(tr => {
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
                                                // console.log(fqInfo)
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
                                    let questSending = document.querySelector(`#QuestsBlock > table:nth-child(${ti[0][2]})`);
                                    Array.from(questSending.getElementsByTagName('tr')).forEach(tr => {
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
                            let activity = 0;
                            const activityP = document.querySelector("#QuestsBlock > p");
                            if (activityP) {
                                activity = parseInt(activityP.textContent.match(/\d+$/)[0], 10);
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
                        } catch (error) {
                            console.log(error);
                            window.alert('错误页面', error);
                        }
                        // function saveAsTxt(dataArray, filename) {
                        //     const txt = dataArray.map(item => item + '\n').join('');
                        //     const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
                        //     const url = URL.createObjectURL(blob);
                        //     const a = document.createElement('a');
                        //     a.style.display = 'none';
                        //     a.href = url;
                        //     a.download = filename;
                        //     document.body.appendChild(a);
                        //     a.click();
                        //     setTimeout(() => {
                        //         document.body.removeChild(a);
                        //         window.URL.revokeObjectURL(url);
                        //     }, 0);
                        // }
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
            buttonFqAll.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});

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
        if (document.getElementById('buttonFq').style.backgroundColor === 'rgb(255, 159, 24)') {
            document.getElementById('buttonFq').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        }
        if (document.getElementById('buttonFqAll').style.backgroundColor == 'rgb(255, 159, 24)') {
            document.getElementById('buttonFqAll').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    if ((currentDate.getUTCMonth() + 1) % 4 != 2) {
        document.getElementById("event2").style.display = 'none';
    }
});