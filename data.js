document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('button3');
    button.style.backgroundColor = '#9b9b9b'; // 默认灰色
    chrome.storage.local.get('pId', function (result) {
        const pId = result.pId;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            if (tab1[0].url.includes('https://minesweeper.online/') && tab1[0].url.includes('player/' + pId)) {
                button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
                button.style.cursor = 'pointer'; // 鼠标指针样式
                button.addEventListener('click', function () {
                    button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                    const tabId = tab1[0].id;
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
                                ['金币', '宝石', '竞技场币', '竞技场门票', '装备', '装备碎片', '功勋点', '活动物品'],
                                [0, 0, 0, 0, 0, 0, 0],
                                ['装备加成'],
                                ['经验', '金币', '宝石', '竞技场门票', '每日任务', '赛季任务', '任务等级', '竞技场币', '', '活跃度', '活动物品'],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉'],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                                ['奖杯', 0, '排名', ''],
                                ['Time', '效率', '经验', '装备', '动态胜率', '连胜', '竞技场', '难度', '开速', '成就'],
                                ['', '', '', '', '', '', '', '', '', ''],
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                ['昵称'],
                                ['']
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
                                personalData[row + 1][6] = hp.textContent.replace(/\s+/g, '');
                                let ep1 = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(14) > div.col-xs-8.form-text > div > span");
                                let ep2 = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(14) > div.col-xs-8.form-text > span:nth-child(2) > span");
                                if (ep1 && ep1.textContent) {
                                    personalData[row + 1][7] = ep1.textContent;
                                } else if (ep2 && ep2.textContent) {
                                    personalData[row + 1][7] = ep2.textContent;
                                }
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
                                row += 5;
                                
                                /* 读昵称 */
                                let userName = document.querySelector("#PlayerBlock > h2 > div.pull-left > span").textContent;
                                personalData[row][0] = userName;
        
                                console.log(personalData);
        
                                chrome.runtime.sendMessage({ action: 'sendPersonalData', personalData: personalData });
                                // saveAsCsv(personalData, '个人数据.csv');
        
                            } catch (error) {
                                console.log(error);
                                window.alert('错误页面');
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
                            // /* 保存为csv文件 */
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
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'sendPersonalData') {
        let personalData = request.personalData;
        console.log('收到个人数据：', personalData);
        chrome.storage.local.set({ personalData: personalData });
        /* 按日期保存 */
        chrome.storage.local.get(['personalDataMap'], function (result) {
            const pdMap = result.personalDataMap || {}; // 确保存在数据，防止为 undefined
            const currentDate = new Date();
            const newDate = currentDate.getUTCFullYear() + String(currentDate.getUTCMonth() + 1).padStart(2, '0') + String(currentDate.getUTCDate()).padStart(2, '0');
            // 更新数据
            pdMap[newDate] = personalData;

            // 保存更新后的数据
            chrome.storage.local.set({ personalDataMap: pdMap });
        });

        document.getElementById('button3').style.backgroundColor = '#4caf50';
    }
});