document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#button3').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var priceMap = [
                        ['黄玉', '红宝石', '蓝宝石', '紫水晶', '缟玛瑙', '海蓝宝石', '祖母绿', '石榴石', '碧玉', '钻石'],
                        ['Topaz', 'Ruby', 'Sapphire', 'Amethyst', 'Onyx', 'Aquamarine', 'Emerald', 'Garnet', 'Jade', 'Diamond'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['金竞技场币', '铜竞技场币', '银竞技场币', '镍竞技场币', '钢竞技场币', '铁竞技场币', '钯竞技场币', '钛竞技场币', '锌竞技场币', '铂竞技场币'],
                        ['Gold coins', 'Copper coins', 'Silver coins', 'Nickel coins', 'Steel coins', 'Iron coins', 'Palladium coins', 'Titanium coins', 'Zinc coins', 'Platinum coins'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Arena Tickets'],
                        ['Speed', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Speed NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['No flags', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Efficiency', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['High difficulty', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Random difficulty', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Hardcore', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Hardcore NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Endurance', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Nightmare', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Resources'],
                        ['Minecoins', 'Gems', 'Arena coins', 'Arena tickets', 'Equipment', 'Spare parts'],
                        [0, 0, 0, 0, 0, 0],
                        ['Equipment'],
                        ['Experience', 'Minecoins', 'Gems', 'Arena tickets', 'Daily quests', 'Season quests', 'Quest level', 'Arena coins', '', 'Activity', 'Event points'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Topaz', 'Ruby', 'Sapphire', 'Amethyst', 'Onyx', 'Aquamarine', 'Emerald', 'Garnet', 'Jade', 'Diamond'],
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
                                if (priceMap[row][j] == gemName.textContent) {
                                    priceMap[row + 2][j] = gemPrice.textContent.replace(/ /g, "");
                                    break;
                                }
                            }
                        }
                        priceMap.splice(row, 1);      // 删除用于匹配的中文行
                        row += 2;
                        /* 读竞技场币数量 */
                        let coinList = document.querySelector("body > div:nth-child(53) > div.popover-content > table > tbody");
                        let coins = coinList.children;
                        for (let i = 0; i < coins.length; i++) {
                            let coinPrice = coins[i].querySelector("td.text-right");
                            let coinName = coins[i].querySelector("td:nth-child(3)");
                            for (let j = 0; j < 10; j++) {
                                if (priceMap[row][j] == coinName.textContent) {
                                    priceMap[row + 2][j] = coinPrice.textContent.replace(/ /g, "");
                                    break;
                                }
                            }
                        }
                        priceMap.splice(row, 1);
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
                            priceMap[row + +type - 1][level] = n;
                        }
                        row += 11;      // 空一行

                        /* 读资源数 */
                        let resource = document.querySelector("#PlayerBlock > div:nth-child(3) > div:nth-child(7) > div.col-xs-8.form-text > span");
                        let res = resource.textContent.replace(/(\d) (\d)/g, '$1$2').split(/\s+/);
                        for (let i = 0; i < res.length; i++) {
                            priceMap[row + 1][i] = res[i];
                        }
                        row += 3;       // 空一行

                        /* 读装备信息 */
                        let equipList = document.querySelector("body > div:nth-child(55) > div.popover-content > div > div:nth-child(5) > div");
                        let equip = equipList.children;
                        for (let i = 0; i < equip.length; i++) {
                            let item = equip[i].className.match(/bonus-(\d+)/)[1];
                            let percent = equip[i].textContent.match(/\+([^+]+)/)[1];
                            if (item < 4) {
                                priceMap[row + 1][item] = percent;
                            } else if (item > 10 && item < 14) {
                                priceMap[row + 1][item - 7] = percent;
                            } else if (item > 17 && item < 22) {
                                priceMap[row + 1][item - 11] = percent;
                            } else if (item > 30 && item < 41) {
                                priceMap[row + 3][item - 31] = percent;
                            }
                        }

                        console.log(priceMap);

                        saveAsCsv(priceMap, '个人数据.csv');

                    } catch (error) {
                        window.alert('错误页面');
                    }

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
                    
                    function saveAsCsv(dataMap, filename) {
                        const csv = dataMap.map(row => row.join(',')).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv', encoding: 'UTF-8' });
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
