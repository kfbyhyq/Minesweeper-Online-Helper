/* 刷新价格、个人数据 */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('update').addEventListener('click', function () {
        // const button = document.getElementById('update');
        // button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        const pId = document.getElementById('pIdNow').innerText;
        if (!pId) {
            window.alert('请先设置用户uID（个人主页网址中的数字）');
            return;
        }
        updateGems();
        updateArenaTickets();
        updateStatistics();
        updatePersonalData();
        updateEconomy();
        updateEquipmentStats();
        const currentDate = new Date();
        if ((currentDate.getUTCMonth() + 1) % 4 == 1 && currentDate.getUTCDate() > 3) { // 如果活动竞技场开启，刷新价格
            updateEventArenaTickets();
        }
        if ((currentDate.getUTCMonth() + 1) % 4 == 2 && currentDate.getUTCDate() > 3) { // 如果友谊任务开启，刷新任务
            updateFriendQuest();
        }
    });
}); 
/* 刷新宝石场币 */
function updateGems() {
    document.getElementById('flag1').textContent = 0;
    chrome.tabs.create({ url: 'https://minesweeper.online/cn/marketplace', active: false }, function (tab1) {
        const ti1 = tab1.id;
        recur(ti1, 0);

        function recur(tabId, i) {
            var maxI = 50;
            var t0 = 200;
            setTimeout(() => {
                extract(tabId);
                const flag = document.getElementById('flag1').textContent;
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
                    var priceMap = [
                        // ['Topaz', 'Ruby', 'Sapphire', 'Amethyst', 'Onyx', 'Aquamarine', 'Emerald', 'Garnet', 'Jade', 'Diamond'],
                        ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        // ['Gold coins', 'Copper coins', 'Silver coins', 'Nickel coins', 'Steel coins', 'Iron coins', 'Palladium coins', 'Titanium coins', 'Zinc coins', 'Platinum coins'],
                        ['金竞技场币', '铜竞技场币', '银竞技场币', '镍竞技场币', '钢竞技场币', '铁竞技场币', '钯竞技场币', '钛竞技场币', '锌竞技场币', '铂竞技场币'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        // ['Rare parts', 'Unique parts', 'Legendary parts', 'Perfect parts'],
                        ['稀有碎片', '史诗碎片', '传说碎片', '完美碎片'],
                        [0, 0, 0, 0]
                    ];
                    try {
                        var Topaz = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                        priceMap[1][0] = Topaz.textContent;
                        var Ruby = document.querySelector("#stat_table_body > tr:nth-child(2) > td:nth-child(3)");
                        priceMap[1][1] = Ruby.textContent;
                        var Sapphire = document.querySelector("#stat_table_body > tr:nth-child(3) > td:nth-child(3)");
                        priceMap[1][2] = Sapphire.textContent;
                        var Amethyst = document.querySelector("#stat_table_body > tr:nth-child(4) > td:nth-child(3)");
                        priceMap[1][3] = Amethyst.textContent;
                        var Onyx = document.querySelector("#stat_table_body > tr:nth-child(5) > td:nth-child(3)");
                        priceMap[1][4] = Onyx.textContent;
                        var Aquamarine = document.querySelector("#stat_table_body > tr:nth-child(6) > td:nth-child(3)");
                        priceMap[1][5] = Aquamarine.textContent;
                        var Emerald = document.querySelector("#stat_table_body > tr:nth-child(7) > td:nth-child(3)");
                        priceMap[1][6] = Emerald.textContent;
                        var Garnet = document.querySelector("#stat_table_body > tr:nth-child(8) > td:nth-child(3)");
                        priceMap[1][7] = Garnet.textContent;
                        var Jade = document.querySelector("#stat_table_body > tr:nth-child(9) > td:nth-child(3)");
                        priceMap[1][8] = Jade.textContent;
                        var Diamond = document.querySelector("#stat_table_body > tr:nth-child(10) > td:nth-child(3)");
                        priceMap[1][9] = Diamond.textContent;

                        var Gold = document.querySelector("#stat_table_body > tr:nth-child(11) > td:nth-child(3)");
                        priceMap[3][0] = Gold.textContent;
                        var Copper = document.querySelector("#stat_table_body > tr:nth-child(12) > td:nth-child(3)");
                        priceMap[3][1] = Copper.textContent;
                        var Silver = document.querySelector("#stat_table_body > tr:nth-child(13) > td:nth-child(3)");
                        priceMap[3][2] = Silver.textContent;
                        var Nickel = document.querySelector("#stat_table_body > tr:nth-child(14) > td:nth-child(3)");
                        priceMap[3][3] = Nickel.textContent;
                        var Steel = document.querySelector("#stat_table_body > tr:nth-child(15) > td:nth-child(3)");
                        priceMap[3][4] = Steel.textContent;
                        var Iron = document.querySelector("#stat_table_body > tr:nth-child(16) > td:nth-child(3)");
                        priceMap[3][5] = Iron.textContent;
                        var Palladium = document.querySelector("#stat_table_body > tr:nth-child(17) > td:nth-child(3)");
                        priceMap[3][6] = Palladium.textContent;
                        var Titanium = document.querySelector("#stat_table_body > tr:nth-child(18) > td:nth-child(3)");
                        priceMap[3][7] = Titanium.textContent;
                        var Zinc = document.querySelector("#stat_table_body > tr:nth-child(19) > td:nth-child(3)");
                        priceMap[3][8] = Zinc.textContent;
                        var Platinum = document.querySelector("#stat_table_body > tr:nth-child(20) > td:nth-child(3)");
                        priceMap[3][9] = Platinum.textContent;

                        var Rare = document.querySelector("#stat_table_body > tr:nth-last-child(4) > td:nth-child(3)");
                        priceMap[5][0] = Rare.textContent.replace(/ /g, "");
                        var Unique = document.querySelector("#stat_table_body > tr:nth-last-child(3) > td:nth-child(3)");
                        priceMap[5][1] = Unique.textContent.replace(/ /g, "");
                        var Legendary = document.querySelector("#stat_table_body > tr:nth-last-child(2) > td:nth-child(3)");
                        priceMap[5][2] = Legendary.textContent.replace(/ /g, "");
                        var Perfect = document.querySelector("#stat_table_body > tr:nth-last-child(1) > td:nth-child(3)");
                        priceMap[5][3] = Perfect.textContent.replace(/ /g, "");

                        console.log(priceMap);
                        chrome.runtime.sendMessage({ action: 'sendGemsPrice', gemsPrice: priceMap });
                    } catch (e) {
                        console.error('错误页面', e);
                    }

                }
            });
        }
    });
}
/* 刷新竞技场门票 */
function updateArenaTickets() {
    document.getElementById('flag2').textContent = 0;
    chrome.storage.local.get('autoUpdate', function (result) {
        // var backgroundCoe = 1;
        var activePage = true;
        if (result.autoUpdate[3][0]) {
            // backgroundCoe = 4;
            activePage = false;
        }
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/marketplace', active: activePage }, function (tab2) {
            const ti2 = tab2.id;
            recur(ti2);

            function recur(tabId) {
                var maxI = 1; // 不循环了，只运行一次
                var t0 = 10000;
                var t1 = 1000;
                setTimeout(() => {
                    extract(tabId);
                }, t0);
                // setTimeout(() => {
                //     chrome.tabs.remove(tabId, function() {});
                // }, 30 * t0);
                var flag;
                var count = 1;
                var countMax = 300;
                checkIntervalAt = setInterval(() => {
                    flag = document.getElementById('flag2').textContent;
                    if (flag == 1 || count == countMax) {
                        clearInterval(checkIntervalAt);
                        chrome.tabs.remove(tabId, function() {});
                    } else {
                        count++;
                    }
                }, t1);
            }

            function extract(tabId) {
                chrome.scripting.executeScript({
                    target: { tabId },
                    // args: [backgroundCoe],
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
                            let choice1 = document.querySelector("#market_search_filters_left > span > ul > li:nth-child(4) > a");
                            choice1.click(); // 选择竞技场门票分类
                            setTimeout(() => {
                                queryProgress(0, 0);
                            }, t0 * 10);
                        } catch (e) {
                            console.error(e);
                        }
                        // try {
                        //     var ticketPrice = [
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
                        //     var t1 = 500 * backgroundCoe;        // 等待间隔
                        //     var typeMax = 10;    // 多少种竞技场
                        //     var LMax = 8;       // 最大等级
                        //     for (let type = 1; type <= typeMax; type++) {
                        //         setTimeout(() => {
                        //             console.log('分类', type, t1 * LMax * (type - 1) + 2 * t1);
                        //             let typeMenu = document.querySelector(`#market_search_filters_left > span:nth-child(4) > ul > li:nth-child(${type + 1}) > a`);
                        //             typeMenu.click(); // 选择门票种类
                        //         }, t1 * LMax * (type - 1) + 2 * t1);
                        //         for (let L = 1; L <= LMax; L++) {
                        //             setTimeout(() => {
                        //                 console.log('等级', L, t1 * LMax * (type - 1) + 2 * t1 + t1 * (L - 1));
                        //                 let levelMenu = document.querySelector(`#market_search_filters_left > span:nth-child(5) > ul > li:nth-child(${L + 1}) > a`);
                        //                 levelMenu.click(); // 选择门票等级
                        //             }, t1 * LMax * (type - 1) + 2 * t1 + t1 * (L - 1));
                        //             setTimeout(() => {
                        //                 console.log('采集', type, L, t1 * LMax * (type - 1) + 2.99 * t1 + t1 * (L - 1));
                        //                 let price = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                        //                 ticketPrice[type][L] = price.textContent.replace(/ /g, "");    // 删去可能的空格 1 200 -> 1200
                        //                 let name = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(2) > span");
                        //                 console.log(name.textContent, ticketPrice[type][L]);
                        //             }, t1 * LMax * (type - 1) + 2.99 * t1 + t1 * (L - 1));
                        //         }
                        //     }
                        //     setTimeout(() => {
                        //         console.log(ticketPrice);
                        //         chrome.runtime.sendMessage({ action: 'sendTicketPrice', ticketPrice: ticketPrice });
                        //     }, t1 * LMax * typeMax + 2 * t1);
                        // } catch (e) {
                        //     console.error(e);
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
                        //     }, (LMax * typeMax + 3) * t1);
                        // } catch (e) {
                        //     console.error('错误页面', e);
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
                    }
                });
            }
        });
    });
}
/* 刷新装备加成 */
function updateEquipmentStats() {
    document.getElementById('flagEquip').textContent = 0;
    chrome.tabs.create({ url: 'https://minesweeper.online/cn/equipment', active: false }, function (tabEquip) {
        const tiEquip = tabEquip.id;
        var t0 = 1000;
        var flag;
        var count = 1;
        var countMax = 20;
        intervalEquip = setInterval(() => {
            flag = document.getElementById('flagEquip').textContent;
            if (flag == 1 || count == countMax) {
                clearInterval(intervalEquip);
                chrome.tabs.remove(tiEquip, function() {});
            } else {
                extract(tiEquip);
                count++;
            }
        }, t0);

        function extract(tabId) {
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var equipStats = [
                        ['经验', '金币', '竞技场门票', '每日任务', '赛季任务', '任务等级', '竞技场币', '活跃度', '活动物品'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ]
                    var bonusIndex = [0, 1, '', 2, '', '', '', '', '', '', '', 
                                      3, 4, 5, '', '', '', '', 6, '', 7, 
                                      8, '', '', '', '', '', '', '', '', '', 
                                      10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
                    try {
                        let allStats = document.querySelector("#EquipmentBlock > div:nth-child(1) > div.pull-right > span:nth-child(3) > img");
                        hoverBox(allStats);      // 鼠标悬浮展开宝石数量
                        let list = document.querySelector("body > div.popover.fade.bottom.in > div.popover-content > div > div");

                        for (const item of list.children) {
                            const classText = item.classList.value;
                            if (classText.includes('bonus-')) {
                                var bonusType = classText.match(/(\d+)/g)[0];
                                var value = item.textContent.match(/[:：](.*)/)[1];
                                equipStats[1 + 2 * (bonusIndex[bonusType] / 10 | 0)][bonusIndex[bonusType] % 10] = value;
                            }
                        }
                        console.log(equipStats);
                        chrome.runtime.sendMessage({ action: 'sendEquipStats', equipStats: equipStats });
                    } catch (error) {
                        console.error(error);
                    }

                    /* 模拟鼠标悬浮在button */
                    function hoverBox(button) {
                        let event = new MouseEvent("mouseover", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: button.getBoundingClientRect().left + button.offsetWidth / 2,
                            clientY: button.getBoundingClientRect().top + button.offsetHeight / 2
                        });
                        button.dispatchEvent(event);
                    }
                }
            });
        }
    });

}
/* 刷新游戏数据 */
function updateStatistics() {
    const pId = document.getElementById('pIdNow').innerText;
    document.getElementById('flag5').textContent = 0;
    const u1 = 'https://minesweeper.online/cn/statistics/' + pId;
    chrome.tabs.create({ url: u1, active: false }, function (tab5) {
        const ti5 = tab5.id;
        recur(ti5, 0);

        function recur(tabId, i) {
            var maxI = 50;
            var t0 = 200;
            setTimeout(() => {
                extract(tabId);
                const flag = document.getElementById('flag5').textContent;
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
                    var statistics = [
                        ['总局数', '胜局数', '总耗时', '完成的任务', '完成的竞技场', '已解决3BV', '经验', '金币', '宝石', '竞技场门票', '活跃度', '活动物品', '竞技场币'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ];
                    try {
                        var totalGames = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(1)");
                        statistics[1][0] = totalGames.textContent.replace(/ /g, "");
                        var totalWins = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(3)");
                        statistics[1][1] = totalWins.textContent.replace(/ /g, "");
                        var totalTime = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(5)");
                        statistics[1][2] = totalTime.textContent.replace(/ /g, "");
                        var quests = document.querySelector("#aggregate > div > div:nth-child(1) > span:nth-child(7)");
                        statistics[1][3] = quests.textContent.replace(/ /g, "");
                        var arenas = document.querySelector("#aggregate > div > div:nth-child(1) > span:nth-child(9)");
                        statistics[1][4] = arenas.textContent.replace(/ /g, "");
                        var bv = document.querySelector("#aggregate > div > div:nth-child(1) > strong:nth-child(11)");
                        statistics[1][5] = bv.textContent.replace(/ /g, "");
                        var experience = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(1)");
                        statistics[1][6] = experience.textContent.replace(/ /g, "");
                        var minecoins = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(3)");
                        statistics[1][7] = minecoins.textContent.replace(/ /g, "");
                        var gems = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(5) > span > span");
                        statistics[1][8] = gems.textContent.replace(/ /g, "");
                        var tickets = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(7)");
                        statistics[1][9] = tickets.textContent.replace(/ /g, "");
                        var activity = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(9)");
                        statistics[1][10] = activity.textContent.replace(/ /g, "");
                        var eventPoints = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(11)");
                        statistics[1][11] = eventPoints.textContent.replace(/ /g, "");
                        var arenaCoins = document.querySelector("#aggregate > div > div:nth-child(2) > span:nth-child(13) > span > span");
                        statistics[1][12] = arenaCoins.textContent.replace(/ /g, "");
                        
                        console.log(statistics);
                        chrome.runtime.sendMessage({ action: 'sendStatistics', statistics: statistics });
                    } catch (e) {
                        console.error('错误页面', e);
                    }

                }
            });
        }
    });
}
/* 刷新个人数据 */
function updatePersonalData() {
    const pId = document.getElementById('pIdNow').innerText;
    document.getElementById('flag3').textContent = 0;
    const u2 = 'https://minesweeper.online/cn/player/' + pId;
    chrome.tabs.create({ url: u2, active: false }, function (tab3) {
        const ti3 = tab3.id;
        recur(ti3, 0);

        function recur(tabId, i) {
            var maxI = 50;
            var t0 = 200;
            setTimeout(() => {
                extract(tabId);
                const flag = document.getElementById('flag3').textContent;
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
                    var personalData = [
                        ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'],
                        // ['Topaz', 'Ruby', 'Sapphire', 'Amethyst', 'Onyx', 'Aquamarine', 'Emerald', 'Garnet', 'Jade', 'Diamond'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['金竞技场币', '铜竞技场币', '银竞技场币', '镍竞技场币', '钢竞技场币', '铁竞技场币', '钯竞技场币', '钛竞技场币', '锌竞技场币', '铂竞技场币'],
                        // ['Gold coins', 'Copper coins', 'Silver coins', 'Nickel coins', 'Steel coins', 'Iron coins', 'Palladium coins', 'Titanium coins', 'Zinc coins', 'Platinum coins'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['竞技场门票', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
                        ['速度', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['速度NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['盲扫', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['效率', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['高难度', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['随机难度', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['硬核', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['硬核NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['耐力', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['噩梦', 0, 0, 0, 0, 0, 0, 0, 0],
                        [],
                        ['资源'],
                        ['金币', '宝石', '竞技场币', '竞技场门票', '装备', '装备碎片', '功勋点'],
                        [0, 0, 0, 0, 0, 0, 0],
                        ['装备加成'],
                        ['经验', '金币', '宝石', '竞技场门票', '每日任务', '赛季任务', '任务等级', '竞技场币', '', '活跃度', '活动物品'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['奖杯', 0, '排名', ''],
                        ['Time', '效率', '经验', '装备', '动态胜率', '连胜', '竞技场', '难度', '开速', '成就'],
                        ['', '', '', '', '', '', '', '', '', ''],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ];
                    var row = 0;        // 当前录入行
                    try {
                        let gem = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(7) > div.col-xs-8.form-text > span > span:nth-child(2)");
                        hoverBox(gem);      // 鼠标悬浮展开宝石数量
                        let coin = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(7) > div.col-xs-8.form-text > span > span:nth-child(3)");
                        hoverBox(coin);     // 鼠标悬浮展开竞技场币数量
                        let ticket = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(7) > div.col-xs-8.form-text > span > span:nth-child(4)");
                        hoverBox(ticket);   // 鼠标悬浮展开竞技场门票数量
                        let equipment = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(6) > div.col-xs-8.form-text > table > tbody > tr > td:nth-last-child(1) > span > span");
                        hoverBox(equipment);   // 鼠标悬浮展开装备信息
                        let trophy = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(2) > div.col-xs-8.form-text > span");
                        trophy.click(); // 20250120更新改为点击弹出
                        hoverBox(trophy);   // 鼠标悬浮展开奖杯信息

                        let popoverList = document.querySelectorAll("div.popover.fade.top.in, div.popover.fade.left.in");

                        let gemList;
                        let coinList;
                        let ticketList;
                        let equipList;
                        /* 检查弹窗种类 */
                        for (let i = 0; i < popoverList.length; i++) {
                            const judge1 = popoverList[i].querySelector("div.popover-content > table > tbody > tr:nth-child(1) > td:nth-child(3)");
                            const judge2 = popoverList[i].querySelector("div.popover-content > div > span:nth-child(1) > i");
                            const judge3 = popoverList[i].querySelector("div.popover-content > div > div:nth-child(1)");
                            if (judge3) {
                                equipList = popoverList[i].querySelector("div.popover-content > div > div:nth-child(5) > div");
                            } else if (judge2) {
                                ticketList = popoverList[i].querySelector("div.popover-content > div");
                            } else if (judge1) {
                                if (personalData[0].includes(judge1.textContent)) {
                                    gemList = popoverList[i].querySelector("div.popover-content > table > tbody");;
                                } else {
                                    coinList = popoverList[i].querySelector("div.popover-content > table > tbody");
                                }
                            }
                        }
                        
                        /* 读宝石数量 */
                        // let gemList = popoverList[0].querySelector("div.popover-content > table > tbody");
                        if (gemList) {
                            let gems = gemList.children;
                            for (let i = 0; i < gems.length; i++) {
                                let gemPrice = gems[i].querySelector("td.text-right");
                                let gemName = gems[i].querySelector("td:nth-child(3)");
                                for (let j = 0; j < 10; j++) {
                                    if (personalData[row][j] == gemName.textContent) {
                                        personalData[row + 1][j] = gemPrice.textContent.replace(/ /g, "");
                                        break;
                                    }
                                }
                            }
                        }
                        // personalData.splice(row, 1);      // 删除用于匹配的中文行
                        row += 2;

                        /* 读竞技场币数量 */
                        // let coinList = popoverList[1].querySelector("div.popover-content > table > tbody");
                        if (coinList) {
                            let coins = coinList.children;
                            for (let i = 0; i < coins.length; i++) {
                                let coinPrice = coins[i].querySelector("td.text-right");
                                let coinName = coins[i].querySelector("td:nth-child(3)");
                                for (let j = 0; j < 10; j++) {
                                    if (personalData[row][j] == coinName.textContent) {
                                        personalData[row + 1][j] = coinPrice.textContent.replace(/ /g, "");
                                        break;
                                    }
                                }
                            }
                        }
                        // personalData.splice(row, 1);
                        row += 3;       // 空一行

                        /* 读竞技场门票数量 */
                        // let ticketList = popoverList[2].querySelector("div.popover-content > div");
                        if (ticketList) {
                            let tickets = ticketList.children;
                            for (let i = 0; i < tickets.length; i++) {
                                let typeClass = tickets[i].querySelector("i.fa-ticket");
                                var type = typeClass.className.match(/ticket(\d+)/)[1];
                                if (type > 10) { // 如果有活动票
                                    personalData[15][0] = '活动竞技场';
                                    type = 11;
                                }
                                var level = tickets[i].textContent.match(/L(\d+)/)[1];
                                var num = tickets[i].querySelector("span.tickets-amount").textContent.match(/\d+/)[0];
                                var n = num.replace(/ /g, "");
                                personalData[row + +type - 1][level] = n;
                            }
                        }
                        var levelMax = 8; // 最大等级
                        if (personalData[15]) {
                            for (let l = 0; l < levelMax; l++) {
                                if (!personalData[15][l + 1]) { 
                                    console.log(personalData[15][l + 1]);
                                    personalData[15][l + 1] = 0;
                                }
                            }
                        }
                        row += 12;      // 空一行

                        /* 读资源数 */
                        let resource = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(7) > div.col-xs-8.form-text > span");
                        personalData[row + 1][0] = resource.childNodes[0].textContent.replace(/\s+/g, '');
                        const spans = resource.querySelectorAll("span");
                        spans.forEach((span) => {
                            if (span.querySelector("img")) {
                                if (span.querySelector("img").className.includes('gem')) {
                                    personalData[row + 1][1] = span.querySelector("span").textContent.replace(/\s+/g, '');
                                } else if (span.querySelector("img").className.includes('arena')) {
                                    personalData[row + 1][2] = span.querySelector("span").textContent.replace(/\s+/g, '');
                                } else if (span.querySelector("img").className.includes('eq')) {
                                    personalData[row + 1][4] = span.querySelector("span").textContent.replace(/\s+/g, '');
                                } else if (span.querySelector("img").className.includes('parts')) {
                                    personalData[row + 1][5] = span.textContent.replace(/\s+/g, '');
                                }
                            } else if (span.querySelector("i")) {
                                personalData[row + 1][3] = span.querySelector("span").textContent.replace(/\s+/g, '');
                            }
                        });
                        let hp = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(5) > div.col-xs-8.form-text > span:nth-child(2)");
                        personalData[row + 1][6] = hp.textContent;
                        row += 3;       // 空一行

                        /* 读装备信息 */
                        // let equipList = popoverList[3].querySelector("div.popover-content > div > div:nth-child(5) > div");
                        if (equipList) {
                            let equip = equipList.children;
                            for (let i = 0; i < equip.length; i++) {
                                let item = equip[i].className.match(/bonus-(\d+)/)[1];
                                let percent = equip[i].textContent.match(/\+([^+]+)/)[1];
                                if (item < 4) {
                                    personalData[row + 1][item] = percent;
                                } else if (item > 10 && item < 14) {
                                    personalData[row + 1][item - 7] = percent;
                                } else if (item > 17 && item < 22) {
                                    personalData[row + 1][item - 11] = percent;
                                } else if (item > 30 && item < 41) {
                                    personalData[row + 3][item - 31] = percent;
                                }
                            }
                        }
                        row += 4;

                        /* 读奖杯信息 */
                        let trophyList = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(2) > div.col-xs-8.form-text > div > div.popover-content > table");
                        let trs = trophyList.querySelectorAll('tr');
                        
                        personalData[row][1] = parseInt(document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(2) > div.col-xs-8.form-text > span").textContent, 10);
                        let rank = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(2) > div.col-xs-8.form-text > a");
                        if (rank && rank.textContent) {
                            personalData[row][3] = parseInt(rank.textContent.match(/\d+/), 10) || '';
                        }
                        // 遍历每一行
                        var gls = ['', '初', '中', '高', '自'];
                        trs.forEach(tr => {
                            let cells = tr.querySelectorAll('td'); // 获取所有td元素
                            let title = cells[0].textContent; // 第一个td为标题
                            let index = personalData[row + 1].indexOf(title); // 匹配标题在personalData中的索引
                            if (index !== -1) {
                                // 填入值和奖杯数
                                personalData[row + 2][index] = cells[1].textContent || '';
                                personalData[row + 3][index] = parseInt(cells[2].textContent, 10) || 0;
                                // 检查初中高级
                                let grade = cells[1].querySelector("i");
                                if (grade) {
                                    let cname = grade.className;
                                    let glevel = cname.charAt(cname.length - 1);
                                    if (!isNaN(glevel)) {
                                        personalData[row + 2][index] = gls[glevel] + personalData[row + 2][index];
                                    }
                                }
                            }
                        });

                        console.log(personalData);

                        chrome.runtime.sendMessage({ action: 'sendPersonalData', personalData: personalData });
                    } catch (e) {
                        console.error('错误页面', e);
                    }

                    /* 模拟鼠标悬浮在button */
                    function hoverBox(button) {
                        let event = new MouseEvent("mouseover", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: button.getBoundingClientRect().left + button.offsetWidth / 2,
                            clientY: button.getBoundingClientRect().top + button.offsetHeight / 2
                        });
                        button.dispatchEvent(event);
                    }

                }
            });
        }
    });
}
/* 刷新游戏经济 */
function updateEconomy() {
    document.getElementById('flagPe').textContent = 0;
    chrome.tabs.create({ url: 'https://minesweeper.online/cn/economy', active: false }, function (tabEco) {
        const tiE = tabEco.id;
        recur(tiE, 0);

        function recur(tabId, i) {
            var maxI = 10;
            var t0 = 2000;
            setTimeout(() => {
                const flag = document.getElementById('flagPe').textContent;
                if (flag == 1 || i > maxI) {
                    chrome.tabs.remove(tabId, function() {});
                } else {
                    extract(tabId);
                    recur(tabId, i + 1);
                }
            }, i * t0);
        }

        function extract(tabId) {
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var personalEco = [
                        ['总财产', '装备', '金币', '宝石', '功勋点', '活动物品', '竞技场门票', '仓库', '装备碎片', '竞技场币', '代币'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    ];
                    try {
                        let myRank = document.querySelector("#stat_my_rank > a");
                        myRank.click();
                        setTimeout(() => {
                            let myRow = document.querySelector("#stat_table_body > tr.stat-my-row");
                            let value = myRow.querySelector("td:nth-child(3) > span.help.dotted-underline");
                            personalEco[1][0] = value.textContent;
                            hoverBox(value);
                            let dataDisp = myRow.querySelector("td:nth-child(3) > div > div.popover-content");
                            var data = dataDisp.innerHTML.split(/<[^>]*>/g);
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 1; j <= personalEco[0].length; j++) {
                                    if (data[i].includes(personalEco[0][j] + '：')) {
                                        var match = data[i].match(/：(.*)/);
                                        personalEco[1][j] = match[1];
                                        break;
                                    }
                                }
                            }
                            console.log(personalEco);
                            chrome.runtime.sendMessage({ action: 'personalEconomy', personalEco: personalEco });
                        }, 2000);
                        
                        /* 模拟鼠标悬浮在button */
                        function hoverBox(button) {
                            let event = new MouseEvent("mouseover", {
                                bubbles: true,
                                cancelable: true,
                                view: window,
                                clientX: button.getBoundingClientRect().left + button.offsetWidth / 2,
                                clientY: button.getBoundingClientRect().top + button.offsetHeight / 2
                            });
                            button.dispatchEvent(event);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        }
    });
}

/* 分析全球任务 */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('updateEq').addEventListener('click', function () {
        const button = document.getElementById('updateEq');
        button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        document.getElementById('flag4').textContent = 0;
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/event-quests', active: false }, function (tab0) {
            const ti0 = tab0.id;
            recurEq(ti0, 0);

            function recurEq(tabId, i) {
                var maxI = 50;
                var t0 = 200;
                setTimeout(() => {
                    extractEq(tabId);
                    const flag = document.getElementById('flag4').textContent;
                    if (flag == 1 || i > maxI) {
                        chrome.tabs.remove(tabId, function() {});
                    } else {
                        recurEq(tabId, i + 1);
                    }
                }, i * t0);
            }
            function extractEq(tabId) {
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
    
                            chrome.runtime.sendMessage({ action: 'eventQuest', eqInfo: eqInfo });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            }
        });
    });
});
