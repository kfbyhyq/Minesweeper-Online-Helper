chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'eventQuest') {
        let eqInfo = request.eqInfo;
        console.log('活动任务信息:', eqInfo);   // 在控制台打出结果
        chrome.storage.local.set({ eqInfo: eqInfo });     // 保存数据
        document.getElementById('updateEq').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
        document.getElementById('flag4').textContent = 1;   // 设置成功标记

        const output = eqInfo.map(item => item + '<br>').join('');
        document.getElementById('eqInfo').innerHTML = output;
    } else if (request.action === 'sendGemsPrice') {
        let gemsPrice = request.gemsPrice;
        console.log('收到价格更新:', gemsPrice);   // 在控制台打出结果
        chrome.storage.local.set({ gemsPrice: gemsPrice });     // 保存数据
        document.getElementById('flag1').textContent = 1;   // 设置成功标记

        displayMatrix(gemsPrice, 'table1');
    } else if (request.action === 'sendTicketPrice') {
        let ticketPrice = request.ticketPrice;
        console.log('收到门票价格更新:', ticketPrice);   // 在控制台打出结果
        chrome.storage.local.set({ ticketPrice: ticketPrice });     // 保存数据
        document.getElementById('flag2').textContent = 1;   // 设置成功标记
        
        displayMatrix(ticketPrice, 'table2');
    } else if (request.action === 'sendPersonalData') {
        let personalData = request.personalData;
        console.log('收到个人数据更新:', personalData);   // 在控制台打出结果
        chrome.storage.local.set({ personalData: personalData });     // 保存数据
        document.getElementById('flag3').textContent = 1;   // 设置成功标记
        
        displayMatrix(personalData, 'table3');
    }

    if (document.getElementById('flag1').textContent == 1
     && document.getElementById('flag2').textContent == 1
     && document.getElementById('flag3').textContent == 1) {
        document.getElementById('update').style.backgroundColor = '#4caf50';   // 将对应按钮变为绿色，表示提取成功
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#update').addEventListener('click', function () {
        const button = document.getElementById('update');
        button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        document.getElementById('flag1').textContent = 0;
        document.getElementById('flag2').textContent = 0;
        document.getElementById('flag3').textContent = 0;
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/marketplace', active: false }, function (tab1) {
            const ti1 = tab1.id;
            recur(ti1, 0);

            function recur(tabId, i) {
                var maxI = 100;
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
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/arena', active: false }, function (tab2) {
            const ti2 = tab2.id;
            recur(ti2, 1);

            function recur(tabId, i) {
                var maxI = 10;
                var t0 = 10000;
                setTimeout(() => {
                    extract(tabId);
                    const flag = document.getElementById('flag2').textContent;
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
                        var t1 = 500;        // 等待间隔
                        var typeMax = 10;    // 多少种竞技场
                        var LMax = 8;       // 最大等级
                        try {
                            for (let type = 1; type <= typeMax; type++) {
                                for (let L = 1; L <= LMax; L++) {
                                    setTimeout(() => {
                                        let ticket = document.querySelector(`#arena_content > table > tbody > tr:nth-child(${type}) > td:nth-child(${L + 1}) > span > button`);
                                        if (ticket) {
                                            hoverBox(ticket);   // 模拟鼠标悬浮 展开详情
                                        }
                                    }, (type - 1) * LMax * t1 + L * t1);
                                    setTimeout(() => {
                                        let price = document.querySelector(`#arena_content > table > tbody > tr:nth-child(${type}) > td:nth-child(${L + 1}) > div > div.popover-content > div > div:last-child > span`);
                                        if (price) {
                                            priceMap[type][L] = price.textContent.replace(/ /g, "");    // 删去可能的空格 1 200 -> 1200
                                        }
                                    }, (type - 1) * LMax * t1 + L * t1 + 3 * t1);
                                }
                            }
                            setTimeout(() => {
                                console.log(priceMap);
                                chrome.runtime.sendMessage({ action: 'sendTicketPrice', ticketPrice: priceMap });
                                // saveAsCsv(priceMap, '门票实时价格.csv');
                            }, (LMax * typeMax + 3) * t1);
                        } catch (error) {
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
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/player/15862596', active: false }, function (tab3) {
            const ti3 = tab3.id;
            recur(ti3, 0);

            function recur(tabId, i) {
                var maxI = 100;
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
                            ['资源'],
                            ['金币', '宝石', '竞技场币', '竞技场门票', '装备', '装备碎片'],
                            [0, 0, 0, 0, 0, 0],
                            ['装备加成'],
                            ['经验', '金币', '宝石', '竞技场门票', '每日任务', '赛季任务', '任务等级', '竞技场币', '', '活跃度', '活动物品'],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'],
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
                            let equipment = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(6) > div.col-xs-8.form-text > table > tbody > tr > td:nth-child(11) > span > span");
                            hoverBox(equipment);   // 鼠标悬浮展开装备信息
    
                            /* 读宝石数量 */
                            let gemList = document.querySelector("body > div:nth-child(52) > div.popover-content > table > tbody");
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
                            // personalData.splice(row, 1);      // 删除用于匹配的中文行
                            row += 2;
                            /* 读竞技场币数量 */
                            let coinList = document.querySelector("body > div:nth-child(53) > div.popover-content > table > tbody");
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
                            // personalData.splice(row, 1);
                            row += 3;       // 空一行
    
                            /* 读竞技场门票数量 */
                            let ticketList = document.querySelector("body > div:nth-child(54) > div.popover-content > div");
                            let tickets = ticketList.children;
                            for (let i = 0; i < tickets.length; i++) {
                                let typeClass = tickets[i].querySelector("i.fa-ticket");
                                var type = typeClass.className.match(/ticket(\d+)/)[1];
                                var level = tickets[i].textContent.match(/L(\d+)/)[1];
                                var num = tickets[i].querySelector("span.tickets-amount").textContent.match(/\d+/)[0];
                                var n = num.replace(/ /g, "");
                                personalData[row + +type - 1][level] = n;
                            }
                            row += 11;      // 空一行
    
                            /* 读资源数 */
                            let resource = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(7) > div.col-xs-8.form-text > span");
                            let res = resource.textContent.replace(/(\d) (\d)/g, '$1$2').split(/\s+/);
                            for (let i = 0; i < res.length; i++) {
                                personalData[row + 1][i] = res[i];
                            }
                            row += 3;       // 空一行
    
                            /* 读装备信息 */
                            let equipList = document.querySelector("body > div:nth-child(55) > div.popover-content > div > div:nth-child(5) > div");
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
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#updateEq').addEventListener('click', function () {
        const button = document.getElementById('updateEq');
        button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
        document.getElementById('flag4').textContent = 0;
        chrome.tabs.create({ url: 'https://minesweeper.online/cn/event-quests', active: false }, function (tab0) {
            const ti0 = tab0.id;
            recurEq(ti0, 0);

            function recurEq(tabId, i) {
                var maxI = 100;
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
                        var index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        var name = ['竞技场门票', '竞技场', '效率', '连胜', '动态胜率', '盲扫', '无猜', '自定义', '金币', '宝石', '速度', '初级局数', '中级局数', '高级局数'];
                        var keyword = ['门票', '竞技场', '效率', '连胜', '百局', '盲扫', 'NG', '自定义', '金币', '获得', '用时', '初级', '中级', '高级'];
                        var restrict = [[15, 25], '', '', '', ['20E', '30E'], [4, 30], '', '', '', '', [4, 6], [4, 10], '', ''];
                        var level = [2, 4, 1, 3, 5, 2, 4, 1, 3, 6];
                        var next = -1;
                        var levelRange = [[4, 7], [8, 11], [12, 15], [16, 20], [20, 30], ['20E', '30E']];
                        var eqInfo = ['下一任务等级', '可用任务列表：', '', '', '', '', '', '距离', '', '近10个任务：', '', '', '', '', '', '', '', '', '', ''];
                        var secShift = 3;
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
                                    if (ql.includes('E')) {
                                        next = i;
                                    }
                                    for (let j = 0; j < 14; j++) {
                                        if (qc.includes(keyword[j])) {
                                            index[j]++;
                                            break;
                                        }
                                    }
                                } else {
                                    break;
                                }
                            }
                            let firstId = document.querySelector("#QuestsBlock > table:nth-child(9) > tbody > tr:nth-child(1)").id.match(/\d+$/)[0];
                            var secret = [];
                            var toE = [];
                            var nextLevel = [];
                            var nextRange = [];
                            if (secShift) { secret = (secCycle - (+firstId + secShift) % secCycle) % secCycle; } else { secret = '未知'; }
                            if (next < 0) {
                                let firstLevel = document.querySelector('#QuestsBlock > table:nth-child(9) > tbody > tr:nth-child(1) > td:nth-child(1)').textContent.match(/\d+$/)[0];
                                console.log(firstLevel);
                                if (firstLevel <= levelRange[0][1]) { 
                                    next = 3;  // 3或8，level=3
                                    toE = '1或6';
                                } else if (firstLevel <= levelRange[1][1]) {
                                    next = 1; // 1或6，level=4
                                    toE = '3或8';
                                } else if (firstLevel <= levelRange[2][1]) {
                                    next = -1; // 4或9，level=5或6E
                                    toE = '0或5';
                                } else if (firstLevel < levelRange[3][1]) {
                                    next = 2; // 2或7，level=1
                                    toE = '2或7';
                                } else if (firstLevel = levelRange[3][1]) {
                                    next = -1; // 2/7/0/5，level=1/2
                                    toE = '未知';
                                } else {
                                    next = 5; //level=2
                                    toE = 4;
                                }
                            } else { toE = 9 - next; }
    
                            if (next < 0) {
                                nextRange = '未知';
                            } else {
                                nextLevel = level[next] - 1;
                                nextRange = 'L' + levelRange[nextLevel][0] + '-' + levelRange[nextLevel][1];
                            }
                            eqInfo[7] = '距离机密：' + secret + '，距离E：' + toE;
                            eqInfo[0] = '下一任务等级：' + nextRange;
                            if (secret == 0) {
                                eqInfo[0] = eqInfo[0] + ' 【机密】';
                            }
                            if (toE == 0) {
                                eqInfo[0] = eqInfo[0] + ' 【E】';
                            }
                            
                            var row = 2;
                            if (next < 0) {
                                for (let k = 0; k < 14; k++) {
                                    if (index[k] == 0) {
                                        eqInfo[row] = ' √ ' + name[k];
                                        row++;
                                    }
                                }
                            } else {
                                for (let k = 0; k < 14; k++) {
                                    if (index[k] == 0) {
                                        if (restrict[k]) {
                                            if (restrict[k][0] == '20E') {
                                                if (next == 9) {
                                                    eqInfo[row] = ' √ ' + name[k];
                                                    row++;
                                                } else {
                                                    eqInfo[row] = ' × ' + name[k] + '（限制为L' + restrict[k][0] + '-' + restrict[k][1] + '）';
                                                    row++;
                                                }
                                            } else if (next == 9) {
                                                eqInfo[row] = ' × ' + name[k] + '（限制为L' + restrict[k][0] + '-' + restrict[k][1] + '）';
                                                row++;
                                            } else {
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
                                            }
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

document.addEventListener('DOMContentLoaded', function() {
    var priceMap;

    /* 读宝石 */
    chrome.storage.local.get(['gemsPrice'], function(result) {
        let gemsPrice = result.gemsPrice;
        console.log('宝石/场币/碎片价格:', gemsPrice);
        tableId = 'table1';
        displayMatrix(gemsPrice, tableId);    // 显示表格
    });

    /* 读竞技场门票 */
    chrome.storage.local.get(['ticketPrice'], function(result) {
        let ticketPrice = result.ticketPrice;
        console.log('竞技场门票价格:', ticketPrice);
        tableId = 'table2';
        displayMatrix(ticketPrice, tableId);    // 显示表格
    });
    
    /* 读个人数据 */
    chrome.storage.local.get(['personalData'], function(result) {
        let personalData = result.personalData;
        console.log('个人数据:', result.personalData);
        tableId = 'table3';
        displayMatrix(personalData, tableId);    // 显示表格
    });

});


/* 处理矩阵并显示为表格 */
function displayMatrix(matrix, tableId) {
    
    const rows = matrix.length;
    const cols = matrix[0].length;

    const table = document.getElementById(tableId);    // 定位表格
    table.innerHTML = ''; // 清空现有的表格内容

    /* 表格主体 */
    let tbody = table.createTBody();
    for (let i = 0; i < rows; i++) {
        let row = tbody.insertRow();
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell();
            cell.textContent = matrix[i][j];
        }
    }
}