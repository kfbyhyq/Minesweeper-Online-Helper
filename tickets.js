document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button2').addEventListener('click', function () {
        const button = document.getElementById('button2');
        button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    if (window.location.href != 'https://minesweeper.online/cn/marketplace' && window.location.href != 'https://minesweeper.online/marketplace') {
                        window.alert('错误页面');
                        return;
                    }
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
                        let choice1 = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(4) > a");
                        choice1.click(); // 选择竞技场门票分类
                        var t1 = 500;        // 等待间隔
                        var typeMax = 10;    // 多少种竞技场
                        var LMax = 8;       // 最大等级
                        for (let type = 1; type <= typeMax; type++) {
                            setTimeout(() => {
                                // console.log('分类', type, t1 * LMax * (type - 1) + t1);
                                let typeMenu = document.querySelector(`#market_search_filters_left > span:nth-child(4) > ul > li:nth-child(${type + 1}) > a`);
                                typeMenu.click(); // 选择门票种类
                            }, t1 * LMax * (type - 1) + t1);
                            for (let L = 1; L <= LMax; L++) {
                                setTimeout(() => {
                                    // console.log('等级', L, t1 * LMax * (type - 1) + t1 + t1 * (L - 1));
                                    let levelMenu = document.querySelector(`#market_search_filters_left > span:nth-child(5) > ul > li:nth-child(${L + 1}) > a`);
                                    levelMenu.click(); // 选择门票等级
                                }, t1 * LMax * (type - 1) + t1 + t1 * (L - 1));
                                setTimeout(() => {
                                    // console.log('采集', type, L, t1 * LMax * (type - 1) + 1.9 * t1 + t1 * (L - 1));
                                    let price = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                                    priceMap[type][L] = price.textContent.replace(/ /g, "");    // 删去可能的空格 1 200 -> 1200
                                    let name = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(2) > span");
                                    console.log(name.textContent, priceMap[type][L]);
                                }, t1 * LMax * (type - 1) + 1.9 * t1 + t1 * (L - 1));
                            }
                        }
                        setTimeout(() => {
                            console.log(priceMap);
                            chrome.runtime.sendMessage({ action: 'sendTicketPrice', ticketPrice: priceMap });
                        }, t1 * LMax * typeMax + t1);
                    } catch (e) {
                        console.log(e);
                        window.alert('错误页面');
                    }

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