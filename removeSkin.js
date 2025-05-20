document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonRemoveSkin');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/cn/game/') || tab1[0].url.includes('https://minesweeper.online/game/')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        var t0 = 1;
                        var skinMap = {};

                        let game = document.querySelector("#GameBlock > table");
                        let setArea = document.createElement('div'); // 创建配置区域
                        setArea.id = 'setArea';
                        let confirm = document.createElement('button');
                        confirm.id = 'confirmNumber';
                        confirm.textContent = '应用数字设置';
                        setArea.appendChild(confirm);
                        game.insertAdjacentElement('afterend', setArea);

                        changeSkin();
                        checkSkin = setInterval(() => {
                            changeSkin();
                        }, t0);
                        
                        confirm.addEventListener('click', function () {
                            let setArea1 = document.getElementById("setArea");
                            const numberInputs = setArea1.querySelectorAll('input');
                            numberInputs.forEach(input => {
                                if (input.value) {
                                    skinMap[input.id] = input.value;
                                }
                            });
                        });

                        function changeSkin() {
                            const area = document.querySelector("#AreaBlock");
                            if (area) {
                                var openNum = 0;
                                let setArea0 = document.getElementById("setArea");
                                for (const cell of area.children) {
                                    if (cell.classList.contains('cell')) {
                                        const class0 = cell.classList.value;
                                        // 计数打开的格子
                                        if (class0.includes('opened')) {
                                            openNum++;
                                        }
                                        // 开始匹配特殊皮肤
                                        if (class0.match(/al(d)?_/)) { // 字母
                                            cell.className = class0.replace(/al/g, "hd");
                                            setArea0.innerHTML = '';
                                        } else if (class0.match(/nnhd(d)?_/)) { // 无数字
                                            cell.className = class0.replace(/nnh/g, "h");
                                            setArea0.innerHTML = '';
                                        } else if (class0.match(/alr(d)?_/)) { // 随机字母
                                            const alrRegex = /alr(d)?_rtype\d+/g
                                            const alrMatch = class0.match(alrRegex);
                                            if (alrMatch) {
                                                if (!skinMap[alrMatch[0]]) {
                                                    skinMap[alrMatch[0]] = -1;
                                                    let row0 = document.createElement('div');
                                                    row0.className = 'cellRow';
                                                    setArea0.appendChild(row0);
                                                    let cell0 = document.createElement('div');
                                                    cell0.classList = class0;
                                                    row0.appendChild(cell0);
                                                    let input0 = document.createElement('input');
                                                    input0.id = alrMatch[0];
                                                    input0.style.width = `${cell0.offsetWidth}px`;
                                                    input0.style.height = `${cell0.offsetHeight}px`;
                                                    row0.appendChild(input0);
                                                } else if (skinMap[alrMatch[0]] > 0) {
                                                    var classNew = class0.replace(alrRegex, 'hd$1_type' + skinMap[alrMatch[0]]);
                                                    cell.className = classNew;
                                                }
                                            }
                                        }else if (class0.match(/rc(d)?_/)) { // 随机颜色
                                            const rcRegex = /rc(d)?_rtype\d+/g
                                            const rcMatch = class0.match(rcRegex);
                                            if (rcMatch) {
                                                if (!skinMap[rcMatch[0]]) {
                                                    skinMap[rcMatch[0]] = -1;
                                                    let row0 = document.createElement('div');
                                                    row0.className = 'cellRow';
                                                    setArea0.appendChild(row0);
                                                    let cell0 = document.createElement('div');
                                                    cell0.classList = class0;
                                                    row0.appendChild(cell0);
                                                    let input0 = document.createElement('input');
                                                    input0.id = rcMatch[0];
                                                    input0.style.width = `${cell0.offsetWidth}px`;
                                                    input0.style.height = `${cell0.offsetHeight}px`;
                                                    row0.appendChild(input0);
                                                } else if (skinMap[rcMatch[0]] > 0) {
                                                    var classNew = class0.replace(rcRegex, 'hd$1_type' + skinMap[rcMatch[0]]);
                                                    cell.className = classNew;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (openNum == 0) {
                                    skinMap = {}; // 没有打开的格子说明是新局
                                    const rows = setArea0.querySelectorAll('.cellRow');
                                    rows.forEach(row => {
                                        row.remove();
                                    });
                                }
                                // console.log(skinMap);
                            }
                        }
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});
