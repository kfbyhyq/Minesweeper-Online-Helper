document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('button2');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/') && tab1[0].url.includes('marketplace')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            // button.style.borderColor = '#c9c9c9';
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        try {
                            var priceMap = [
                                ['', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                                ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                                ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0]
                            ];
                            var t0 = 100; // 等待间隔
                            var typeMax = 10; // 多少种竞技场
                            var levelMax = 8; // 最大等级
    
                            function selectTicket(type, level) { // 选择市场中的单个门票条目
                                setTimeout(() => {
                                    let typeMenu = document.querySelector(`#market_search_filters_left > span:nth-child(4) > ul > li:nth-child(${type + 2}) > a`);
                                    typeMenu.click(); // 选择门票种类
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
                            function queryProgress(type, level) { // 递归查询函数
                                selectTicket(type, level);
                                setTimeout(() => {
                                    var count = 1;
                                    var countMax = 50;
                                    checkInterval = setInterval(() => { // 循环调用queryTicket查找是否有数据
                                        let queryResult = queryTicket();
                                        if (queryResult) {
                                            if (queryResult[0].includes(priceMap[type + 1][0]) && queryResult[0].includes(priceMap[0][level + 1])) {
                                                console.log('找到：L', level + 1, ' type', type + 1, queryResult);
                                                clearInterval(checkInterval); // 查询成功后停止循环
                                                priceMap[type + 1][level + 1] = queryResult[1];
                                                if (type == typeMax - 1) {
                                                    if (level == levelMax - 1) { // 已到达最后一张（噩梦8）
                                                        console.log(priceMap);
                                                        chrome.runtime.sendMessage({ action: 'sendTicketPrice', ticketPrice: priceMap });
                                                    } else {
                                                        queryProgress(type, level + 1); // 其他情况递归进入下一张票
                                                    }
                                                } else {
                                                    if (level == levelMax - 1) {
                                                        queryProgress(type + 1, 0);
                                                    } else {
                                                        queryProgress(type, level + 1);
                                                    }
                                                }
                                            } else {
                                                count++;
                                                console.log('匹配错误：L', level + 1, ' type', type + 1, queryResult);
                                            }
                                        } else if (count == countMax) {
                                            console.log('暂无L', level + 1, ' type', type + 1, '票价');
                                            clearInterval(checkInterval); // 查询超时，停止循环
                                            if (type == typeMax - 1) {
                                                if (level == levelMax - 1) { // 已到达最后一张（噩梦8）
                                                    console.log(priceMap);
                                                    chrome.runtime.sendMessage({ action: 'sendTicketPrice', ticketPrice: priceMap });
                                                } else {
                                                    queryProgress(type, level + 1); // 其他情况递归进入下一张票
                                                }
                                            } else {
                                                if (level == levelMax - 1) {
                                                    queryProgress(type + 1, 0);
                                                } else {
                                                    queryProgress(type, level + 1);
                                                }
                                            }
                                        } else {
                                            count++;
                                            console.log('未找到：L', level + 1, ' type', type + 1);
                                        }
                                    }, t0);
                                }, t0 * 2);
                            }
                            startAtQuery = setInterval(() => {
                                let choice1 = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(4) > a");
                                if (choice1) {
                                    clearInterval(startAtQuery);
                                    choice1.click(); // 选择竞技场门票分类
                                    atCategoryInterval = setInterval(() => {
                                        let firstItem = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(2) > span")
                                        if (firstItem.textContent.includes('L')) {
                                            clearInterval(atCategoryInterval);
                                            queryProgress(0, 0);
                                        }
                                    }, t0);
                                }
                            }, t0);
                        } catch (e) {
                            console.log(e);
                            window.alert('错误页面');
                        }
                        // try {
                        //     var priceMap = [
                        //         ['', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                        //         ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                        //         ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0]
                        //     ];
                        //     let choice1 = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(4) > a");
                        //     choice1.click(); // 选择竞技场门票分类
                        //     var t1 = 500;        // 等待间隔
                        //     var typeMax = 10;    // 多少种竞技场
                        //     var LMax = 8;       // 最大等级
                        //     for (let type = 1; type <= typeMax; type++) {
                        //         setTimeout(() => {
                        //             // console.log('分类', type, t1 * LMax * (type - 1) + 2 * t1);
                        //             let typeMenu = document.querySelector(`#market_search_filters_left > span:nth-child(4) > ul > li:nth-child(${type + 1}) > a`);
                        //             typeMenu.click(); // 选择门票种类
                        //         }, t1 * LMax * (type - 1) + 2 * t1);
                        //         for (let L = 1; L <= LMax; L++) {
                        //             setTimeout(() => {
                        //                 // console.log('等级', L, t1 * LMax * (type - 1) + 2 * t1 + t1 * (L - 1));
                        //                 let levelMenu = document.querySelector(`#market_search_filters_left > span:nth-child(5) > ul > li:nth-child(${L + 1}) > a`);
                        //                 levelMenu.click(); // 选择门票等级
                        //             }, t1 * LMax * (type - 1) + 2 * t1 + t1 * (L - 1));
                        //             setTimeout(() => {
                        //                 // console.log('采集', type, L, t1 * LMax * (type - 1) + 2.99 * t1 + t1 * (L - 1));
                        //                 let price = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                        //                 priceMap[type][L] = price.textContent.replace(/ /g, "");    // 删去可能的空格 1 200 -> 1200
                        //                 let name = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(2) > span");
                        //                 console.log(name.textContent, priceMap[type][L]);
                        //             }, t1 * LMax * (type - 1) + 2.99 * t1 + t1 * (L - 1));
                        //         }
                        //     }
                        //     setTimeout(() => {
                        //         console.log(priceMap);
                        //         chrome.runtime.sendMessage({ action: 'sendTicketPrice', ticketPrice: priceMap });
                        //     }, t1 * LMax * typeMax + 2 * t1);
                        // } catch (e) {
                        //     console.log(e);
                        //     window.alert('错误页面');
                        // }
    
                        // var priceMap = [
                        //     ['', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                        //     ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                        //     ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0]
                        // ];
                        // var t1 = 500;        // 等待间隔
                        // var typeMax = 10;    // 多少种竞技场
                        // var LMax = 8;       // 最大等级
                        // try {
                        //     for (let type = 1; type <= typeMax; type++) {
                        //         for (let L = 1; L <= LMax; L++) {
                        //             setTimeout(() => {
                        //                 let ticket = document.querySelector(`#arena_content > table > tbody > tr:nth-child(${type}) > td:nth-child(${L + 1}) > span > button`);
                        //                 if (ticket) {
                        //                     hoverBox(ticket);   // 模拟鼠标悬浮 展开详情
                        //                 }
                        //             }, (type - 1) * LMax * t1 + L * t1);
                        //             setTimeout(() => {
                        //                 let price = document.querySelector(`#arena_content > table > tbody > tr:nth-child(${type}) > td:nth-child(${L + 1}) > div > div.popover-content > div > div:last-child > span`);
                        //                 if (price) {
                        //                     priceMap[type][L] = price.textContent.replace(/ /g, "");    // 删去可能的空格 1 200 -> 1200
                        //                 }
                        //             }, (type - 1) * LMax * t1 + L * t1 + 3 * t1);
                        //         }
                        //     }
                        //     setTimeout(() => {
                        //         console.log(priceMap);
                        //         chrome.runtime.sendMessage({ action: 'sendTicketPrice', ticketPrice: priceMap });
                        //         // saveAsCsv(priceMap, '门票实时价格.csv');
                        //     }, (LMax * typeMax + 3) * t1);
                        // } catch (error) {
                        //     console.log(error);
                        //     window.alert('错误页面');
                        // }
    
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
    if (request.action === 'sendTicketPrice') {
        let tpNew = request.ticketPrice;
        let ticketPrice = request.ticketPrice;
        console.log('收到门票价格:', tpNew);
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
        document.getElementById('button2').style.backgroundColor = '#4caf50';
    } 
});