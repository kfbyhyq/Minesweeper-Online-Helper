document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#button2').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
            const tabId = tab1[0].id;
            chrome.scripting.executeScript({
                target: { tabId },
                function: function () {
                    var priceMap = [
                        ['Speed', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Speed NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['No flags', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Efficiency', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['High difficulty', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Random difficulty', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Hardcore', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Hardcore NG', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Endurance', 0, 0, 0, 0, 0, 0, 0, 0],
                        ['Nightmare', 0, 0, 0, 0, 0, 0, 0, 0]
                    ];
                    var line = [8, 8, 8, 8, 7, 8, 10, 9, 8, 10];
                    var t1 = 1000;
                    var typeMax = 10;
                    var LMax = 5;
                    try {
                        for (let type = 1; type <= typeMax; type++) {
                            for (let L = 1; L <= LMax; L++) {
                                setTimeout(() => {
                                    let ticket = document.querySelector(`#arena_content > table > tbody > tr:nth-child(${type}) > td:nth-child(${L + 1}) > span > button`);
                                    hoverBox(ticket);
                                }, (type - 1)*LMax*t1 + L*t1);
                                setTimeout(() =>{
                                    let price = document.querySelector(`#arena_content > table > tbody > tr:nth-child(${type}) > td:nth-child(${L+1}) > div > div.popover-content > div > div:nth-child(${line[type-1]}) > span`);
                                    priceMap[type - 1][L] = price.textContent.replace(/ /g, "");
                                    console.log(priceMap);
                                }, (type - 1)*LMax*t1 + L*t1 + 3*t1);
                            }
                        }
                        setTimeout(() =>{
                            saveAsCsv(priceMap, '门票实时价格.csv');
                        }, (LMax*typeMax + 3)*t1);
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
