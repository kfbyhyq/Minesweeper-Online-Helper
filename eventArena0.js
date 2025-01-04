document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('buttonEa');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url == 'https://minesweeper.online/cn/marketplace' || tab1[0].url == 'https://minesweeper.online/marketplace') {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var eaPrice = [
                            ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                            [0, 0, 0, 0, 0, 0, 0, 0]
                        ];
                        var t0 = 100;        // 等待间隔
                        var levelMax = 8;       // 最大等级
                        try {
                            function selectEventTicket(level) { // 选择市场中的单个门票条目
                                setTimeout(() => {
                                    let levelMenu = document.querySelector(`#market_search_filters_left > span:nth-child(5) > ul > li:nth-child(${level + 2}) > a`);
                                    levelMenu.click(); // 选择门票等级
                                }, t0 * 1);
                            }
                            function queryTicket() { // 查询当前页面最低价是否存在
                                let price = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                                let name = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(2) > span");
                                if (price && name) {
                                    let queryResult = [name.textContent, price.textContent.replace(/ /g, "")];    // 删去可能的空格 1 200 -> 1200
                                    return queryResult;
                                } else {
                                    return null;
                                }
                            }
                            function queryProgress(level) { // 递归查询函数
                                selectEventTicket(level);
                                var count = 1;
                                var countMax = 40;
                                setTimeout(() => {
                                    checkInterval = setInterval(() => { // 循环调用queryTicket查找是否有数据
                                        let queryResult = queryTicket();
                                        if (queryResult) {
                                            console.log('找到：L', level + 1, queryResult);
                                            clearInterval(checkInterval); // 查询成功后停止循环
                                            eaPrice[1][level] = queryResult[1];
                                            if (level == levelMax - 1) { // 已到达最后一张
                                                console.log(eaPrice);
                                                chrome.runtime.sendMessage({ action: 'sendEventArenaPrice', eaPrice: eaPrice });
                                            } else {
                                                queryProgress(level + 1); // 其他情况递归进入下一张票
                                            }
                                        } else if (count == countMax) {
                                            console.log('暂无L', level + 1, '票价');
                                            clearInterval(checkInterval); // 查询超时，停止循环
                                            eaPrice[1][level] = '无';
                                            if (level == levelMax - 1) { // 已到达最后一张
                                                console.log(eaPrice);
                                                chrome.runtime.sendMessage({ action: 'sendEventArenaPrice', eaPrice: eaPrice });
                                            } else {
                                                queryProgress(level + 1); // 其他情况递归进入下一张票
                                            }
                                        } else {
                                            count++;
                                            console.log('未找到：L', level + 1);
                                        }
                                    }, t0);
                                }, t0 * 2);
                            }
                            let choice1 = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(4) > a");
                            choice1.click(); // 选择竞技场门票分类
                            setTimeout(() => {
                                let choice2 = document.querySelector("#market_search_filters_left > span:nth-child(4) > ul > li:nth-child(12) > a");
                                choice2.click(); // 选择活动竞技场
                            }, t0 * 10);
                            setTimeout(() => {
                                queryProgress(0);
                            }, t0 * 20);

                            // for (let L = 1; L <= LMax; L++) {
                            //     const ticket = document.querySelector(`#arena_content > table:nth-child(3) > tbody > tr:nth-child(${L}) > td.text-nowrap > span.help`);
                            //     if (!ticket) {
                            //         break;
                            //     }
                            //     setTimeout(() => {
                            //         hoverBox(ticket);
                            //     }, (L - 1) * t1);
                            //     setTimeout(() => {
                            //         for (let i = 0; i < LMax; i++) {
                            //             if (ticket.textContent == eaPrice[0][i]) {
                            //                 const price = document.querySelector(`#arena_content > table:nth-child(3) > tbody > tr:nth-child(${L}) > td.text-nowrap > div > div.popover-content > div > div:nth-child(6) > span`)
                            //                 eaPrice[1][i] = +price.textContent.replace(/ /g, "");
                            //             }
                            //         }
                            //     }, (L - 1) * t1 + 3 * t1);
                            // }
                            // setTimeout(() => {
                            //     console.log(eaPrice);
                            //     chrome.runtime.sendMessage({ action: 'sendEventArenaPrice', eaPrice: eaPrice });
                            //     // saveAsCsv(eaPrice, '活动门票价格.csv');
                            // }, (LMax + 3) * t1);
                        } catch (error) {
                            console.log(error);
                            window.alert('错误页面');
                        }
    
                        // /* 模拟鼠标悬浮在button */
                        // function hoverBox(button) {
                        //     let event = new MouseEvent("mouseover", {
                        //         bubbles: true,
                        //         cancelable: true,
                        //         view: window,
                        //         clientX: button.getBoundingClientRect().left + button.offsetWidth / 2,
                        //         clientY: button.getBoundingClientRect().top + button.offsetHeight / 2
                        //     });
                        //     button.dispatchEvent(event);
                        // }
    
                        // function saveAsCsv(dataMap, filename) {
                        //     const csv = dataMap.map(row => row.join(',')).join('\n');
                        //     const blob = new Blob([csv], { type: 'text/csv', encoding: 'UTF-8' });
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
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var LMax = 8;       // 最大等级
    if (request.action === 'sendEventArenaPrice') {
        console.log('收到活动门票价格：', request.eaPrice);
        let eaPrice = request.eaPrice;
        chrome.storage.local.get(['eaPriceMap'], function(result) { // 从存储中读出总数据
            const eapMap = result.eaPriceMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const date = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            if (!eapMap[date]) { // 如果当前日期无条目，先新建
                eapMap[date] = new Array(8).fill(0);
            }
            for (let i = 0; i < LMax; i++) {
                if (eaPrice[1][i]) {
                    eapMap[date][i] = eaPrice[1][i];
                }
            }
            chrome.storage.local.set({ eaPriceMap: eapMap }); // 保存更新后的数据
        });
        document.getElementById('buttonEa').style.backgroundColor = '#4caf50';
    } 
});

document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    if ((currentDate.getUTCMonth() + 1) % 4 != 1) {
        document.getElementById("event1").style.display = 'none';
    }
});