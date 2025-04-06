document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonWh');
    button.style.backgroundColor = '#9b9b9b'; // 默认灰色
    chrome.storage.local.get('pId', function (result) {
        const pId = result.pId;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            if (tab1[0].url.includes('https://minesweeper.online/') && tab1[0].url.includes('quests/' + pId)) {
                button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
                button.style.cursor = 'pointer'; // 鼠标指针样式
                button.addEventListener('click', function () {
                    button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                    const tabId = tab1[0].id;
                    chrome.scripting.executeScript({
                        target: { tabId },
                        function: function () {
                            try {
                                var allQuests = [
                                    ['序号', '发起时间', '月', '日', '任务种类', '任务内容', '活动任务类型']
                                ];
                                var itemPerPage = 5; // 每页5条
                                var pageNum = 1;
                                var t0 = 100;
                                var t1 = 10;
                                pageInterval = setInterval(() => {
                                    const pageActive = document.querySelector("#stat_pagination > li.page.active");
                                    if (pageActive) {
                                        if (pageActive.textContent == pageNum) {
                                            const statTable = document.querySelector("#stat_table");
                                            if (!statTable.classList.contains('stat-loading')) {
                                                for (let i = 1; i <= itemPerPage; i++) {
                                                    var itemNum = (pageNum - 1) * itemPerPage + i;
                                                    allQuests[itemNum] = [];
                                                    allQuests[itemNum][0] = itemNum;
                                                    const startTime = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(1)`).textContent;
                                                    allQuests[itemNum][1] = startTime;
                                                    let date;
                                                    // “今天08:00”或“Today 08:00”
                                                    if (startTime.includes("今天") || startTime.includes("Today")) {
                                                        const timePart = startTime.match(/\d{1,2}:\d{2}/)[0];
                                                        const [hours, minutes] = timePart.split(':');
                                                        date = new Date();
                                                        date.setHours(parseInt(hours, 10));
                                                        date.setMinutes(parseInt(minutes, 10));
                                                    } else { // “03月 06日08:00”或“6 March08:00”
                                                        const matchChs = startTime.match(/(\d{1,2})月\s*(\d{1,2})日\s*(\d{1,2}):(\d{2})/);
                                                        const matchEn = startTime.match(/(\d{1,2})\s+([A-Za-z]+)\s*(\d{1,2}):(\d{2})/);
                                                        if (matchChs) {
                                                            const [, month, day, hours, minutes] = matchChs;
                                                            date = new Date();
                                                            date.setMonth(parseInt(month, 10) - 1);
                                                            date.setDate(parseInt(day, 10));
                                                            date.setHours(parseInt(hours, 10));
                                                            date.setMinutes(parseInt(minutes, 10));
                                                        } else if (matchEn) {
                                                            const [, day, monthStr, hours, minutes] = matchEn;
                                                            const monthMap = {
                                                                January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                                                                July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
                                                            };
                                                            const month = monthMap[monthStr];
                                                            date = new Date();
                                                            date.setMonth(parseInt(month, 10));
                                                            date.setDate(parseInt(day, 10));
                                                            date.setHours(parseInt(hours, 10));
                                                            date.setMinutes(parseInt(minutes, 10));
                                                        }
                                                    }
                                                    if (date) {
                                                        if (date.getUTCDate() < 4 || (itemNum > 1 && date.getUTCMonth() + 1 != allQuests[itemNum - 1][2])) {
                                                            clearInterval(pageInterval);
                                                            console.log(allQuests);
                                                            chrome.runtime.sendMessage({ action: 'sendWheelQuest', allQuests: allQuests });
                                                        }
                                                        allQuests[itemNum][2] = date.getUTCMonth() + 1;
                                                        allQuests[itemNum][3] = date.getUTCDate();
                                                    } else {
                                                        console.log('匹配日期失败：', startTime);
                                                        clearInterval(pageInterval);
                                                        console.log(allQuests);
                                                    }
                                                    const type = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2) > span`).textContent;
                                                    allQuests[itemNum][4] = type;
                                                    const questContent = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(3) > div`).textContent;
                                                    allQuests[itemNum][5] = questContent;
                                                    const eventType = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(5) > span > span > span > span:nth-child(2) > img`);
                                                    if (eventType && eventType.className.includes('shard')) {
                                                        allQuests[itemNum][6] = eventType.className.match(/shard\d+/)[0];
                                                    } else {
                                                        allQuests[itemNum][6] = '';
                                                    }
                                                }
                                                pageNum++;
                                                const pageLastDisabled = document.querySelector("#stat_pagination > li.last.disabled");
                                                if (pageLastDisabled) {
                                                    clearInterval(pageInterval);
                                                    console.log(allQuests);
                                                    chrome.runtime.sendMessage({ action: 'sendWheelQuest', allQuests: allQuests });
                                                } else {
                                                    setTimeout(() => {
                                                        const pageNext = document.querySelector("#stat_pagination > li.next");
                                                        pageNext.click();
                                                    }, t1);
                                                }
                                            }
                                        } else if (pageActive.textContent < pageNum) {
                                            setTimeout(() => {
                                                const pageNext = document.querySelector("#stat_pagination > li.next");
                                                pageNext.click();
                                            }, t1);
                                        } else if (pageActive.textContent > pageNum) {
                                            setTimeout(() => {
                                                const pageFirst = document.querySelector("#stat_pagination > li.first");
                                                pageFirst.click();
                                            }, t1);
                                        }
                                    } else {
                                        for (let i = 1; i <= itemPerPage; i++) {
                                            var itemNum = (pageNum - 1) * itemPerPage + i;
                                            allQuests[itemNum] = [];
                                            allQuests[itemNum][0] = itemNum;
                                            const startTime = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(1)`).textContent;
                                            allQuests[itemNum][1] = startTime;
                                            let date;
                                            // “今天08:00”或“Today 08:00”
                                            if (startTime.includes("今天") || startTime.includes("Today")) {
                                                const timePart = startTime.match(/\d{1,2}:\d{2}/)[0];
                                                const [hours, minutes] = timePart.split(':');
                                                date = new Date();
                                                date.setHours(parseInt(hours, 10));
                                                date.setMinutes(parseInt(minutes, 10));
                                            } else { // “03月 06日08:00”或“6 March08:00”
                                                const matchChs = startTime.match(/(\d{1,2})月\s*(\d{1,2})日\s*(\d{1,2}):(\d{2})/);
                                                const matchEn = startTime.match(/(\d{1,2})\s+([A-Za-z]+)\s*(\d{1,2}):(\d{2})/);
                                                if (matchChs) {
                                                    const [, month, day, hours, minutes] = matchChs;
                                                    date = new Date();
                                                    date.setMonth(parseInt(month, 10) - 1);
                                                    date.setDate(parseInt(day, 10));
                                                    date.setHours(parseInt(hours, 10));
                                                    date.setMinutes(parseInt(minutes, 10));
                                                } else if (matchEn) {
                                                    const [, day, monthStr, hours, minutes] = matchEn;
                                                    const monthMap = {
                                                        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
                                                        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
                                                    };
                                                    const month = monthMap[monthStr];
                                                    date = new Date();
                                                    date.setMonth(parseInt(month, 10));
                                                    date.setDate(parseInt(day, 10));
                                                    date.setHours(parseInt(hours, 10));
                                                    date.setMinutes(parseInt(minutes, 10));
                                                }
                                            }
                                            if (date) {
                                                if (date.getUTCDate() < 4 || (itemNum > 1 && date.getUTCMonth() + 1 != allQuests[itemNum - 1][2])) {
                                                    clearInterval(pageInterval);
                                                    console.log(allQuests);
                                                    chrome.runtime.sendMessage({ action: 'sendWheelQuest', allQuests: allQuests });
                                                }
                                                allQuests[itemNum][2] = date.getUTCMonth() + 1;
                                                allQuests[itemNum][3] = date.getUTCDate();
                                            } else {
                                                console.log('匹配日期失败：', startTime);
                                                clearInterval(pageInterval);
                                                console.log(allQuests);
                                            }
                                            const type = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(2) > span`).textContent;
                                            allQuests[itemNum][4] = type;
                                            const questContent = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(3) > div`).textContent;
                                            allQuests[itemNum][5] = questContent;
                                            const eventType = document.querySelector(`#stat_table_body > tr:nth-child(${i}) > td:nth-child(5) > span > span > span > span:nth-child(2) > img`);
                                            if (eventType && eventType.className.includes('shard')) {
                                                allQuests[itemNum][6] = eventType.className.match(/shard\d+/)[0];
                                            } else {
                                                allQuests[itemNum][6] = '';
                                            }
                                        }
                                        clearInterval(pageInterval);
                                        console.log(allQuests);
                                        chrome.runtime.sendMessage({ action: 'sendWheelQuest', allQuests: allQuests });
                                    }
                                }, t0);
                            } catch (e) {
                                console.log(e);
                                window.alert('错误页面', e);
                            }
                        }
                    });
                });
            } else {
                button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
            }
        });
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'sendWheelQuest') {
        let allQuests = request.allQuests;
        console.log('收到任务数据：', allQuests);
        document.getElementById('buttonWh').style.backgroundColor = '#4caf50';
        var wheelType = {
            'shard387': '效率',
            'shard388': '竞速',
            'shard390': '连胜',
            'shard391': '高难',
            'shard392': '无猜',
            'shard393': '局数',
            'shard394': '命运任务',
            'shard395': '竞技场'
        }
        var wheelQuests = [['月', '日', '任务内容', '活动任务类型']];
        for (let i = 1; i < allQuests.length; i++) {
            if (allQuests[i][4] == 'Wheel') {
                if (i > 1 && allQuests[i][6] == 'shard394' && allQuests[i - 1][6] == 'shard394') {
                    continue;
                } else {
                    var wheelRow = [allQuests[i][2], allQuests[i][3], allQuests[i][5], wheelType[allQuests[i][6]]];
                    wheelQuests.push(wheelRow);
                }
            }
        }
        console.log(wheelQuests);
        var questsLeft = [
            ['效率', '竞速', '连胜', '高难', '无猜', '局数', '命运任务', '竞技场'],
            [0, 0, 0, 0, 0, 0, 0, 0], // 0为每日剩余
            [0, 0, 0, 0, 0, 0, 0, 0] // 0为周期剩余
        ];
        var dailyNum = 0;
        var roundNum = 0;
        const currentDate = new Date();
        const date = currentDate.getUTCDate();
        for (let i = 1; i < wheelQuests.length; i++) {
            if (wheelQuests[i][1] == date) {
                for (let j = 0; j < questsLeft[0].length; j++) {
                    if (questsLeft[0][j] == wheelQuests[i][3]) {
                        questsLeft[1][j] = 1;
                        break;
                    }
                }
                dailyNum++;
            } else {
                break;
            }
        }
        for (let i = 1; i <= (wheelQuests.length - 1) % 8; i++) {
            for (let j = 0; j < questsLeft[0].length; j++) {
                if (questsLeft[0][j] == wheelQuests[i][3]) {
                    questsLeft[2][j] = 1;
                    break;
                }
            }
            roundNum++;
        }
        console.log(questsLeft);
        var wheelOutput = '';
        if (dailyNum == 8) {
            wheelOutput += '今日转盘已转满 ';
            if (roundNum == 0) {
            wheelOutput += '\n明日无优先任务';
            } else {
                wheelOutput += '\n明日优先任务：';
                for (let i = 0; i < 8; i++) {
                    if (questsLeft[2][i] == 0) {
                        wheelOutput += questsLeft[0][i] + ' ';
                    }
                }
            }
        } else if (dailyNum >= roundNum) {
            wheelOutput += '今日剩余任务：';
            for (let i = 0; i < 8; i++) {
                if (questsLeft[1][i] == 0) {
                    wheelOutput += questsLeft[0][i] + ' ';
                }
            }
            if (roundNum == 0) {
            wheelOutput += '\n如果今日不转，明日无优先任务';
            } else {
                wheelOutput += '\n如果今日不转，明日优先任务：';
                for (let i = 0; i < 8; i++) {
                    if (questsLeft[2][i] == 0) {
                        wheelOutput += questsLeft[0][i] + ' ';
                    }
                }
            }
        } else if (dailyNum < roundNum) {
            wheelOutput += '今日优先任务：';
            for (let i = 0; i < 8; i++) {
                if (questsLeft[2][i] == 0) {
                    questsLeft[1][i] = 2;
                    wheelOutput += questsLeft[0][i] + ' ';
                }
            }
            wheelOutput += '\n今日后续任务：';
            for (let i = 0; i < 8; i++) {
                if (questsLeft[1][i] == 0) {
                    wheelOutput += questsLeft[0][i] + ' ';
                }
            }
            wheelOutput += '\n如果今日不转，明日优先任务：';
            for (let i = 0; i < 8; i++) {
                if (questsLeft[2][i] == 0) {
                    wheelOutput += questsLeft[0][i] + ' ';
                }
            }
        }
        console.log(wheelOutput);
        document.getElementById("resultWh").innerHTML = wheelOutput.replaceAll('\n', '<br>');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    if ((currentDate.getUTCMonth() + 1) % 4 != 3) {
        document.getElementById("event3").style.display = 'none';
    }
});