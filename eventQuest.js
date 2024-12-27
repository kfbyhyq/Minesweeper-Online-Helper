document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('buttonEq').addEventListener('click', function () {
        const button = document.getElementById('buttonEq');
        button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    var name = ['中级效率', '高级效率', '竞技场', '连胜', '盲扫', '无猜', '自定义', '金币', '宝石', '速度', '初级局数', '中级局数', '高级局数'];
                    var keyword = ['中级', '高级', '竞技场', '连胜', '盲扫', 'NG', '自定义', '金币', '获得', '用时', '初级', '中级', '高级'];
                    var keywordEff = '效率';
                    var typeNum = 13;
                    var restrict = ['', [12, 30], '', '', '', '', '', '', '', [4, 6], [4, 10], '', ''];
                    // var level = [2, 4, 1, 3, 5];
                    var next = -1;
                    var levelRange = [[4, 7], [8, 11], [12, 15], [16, 20], [20, 30]];
                    var eqInfo = ['下一任务等级', '可用任务列表：', '', '', '', '', '', '距离', '', '近10个任务：', '', '', '', '', '', '', '', '', '', ''];
                    var secShift = 16;
                    var secCycle = 19;
                    try {
                        for (let i = 0; i < 10; i++) {
                            let questLevel = document.querySelector(`#QuestsBlock > table:nth-child(9) > tbody > tr:nth-child(${i+1}) > td:nth-child(1)`);
                            let questContent = document.querySelector(`#QuestsBlock > table:nth-child(9) > tbody > tr:nth-child(${i+1}) > td:nth-child(2)`);
                            if (questContent && questLevel) {
                                let ql = questLevel.textContent;
                                let qc = questContent.textContent;
                                eqInfo[10+i] = ql + '  ' + qc;
                                // console.log(eqInfo[10+i]);
                                // if (ql.includes('E')) {
                                //     next = i;
                                // }
                                if (qc.includes(keywordEff)) {
                                    if (qc.includes(keyword[0])) {
                                        index[0]++;
                                    } else if (qc.includes(keyword[1])) {
                                        index[1]++;
                                    }
                                } else {
                                    for (let j = 2; j < typeNum; j++) {
                                        if (qc.includes(keyword[j])) {
                                            index[j]++;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                break;
                            }
                        }
                        let firstId = document.querySelector("#QuestsBlock > table:nth-child(9) > tbody > tr:nth-child(1)").id.match(/\d+$/)[0];
                        var secret = [];
                        // var toE = [];
                        var nextLevel = [];
                        var nextRange = [];
                        if (secShift) { secret = (secCycle - (parseInt((+firstId + 1) / 2) + secShift) % secCycle) % secCycle; } else { secret = '未知'; }
                        // if (next < 0) {
                        let firstLevel = document.querySelector('#QuestsBlock > table:nth-child(9) > tbody > tr:nth-child(1) > td:nth-child(1)').textContent.match(/\d+/)[0];
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
                        } else if (firstLevel = levelRange[3][1]) {
                            let secondLevelElement = document.querySelector('#QuestsBlock > table:nth-child(9) > tbody > tr:nth-child(2) > td:nth-child(1)');
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
                        eqInfo[7] = '距离机密：' + secret;
                        eqInfo[0] = '下一任务等级：' + nextRange;
                        if (secret == 0) {
                            eqInfo[0] = eqInfo[0] + ' 【机密】';
                        }
                        // if (toE == 0) {
                        //     eqInfo[0] = eqInfo[0] + ' 【E】';
                        // }

                        var row = 2;
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
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'eventQuest') {
        let eqInfo = request.eqInfo;
        console.log('活动任务信息:', eqInfo);   // 在控制台打出结果
        chrome.storage.local.set({ eqInfo: eqInfo });     // 保存数据
        document.getElementById('buttonEq').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        const result = eqInfo.map(item => item + '<br>').join('');
        document.getElementById('result').innerHTML = result;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    if ((currentDate.getUTCMonth() + 1) % 4 != 0) {
        document.getElementById("event4").style.display = 'none';
    }
});