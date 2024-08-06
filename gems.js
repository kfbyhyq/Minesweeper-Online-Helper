document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#button1').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var priceMap = [
                        ['Topaz', 'Ruby', 'Sapphire', 'Amethyst', 'Onyx', 'Aquamarine', 'Emerald', 'Garnet', 'Jade', 'Diamond'],
                        ['Huang Yu', 'Hong Bao Shi', 'Lan Bao Shi', 'Zi Shui Jing', 'Gao Ma Nao', 'Hai Lan Bao Shi', 'Zu Mu Lv', 'Shi Liu Shi', 'Bi Yu', 'Zuan Shi'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Gold coins', 'Copper coins', 'Silver coins', 'Nickel coins', 'Steel coins', 'Iron coins', 'Palladium coins', 'Titanium coins', 'Zinc coins', 'Platinum coins'],
                        ['Jin', 'Tong', 'Yin', 'Nie', 'Gang', 'Tie', 'Ba', 'Tai', 'Xin', 'Bo'],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Rare parts', 'Unique parts', 'Legendary parts', 'Perfect parts'],
                        [0, 0, 0, 0]
                    ];
                    try {
                        var Topaz = document.querySelector("#stat_table_body > tr:nth-child(1) > td:nth-child(3)");
                        priceMap[2][0] = Topaz.textContent;
                        var Ruby = document.querySelector("#stat_table_body > tr:nth-child(2) > td:nth-child(3)");
                        priceMap[2][1] = Ruby.textContent;
                        var Sapphire = document.querySelector("#stat_table_body > tr:nth-child(3) > td:nth-child(3)");
                        priceMap[2][2] = Sapphire.textContent;
                        var Amethyst = document.querySelector("#stat_table_body > tr:nth-child(4) > td:nth-child(3)");
                        priceMap[2][3] = Amethyst.textContent;
                        var Onyx = document.querySelector("#stat_table_body > tr:nth-child(5) > td:nth-child(3)");
                        priceMap[2][4] = Onyx.textContent;
                        var Aquamarine = document.querySelector("#stat_table_body > tr:nth-child(6) > td:nth-child(3)");
                        priceMap[2][5] = Aquamarine.textContent;
                        var Emerald = document.querySelector("#stat_table_body > tr:nth-child(7) > td:nth-child(3)");
                        priceMap[2][6] = Emerald.textContent;
                        var Garnet = document.querySelector("#stat_table_body > tr:nth-child(8) > td:nth-child(3)");
                        priceMap[2][7] = Garnet.textContent;
                        var Jade = document.querySelector("#stat_table_body > tr:nth-child(9) > td:nth-child(3)");
                        priceMap[2][8] = Jade.textContent;
                        var Diamond = document.querySelector("#stat_table_body > tr:nth-child(10) > td:nth-child(3)");
                        priceMap[2][9] = Diamond.textContent;

                        var Gold = document.querySelector("#stat_table_body > tr:nth-child(11) > td:nth-child(3)");
                        priceMap[5][0] = Gold.textContent;
                        var Copper = document.querySelector("#stat_table_body > tr:nth-child(12) > td:nth-child(3)");
                        priceMap[5][1] = Copper.textContent;
                        var Silver = document.querySelector("#stat_table_body > tr:nth-child(13) > td:nth-child(3)");
                        priceMap[5][2] = Silver.textContent;
                        var Nickel = document.querySelector("#stat_table_body > tr:nth-child(14) > td:nth-child(3)");
                        priceMap[5][3] = Nickel.textContent;
                        var Steel = document.querySelector("#stat_table_body > tr:nth-child(15) > td:nth-child(3)");
                        priceMap[5][4] = Steel.textContent;
                        var Iron = document.querySelector("#stat_table_body > tr:nth-child(16) > td:nth-child(3)");
                        priceMap[5][5] = Iron.textContent;
                        var Palladium = document.querySelector("#stat_table_body > tr:nth-child(17) > td:nth-child(3)");
                        priceMap[5][6] = Palladium.textContent;
                        var Titanium = document.querySelector("#stat_table_body > tr:nth-child(18) > td:nth-child(3)");
                        priceMap[5][7] = Titanium.textContent;
                        var Zinc = document.querySelector("#stat_table_body > tr:nth-child(19) > td:nth-child(3)");
                        priceMap[5][8] = Zinc.textContent;
                        var Platinum = document.querySelector("#stat_table_body > tr:nth-child(20) > td:nth-child(3)");
                        priceMap[5][9] = Platinum.textContent;

                        var Rare = document.querySelector("#stat_table_body > tr:nth-child(34) > td:nth-child(3)");
                        priceMap[7][0] = Rare.textContent.replace(/ /g, "");
                        var Unique = document.querySelector("#stat_table_body > tr:nth-child(35) > td:nth-child(3)");
                        priceMap[7][1] = Unique.textContent.replace(/ /g, "");
                        var Legendary = document.querySelector("#stat_table_body > tr:nth-child(36) > td:nth-child(3)");
                        priceMap[7][2] = Legendary.textContent.replace(/ /g, "");
                        var Perfect = document.querySelector("#stat_table_body > tr:nth-child(37) > td:nth-child(3)");
                        priceMap[7][3] = Perfect.textContent.replace(/ /g, "");

                        console.log(priceMap);

                        saveAsCsv(priceMap, '宝石实时价格.csv');
                    } catch (error) {
                        window.alert('错误页面');
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
