document.addEventListener('DOMContentLoaded', function() {
    /* 分析活动任务 */
    const button = document.getElementById('buttonEq');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/') && tab1[0].url.includes('event-quests')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        var name = ['中级效率', '高级效率', '竞技场', '连胜', '盲扫', '无猜', '自定义', '金币', '宝石', '竞速', '初级局数', '中级局数', '高级局数'];
                        var keyword = ['中级', '高级', '竞技场', '连胜', '盲扫', 'NG', '自定义', '金币', '获得', '用时', '初级', '中级', '高级'];
                        var keywordEff = '效率达到';
                        var keywordAt = '门票';
                        var typeNum = 13;
                        var restrict = ['', [12, 30], '', '', '', '', '', '', '', [4, 6], [4, 10], '', ''];
                        // var level = [2, 4, 1, 3, 5];
                        var next = -1;
                        var levelRange = [[4, 7], [8, 11], [12, 15], [16, 20], [20, 30]];
                        var eqInfo = ['下一任务：', '等级范围：', '可用任务列表：', '', '', '', '', '', '距离机密：', '', '近10个任务：', '', '', '', '', '', '', '', '', '', ''];
                        var secShift = 9;
                        var secCycle = 19;
                        var questTable;
                        // 定位任务表
                        document.querySelectorAll('.table.table-bordered').forEach(table => {
                            const title = table.querySelector("thead > tr > th:nth-child(4)");
                            if (title && (title.textContent == '冠军' || title.textContent == 'Winners')) {
                                questTable = table;
                            }
                        });
                        if (questTable) {
                            // 提取近期任务
                            var i = 0;
                            questTable.querySelectorAll('tbody > tr[id^="quest_row_"]').forEach(quest => {
                                let questLevel = quest.querySelector('td:nth-child(1)');
                                let questContent = quest.querySelector('td:nth-child(2)');
                                if (questContent && questLevel) {
                                    let ql = questLevel.textContent;
                                    let qc = questContent.textContent;
                                    eqInfo[11+i] = String(i + 1) + '. ' + ql + '  ' + qc;
                                    if (qc.includes(keywordEff)) {
                                        if (qc.includes(keyword[0])) {
                                            index[0]++;
                                        } else if (qc.includes(keyword[1])) {
                                            index[1]++;
                                        }
                                    } else if (qc.includes(keywordAt)) {
                                        index[9]++;
                                    } else {
                                        for (let j = 2; j < typeNum; j++) {
                                            if (qc.includes(keyword[j])) {
                                                index[j]++;
                                                break;
                                            }
                                        }
                                    }
                                    i++;
                                }
                            });
                            console.log(index)
                            // 分析下一任务等级
                            const timeNow = new Date();
                            eqInfo[0] = '下一任务：' + (timeNow.getHours() + 1) + ':00';
                            // 计算距离机密的数量
                            const currentYear = timeNow.getUTCFullYear();
                            const currentMonth = timeNow.getUTCMonth();
                            const startHour = new Date(Date.UTC(currentYear, currentMonth, 4, 0, 0, 0)); // 创建本月4号UTC 0点的Date对象
                            const diffMs = timeNow - startHour;
                            var secret;
                            if (diffMs > 0) {
                                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                secret = secCycle - (hours % secCycle) - 1;
                            } else {
                                secret = '未知';
                            }
                            // let firstId = questTable.querySelector("tbody > tr:nth-child(1)").id.match(/\d+$/)[0];
                            // var toE = [];
                            var nextLevel = [];
                            var nextRange = [];
                            // if (secShift) { secret = (secCycle - (parseInt((+firstId + 1) / 2) + secShift) % secCycle) % secCycle; } else { secret = '未知'; }
                            // if (next < 0) {
                            let firstLevel = questTable.querySelector('tbody > tr:nth-child(1) > td:nth-child(1)').textContent.match(/\d+/)[0];
                            if (firstLevel <= levelRange[0][1]) { 
                                next = 3;  // 3或8，level=3
                                // toE = '1或6';
                            } else if (firstLevel <= levelRange[1][1]) {
                                next = 4; // 1或6，level=4
                                // toE = '3或8';
                            } else if (firstLevel <= levelRange[2][1]) {
                                next = 5; // 4或9，level=5或6E
                                // toE = '0或5';
                            } else if (firstLevel < levelRange[3][1]) {
                                next = 1; // 2或7，level=1
                                // toE = '2或7';
                            } else if (firstLevel == levelRange[3][1]) {
                                let secondLevelElement = questTable.querySelector('tbody > tr:nth-child(2) > td:nth-child(1)');
                                if (secondLevelElement) {
                                    let secondLevel = secondLevelElement.textContent.match(/\d+/)[0];
                                    if (secondLevel <= levelRange[1][1]) {
                                        next = 1;
                                    } else if (secondLevel <= levelRange[2][1]) {
                                        next = 2;
                                    }
                                }
                                // next = -1; // 2/7/0/5，level=1/2
                                // toE = '未知';
                            } else {
                                next = 2; //level=2
                                // toE = 4;
                            }
                            // } else { toE = 9 - next; }
    
                            if (next < 0) {
                                nextRange = '未知';
                            } else {
                                // nextLevel = level[next] - 1;
                                nextLevel = next - 1;
                                nextRange = 'L' + levelRange[nextLevel][0] + '-' + levelRange[nextLevel][1];
                            }
                            // eqInfo[7] = '距离机密：' + secret + '，距离E：' + toE;
                            eqInfo[8] = '距离机密：' + secret;
                            eqInfo[1] = '等级范围：' + nextRange;
                            if (secret == 0) {
                                eqInfo[0] = eqInfo[0] + ' 【机密】';
                            }
                            // if (toE == 0) {
                            //     eqInfo[0] = eqInfo[0] + ' 【E】';
                            // }
    
                            var row = 3;
                            if (next < 0) {
                                for (let k = 0; k < typeNum; k++) {
                                    if (index[k] == 0) {
                                        eqInfo[row] = ' √ ' + name[k];
                                        row++;
                                    }
                                }
                            } else {
                                for (let k = 0; k < typeNum; k++) {
                                    if (index[k] == 0) {
                                        if (restrict[k]) {
                                            // if (restrict[k][0] == '20E') {
                                            //     if (next == 9) {
                                            //         eqInfo[row] = ' √ ' + name[k];
                                            //         row++;
                                            //     } else {
                                            //         eqInfo[row] = ' × ' + name[k] + '（限制为L' + restrict[k][0] + '-' + restrict[k][1] + '）';
                                            //         row++;z
                                            //     }
                                            // } else if (next == 9) {
                                            //     eqInfo[row] = ' × ' + name[k] + '（限制为L' + restrict[k][0] + '-' + restrict[k][1] + '）';
                                            //     row++;
                                            // } else {
                                            if (restrict[k][0] <= levelRange[nextLevel][0]) {
                                                if (restrict[k][1] >= levelRange[nextLevel][1]) {
                                                    eqInfo[row] = ' √ ' + name[k];
                                                    row++;
                                                } else if (restrict[k][1] >= levelRange[nextLevel][0]) {
                                                    eqInfo[row] = ' √ ' + name[k] + '（L' + levelRange[nextLevel][0] + '-' + restrict[k][1] + '）';
                                                    row++;
                                                } else {
                                                    eqInfo[row] = ' × ' + name[k] + '（限制为L' + restrict[k][0] + '-' + restrict[k][1] + '）';
                                                    row++;
                                                }
                                            } else if (restrict[k][0] <= levelRange[nextLevel][1]) {
                                                if (restrict[k][1] >= levelRange[nextLevel][1]) {
                                                    eqInfo[row] = ' √ ' + name[k] + '（L' + restrict[k][0] + '-' + levelRange[nextLevel][1] + '）';
                                                    row++;
                                                } else {
                                                    eqInfo[row] = ' √ ' + name[k] + '（L' + restrict[k][0] + '-' + restrict[k][1] + '）';
                                                    row++;
                                                }
                                            } else {
                                                eqInfo[row] = ' × ' + name[k] + '（限制为L' + restrict[k][0] + '-' + restrict[k][1] + '）';
                                                row++;
                                            }
                                            // }
                                        } else {
                                            eqInfo[row] = ' √ ' + name[k];
                                            row++;
                                        }
                                        if (row > 6) {
                                            eqInfo.splice(row, 0, '');
                                        }
                                    }
                                }
                            }
                            console.log(eqInfo);
                            // saveAsTxt(eqInfo, '活动任务.txt');
    
                            chrome.runtime.sendMessage({ action: 'eventQuest', eqInfo: eqInfo });
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
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
    /* 统计奖牌榜 */
    const buttonTally = document.getElementById('buttonEqTally');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab2) {
        if (tab2[0].url.includes('https://minesweeper.online/') && tab2[0].url.includes('event-quests')) {
            buttonTally.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            buttonTally.style.cursor = 'pointer'; // 鼠标指针样式
            buttonTally.addEventListener('click', function () {
                buttonTally.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab2[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var tallyMap = {'time': '', 'tally': {}};
                        var rawRank = [];
                        var rawRankTitle = ['任务id', '等级', '任务', '分类', '冠军', '亚军', '季军', '第四', '第五'];
                        // var rawRank2 = [['任务id', '等级', '任务', '分类', '冠军', '亚军', '季军', '第四', '第五']];
                        var name = ['中级效率', '高级效率', '竞技场', '连胜', '盲扫', '无猜', '自定义', '金币', '宝石', '竞速', '初级局数', '中级局数', '高级局数'];
                        var keyword = ['中级', '高级', '竞技场', '连胜', '盲扫', 'NG', '自定义', '金币', '获得', '用时', '初级', '中级', '高级'];
                        var keywordEff = '效率达到';
                        var keywordAt = '门票';
                        var typeNum = 13;
                        var t0 = 100;
                        var qti = 0; // 任务表索引
                        var qpi = 0; // 任务表翻页区索引
                        const questsBlock = document.querySelector("#QuestsBlock");
                        for (let i = 0; i < questsBlock.children.length; i++) {
                            const ele = questsBlock.children[i];
                            if (ele.classList.contains('table-bordered')) {
                                const title = ele.querySelector("thead > tr > th:nth-child(4)");
                                if (title && (title.textContent == '冠军' || title.textContent == 'Winners')) {
                                    qti = i + 1;
                                    if (ele.nextElementSibling && ele.nextElementSibling.classList == 'pagination pagination-sm noselect') {
                                        qpi = i + 2;
                                    }
                                    break;
                                }
                            }
                        }
                        const time = new Date();
                        tallyMap['time'] = time.toString();
                        if (qpi) {
                            var pageNum = 1;
                            tallyPageInterval = setInterval(() => {
                                const pageActive = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.page.active`);
                                const questTable = document.querySelector(`#QuestsBlock > table:nth-child(${qti})`);
                                if (pageActive.textContent == pageNum) {
                                    // console.log('匹配', pageActive.textContent, pageNum)
                                    var ready = 1;
                                    document.querySelectorAll('div[id^="winners_"]').forEach(leaderboard => {
                                        if (leaderboard.textContent == ' 正在加载...' || leaderboard.textContent == ' Loading...') {
                                            ready = 0;
                                        }
                                    });
                                    if (ready) {
                                        questTable.querySelectorAll('tr[id^="quest_row_"]').forEach(questRow => {
                                            var newQuestRow = ['', '', '', '', '', '', '', '', ''];
                                            newQuestRow[0] = questRow.id.match(/quest_row_(\d+)$/)[1];
                                            var ql = questRow.querySelector('td:nth-child(1)').textContent;
                                            var qc = questRow.querySelector('td:nth-child(2)').textContent;
                                            newQuestRow[1] = ql;
                                            newQuestRow[2] = qc;
                                            if (qc.includes(keywordEff)) {
                                                if (qc.includes(keyword[0])) {
                                                    newQuestRow[3] = name[0];
                                                } else if (qc.includes(keyword[1])) {
                                                    newQuestRow[3] = name[1];
                                                }
                                            } else if (qc.includes(keywordAt)) {
                                                newQuestRow[3] = name[9];
                                            } else {
                                                for (let j = 2; j < typeNum; j++) {
                                                    if (qc.includes(keyword[j])) {
                                                        newQuestRow[3] = name[j];
                                                        break;
                                                    }
                                                }
                                            }
                                            questRow.querySelectorAll('div[id^="winners_"]').forEach(leaderboard => {
                                                leaderboard.querySelectorAll('div > table > tbody > tr').forEach(lbtr => {
                                                    const rank = lbtr.querySelector(`td:nth-child(1)`).textContent;
                                                    const player = lbtr.querySelector(`td.vertical-align-top.username-overflow-column `).textContent;
                                                    if (!tallyMap['tally'][player]) {
                                                        tallyMap['tally'][player] = [0, 0, 0, 0, 0];
                                                    }
                                                    if (rank <= 5) {
                                                        tallyMap['tally'][player][rank - 1]++;
                                                        newQuestRow[+rank + 3] = player;
                                                    }
                                                });
                                            });
                                            rawRank.push(newQuestRow);
                                        });
                                        // document.querySelectorAll('div[id^="winners_"]').forEach(leaderboard => {
                                        //     leaderboard.querySelectorAll('div > table > tbody > tr').forEach(lbtr => {
                                        //         const rank = lbtr.querySelector(`td:nth-child(1)`).textContent;
                                        //         const player = lbtr.querySelector(`td.vertical-align-top.username-overflow-column `).textContent;
                                        //         if (!tallyMap['tally'][player]) {
                                        //             tallyMap['tally'][player] = [0, 0, 0, 0, 0];
                                        //         }
                                        //         if (rank <= 5) {
                                        //             tallyMap['tally'][player][rank - 1]++;
                                        //         }
                                        //     });
                                        // });
                                        pageNum++;
                                        const pageLastDisabled = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.last.disabled`);
                                        if (pageLastDisabled) {
                                            // console.log('结束', pageActive.textContent, pageNum)
                                            // console.log(tallyMap, rawRank);
                                            clearInterval(tallyPageInterval);
                                            const eCheck = document.querySelector(`#QuestsBlock > div:nth-child(${qti - 2}) > div.pull-left > label > input`);
                                            eCheck.click();
                                            countTally();
                                        }
                                    }
                                } else if (pageActive.textContent < pageNum) {
                                    // console.log('下一页', pageActive.textContent, pageNum)
                                    const pageNext = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.next`);
                                    pageNext.click();
                                } else if (pageActive.textContent > pageNum) {
                                    // console.log('过页', pageActive.textContent, pageNum)
                                    const pageFirst = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.first`);
                                    pageFirst.click();
                                }
                            }, t0);
                        } else {
                            document.querySelectorAll('div[id^="winners_"]').forEach(leaderboard => {
                                leaderboard.querySelectorAll('div > table > tbody > tr').forEach(lbtr => {
                                    const rank = lbtr.querySelector(`td:nth-child(1)`).textContent;
                                    const player = lbtr.querySelector(`td.vertical-align-top.username-overflow-column `).textContent;
                                    if (!tallyMap['tally'][player]) {
                                        tallyMap['tally'][player] = [0, 0, 0, 0, 0];
                                    }
                                    tallyMap['tally'][player][rank - 1]++;
                                });
                            });
                            const eCheck = document.querySelector(`#QuestsBlock > div:nth-child(${qti - 2}) > div.pull-left > label > input`);
                            eCheck.click();
                            countTally();
                            console.log(tallyMap);
                        }
                        function countTally() {
                            startQuery = setInterval(() => {
                                const testTitle = document.querySelector("#QuestsBlock > div:nth-child(1) > table > tbody > tr > td:nth-child(1) > h2");
                                if (testTitle) {
                                    clearInterval(startQuery);
                                    if (qpi) {
                                        var pageNum = 1;
                                        tallyPageIntervalNew = setInterval(() => {
                                            const pageActive = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.page.active`);
                                            const questTable = document.querySelector(`#QuestsBlock > table:nth-child(${qti})`);
                                            if (pageActive.textContent == pageNum) {
                                                // console.log('匹配', pageActive.textContent, pageNum)
                                                var ready = 1;
                                                document.querySelectorAll('div[id^="winners_"]').forEach(leaderboard => {
                                                    if (leaderboard.textContent == ' 正在加载...' || leaderboard.textContent == ' Loading...') {
                                                        ready = 0;
                                                    }
                                                });
                                                if (ready) {
                                                    questTable.querySelectorAll('tr[id^="quest_row_"]').forEach(questRow => {
                                                        var newQuestRow = ['', '', '', '', '', '', '', '', ''];
                                                        newQuestRow[0] = questRow.id.match(/quest_row_(\d+)$/)[1];
                                                        var ql = questRow.querySelector('td:nth-child(1)').textContent;
                                                        var qc = questRow.querySelector('td:nth-child(2)').textContent;
                                                        newQuestRow[1] = ql;
                                                        newQuestRow[2] = qc;
                                                        if (qc.includes(keywordEff)) {
                                                            if (qc.includes(keyword[0])) {
                                                                newQuestRow[3] = name[0];
                                                            } else if (qc.includes(keyword[1])) {
                                                                newQuestRow[3] = name[1];
                                                            }
                                                        } else if (qc.includes(keywordAt)) {
                                                            newQuestRow[3] = name[9];
                                                        } else {
                                                            for (let j = 2; j < typeNum; j++) {
                                                                if (qc.includes(keyword[j])) {
                                                                    newQuestRow[3] = name[j];
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        questRow.querySelectorAll('div[id^="winners_"]').forEach(leaderboard => {
                                                            leaderboard.querySelectorAll('div > table > tbody > tr').forEach(lbtr => {
                                                                const rank = lbtr.querySelector(`td:nth-child(1)`).textContent;
                                                                const player = lbtr.querySelector(`td.vertical-align-top.username-overflow-column `).textContent;
                                                                if (!tallyMap['tally'][player]) {
                                                                    tallyMap['tally'][player] = [0, 0, 0, 0, 0];
                                                                }
                                                                if (rank <= 5) {
                                                                    tallyMap['tally'][player][rank - 1]++;
                                                                    newQuestRow[+rank + 3] = player;
                                                                }
                                                            });
                                                        });
                                                        rawRank.push(newQuestRow);
                                                    });
                                                    pageNum++;
                                                    const pageLastDisabled = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.last.disabled`);
                                                    if (pageLastDisabled) {
                                                        // console.log('结束', pageActive.textContent, pageNum)
                                                        clearInterval(tallyPageIntervalNew);
                                                        rawRank.sort((a, b) => a[0] - b[0]);
                                                        rawRank.unshift(rawRankTitle);
                                                        console.log(tallyMap, rawRank);
                                                        chrome.runtime.sendMessage({ action: 'sendEventQuestTallyMap', tallyMap: tallyMap, rawRank: rawRank });
                                                    }
                                                }
                                            } else if (pageActive.textContent < pageNum) {
                                                // console.log('下一页', pageActive.textContent, pageNum)
                                                const pageNext = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.next`);
                                                pageNext.click();
                                            } else if (pageActive.textContent > pageNum) {
                                                // console.log('过页', pageActive.textContent, pageNum)
                                                const pageFirst = document.querySelector(`#QuestsBlock > ul:nth-child(${qpi}) > li.first`);
                                                pageFirst.click();
                                            }
                                        }, t0);
                                    } else {
                                        document.querySelectorAll('div[id^="winners_"]').forEach(leaderboard => {
                                            leaderboard.querySelectorAll('div > table > tbody > tr').forEach(lbtr => {
                                                const rank = lbtr.querySelector(`td:nth-child(1)`).textContent;
                                                const player = lbtr.querySelector(`td.vertical-align-top.username-overflow-column `).textContent;
                                                if (!tallyMap['tally'][player]) {
                                                    tallyMap['tally'][player] = [0, 0, 0, 0, 0];
                                                }
                                                tallyMap['tally'][player][rank - 1]++;
                                            });
                                        });
                                        console.log(tallyMap);
                                        chrome.runtime.sendMessage({ action: 'sendEventQuestTallyMap', tallyMap: tallyMap });
                                    }
                                }
                            }, t0);
                        }
                    }
                });
            });
        } else {
            buttonTally.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'eventQuest') {
        let eqInfo = request.eqInfo;
        console.log('全球任务分析:', eqInfo);   // 在控制台打出结果
        chrome.storage.local.set({ eqInfo: eqInfo });     // 保存数据
        document.getElementById('buttonEq').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        const result = eqInfo.map(item => item + '<br>').join('');
        document.getElementById('result').innerHTML = result;
    } else if (request.action === 'sendEventQuestTallyMap') {
        let tallyMap = request.tallyMap;
        let rawRank = request.rawRank;
        console.log('全球任务排行榜:', tallyMap);   // 在控制台打出结果
        console.log('全球任务排行榜原始数据:', rawRank);   // 在控制台打出结果
        chrome.storage.local.get(['eventQuestTallyMap', 'eventQuestRawRank'], function(result) {
            let eventQuestTallyMap = result.eventQuestTallyMap || {};
            let eventQuestRawRank = result.eventQuestRawRank || {};
            const currentDate = new Date();
            const newMonth = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0');
            eventQuestTallyMap[newMonth] = tallyMap;
            eventQuestRawRank[newMonth] = rawRank;
            chrome.storage.local.set({ eventQuestTallyMap: eventQuestTallyMap });     // 保存数据
            chrome.storage.local.set({ eventQuestRawRank: eventQuestRawRank });     // 保存数据
        });
        document.getElementById('buttonEqTally').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    if ((currentDate.getUTCMonth() + 1) % 4 != 0) {
        document.getElementById("event4").style.display = 'none';
    }
});