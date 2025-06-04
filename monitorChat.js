document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('buttonMonitorChat');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab1) {
        if (tab1[0].url.includes('https://minesweeper.online/cn/chat') || tab1[0].url.includes('https://minesweeper.online/chat')) {
            button.style.backgroundColor = '#6bc1f3';   // 对应按钮变为蓝色，表示可用
            button.style.cursor = 'pointer'; // 鼠标指针样式
            button.addEventListener('click', function () {
                button.style.backgroundColor = '#ff9f18';   // 对应按钮变为橙色，表示运行中
                const tabId = tab1[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    function: function () {
                        try {
                            const chatPage = document.querySelector("#chat_messages");
                            var chatBox;
                            for (let boxes of chatPage.children) {
                                if (window.getComputedStyle(boxes).display === 'block') {
                                    chatBox = boxes;
                                    break;
                                }
                            }
                            // 配置观察选项:
                            const config = { attributes: true, childList: true, subtree: true };
                            // 创建一个观察器实例并传入回调函数
                            const callback = function(mutationsList, observer) {
                                latestMessage();
                            };
                            const observer = new MutationObserver(callback);
                            // 以上述配置开始观察目标节点
                            observer.observe(chatBox, config);
                        } catch (e) {
                            console.log(e);
                            window.alert('错误页面');
                        }

                        function latestMessage() {
                            const chatPage = document.querySelector("#chat_messages");
                            var chatBox;
                            for (let boxes of chatPage.children) {
                                if (window.getComputedStyle(boxes).display === 'block') {
                                    chatBox = boxes;
                                    break;
                                }
                            }
                            const messageItem = chatBox.querySelector("div:last-child > table > tbody > tr > td:nth-child(2) > span.chat-message-text");
                            if (messageItem) {
                                const message = messageItem.textContent;
                                console.log(message);
                                if (message.includes('L') && message.includes('+') &&
                                (message.includes('free') || message.includes('FREE') || message.includes('Free') || message.includes('免费') ||
                                (!message.includes('rading') && !message.includes('rade') && !message.includes('RADE') && !message.includes('RADING') &&
                                !message.includes('ell') && !message.includes('ELL') && !message.includes('ale') && !message.includes('ALE') && 
                                !message.includes('mc') && !message.includes('MC') && !message.includes('Mc') && 
                                !message.includes('xchange') && !message.includes('XCHANGE') && !message.includes(' per ') && 
                                !message.includes('/h') && !message.includes('/p') && !message.includes('/e') && !message.includes('/l') && !message.includes('/ ') && 
                                !message.includes('/H') && !message.includes('/P') && !message.includes('/E') && !message.includes('/L') && !message.includes('/ ') && 
                                (message.includes('Win') || message.includes('Earn') || message.includes('Find') || message.includes('Complete') ||
                                message.includes('获得') || message.includes('完成') || message.includes('获取') || message.includes('达到') || 
                                message.includes('獲得'))))) {
                                    playAudio(523.2, 0.5, 0.5); // 播放提示音
                                    // const regex = /(Beginner|Intermediate|Expert|custom|Easy|Medium|Hard|Evil|row|flags|efficiency|minecoin|honour|gem|arena coins|arena|初级|中级|高级|自定义|简单|中等|困难|地狱|连胜|盲扫|效率|金币|功勋|宝石|竞技场币|竞技场|初級|中級|高級|自訂|簡單|中等|困難|地獄|連勝|無旗幟|效率|金幣|榮譽值|寶石|競技場硬幣|競技場)/g;
                                    const regex = /L(\d+)(E?)[^+]*\+/g;
                                    const abbr = { 'Beginner':['beg', '#54E083'], 'Intermediate':['int', '#54E083'], 'Expert':['exp', '#54E083'], 'custom':['cus', '#C1C1C1'], 
                                        'Easy':['easy', '#17FFFF'], 'Medium':['med', '#17FFFF'], 'Hard':['hard', '#17FFFF'], 'Evil':['evil', '#17FFFF'], 
                                        'row':['ws', '#E0B1FF'], 'flags':['nf', '#72CFFE'], 'efficiency':['eff', '#FFD117'], 
                                        'minecoin':['mc', '#FFF017'], 'honour':['hp', '#B2F0FF'], 'gem':['gem', '#F0F0F0'], 'arena coins':['ac', '#83FFB2'], 'higher':['arena', '#83FFB2'], 
                                        'PvP':['pvp', '#007700'],
                                        '初级':['初级', '#54E083'], '中级':['中级', '#54E083'], '高级':['高级', '#54E083'], '自定义':['自定义', '#C1C1C1'], 
                                        '简单':['简单', '#17FFFF'], '中等':['中等', '#17FFFF'], '困难':['困难', '#17FFFF'], '地狱':['地狱', '#17FFFF'], 
                                        '连胜':['连胜', '#E0B1FF'], '盲扫':['盲扫', '#72CFFE'], '效率':['效率', '#FFD117'], 
                                        '金币':['金币', '#FFF017'], '功勋':['功勋', '#B2F0FF'], '宝石':['宝石', '#F0F0F0'], '竞技场币':['场币', '#83FFB2'], '更高':['竞技场', '#83FFB2'], 
                                        '初級':['初级', '#54E083'], '中級':['中级', '#54E083'], '高級':['高级', '#54E083'], '自訂':['自定义', '#C1C1C1'], 
                                        '簡單':['简单', '#17FFFF'], '中等':['中等', '#17FFFF'], '困難':['困难', '#17FFFF'], '地獄':['地狱', '#17FFFF'], 
                                        '連勝':['连胜', '#E0B1FF'], '無旗幟':['无旗', '#72CFFE'], '效率':['效率', '#FFD117'], 
                                        '金幣':['金币', '#FFF017'], '榮譽值':['功勋', '#B2F0FF'], '寶石':['宝石', '#F0F0F0'], '競技場硬幣':['场币', '#83FFB2'], '競技場':['竞技场', '#83FFB2'],
                                        '一對一':['pvp', '#007700']}
                                    // const matchedStr = [...message.matchAll(regex)].map(match => match[0]);
                                    const matchedResult = [...message.matchAll(regex)];
                                    console.log(matchedResult);
                                    const sortedResults = matchedResult.sort((b, a) => {
                                        const numA = parseInt(a[1], 10);
                                        const numB = parseInt(b[1], 10);
                                        const hasE_A = a[2] !== '';
                                        const hasE_B = b[2] !== '';
                                    
                                        // 优先排序没有E的结果
                                        if (hasE_A === hasE_B) {
                                            return numA - numB; // 数字升序
                                        }
                                        return hasE_A ? 1 : -1;
                                    });
                                    // const matchedStr = sortedResults.map(match => match[0]);
                                    const typeArea = document.querySelector("#chat_send_message"); // 输入框所在元素
                                    var buttonArea = typeArea.querySelector("#buttonArea"); // 在输入框下方创建按钮集合
                                    if (!buttonArea) {
                                        buttonArea = document.createElement('div');
                                        buttonArea.id = 'buttonArea';
                                        typeArea.appendChild(buttonArea);
                                    }
                                    buttonArea.innerHTML = '';
                                    var clearBoxButton = document.createElement('button');
                                    clearBoxButton.textContent = '清空输入框';
                                    clearBoxButton.className = 'fastInputButton';
                                    buttonArea.appendChild(clearBoxButton);
                                    clearBoxButton.addEventListener('click', function() {
                                        const inputBox = document.querySelector("#chat_new_message");
                                        inputBox.value = '';
                                    });
                                    var typeButtonMe = document.createElement('button');
                                    typeButtonMe.textContent = 'me';
                                    typeButtonMe.className = 'fastInputButton';
                                    buttonArea.appendChild(typeButtonMe);
                                    fastInput(typeButtonMe);
                                    for (let i = 0; i < sortedResults.length; i++) {
                                        for (let key in abbr) {
                                            if (sortedResults[i][0].includes(key)) {
                                                var typeButton = document.createElement('button');
                                                typeButton.textContent = abbr[key][0];
                                                typeButton.style.backgroundColor = abbr[key][1];
                                                typeButton.style.color = '#000';
                                                if (sortedResults[i][2] == 'E') {
                                                    typeButton.style.fontWeight = 'bold';
                                                }
                                                typeButton.className = 'fastInputButton';
                                                buttonArea.appendChild(typeButton);
                                                fastInput(typeButton);
                                            }
                                        }
                                        // var typeButton = document.createElement('button');
                                        // typeButton.textContent = abbr[matchedStr[i]][0];
                                        // typeButton.style.backgroundColor = abbr[matchedStr[i]][1];
                                        // typeButton.style.color = '#000';
                                        // typeButton.className = 'fastInputButton';
                                        // buttonArea.appendChild(typeButton);
                                        // fastInput(typeButton);
                                    }
                                }
                            }
                        }

                        function fastInput(button) {
                            button.addEventListener('click', function() {
                                const inputBox = document.querySelector("#chat_new_message");
                                const send = document.querySelector("#chat_send_button");
                                inputBox.value = inputBox.value + button.textContent;
                                send.click();
                            });
                        }

                        function playAudio(frequency, volume, time) {
                            var audioCtx = new (window.AudioContext);
                            // 创建一个振荡器节点
                            var oscillator = audioCtx.createOscillator();
                             // 设置波形类型
                            oscillator.type = 'triangle';
                            // 设置振荡器的频率
                            oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
                            // 创建一个增益节点来控制音量
                            var gainNode = audioCtx.createGain();
                            // 将振荡器连接到增益节点，然后将增益节点连接到音频上下文的输出
                            oscillator.connect(gainNode);
                            gainNode.connect(audioCtx.destination);
                            // 设置音量并开始播放
                            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime); // 音量范围0到1
                            oscillator.start(audioCtx.currentTime);
                            // 设置停止播放的时间
                            oscillator.stop(audioCtx.currentTime + time);
                        }
                    }
                });
            });
        } else {
            button.style.backgroundColor = '#9b9b9b';   // 对应按钮变为灰色，表示不可用
        }
    });
});
